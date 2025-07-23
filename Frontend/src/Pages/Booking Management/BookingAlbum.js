import React, { useState, useEffect, useRef } from "react";
import BookingCard from "./BookingCard.js";
import BookingForm from "./BookingForm.js";
import Filter from "../CalenderFilter/CalenderFilterMain.js";
import { toast } from "react-hot-toast";
import DeleteConfirmModal from "../../utils/DeleteConfirmModal.js";
import HemetData from "../../utils/HelmetData.jsx";
import { Bell } from "lucide-react";

export default function BookingAlbum() {
  const [showForm, setShowForm] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [unreadCount, setUnreadCount] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const [bookings, setBookings] = useState([
    {
      name: "Arun Kumar",
      price: "12000",
      type: "Camera",
      date: "2025-07-01",
      time: "10:00",

      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Priya S",
      price: "8000",
      type: "Makeup",
      date: "2025-07-10",
      time: "18:30",
      image:
        "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Arun Kumar",
      price: "12000",
      type: "Makeup",
      date: "2025-07-01",
      time: "10:00",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Arunk Kumar",
      price: "12000",
      type: "Vehicle",
      date: "2025-07-01",
      time: "10:00",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    },
  ]);

  const handleAddOrEditBooking = (data) => {
    if (editingBooking) {
      setBookings((prev) =>
        prev.map((b) => (b === editingBooking ? { ...b, ...data } : b))
      );
    } else {
      setBookings([data, ...bookings]);
    }
    setShowForm(false);
    setEditingBooking(null);
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking);
    setShowForm(true);
  };

  const handleDelete = (bookingToDelete) => {
    setBookings((prev) => prev.filter((b) => b !== bookingToDelete));
    toast.success("Booking deleted successfully");
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBooking(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  return (
    <div className="p-4 mt-8 sm:mt-0 overflow-x-hidden">
      <HemetData title={"Booking Management"} />
      <div className="flex justify-center md:justify-between items-center mb-6 flex-wrap gap-4">
        <div className="flex gap-8">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setShowFilter(!showFilter)}
          >
            <div className="bg-orange-100 rounded-full p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8h2a2 2 0 012 2v9l-4-2H7a2 2 0 01-2-2V8a2 2 0 012-2h2"
                />
              </svg>
            </div>
            <div>
              <div className="text-lg font-semibold">220</div>
              <div className="text-sm text-gray-500">Responses</div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 items-center relative">
          {!showFilter && (
            <button
              onClick={() => {
                setEditingBooking(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded shadow"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 4a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H5a1 1 0 110-2h6V5a1 1 0 011-1z" />
              </svg>
              <span className="font-semibold">New Advertise</span>
            </button>
          )}

          {/* Notification Bell */}
          <div className="relative inline-block" ref={notificationRef}>
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setUnreadCount(0);
              }}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded shadow relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded shadow-lg z-10 max-h-[90vh] overflow-auto">
                <ul
                  className="divide-y divide-gray-200 text-sm"
                  onClick={() => {
                    setShowFilter(true);
                    setShowNotifications(false);
                  }}
                >
                  <li className="p-3 cursor-pointer hover:bg-gray-100">New appointment scheduled</li>
                  <li className="p-3 cursor-pointer hover:bg-gray-100">You have 2 bookings today</li>
                  <li className="p-3 cursor-pointer hover:bg-gray-100">Makeup artist confirmed</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {!showFilter && (
        <div className="flex flex-wrap justify-start gap-[19.3px]">
          {bookings.map((b, idx) => (
            <BookingCard
              key={idx}
              {...b}
              onEdit={() => handleEdit(b)}
              onDelete={() => setDeleteTarget(b)}
            />
          ))}
        </div>
      )}

      {showForm && (
        <BookingForm
          onClose={handleCloseForm}
          onSubmit={handleAddOrEditBooking}
          initialData={editingBooking}
        />
      )}

      {showFilter && <Filter setShowFilter={setShowFilter} />}

      <DeleteConfirmModal
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          setBookings((prev) => prev.filter((b) => b !== deleteTarget));
          setDeleteTarget(null);
          toast.success("Booking deleted successfully");
        }}
        message="Are you sure you want to delete this booking?"
      />
    </div>
  );
}