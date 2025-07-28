import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { ReactSortable } from "react-sortablejs";
import { X } from "lucide-react";
import { createAlbum, updateAlbum } from "../../api/gallery";
import toast from "react-hot-toast";

const AlbumForm = ({ onClose, onAddAlbum, onUpdateAlbum, album }) => {
  const [images, setImages] = useState([]);
  const [removedImageIds, setRemovedImageIds] = useState([]); // Track removed existing images
  const [category, setCategory] = useState("");

  const isEditMode = Boolean(album?.id);

  const BACKEND_URL = "http://localhost:8000";

  useEffect(() => {
    if (album) {
      setCategory(album.name || "");
      setImages(
        (album.images || []).map((img, idx) => ({
          id: img.id || `existing-${idx}`,
          preview: img.image_path
            ? img.image_path.startsWith("http")
              ? img.image_path
              : `${BACKEND_URL}/storage/${img.image_path}`
            : img.preview || img.url || "",
          existing: true,
        }))
      );
      setRemovedImageIds([]); 
    } else {
      setImages([]);
      setRemovedImageIds([]);
      setCategory("");
    }
  }, [album]);

  const onDrop = useCallback((acceptedFiles) => {
    const newImages = acceptedFiles.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}`,
      file,
      preview: URL.createObjectURL(file),
      existing: false,
    }));
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleClear = () => {
    setImages([]);
    setRemovedImageIds([]);
    setCategory("");
  };

  const handleSubmit = async () => {
    if (!category.trim()) {
      toast.error("Please enter a category name.");
      return;
    }

    const formData = new FormData();
    formData.append("name", category);

    // Append new images (files) only
    images.forEach((img) => {
      if (img.file && !img.existing) {
        formData.append("images[]", img.file);
      }
    });

    // Append IDs of removed existing images (for backend to delete)
    if (isEditMode && removedImageIds.length > 0) {
      removedImageIds.forEach((id) => formData.append("removed_images[]", id));
    }

    try {
      let res;

      if (isEditMode) {
        formData.append("_method", "PUT");
        const albumId = album.id.toString().replace("backend-", "");
        res = await updateAlbum(albumId, formData);
        toast.success("Album updated successfully!");
      } else {
        res = await createAlbum(formData);
        toast.success("Album created successfully!");
      }

      if (onAddAlbum) {
        try {
          await onAddAlbum(); // Refresh albums list after add/update
        } catch (refreshError) {
          console.error("Error refreshing albums:", refreshError);
          toast.error("Album saved but failed to refresh albums.");
        }
      }

      handleClear();
      onClose();
    } catch (error) {
      console.error("Save error:", error.response?.data || error.message);
      toast.error("Failed to save album.");
    }
  };

  return (
    <div className="relative mt-[4rem] max-w-5xl mx-auto p-4 sm:p-6 bg-white rounded-2xl shadow-xl overflow-auto max-h-[80vh]">
      {onClose && (
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-400 hover:text-orange-500"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={24} />
        </button>
      )}

      <h2 className="text-2xl font-bold mb-6">{isEditMode ? "Edit Album" : "Add Album"}</h2>

      <div
        {...getRootProps()}
        className="border-dashed border-2 p-8 sm:p-16 rounded cursor-pointer text-center"
      >
        <input {...getInputProps()} />
        <p>{isDragActive ? "Drop the files here ..." : "Drag & drop images or click to select"}</p>
      </div>

      {images.length > 0 && (
        <ReactSortable
          list={images}
          setList={setImages}
          className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4"
        >
          {images.map((img) => (
            <div key={img.id} className="relative group">
              <img
                src={img.preview}
                alt="preview"
                className="h-24 w-full object-cover rounded-lg"
              />
              <button
                type="button"
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-orange-500 hover:text-white transition"
                onClick={() => {
                  if (img.existing) {
                    setRemovedImageIds((prev) => [...prev, img.id]);
                  }
                  setImages((prev) => prev.filter((i) => i.id !== img.id));
                }}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </ReactSortable>
      )}

      <div className="mt-6">
        <label className="block text-sm font-medium mb-1">Category</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Enter category"
          className="w-full border border-gray-300 rounded-lg p-2"
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-between mt-6 p-2 pb-4 rounded gap-4">
        <button
          type="button"
          onClick={handleClear}
          className="w-full sm:w-[9rem] border border-gray-300 p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full sm:w-[9rem] bg-orange-500 p-2 rounded-lg text-white hover:bg-orange-600 transition"
        >
          {isEditMode ? "Update Album" : "Add Album"}
        </button>
      </div>
    </div>
  );
};

export default AlbumForm;
