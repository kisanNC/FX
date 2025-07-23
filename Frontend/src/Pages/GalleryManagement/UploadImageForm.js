import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { X } from "lucide-react";
import { ReactSortable } from "react-sortablejs";

export default function UploadImageForm({ onClose, onUpload }) {
  const [images, setImages] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    const newImages = acceptedFiles.map((file) =>
      Object.assign(file, {
        id: crypto.randomUUID(),
        preview: URL.createObjectURL(file),
      })
    );
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const handleRemoveImage = (id) => {
    setImages((prev) => prev.filter((file) => file.id !== id));
  };

  const handleUpload = () => {
    if (images.length > 0 && onUpload) {
      onUpload(images);
      setImages([]);
      onClose();
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="fixed md overflow-auto inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-orange-500"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-4">Upload Images</h2>

        <div
          {...getRootProps()}
          className="border-dashed border-2 p-8 rounded cursor-pointer text-center"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the images here...</p>
          ) : (
            <p>
              Drag & drop or <b>click</b> to select images
            </p>
          )}
        </div>

        {images.length > 0 && (
          <ReactSortable
            list={images}
            setList={setImages}
              group={{ name: "images", pull: true, put: true }}  

            itemKey="id"
            className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4"
          >
            {images.map((file) => (
              <div key={file.id} className="relative group">
                <img
                  src={file.preview}
                  alt="preview"
                  className="h-24 w-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-orange-500 hover:text-white transition"
                  onClick={() => handleRemoveImage(file.id)}
                  aria-label="Remove"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </ReactSortable>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setImages([])}
            className="px-4 py-2 border rounded text-gray-600"
          >
            Clear
          </button>
          <button
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            onClick={handleUpload}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
