import React from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

const CustomCalendar = ({ onDateChange }) => {
  const handleDateClick = (value) => {
    // Use local time, not UTC
    const formatted = value.toLocaleDateString('en-CA'); // "YYYY-MM-DD"
    onDateChange(formatted);
  };

  return (
    <div className="rounded border p-2">
      <Calendar onClickDay={handleDateClick} />
    </div>
  );
};

export default CustomCalendar;
