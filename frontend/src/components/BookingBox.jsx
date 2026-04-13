import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BookingBox() {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [rideType, setRideType] = useState("oneway");
  const [hours, setHours] = useState(2);

  const handleSearch = () => {
    if (!pickup) return alert("Enter pickup location");
    if (rideType === "oneway" && !drop) {
      return alert("Enter destination");
    }
    const data = {
      pickup,
      drop: rideType === "oneway" ? drop : null,
      rideType,
      hours: rideType === "hourly" ? hours : null,
    };
    console.log("Booking Data:", data);
    // 👉 API call yaha karega
    navigate("/drivers", { state: data });
  };

  return (
    <div className="bg-card dark:bg-[#0d2233] p-8 rounded-2xl w-full max-w-md shadow-2xl border border-border">
      {/* 🔘 RIDE TYPE */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setRideType("oneway")}
          className={`flex-1 p-2 rounded-lg font-bold border-2 transition-colors duration-150 ${
            rideType === "oneway"
              ? "bg-primary text-black border-primary shadow"
              : "bg-white dark:bg-[#122c3f] text-black dark:text-white border-border hover:bg-primary/10"
          }`}
        >
          One Way
        </button>
        <button
          onClick={() => setRideType("hourly")}
          className={`flex-1 p-2 rounded-lg font-bold border-2 transition-colors duration-150 ${
            rideType === "hourly"
              ? "bg-primary text-black border-primary shadow"
              : "bg-white dark:bg-[#122c3f] text-black dark:text-white border-border hover:bg-primary/10"
          }`}
        >
          2h / 4h
        </button>
        <button
          onClick={() => setRideType("outstation")}
          className={`flex-1 p-2 rounded-lg font-bold border-2 transition-colors duration-150 ${
            rideType === "outstation"
              ? "bg-primary text-black border-primary shadow"
              : "bg-white dark:bg-[#122c3f] text-black dark:text-white border-border hover:bg-primary/10"
          }`}
        >
          Outstation
        </button>
      </div>
      {/* 📍 PICKUP */}
      <input
        value={pickup}
        onChange={(e) => setPickup(e.target.value)}
        placeholder="Pickup Location"
        className="w-full p-3 mb-3 rounded-xl bg-white dark:bg-[#122c3f] text-black dark:text-white border border-border focus:ring-2 focus:ring-primary outline-none"
      />
      {/* 🏁 DROP (only for one-way & outstation) */}
      {(rideType === "oneway" || rideType === "outstation") && (
        <input
          value={drop}
          onChange={(e) => setDrop(e.target.value)}
          placeholder="Destination"
          className="w-full p-3 mb-3 rounded-xl bg-white dark:bg-[#122c3f] text-black dark:text-white border border-border focus:ring-2 focus:ring-primary outline-none"
        />
      )}
      {/* ⏱️ HOURS (only hourly) */}
      {rideType === "hourly" && (
        <select
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          className="w-full p-3 mb-3 rounded-xl bg-white dark:bg-[#122c3f] text-black dark:text-white border border-border focus:ring-2 focus:ring-primary outline-none"
        >
          <option value={2}>2 Hours</option>
          <option value={4}>4 Hours</option>
          <option value={8}>8 Hours</option>
        </select>
      )}
      {/* 🚀 BUTTON */}
      <button
        onClick={handleSearch}
        className="w-full bg-primary hover:bg-green-400 py-3 rounded-2xl text-black font-extrabold text-lg shadow-lg transition-colors duration-150 mt-2"
      >
        Book Ride
      </button>
    </div>
  );
}
