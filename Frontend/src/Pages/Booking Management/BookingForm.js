import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { CalendarDays, AlarmClock, Upload } from "lucide-react";
import { toast } from "react-hot-toast";

export default function BookingForm({ onClose, onSubmit, initialData }) {
  const [changebutton, setChangebutton] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    type: "",
    date: "",
    time: "",
    image: null,
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
      setChangebutton(true);
    }
  }, [initialData]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = (e) => {
  e.preventDefault();
  const { name, price, type, date, time, image } = form;
  if (!name || !price || !type || !date || !time || !image) {
    toast.error("Please fill all fields and upload an image");
    return;
  }

  if (changebutton) {
    toast.success("Booking updated successfully");
  } else {
    toast.success("Booking saved successfully");
  }

  onSubmit(form);
};


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-2 top-1 text-black-400 hover:text-black text-xl"
          aria-label="Close form"
        >
          ×
        </button>
        <form onSubmit={handleSubmit}>
          {/* Image Upload */}
          <div
            {...getRootProps()}
            className="flex flex-col items-center border-2 border-dashed border-orange-300 p-4 mb-4 rounded-xl text-center cursor-pointer relative"
          >
            <input {...getInputProps()} />
            {form.image ? (
              <>
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering upload dialog
                    setForm((prev) => ({ ...prev, image: null }));
                  }}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                  aria-label="Remove image"
                >
                  ×
                </button>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6 text-orange-500 mb-2" />
                <p className="text-sm text-orange-500 font-medium">
                  <span className="font-semibold cursor-pointer">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-xs text-gray-400">
                  JPG, JPEG, PNG less than 1MB
                </p>
              </>
            )}
          </div>

          {/* Name */}
          <label
            htmlFor="name"
            className="block mb-1 font-semibold text-gray-700"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-4"
            placeholder="Enter name"
          />

          {/* Price */}
          <label
            htmlFor="price"
            className="block mb-1 font-semibold text-gray-700"
          >
            Price
          </label>
          <input
            id="price"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-4"
            placeholder="Enter price"
          />

          {/* Type */}
          <label
            htmlFor="type"
            className="block mb-1 font-semibold text-gray-700"
          >
            Service Type
          </label>
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-4"
          >
            <option value="" disabled>
              Select service type
            </option>
            <option value="Vehicle">Vehicle</option>
            <option value="Makeup">Makeup</option>
            <option value="Camera">Camera</option>
          </select>

          {/* Date and Time */}
          <div className="flex justify-center gap-4 mb-4">
            <div className="flex flex-col">
              <label
                htmlFor="date"
                className="mb-1 font-semibold text-gray-700 flex items-center gap-2"
              >
                <CalendarDays className="w-5 h-5" /> Date
              </label>
              <input
                id="date"
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="p-2 border rounded"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="time"
                className="mb-1 font-semibold text-gray-700 flex items-center gap-2"
              >
                <AlarmClock className="w-5 h-5" /> Time
              </label>
              <input
                id="time"
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                className="p-2 border rounded"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() =>
                setForm({
                  name: "",
                  price: "",
                  type: "",
                  date: "",
                  time: "",
                  image: null,
                })
              }
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Clear
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded"
            >
              {changebutton ? "Update" : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
