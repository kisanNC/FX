import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { ReactSortable } from "react-sortablejs";
import { X } from "lucide-react";

const AlbumForm = ({ onClose, startIndex, onAddAlbum, album }) => {
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (album) {
      setCategory(album.name || "");
      setImages(
        album.images?.map((img, idx) => ({
          ...img,
          id: img.id || `existing-${idx}-${Date.now()}`,
          preview: img.preview || img.src || img.url, // ensure preview URL exists
        })) || []
      );
    }
  }, [album]);

  const onDrop = useCallback((acceptedFiles) => {
    const newImages = acceptedFiles.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}`,
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleClear = () => {
    setImages([]);
    setCategory("");
  };

  const handleSubmit = () => {
    if (images.length === 0 || !category.trim()) {
      alert("Please add at least one image and a category.");
      return;
    }

    const newAlbum = {
      id: album?.id || `local-${Date.now()}`,
      name: category,
      previewImage: images[0].preview,
      images,
    };

    onAddAlbum(newAlbum);
    handleClear();
    onClose();
  };

  return (
    <div className="relative mt-[4rem] md:mt-[4rem] max-w-5xl mx-auto p-4 sm:p-6 bg-white rounded-2xl shadow-xl overflow-auto max-h-[80vh]">
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

      <h2 className="text-2xl font-bold mb-6">
        {album ? "Edit Album" : "Add Album"}
      </h2>

      <div
        {...getRootProps()}
        className="border-dashed border-2 p-8 sm:p-16 rounded cursor-pointer text-center"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag & drop some images here, or click to select files</p>
        )}
      </div>

      {images.length > 0 && (
        <ReactSortable
          list={images}
          setList={setImages}
          group={{ name: "images", pull: true, put: true }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4"
          animation={200}
          ghostClass="opacity-50"
        >
          {images.map((image) => (
            <div key={image.id} className="relative group">
              <img
                src={image.preview}
                alt="preview"
                className="h-24 w-full object-cover rounded-lg"
              />
              <button
                type="button"
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-orange-500 hover:text-white transition"
                onClick={() =>
                  setImages((prev) => prev.filter((img) => img.id !== image.id))
                }
                aria-label="Remove"
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

      <div className="relative flex flex-col sm:flex-row justify-between mt-6 p-2 pb-4 rounded gap-4">
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
          {album ? "Update Album" : "Add Album"}
        </button>
      </div>
    </div>
  );
};

export default AlbumForm;
