import React, { useState } from "react";
import api from "../utils/api";

export default function BookingBox() {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [tripType, setTripType] = useState("oneway");
  const [carType, setCarType] = useState("wagonr");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);

  const handleSearch = async () => {
    if (!pickup) return alert("Enter pickup");
    if ((tripType === "oneway" || tripType === "round") && !drop) {
      return alert("Enter drop location");
    }

    let perKm = 11;
    let baseFare = 900;

    if (carType === "ertiga") {
      perKm = 14;
      baseFare = 1100;
    } else if (carType === "innova") {
      perKm = 17;
      baseFare = 1200;
    }

    let distance = 10;
    let fare = baseFare + distance * perKm;

    setLoading(true);
    try {
      await api.post("/bookings/create", {
        pickup,
        drop,
        tripType,
        carType,
        fare,
        date,
        time,
      });

      alert(`Booking Confirmed 🚗\nFare: ₹${fare}`);
    } catch {
      alert("Booking Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* MAIN BOOKING BOX */}
      <div className="bg-[#0f172a]/80 backdrop-blur-md border border-green-500/20 
                      p-5 rounded-2xl shadow-xl w-full max-w-md text-white">

        <h2 className="text-xl font-bold mb-2">Select Your Ride</h2>
        <p className="text-gray-400 mb-4 text-sm">Quick & Easy Booking</p>

        {/* Pickup */}
        <div className="flex items-center gap-2 bg-[#020617] border border-gray-700 rounded-lg px-3 py-2.5 mb-2.5">
        <span className="text-green-400">📍</span>
        <input
           type="text"
           placeholder="Pickup Location"
           className="bg-transparent w-full outline-none text-sm"
    />
</div>

        {/* Drop */}
        <div className="flex items-center gap-2 bg-[#020617] border border-gray-700 rounded-lg px-3 py-2.5 mb-2.5">
  <span className="text-red-400">📍</span>
  <input
    type="text"
    placeholder="Drop Location"
    value={drop}
    onChange={(e) => setDrop(e.target.value)}
    className="bg-transparent w-full outline-none text-sm"
  />
</div>

        {/* Trip Type */}
         <div className="flex items-center justify-between bg-[#020617] border border-gray-700 rounded-lg px-3 py-3 mb-2">
         <div className="flex items-center gap-2 text-gray-300 text-sm">
         <span>🚕</span>
         <span>
        {tripType === "oneway"
        ? "One Way"
        : tripType === "round"
        ? "Round Trip"
        : "Hourly"}
         </span>
  </div>

  <select
    value={tripType}
    onChange={(e) => setTripType(e.target.value)}
    className="bg-transparent outline-none text-gray-400 text-sm cursor-pointer"
  >
    <option value="oneway">One Way</option>
    <option value="round">Round Trip</option>
    <option value="hourly">Hourly</option>
  </select>
</div>

        {/* Vehicle Type */}
        <div className="flex items-center justify-between bg-[#020617] border border-gray-700 rounded-lg px-3 py-3 mb-3">
  <div className="flex items-center gap-2 text-gray-300 text-sm">
    <span>🚗</span>
    <span>
      {carType === "wagonr"
        ? "WagonR / Swift (₹11/km)"
        : carType === "ertiga"
        ? "Ertiga / Rumion (₹14/km)"
        : "Innova Crysta (₹17/km)"}
    </span>
  </div>

  <select
    value={carType}
    onChange={(e) => setCarType(e.target.value)}
    className="bg-transparent outline-none text-gray-400 text-sm cursor-pointer"
  >
    <option value="wagonr">WagonR / Swift</option>
    <option value="ertiga">Ertiga / Rumion</option>
    <option value="innova">Innova Crysta</option>
  </select>
</div>
        {/* Date */}
       <div className="flex items-center justify-between bg-[#020617] border border-gray-700 rounded-lg px-3 py-3 mb-2">
       <div className="flex items-center gap-2 text-gray-300 text-sm">
       <span>📅</span>
       <span>{date || "Date"}</span>
     </div>
       <span className="text-gray-400">▼</span>
</div>

        {/* Time */}
       <div className="flex items-center justify-between bg-[#020617] border border-gray-700 rounded-lg px-3 py-3 mb-2">
       <div className="flex items-center gap-2 text-gray-300 text-sm">
       <span>⏰</span>
       <span>{time || "Time"}</span>
       </div>
       <span className="text-gray-400">▼</span>
</div>

        {/* Buttons */}
        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-400 py-3 rounded-xl font-bold text-black shadow-lg hover:shadow-green-500/30 transition"
        >
          {loading ? "Processing..." : "Confirm Ride"}
        </button>

        <button
          onClick={() => setShowDriverModal(true)}
          className="mt-3 w-full border border-green-500 text-green-400 py-2 rounded-lg hover:bg-green-500 hover:text-black transition"
        >
          Hire Driver Only
        </button>

        <p className="text-xs text-gray-400 mt-3 text-center">
          ✔ No hidden charges • ✔ Free cancellation
        </p>
      </div>

      {/* DRIVER MODAL */}
      {showDriverModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

          <div className="bg-[#0f172a] w-full max-w-md p-6 rounded-2xl border border-green-500/20 shadow-xl relative">

            {/* Close */}
            <button
              onClick={() => setShowDriverModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-white mb-2">
              Hire a Driver
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Book a driver for your personal car
            </p>

            <div className="mb-3">
              <label className="block text-sm text-gray-400 mb-1">
                Pickup Location
              </label>
              <input className="w-full p-3 rounded-lg bg-[#020617] border border-gray-700" />
            </div>

            <div className="mb-3">
              <label className="block text-sm text-gray-400 mb-1">
                Duration
              </label>
              <select className="w-full p-3 rounded-lg bg-[#020617] border border-gray-700">
                <option>4 Hours</option>
                <option>8 Hours</option>
                <option>12 Hours</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="block text-sm text-gray-400 mb-1">
                Date
              </label>
              <input type="date" className="w-full p-3 rounded-lg bg-[#020617] border border-gray-700" />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1">
                Time
              </label>
              <input type="time" className="w-full p-3 rounded-lg bg-[#020617] border border-gray-700" />
            </div>

            <button className="w-full bg-green-500 py-3 rounded-xl font-bold text-black">
              Confirm Driver
            </button>

          </div>
        </div>
      )}
    </>
  );
}