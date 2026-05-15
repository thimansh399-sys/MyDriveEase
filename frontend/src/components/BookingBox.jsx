import React, { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

export default function BookingBox() {

  const [tripType, setTripType] = useState("oneway");
  const [carType, setCarType] = useState("wagonr");

  const [loading, setLoading] = useState(false);

  // LOCATION STATES
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");

  // LOCATION COORDINATES
  const [pickupCoords, setPickupCoords] = useState([0, 0]);
  const [dropCoords, setDropCoords] = useState([0, 0]);

  // SUGGESTIONS
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);

  // DATE & TIME
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("10:00");
  const navigate = useNavigate();

  // SEARCH LOCATION FUNCTION
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
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}, India&countrycodes=in&addressdetails=1&limit=5`
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

  // HANDLE SEARCH
  const handleSearch = async () => {

    if (!pickup) {
      return alert("Enter Pickup Location");
    }

    if (
      (tripType === "oneway" || tripType === "round") &&
      !drop
    ) {
      return alert("Enter Drop Location");
    }

    let perKm = 11;
    let baseFare = 900;

    if (carType === "ertiga") {
      perKm = 14;
      baseFare = 1100;
    }

    else if (carType === "innova") {
      perKm = 17;
      baseFare = 1200;
    }

    let distance = Math.floor(Math.random() * 40) + 10;

    let fare = baseFare + distance * perKm;

    setLoading(true);

    try {

      await api.post("/bookings/create", {

        pickup: {
          address: pickup,
          coordinates: pickupCoords,
        },
        drop: {
          address: drop,
          coordinates: dropCoords,
        },
        tripType,
        carType,
        distance,
        fare: {
          total: fare,
        },
        date: selectedDate,
        time: selectedTime,
      });

      navigate("/my-rides");

    } catch (err) {

      console.log(err);

      alert("Booking Failed");

    } finally {

      setLoading(false);

    }
  };

  return (
    <>

      {/* MAIN BOOKING BOX */}

      <div className="bg-[#0f172a]/90 backdrop-blur-xl border border-green-500/20 p-6 rounded-3xl shadow-2xl w-full max-w-md text-white">

        <h2 className="text-3xl font-bold mb-1">
          Book Your Ride
        </h2>

        <p className="text-gray-400 mb-6 text-sm">
          Fast • Safe • Reliable
        </p>

        {/* PICKUP */}

        <div className="relative mb-4 z-50">

          <div className="flex items-center gap-3 bg-[#020617] border border-gray-700 focus-within:border-green-500 rounded-2xl px-4 py-4 transition-all duration-300">

            <span className="text-green-400 text-xl">
              📍
            </span>

            <input
              type="text"
              value={pickup}
              onChange={(e) => {
                setPickup(e.target.value);
                searchLocation(e.target.value, "pickup");
              }}
              placeholder="Enter Pickup Location"
              className="w-full bg-transparent text-white outline-none placeholder:text-gray-500 text-sm"
            />

          </div>

          {pickupSuggestions.length > 0 && (

            <div className="absolute top-full left-0 w-full bg-[#071426] border border-green-500 rounded-2xl mt-2 z-[999] max-h-64 overflow-y-auto shadow-2xl">

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
                  className="px-4 py-4 hover:bg-green-500 hover:text-black cursor-pointer border-b border-gray-800 text-sm transition-all duration-200"
                >
                  {item.display}
                </div>

              ))}

            </div>
          )}

        </div>

        {/* DROP */}

        <div className="relative mb-4 z-40">

          <div className="flex items-center gap-3 bg-[#020617] border border-gray-700 focus-within:border-green-500 rounded-2xl px-4 py-4 transition-all duration-300">

            <span className="text-red-400 text-xl">
              📍
            </span>

            <input
              type="text"
              value={drop}
              onChange={(e) => {
                setDrop(e.target.value);
                searchLocation(e.target.value, "drop");
              }}
              placeholder="Enter Drop Location"
              className="w-full bg-transparent text-white outline-none placeholder:text-gray-500 text-sm"
            />

          </div>

          {dropSuggestions.length > 0 && (

            <div className="absolute top-full left-0 w-full bg-[#071426] border border-green-500 rounded-2xl mt-2 z-[999] max-h-64 overflow-y-auto shadow-2xl">

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
                  className="px-4 py-4 hover:bg-green-500 hover:text-black cursor-pointer border-b border-gray-800 text-sm transition-all duration-200"
                >
                  {item.display}
                </div>

              ))}

            </div>
          )}

        </div>

        {/* TRIP TYPE */}

        <div className="bg-[#020617] border border-gray-700 rounded-2xl px-4 py-4 mb-4">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">

              <span className="text-lg">
                🚕
              </span>

              <span className="text-sm text-gray-300">
                Trip Type
              </span>

            </div>

            <select
              value={tripType}
              onChange={(e) => setTripType(e.target.value)}
              className="bg-transparent outline-none text-white text-sm"
            >
              <option value="oneway" className="text-black">
                One Way
              </option>

              <option value="round" className="text-black">
                Round Trip
              </option>

              <option value="hourly" className="text-black">
                Hourly
              </option>

            </select>

          </div>

        </div>

        {/* CAR TYPE */}

        <div className="bg-[#020617] border border-gray-700 rounded-2xl px-4 py-4 mb-4">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">

              <span className="text-lg">
                🚗
              </span>

              <span className="text-sm text-gray-300">
                Select Vehicle
              </span>

            </div>

            <select
              value={carType}
              onChange={(e) => setCarType(e.target.value)}
              className="bg-transparent outline-none text-white text-sm"
            >
              <option value="wagonr" className="text-black">
                WagonR / Swift
              </option>

              <option value="ertiga" className="text-black">
                Ertiga / Rumion
              </option>

              <option value="innova" className="text-black">
                Innova Crysta
              </option>

            </select>

          </div>

        </div>

        {/* DATE */}

        <div className="bg-[#020617] border border-gray-700 rounded-2xl px-4 py-4 mb-4">

          <div className="flex items-center gap-3">

            <span className="text-xl">
              📅
            </span>

            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              minDate={new Date()}
              dateFormat="dd/MM/yyyy"
              className="bg-transparent text-white outline-none w-full"
            />

          </div>

        </div>

        {/* TIME */}

        <div className="bg-[#020617] border border-gray-700 rounded-2xl px-4 py-4 mb-5">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              ⏰
            </div>

            <div className="flex-1">

              <p className="text-xs text-gray-400 mb-1">
                Select Time
              </p>

              <TimePicker
                value={selectedTime}
                onChange={setSelectedTime}
                disableClock={true}
                clearIcon={null}
                className="custom-time-picker"
              />

            </div>

          </div>

        </div>

        {/* BUTTON */}

        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-400 py-4 rounded-2xl font-bold text-black shadow-xl hover:shadow-green-500/30 transition-all duration-300"
        >
          {loading ? "Processing..." : "Confirm Ride"}
        </button>

        {/* HIRE DRIVER */}

        <button
            type="button"
            onClick={() => navigate("/hire-driver")}
            className="mt-3 w-full border border-green-500 text-green-400 py-3 rounded-2xl hover:bg-green-500 hover:text-black transition-all duration-300"
       >
           Hire Driver Only
       </button>

        <p className="text-xs text-gray-400 mt-4 text-center">
          ✔ No hidden charges • ✔ Free cancellation
        </p>

      </div>

    </>
  );
}
