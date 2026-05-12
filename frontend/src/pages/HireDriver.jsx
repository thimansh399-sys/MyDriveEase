import React, { useState } from "react";
import api from "../utils/api";

export default function HireDriver() {

  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");

  const [pickupCoords, setPickupCoords] = useState([0, 0]);
  const [dropCoords, setDropCoords] = useState([0, 0]);

  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [duration, setDuration] = useState("4 Hours");

  const [loading, setLoading] = useState(false);

  // SEARCH LOCATION

  const searchLocation = async (query, type) => {

    if (query.length < 3) {

      if (type === "pickup") {
        setPickupSuggestions([]);
      } else {
        setDropSuggestions([]);
      }

      return;
    }

    try {

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}, India&countrycodes=in&limit=5`
      );

      const data = await res.json();

      const places = data.map((item) => ({
        display: item.display_name,
        lat: item.lat,
        lon: item.lon,
      }));

      if (type === "pickup") {
        setPickupSuggestions(places);
      } else {
        setDropSuggestions(places);
      }

    } catch (err) {

      console.log(err);

    }
  };

  // SUBMIT

  const handleSubmit = async () => {

    if (!pickup) {
      return alert("Enter pickup");
    }

    setLoading(true);

    try {

      await api.post("/bookings/hire-driver", {

  pickup: {
    address: pickup,
    coordinates: pickupCoords,
  },

  drop: {
    address: drop,
    coordinates: dropCoords,
  },

  hours: duration,

  date,
  time,

});
      alert("Driver request sent 🚗");

    } catch (err) {

      console.log(err);

      alert("Booking Failed");

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="min-h-screen bg-[#06121C] flex items-center justify-center p-4">

      <div className="w-full max-w-xl bg-[#0d2233] rounded-3xl p-8 border border-green-500/20">

        <h1 className="text-3xl font-bold text-white mb-2">
          Hire Driver
        </h1>

        <p className="text-gray-400 mb-6">
          Professional drivers near you
        </p>

        {/* PICKUP */}

        <div className="relative mb-4">

          <input
            type="text"
            value={pickup}
            onChange={(e) => {
              setPickup(e.target.value);
              searchLocation(e.target.value, "pickup");
            }}
            placeholder="Pickup Location"
            className="w-full p-4 rounded-2xl bg-[#06121C] border border-gray-700 text-white outline-none"
          />

          {pickupSuggestions.length > 0 && (

            <div className="absolute w-full bg-[#071426] border border-green-500 rounded-2xl mt-2 z-50 max-h-60 overflow-y-auto">

              {pickupSuggestions.map((item, index) => (

                <div
                  key={index}
                  onClick={() => {

                    setPickup(item.display);

                    setPickupCoords([
                      parseFloat(item.lon),
                      parseFloat(item.lat),
                    ]);

                    setPickupSuggestions([]);
                  }}
                  className="p-4 hover:bg-green-500 hover:text-black cursor-pointer text-sm border-b border-gray-800"
                >
                  {item.display}
                </div>

              ))}

            </div>

          )}

        </div>

        {/* DROP */}

        <div className="relative mb-4">

          <input
            type="text"
            value={drop}
            onChange={(e) => {
              setDrop(e.target.value);
              searchLocation(e.target.value, "drop");
            }}
            placeholder="Drop Location"
            className="w-full p-4 rounded-2xl bg-[#06121C] border border-gray-700 text-white outline-none"
          />

          {dropSuggestions.length > 0 && (

            <div className="absolute w-full bg-[#071426] border border-green-500 rounded-2xl mt-2 z-50 max-h-60 overflow-y-auto">

              {dropSuggestions.map((item, index) => (

                <div
                  key={index}
                  onClick={() => {

                    setDrop(item.display);

                    setDropCoords([
                      parseFloat(item.lon),
                      parseFloat(item.lat),
                    ]);

                    setDropSuggestions([]);
                  }}
                  className="p-4 hover:bg-green-500 hover:text-black cursor-pointer text-sm border-b border-gray-800"
                >
                  {item.display}
                </div>

              ))}

            </div>

          )}

        </div>

        {/* DATE */}

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full mb-4 p-4 rounded-2xl bg-[#06121C] border border-gray-700 text-white"
        />

        {/* TIME */}

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full mb-4 p-4 rounded-2xl bg-[#06121C] border border-gray-700 text-white"
        />

        {/* DURATION */}

        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full mb-6 p-4 rounded-2xl bg-[#06121C] border border-gray-700 text-white"
        >
          <option>4 Hours</option>
          <option>8 Hours</option>
          <option>12 Hours</option>
          <option>Full Day</option>
        </select>

        {/* BUTTON */}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-400 py-4 rounded-2xl font-bold text-black"
        >
          {loading ? "Processing..." : "Find Drivers"}
        </button>

      </div>

    </div>
  );
}