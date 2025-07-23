import React from "react";

const BookingTable = ({ bookings, selectedDate, selectedStatus, onStatusChange }) => {
  const statusFilters = ["All", "Pending", "Confirmed", "Completed"];

  const filtered = bookings.filter((b) =>
    b.date === selectedDate &&
    (selectedStatus === "All" || b.status === selectedStatus)
  );

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {statusFilters.map((status) => (
          <button
            key={status}
            onClick={() => onStatusChange(status)}
            className={`px-4 py-1 border rounded ${
              selectedStatus === status ? "bg-orange-400 text-white" : "bg-white"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto border rounded">
        <table className="w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Contact</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No bookings for this date and status.
                </td>
              </tr>
            ) : (
              filtered.map((b, i) => (
                <tr key={i} className="bg-white">
                  <td className="p-2 border">{b.name}</td>
                  <td className="p-2 border">{b.contact}</td>
                  <td className="p-2 border">{b.type}</td>
                  <td className="p-2 border">{b.date}</td>
                  <td className="p-2 border">{b.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingTable;
