import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import Gallery from "./Pages/GalleryManagement/GalleryAlbums";
import Video from "./Pages/VideoManagement/VideoAlbum";
import AlbumPage from "./Pages/GalleryManagement/Album";
import ContactMessages from "./Pages/ContactMessage/ ContactMessages";
import BookingAlbum from "./Pages/Booking Management/BookingAlbum";

import { Toaster } from 'react-hot-toast';

function Page({ name }) {
  return <div className="p-4 text-xl">{name}</div>;
}

function App() {
  return (
    <Router>
      
      <div className="flex">
        <Sidebar />
              <Toaster position="top-center" reverseOrder={false} />

        <div className="flex-1 ml-0 md:ml-4 p-4 ">
          <Routes>
            <Route path="/" element={<Page name="Dashboard" />} />
            <Route path="/gallery" element={<Gallery />} />  
            <Route path="/video" element={<Video />} />
            <Route path="/booking" element={<BookingAlbum />} />
            <Route path="/contact" element={<ContactMessages/>} />
            <Route path="/album/:id" element={<AlbumPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
