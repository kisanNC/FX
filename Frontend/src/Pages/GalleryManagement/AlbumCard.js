// AlbumCard.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image, Pencil, Trash2 } from "lucide-react";
import pageToken from "../../config/facebookToken";

async function getAlbumDetails(id) {
  try {
    const res = await fetch(
      `https://graph.facebook.com/v18.0/${id}/photos?fields=images&access_token=${pageToken}`
    );
    const data = await res.json();
    return data?.data || [];
  } catch (err) {
    console.error("Error fetching album details", err);
    return [];
  }
}

export default function AlbumCard({ album, onEdit, onDelete }) {
  const navigate = useNavigate();
  const [photoCount, setPhotoCount] = useState(0);
  const [coverPhoto, setCoverPhoto] = useState(album.previewImage);

  useEffect(() => {
    async function fetchDetails() {
      const photos = await getAlbumDetails(album.id);
      setPhotoCount(photos.length);
      if (!coverPhoto && photos.length > 0) {
        setCoverPhoto(photos[0].images[0].source);
      }
    }
    fetchDetails();
    // eslint-disable-next-line
  }, [album.id]);

  return (
    <div
      className="relative group w-full md:w-[29%] lg:w-[24%] h-[281px] mb-7 rounded-xl border overflow-hidden cursor-pointer bg-white hover:scale-105 transition-transform duration-200"
    >
      <img
        onClick={() => navigate(`/album/${album.id}`)}
        src={coverPhoto}
        alt="Preview"
        className="w-full h-[180px] object-cover"
      />

      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(album);
        }}
        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        title="Edit Album"
      >
        <Pencil size={18} className="text-orange-400" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(album); // pass the full album
        }}
        className="absolute top-2 right-12 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        title="Delete Album"
      >
        <Trash2 size={18} className="text-orange-400" />
      </button>

      <div className="p-4 flex justify-between items-center text-center mt-5">
        <div className="flex items-center justify-between gap-4 w-full">
          <div className="w-[130px] h-[36px] bg-orange-400 text-white rounded flex items-center justify-center text-md font-medium">
            {album?.name || "Album"}
          </div>
          <div className="text-gray-700 text-lg font-bold flex items-center">
            {photoCount}
            <Image size={19} className="inline ml-1 mb-[2px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
