import React from "react";
import { Pencil, Trash2, Image as ImageIcon } from "lucide-react";

export default function BookingCard({
  name,
  date,
  time,
  type,
  image,
  onEdit,
  onDelete,
}) {
  return (
    <div className="relative group w-full md:w-[29%] lg:w-[24%] h-[281px] mb-2 rounded-xl border overflow-hidden cursor-pointer bg-white  transition-transform duration-200">
      <img
        src={image ? image : "/placeholder.jpg"}
        alt={name}
        className="w-full h-[180px] object-cover"
      />

      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit?.();
        }}
        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        title="Edit Booking"
      >
        <Pencil size={18} className="text-orange-400" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.();
        }}
        className="absolute top-2 right-12 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        title="Delete Booking"
      >
        <Trash2 size={18} className="text-orange-400" />
      </button>

      <div className="pl-2 pr-2 flex justify-between items-center text-center mt-5">
        <div className=" gap-4 w-full">
          <div className="flex justify-between">
            <div className="w-[110px] ml-3 h-[36px] text-black rounded flex items-start justify-start text-md font-medium truncate">
              {name}
            </div>
            <div className=" text-gray-500 text-sm font-bold">{time}</div>
          </div>
          <div className="flex justify-between">
            <div className="w-[110px] h-[36px] bg-orange-400 ml-2 text-white rounded-2xl flex items-center justify-center text-md font-medium truncate">
              {type}
            </div>
            <div className="text-gray-700 text-sm font-bold">{date}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
