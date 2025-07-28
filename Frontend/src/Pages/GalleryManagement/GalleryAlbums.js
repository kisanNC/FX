// Gallery.js
import { useEffect, useState } from "react";
import AlbumCard from "./AlbumCard";
import ReactPaginate from "react-paginate";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import HelmateData from "../../utils/HelmetData";
import pageToken from "../../config/facebookToken";
import AddAlbum from "./AlbumForm";
import AllImagesView from "./ImageView";
import DeleteConfirmModal from "../../utils/DeleteConfirmModal";
import { getAllAlbums,deleteAlbum, } from "../../api/gallery"; // Laravel albums

const ITEMS_PER_PAGE = 8;

async function fetchFacebookAlbums() {
  const res = await fetch(
    `https://graph.facebook.com/v18.0/me/albums?access_token=${pageToken}`
  );
  const albumData = await res.json();

  const albums = await Promise.all(
    (albumData.data || []).map(async (album) => {
      const previewRes = await fetch(
        `https://graph.facebook.com/v18.0/${album.id}/photos?fields=images&access_token=${pageToken}`
      );
      const previewData = await previewRes.json();
      return {
        ...album,
        id: `fb-${album.id}`, // prevent ID collision
        previewImage: previewData.data?.[0]?.images?.[0]?.source || "",
        allImages:
          previewData.data?.map((img) => img.images?.[0]?.source) || [],
                photoCount: previewData.data?.length || 0, // ✅ Add this line

        source: "facebook",
      };
    })
  );

  return albums;
}

async function getCombinedAlbums() {
  const [fbAlbums, backendRes] = await Promise.all([
    fetchFacebookAlbums(),
    getAllAlbums(),
  ]);

const BACKEND_URL = "http://localhost:8000";

const backendAlbums = (backendRes.data || []).map((album) => ({
  ...album,
  id: `backend-${album.id}`,
  previewImage: album.images?.[0]?.image_path
    ? album.images[0].image_path.startsWith("http")
      ? album.images[0].image_path
      : `${BACKEND_URL}/storage/${album.images[0].image_path}`
    : "",
  allImages: album.images?.map((img) =>
    img.image_path.startsWith("http") ? img.image_path : `${BACKEND_URL}/storage/${img.image_path}`
  ) || [],
    photoCount: album.images?.length || 0, // ✅ Add this line

  source: "backend",
}));



  return [...backendAlbums, ...fbAlbums];
}

export default function Gallery() {
  const [albums, setAlbums] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAddAlbum, setShowAddAlbum] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [viewMode, setViewMode] = useState("albums");
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [deleteTargetAlbum, setDeleteTargetAlbum] = useState(null);

  const handleEditAlbum = (album) => {
    if (album.source === "facebook") {
      alert("Editing Facebook albums is not supported.");
      return;
    }
    setEditingAlbum(album);
    setShowAddAlbum(true);
  };

  const handleDeleteAlbum = (album) => {
    if (album.source === "facebook") {
      alert("Deleting Facebook albums is not allowed.");
      return;
    }
    setDeleteTargetAlbum(album);
  };

 const confirmDeleteAlbum = async () => {
  if (!deleteTargetAlbum) return;

  try {
    // Call API only for backend albums, Facebook albums cannot be deleted
    if (deleteTargetAlbum.source === "backend") {
      await deleteAlbum(deleteTargetAlbum.id.replace("backend-", ""));
    }

    // Refresh albums after deletion
    const allAlbums = await getCombinedAlbums();
    setAlbums(allAlbums);
    setLoading(true);
    setLoading(false);

    setDeleteTargetAlbum(null);
  } catch (error) {
    setLoading(false);
    alert("Failed to delete album.");
    console.error("Delete album error:", error);
  }
};


  const cancelDeleteAlbum = () => setDeleteTargetAlbum(null);

  useEffect(() => {
    async function loadAlbums() {
      setLoading(true);
      const allAlbums = await getCombinedAlbums();
      setAlbums(allAlbums);
      setLoading(false);
    }
    loadAlbums();
  }, []);

  const pageCount = Math.ceil(albums.length / ITEMS_PER_PAGE);
  const offset = currentPage * ITEMS_PER_PAGE;
  const currentAlbums = albums.slice(offset, offset + ITEMS_PER_PAGE);

  const handlePageClick = (e) => setCurrentPage(e.selected);

  const handleAddAlbumClick = () => {
    const nextIndex = albums.length;
    setStartIndex(nextIndex);
    setShowAddAlbum(true);
  };
