import { useParams } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Pencil, Trash2 } from "lucide-react";
import pageToken from "../../config/facebookToken";
import UploadImageForm from "./UploadImageForm";
import DeleteConfirmModal from "../../utils/DeleteConfirmModal";

export default function AlbumPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [albumName, setAlbumName] = useState("");
  const [photos, setPhotos] = useState([]);
  const photoRefs = useRef([]);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  // Ref for hidden file input for editing image
  const hiddenEditInputRef = useRef(null);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    async function fetchAlbumPhotos() {
      setLoading(true);

      try {
        const albumRes = await fetch(
          `https://graph.facebook.com/v18.0/${id}?fields=name&access_token=${pageToken}`
        );
        const albumData = await albumRes.json();
        setAlbumName(albumData.name);

        const photosRes = await fetch(
          `https://graph.facebook.com/v18.0/${id}/photos?fields=images&access_token=${pageToken}`
        );
        const photoData = await photosRes.json();
        setPhotos(photoData.data || []);
      } catch (err) {
        console.error("Error fetching album photos", err);
      }

      setLoading(false);
    }

    fetchAlbumPhotos();
  }, [id]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(photos);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setPhotos(items);
  };

  const handleImagesUploaded = (newImages) => {
    setPhotos((prev) => [...prev, ...newImages]);
  };

  // Delete confirmation modal handlers
  const confirmDeleteImage = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = () => {
    if (deleteIndex !== null) {
      setPhotos((prev) => prev.filter((_, i) => i !== deleteIndex));
    }
    setShowDeleteModal(false);
    setDeleteIndex(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDeleteIndex(null);
  };

  // Open file picker when Edit button clicked
  const openEditFilePicker = (index) => {
    setEditIndex(index);
    if (hiddenEditInputRef.current) {
      hiddenEditInputRef.current.value = ""; // Reset input to allow same file selection again
      hiddenEditInputRef.current.click();
    }
  };

  // When file selected, replace the photo immediately
  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (file && editIndex !== null) {
      const preview = URL.createObjectURL(file);
      setPhotos((prev) => {
        const updated = [...prev];
        updated[editIndex] = {
          id: crypto.randomUUID(),
          preview,
          file,
        };
        return updated;
      });
    }
  };

  if (loading) {
    return (
      <div className="p-5 mt-9">
        <div className="flex gap-4 justify-between mb-6">
          <div className="w-32">
            <Skeleton height={40} />
          </div>
          <div className="w-32">
            <Skeleton height={40} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="w-full h-[281px]">
              <Skeleton height={281} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 mt-9">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-2xl">{albumName || "Album"}</h1>
        <button
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          onClick={() => setShowUploadModal(true)}
        >
          Upload Image
        </button>
      </div>

      {photos.length === 0 ? (
        <p>No photos found.</p>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable
            droppableId="photos"
            direction="horizontal"
            isDropDisabled={false}
            isCombineEnabled={false}
            ignoreContainerClipping={false}
          >
            {(provided) => (
              <div
                className="flex flex-wrap gap-4"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {photos.map((photo, idx) => (
                  <Draggable
                    key={photo.id || idx}
                    draggableId={photo.id || `photo-${idx}`}
                    index={idx}
                  >
                    {(provided) => (
                      <div
                        className="relative group w-full md:w-[24%]"
                        ref={(el) => {
                          photoRefs.current[idx] = el;
                          provided.innerRef(el);
                        }}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <img
                          src={photo.images?.[0]?.source || photo.preview}
                          alt={`Photo ${idx + 1}`}
                          className="h-[281px] object-cover rounded-md w-full"
                        />

                        {/* Buttons on hover */}
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => confirmDeleteImage(idx)}
                            className="bg-white  rounded-full p-1 shadow "
                            aria-label="Delete Image"
                            type="button"
                          >
                            <Trash2 size={20}  className="text-orange-400"/>
                          </button>
                          <button
                            onClick={() => openEditFilePicker(idx)}
                            className="bg-white  rounded-full p-1 shadow "
                            aria-label="Edit Image"
                            type="button"
                          >
                            <Pencil size={20}  className="text-orange-400"/>
                          </button>
                         
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {showUploadModal && (
        <UploadImageForm
          onClose={() => setShowUploadModal(false)}
          onUpload={handleImagesUploaded}
        />
      )}

      <DeleteConfirmModal
        open={showDeleteModal}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirmed}
        message="Are you sure you want to delete this image?"
      />

      {/* Hidden file input for editing image */}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={hiddenEditInputRef}
        onChange={handleEditFileChange}
      />
    </div>
  );
}
