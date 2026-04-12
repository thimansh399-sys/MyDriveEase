import React from "react";

export default function HomePage() {
  return (
    <div className="bg-[#06121C] text-white">

      {/* 🔝 NAVBAR */}
      <nav className="flex justify-between items-center px-10 py-4 bg-[#081a28]">
        <h1 className="text-xl font-bold text-green-400">🚗 DriveEase</h1>

        <div className="flex gap-6 text-sm">
          <a href="#">Home</a>
          <a href="#">Drivers</a>
          <a href="#">Plans</a>
          <a href="#">Insurance</a>
          <a href="#">Bookings</a>
        </div>

        <div className="flex gap-3">
          <button className="border px-4 py-1 rounded-lg">Login</button>
          <button className="bg-green-500 px-4 py-1 rounded-lg text-black font-semibold">
            Sign Up
          </button>
        </div>
      </nav>

      {/* 🚗 HERO */}
      <section className="grid grid-cols-2 px-16 py-16 gap-10 items-center">

        {/* LEFT */}
        <div>
          <h1 className="text-5xl font-bold mb-4">
            Book Your Personal Driver Instantly
          </h1>

          <p className="text-gray-300 mb-6">
            Safe, verified drivers for daily commute, outstation trips & family travel.
          </p>

          {/* FORM */}
          <div className="bg-[#0d2233] p-6 rounded-2xl shadow-lg">
            <input
              placeholder="Pickup Location"
              className="w-full mb-3 p-3 rounded-lg bg-[#122c3f]"
            />
            <input
              placeholder="Destination"
              className="w-full mb-3 p-3 rounded-lg bg-[#122c3f]"
            />

            <button className="w-full bg-green-500 py-3 rounded-xl text-black font-bold">
              Find Drivers
            </button>
          </div>

          {/* BADGES */}
          <div className="flex gap-4 mt-6 flex-wrap text-sm text-green-400">
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