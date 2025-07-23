export default function AllImagesView({ albums, loading }) {
  const allImages = albums.flatMap((album) => album.allImages || []);

if (loading) {
    return (
      <div className="md:mt-0 mt-[3rem] p-5 flex flex-col gap-4 max-h-[100vh] overflow-auto rounded-md">
        <div className="flex justify-between items-center mb-1">
          <div className="w-1/2">
            <Skeleton height={42} width={`60%`} />
          </div>
          <div className="w-[150px]">
            <Skeleton height={42} width={`100%`} />
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          {Array.from({ length: 16 }).map((_, idx) => (
            <div
              key={idx}
              className="md:w-[24%] w-[104%] h-[291px] rounded-md bg-white"
            >
              <Skeleton height={281} width="100%" style={{ borderRadius: 6 }} />
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (allImages.length === 0) {
    return <p>No images available.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[80vh] overflow-auto">
      {allImages.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Image ${index}`}
          className="w-full h-[200px] object-cover rounded-xl shadow"
        />
      ))}
    </div>
  );
}
