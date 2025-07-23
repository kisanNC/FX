import React, { useState } from "react";
import BookingTable from "./BookingTable";
import CustomCalendar from "./Calendar";

function App({ setShowFilter }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedStatus, setSelectedStatus] = useState("All");

  const bookings = [
    { name: "Ameya", contact: "1234567890", type: "Vehicle", date: "2025-06-17", status: "Pending" },
    { name: "Ameya", contact: "1234567890", type: "Make up", date: "2025-06-19", status: "Confirmed" },
    { name: "Ameya", contact: "1234567890", type: "Camera", date: "2025-06-19", status: "Completed" },
    { name: "Ameya", contact: "1234567890", type: "Camera", date: "2025-06-18", status: "Pending" },
    { name: "Ameya", contact: "1234567890", type: "Make up", date: "2025-06-18", status: "Confirmed" },
    { name: "Ameya", contact: "1234567890", type: "Camera", date: "2025-06-18", status: "Completed" },
  ];

  return (
    <>
      <div className="mb-5 p-4 mt-8 sm:mt-0 relative">
        <button className="absolute top-4 right-4 px-3 py-1 size-5" onClick={() => setShowFilter(false)}>
          ✕
        </button>
      </div>

      <div className="min-h-[80vh] bg-gray-50 overflow-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-4">
              Bookings on {selectedDate}
            </h2>
            <BookingTable
              bookings={bookings}
              selectedDate={selectedDate}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
            />
          </div>
          <div>
            <CustomCalendar onDateChange={setSelectedDate} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
