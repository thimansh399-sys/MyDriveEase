import React, { useState } from "react";

export default function BookingBox() {
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
    // navigate("/drivers", { state: data });
  };

  return (
    <div className="bg-[#0d2233] p-6 rounded-2xl w-full max-w-md shadow-lg">
      {/* 🔘 RIDE TYPE */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setRideType("oneway")}
          className={`flex-1 p-2 rounded-lg ${
            rideType === "oneway" ? "bg-green-500 text-black" : "bg-[#122c3f]"
          }`}
        >
          One Way
        </button>
        <button
          onClick={() => setRideType("hourly")}
          className={`flex-1 p-2 rounded-lg ${
            rideType === "hourly" ? "bg-green-500 text-black" : "bg-[#122c3f]"
          }`}
        >
          2h / 4h
        </button>
        <button
          onClick={() => setRideType("outstation")}
          className={`flex-1 p-2 rounded-lg ${
            rideType === "outstation" ? "bg-green-500 text-black" : "bg-[#122c3f]"
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
        className="w-full p-3 mb-3 rounded-lg bg-[#122c3f]"
      />
      {/* 🏁 DROP (only for one-way & outstation) */}
      {(rideType === "oneway" || rideType === "outstation") && (
        <input
          value={drop}
          onChange={(e) => setDrop(e.target.value)}
          placeholder="Destination"
          className="w-full p-3 mb-3 rounded-lg bg-[#122c3f]"
        />
      )}
      {/* ⏱️ HOURS (only hourly) */}
      {rideType === "hourly" && (
        <select
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          className="w-full p-3 mb-3 rounded-lg bg-[#122c3f]"
        >
          <option value={2}>2 Hours</option>
          <option value={4}>4 Hours</option>
          <option value={8}>8 Hours</option>
        </select>
      )}
      {/* 🚀 BUTTON */}
      <button
        onClick={handleSearch}
        className="w-full bg-green-500 py-3 rounded-xl text-black font-bold"
      >
        Find Drivers
      </button>
    </div>
  );
}
