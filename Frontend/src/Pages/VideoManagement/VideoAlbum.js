import { useState } from "react";
import VideoForm from "./VideoForm";
import VideoCard from "./VideoCard";
import { Search } from "lucide-react";
import HelmateData from "../../utils/HelmetData";

export default function Video() {
  const [showModal, setShowModal] = useState(false);
  const [videos, setVideos] = useState([]);
  const [limitWarning, setLimitWarning] = useState(false);

  const handleUpload = (videoData) => {
    setVideos([{ ...videoData, id: Date.now() }, ...videos]);
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setVideos(videos.filter((video) => video.id !== id));
  };

  return (
    <>
    <HelmateData title={"Video Management"}/>
      <div className="min-h-screen bg-white p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            onClick={() => {
              if (videos.length >= 1) {
                setLimitWarning(true);
              } else {
                setShowModal(true);
              }
            }}
          >
            + Upload Video
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <VideoForm
            onClose={() => setShowModal(false)}
            onUpload={handleUpload}
          />
        )}
        {/* Limit Warning Modal */}
        {limitWarning && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center rounded-2xl justify-center z-50">
            <div className="bg-white p-6 rounded shadow-md max-w-sm text-center">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl mb-4 mx-auto">
                !
              </div>
              <h2 className="text-lg font-semibold">
                Only 10 items can be added
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                If you need to add another, remove one first
              </p>
              <button
                onClick={() => setLimitWarning(false)}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              >
                OK
              </button>
            </div>
          </div>
        )}
        {/* Video Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} onDelete={handleDelete} />
          ))}
        </div>
      </div>
    </>
  );
}
