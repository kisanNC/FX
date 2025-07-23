import { useState } from "react";

export default function VideoForm({ onClose, onUpload }) {
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!link) return;
    onUpload({
      thumbnail: "https://via.placeholder.com/150x100.png?text=Video",
      title: description || "Untitled",
      link,
    });
    setLink("");
    setDescription("");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
        <h2 className="text-xl font-semibold mb-4">Add Video</h2>
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
          onClick={onClose}
        >
          &times;
        </button>

        <label className="block mb-2 font-medium">Link</label>
        <input
          type="text"
          placeholder="ex: https://www.youtube.com/"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full border px-3 py-2 mb-4 rounded"
        />

        <label className="block mb-2 font-medium">Description</label>
        <input
          type="text"
          placeholder="Optional"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 mb-4 rounded"
        />

        <div className="flex justify-between">
          <button
            onClick={() => {
              setLink("");
              setDescription("");
            }}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Clear
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