const handleAddAlbum = async () => {
  setLoading(true);
  try {
    const allAlbums = await getCombinedAlbums();  // reload all albums fresh
    setAlbums(allAlbums);
    setCurrentPage(0);
    setEditingAlbum(null);
    setShowAddAlbum(false);
  } catch (error) {
    console.error("Failed to refresh albums after add/update:", error);
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <HelmateData title={"Gallery Management"} />
      <main className="p-3">
        {showAddAlbum ? (
          <div className="mb-8">
            <AddAlbum
              album={editingAlbum}
              onClose={() => {
                setShowAddAlbum(false);
                setEditingAlbum(null);
              }}
              startIndex={startIndex}
              onAddAlbum={handleAddAlbum}
            />
          </div>
        ) : (
          <>
            <div className="flex justify-between mb-6">
              <h1 className="hidden md:block text-3xl font-bold">
                Gallery Albums
              </h1>
              <button
                className="bg-orange-400 text-white px-4 py-2 rounded md:mr-2 md:ml-0 ml-[14.7rem]"
                onClick={handleAddAlbumClick}
              >
                + Add Album
              </button>
            </div>

            <div className="flex mb-6 gap-6 border border-orange-200 rounded overflow-hidden w-max">
              <button
                onClick={() => setViewMode("albums")}
                className={`px-4 py-2 ${
                  viewMode === "albums"
                    ? "bg-orange-400 text-white"
                    : "bg-white text-black"
                }`}
              >
                Albums View
              </button>
              <button
                onClick={() => setViewMode("images")}
                className={`px-4 py-2 ${
                  viewMode === "images"
                    ? "bg-orange-400 text-white"
                    : "bg-white text-black"
                }`}
              >
                Image View
              </button>
            </div>

            {viewMode === "albums" ? (
              <div className="flex flex-wrap justify-start gap-4">
                {loading ? (
                  Array(8)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="w-full sm:w-[48%] lg:w-[24%] h-[300px] mb-7 rounded-xl shadow-md bg-white"
                      >
                        <Skeleton
                          height={180}
                          className="w-full rounded-t-xl"
                        />
                        <div className="p-4">
                          <Skeleton height={24} width={`60%`} />
                          <Skeleton
                            height={20}
                            width={`30%`}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    ))
                ) : currentAlbums.length === 0 ? (
                  <p>No albums found.</p>
                ) : (
                  currentAlbums.map((album) => (
                    <AlbumCard
                      key={album.id}
                      album={album}
                      onEdit={handleEditAlbum}
                      onDelete={handleDeleteAlbum}
                    />
                  ))
                )}
              </div>
            ) : (
              <AllImagesView albums={albums} loading={loading} />
            )}

            {!loading &&
              viewMode === "albums" &&
              albums.length > ITEMS_PER_PAGE && (
                <div className="mt-10 flex justify-center">
                  <ReactPaginate
                    previousLabel={"←"}
                    nextLabel={"→"}
                    breakLabel={"..."}
                    pageCount={pageCount}
                    onPageChange={handlePageClick}
                    containerClassName="flex space-x-2"
                    pageClassName="px-3 py-1 border rounded"
                    activeClassName="bg-orange-400 text-white"
                    previousClassName="px-3 py-1 border rounded"
                    nextClassName="px-3 py-1 border rounded"
                  />
                </div>
              )}
          </>
        )}
      </main>

      <DeleteConfirmModal
        open={!!deleteTargetAlbum}
        onCancel={cancelDeleteAlbum}
        onConfirm={confirmDeleteAlbum}
        message={`Are you sure you want to delete "${deleteTargetAlbum?.name}" Album?`}
      />
    </>
  );
}
