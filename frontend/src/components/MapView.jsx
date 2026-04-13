import React, { useState } from "react";

function MapView() {
  const [pickup, setPickup] = useState({ city: "", area: "" });
  const [drop, setDrop] = useState({ city: "", area: "" });
  const [pickupInput, setPickupInput] = useState("");
  const [dropInput, setDropInput] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch suggestions from backend
  const fetchSuggestions = async (query, setSuggestions) => {
    if (!query) return setSuggestions([]);
    try {
      const base = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${base}/api/drivers/suggestions?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSuggestions(data);
    } catch {
      setSuggestions([]);
    }
  };

  // Handle input changes
  const handlePickupChange = (e) => {
    setPickupInput(e.target.value);
    fetchSuggestions(e.target.value, setPickupSuggestions);
    setPickup({ city: "", area: "" });
  };
  const handleDropChange = (e) => {
    setDropInput(e.target.value);
    fetchSuggestions(e.target.value, setDropSuggestions);
    setDrop({ city: "", area: "" });
  };

  // Handle suggestion click
  const selectPickup = (s) => {
    setPickupInput(`${s.city}${s.area ? " - " + s.area : ""}`);
    setPickup({ city: s.city, area: s.area });
    setPickupSuggestions([]);
  };
  const selectDrop = (s) => {
    setDropInput(`${s.city}${s.area ? " - " + s.area : ""}`);
    setDrop({ city: s.city, area: s.area });
    setDropSuggestions([]);
  };

  // Find drivers
  const handleFindDrivers = async () => {
    console.log("Find Drivers button clicked", { pickup, drop }); // Debug log
    setLoading(true);
    setDrivers([]);
    try {
      const base = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${base}/api/drivers/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pickup, drop }),
      });
      const data = await res.json();
      console.log("Drivers API response:", data); // Debug log
      setDrivers(data);
    } catch (err) {
      console.error("Find Drivers error", err);
      setDrivers([]);
    }
    setLoading(false);
  };

  return (
    <div className="bg-background dark:bg-[#06121C] text-black dark:text-white">
      {/* 🔝 NAVBAR ...existing code... */}
      <nav className="flex justify-between items-center px-10 py-4 bg-white dark:bg-[#081a28] border-b border-border">
        <h1 className="text-xl font-extrabold text-primary">🚗 DriveEase</h1>
        <div className="flex gap-6 text-sm">
          <a href="#">Home</a>
          <a href="#">Drivers</a>
          <a href="#">Plans</a>
          <a href="#">Insurance</a>
          <a href="#">Bookings</a>
        </div>
        <div className="flex gap-3">
          <button className="border border-primary px-4 py-2 rounded-2xl font-extrabold text-primary bg-transparent hover:bg-primary hover:text-white transition-colors">Login</button>
          <button className="bg-primary px-4 py-2 rounded-2xl text-black font-extrabold shadow hover:bg-green-400 transition-colors">Sign Up</button>
        </div>
      </nav>

      {/* 🚗 HERO */}
      <section className="grid grid-cols-1 md:grid-cols-2 px-4 md:px-16 py-16 gap-10 items-center">
        {/* LEFT */}
        <div>
          <h1 className="text-5xl font-extrabold mb-4 text-black dark:text-white">Book Your Personal Driver Instantly</h1>
          <p className="text-gray-700 dark:text-gray-300 mb-6">Safe, verified drivers for daily commute, outstation trips & family travel.</p>
          {/* FORM */}
          <div className="bg-card dark:bg-[#0d2233] p-8 rounded-2xl shadow-2xl border border-border">
            <div className="relative mb-3">
              <input
                placeholder="Pickup Location (Type city or area)"
                className="w-full p-3 rounded-xl bg-white dark:bg-[#122c3f] text-black dark:text-white border border-border focus:ring-2 focus:ring-primary outline-none"
                value={pickupInput}
                onChange={handlePickupChange}
                autoComplete="off"
              />
              {pickupSuggestions.length > 0 && (
                <div className="absolute z-10 bg-white text-black w-full rounded shadow max-h-40 overflow-y-auto">
                  {pickupSuggestions.map((s, i) => (
                    <div key={i} className="px-3 py-2 hover:bg-green-100 cursor-pointer" onClick={() => selectPickup(s)}>
                      {s.city}{s.area ? " - " + s.area : ""}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="relative mb-3">
              <input
                placeholder="Destination (Type city or area)"
                className="w-full p-3 rounded-xl bg-white dark:bg-[#122c3f] text-black dark:text-white border border-border focus:ring-2 focus:ring-primary outline-none"
                value={dropInput}
                onChange={handleDropChange}
                autoComplete="off"
              />
              {dropSuggestions.length > 0 && (
                <div className="absolute z-10 bg-white text-black w-full rounded shadow max-h-40 overflow-y-auto">
                  {dropSuggestions.map((s, i) => (
                    <div key={i} className="px-3 py-2 hover:bg-green-100 cursor-pointer" onClick={() => selectDrop(s)}>
                      {s.city}{s.area ? " - " + s.area : ""}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              className="w-full bg-primary hover:bg-green-400 py-3 rounded-2xl text-black font-extrabold text-lg shadow-lg transition-colors duration-150 mt-2"
              onClick={handleFindDrivers}
              disabled={loading || !pickup.city || !drop.city}
            >
              {loading ? "Finding..." : "Find Drivers"}
            </button>
          </div>
          {/* Show drivers if found */}
          {drivers.length > 0 && (
            <div className="mt-6 bg-card dark:bg-[#0d2233] p-6 rounded-2xl shadow-lg border border-border">
              <h2 className="text-xl mb-2 text-primary font-extrabold">Available Drivers</h2>
              <ul>
                {drivers.map((d, i) => (
                  <li key={i} className="mb-4 border-b border-border pb-4">
                    <div className="font-extrabold text-black dark:text-white">{d.name} <span className="text-xs font-bold text-primary">({d.vehicle?.type || 'N/A'})</span></div>
                    <div className="text-gray-700 dark:text-gray-300">Phone: {d.phone}</div>
                    <div className="text-gray-700 dark:text-gray-300">Status: {d.status}</div>
                    <div className="text-gray-700 dark:text-gray-300">Location: {d.location?.city || ''} {d.location?.state || ''} {d.location?.area || ''}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* BADGES ...existing code... */}
          <div className="flex gap-4 mt-6 flex-wrap text-sm text-primary font-extrabold">
            <span>✔ Verified Drivers</span>
            <span>✔ Safe Rides</span>
            <span>✔ Instant Booking</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative">
          <img
            src="https://cdn.dribbble.com/userupload/10680404/file/original-6c7b3a4cc1c76d1c71d9e0fae76d3a8c.png"
            alt="car"
            className="rounded-2xl"
          />

          {/* FLOATING CARDS */}
          <div className="absolute top-10 right-10 bg-[#0d2233] px-4 py-2 rounded-lg">
            🚗 Driver arriving in 30 min
          </div>

          <div className="absolute bottom-10 left-10 bg-[#0d2233] px-4 py-2 rounded-lg">
            ⭐ 4.9 Rated Drivers
          </div>
        </div>
      </section>

      {/* 📊 STATS */}
      <section className="flex justify-around py-10 text-center">
        <div>
          <h2 className="text-3xl text-green-400">10K+</h2>
          <p>Happy Customers</p>
        </div>
        <div>
          <h2 className="text-3xl text-green-400">500+</h2>
          <p>Drivers</p>
        </div>
        <div>
          <h2 className="text-3xl text-green-400">24/7</h2>
          <p>Support</p>
        </div>
      </section>

      {/* 🧭 HOW IT WORKS */}
      <section className="px-16 py-16 text-center">
        <h2 className="text-3xl mb-10">How It Works</h2>

        <div className="grid grid-cols-3 gap-8">
          <div className="bg-[#0d2233] p-6 rounded-xl">
            📍 <h3 className="mt-3">Choose Location</h3>
          </div>

          <div className="bg-[#0d2233] p-6 rounded-xl">
            🚗 <h3 className="mt-3">Select Driver</h3>
          </div>

          <div className="bg-[#0d2233] p-6 rounded-xl">
            ✅ <h3 className="mt-3">Confirm Ride</h3>
          </div>
        </div>
      </section>

      {/* 🚗 SERVICES */}
      <section className="px-16 py-16">
        <h2 className="text-3xl mb-10 text-center">Our Services</h2>

        <div className="grid grid-cols-3 gap-8">
          <div className="bg-[#0d2233] p-6 rounded-xl">
            🚗 One Way Ride
          </div>

          <div className="bg-[#0d2233] p-6 rounded-xl">
            ⏱️ Hourly Driver
          </div>

          <div className="bg-[#0d2233] p-6 rounded-xl">
            🌄 Outstation Trip
          </div>
        </div>
      </section>

      {/* ⭐ REVIEWS */}
      <section className="px-16 py-16 text-center">
        <h2 className="text-3xl mb-10">Customer Reviews</h2>

        <div className="grid grid-cols-3 gap-8">
          <div className="bg-[#0d2233] p-6 rounded-xl">
            ⭐⭐⭐⭐⭐ <p>Best service ever!</p>
          </div>

          <div className="bg-[#0d2233] p-6 rounded-xl">
            ⭐⭐⭐⭐⭐ <p>Very safe and reliable</p>
          </div>

          <div className="bg-[#0d2233] p-6 rounded-xl">
            ⭐⭐⭐⭐⭐ <p>Affordable pricing</p>
          </div>
        </div>
      </section>

      {/* 🚀 CTA */}
      <section className="text-center py-16 bg-[#081a28]">
        <h2 className="text-4xl mb-4">Ready to Ride?</h2>
        <p className="mb-6">Join 10,000+ happy customers</p>

        <button className="bg-green-500 px-6 py-3 rounded-xl text-black font-bold">
          Get Started
        </button>
      </section>

      {/* 🔚 FOOTER */}
      <footer className="grid grid-cols-4 gap-10 px-16 py-10 bg-[#06121C] text-sm">

        <div>
          <h3 className="text-green-400">DriveEase</h3>
          <p>India’s #1 Personal Driver Network</p>
        </div>

        <div>
          <h3>Links</h3>
          <p>Home</p>
          <p>Drivers</p>
          <p>Plans</p>
        </div>

        <div>
          <h3>Support</h3>
          <p>FAQs</p>
          <p>Contact</p>
        </div>

        <div>
          <h3>Follow</h3>
          <p>Instagram</p>
          <p>WhatsApp</p>
        </div>
      </footer>

    </div>
  );
}

export default MapView;