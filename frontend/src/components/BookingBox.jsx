import React, { useState } from "react";
import api from '../utils/api';

export default function BookingBox() {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [rideType, setRideType] = useState("oneway");
  const [hours, setHours] = useState(2);
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  const handleSearch = async () => {
    if (!pickup) return alert("Enter pickup location");
    if ((rideType === "oneway" || rideType === "outstation") && !drop) {
      return alert("Enter destination");
    }
    setLoading(true);
    try {
      // Dummy coordinates for now (should use geocoding in real app)
      const pickupObj = { address: pickup, coordinates: [0, 0] };
      const dropObj = drop ? { address: drop, coordinates: [0, 0] } : null;
      let distance = 10;
      let duration = 30;
      let fare = 50;
      if (rideType === "hourly") {
        distance = hours * 10;
        duration = hours * 60;
        fare = 50 + hours * 100;
      } else if (rideType === "outstation") {
        distance = 100;
        duration = 180;
        fare = 500;
      }
      const res = await api.post('/bookings/create', {
        pickup: pickupObj,
        drop: dropObj,
        distance,
        duration,
        insurancePlan: 'none',
        fare,
      });
      setConfirmation(res.data);
    } catch (err) {
      alert('Booking failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <>
      {confirmation && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4 text-green-600">Booking Confirmed!</h2>
            <div className="mb-2 text-left">
              <div className="text-xs text-gray-500">Booking ID</div>
              <div className="font-mono text-base mb-2">{confirmation._id}</div>
              <div className="text-xs text-gray-500">Status</div>
              <div className="font-semibold text-yellow-600 mb-2">Driver assignment pending</div>
              <div className="text-xs text-gray-500">Pickup</div>
              <div className="font-semibold mb-2">{confirmation.pickup?.address}</div>
              {confirmation.drop && <>
                <div className="text-xs text-gray-500">Drop</div>
                <div className="font-semibold mb-2">{confirmation.drop?.address}</div>
              </>}
              <div className="text-xs text-gray-500">Date & Time</div>
              <div className="mb-2">{new Date(confirmation.createdAt || Date.now()).toLocaleString()}</div>
              <div className="text-xs text-gray-500">Fare</div>
              <div className="font-bold text-lg mb-2">₹{confirmation.fare?.total || confirmation.fare || 0}</div>
            </div>
            <button
              onClick={() => {
                const pickup = confirmation.pickup?.coordinates;
                const drop = confirmation.drop?.coordinates;
                if (pickup && drop) {
                  const url = `https://www.google.com/maps/dir/?api=1&origin=${pickup[1]},${pickup[0]}&destination=${drop[1]},${drop[0]}&travelmode=driving`;
                  window.open(url, '_blank');
                }
              }}
              className="w-full bg-gradient-to-r from-[#16a34a] to-[#0ea5e9] text-white py-2 rounded-xl text-base font-bold shadow cursor-pointer mb-2 hover:opacity-90"
            >
              🚗 Navigate with Google Maps
            </button>
            <button className="w-full mt-2 border border-gray-300 py-2 rounded-xl text-base font-semibold cursor-pointer bg-white/70 hover:bg-gray-100" onClick={() => setConfirmation(null)}>
              Close
            </button>
          </div>
        </div>
      )}
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
        disabled={loading}
        className="w-full bg-primary hover:bg-green-400 py-3 rounded-2xl text-black font-extrabold text-lg shadow-lg transition-colors duration-150 mt-2 disabled:opacity-60"
      >
        {loading ? 'Booking...' : 'Book Ride'}
      </button>
    </div>
    </>
  );
}
