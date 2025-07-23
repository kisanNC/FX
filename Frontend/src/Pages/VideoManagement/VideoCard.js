import { Trash2 } from "lucide-react";

export default function VideoCard({ video, onDelete }) {
  const getYouTubeEmbedUrl = (url) => {
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^\s&]+)/
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const embedUrl = getYouTubeEmbedUrl(video.link);

  return (
    <div className="relative bg-white rounded shadow p-2 group">
     {embedUrl ? (
  <iframe
    className="w-full aspect-video rounded"
    src={embedUrl}
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
    title={video.title}
    onError={() => setIsBroken(true)}
  ></iframe>
) : (
  <a
    href={video.link}
    target="_blank"
    rel="noopener noreferrer"
    className="block text-blue-500 underline text-sm mt-2"
  >
    Watch on YouTube
  </a>
)}

      <p className="mt-2 font-medium">{video.title}</p>
      <button
        onClick={() => onDelete(video.id)}
        className="absolute top-2 right-2 bg-white bg-opacity-80 p-1 rounded-full hidden group-hover:block"
      >
        <Trash2 size={18} className="text-orange-400"/>
      </button>
    </div>
  );
}
