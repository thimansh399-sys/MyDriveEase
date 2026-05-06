import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import BookingBox from "../components/BookingBox";
import MapView from "../components/MapView";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Home() {
  const [mapLocations, setMapLocations] = useState({ pickup: null, drop: null });
  const [route, setRoute] = useState([]);

  useEffect(() => {
    const pickup = mapLocations.pickup;
    const drop = mapLocations.drop;

    if (
      typeof pickup?.lat !== 'number' ||
      typeof pickup?.lng !== 'number' ||
      typeof drop?.lat !== 'number' ||
      typeof drop?.lng !== 'number'
    ) {
      setRoute([]);
      return;
    }

    let isActive = true;

    const loadRoute = async () => {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${drop.lng},${drop.lat}?overview=full&geometries=geojson`
        );
        const data = await response.json();
        const coordinates = data.routes?.[0]?.geometry?.coordinates;

        if (isActive && coordinates?.length) {
          setRoute(coordinates.map(([lng, lat]) => [lat, lng]));
        }
      } catch {
        if (isActive) {
          setRoute([]);
        }
      }
    };

    loadRoute();

    return () => {
      isActive = false;
    };
  }, [mapLocations.drop, mapLocations.pickup]);

  const markers = useMemo(() => {
    const nextMarkers = [];

    if (typeof mapLocations.pickup?.lat === 'number' && typeof mapLocations.pickup?.lng === 'number') {
      nextMarkers.push({
        lat: mapLocations.pickup.lat,
        lng: mapLocations.pickup.lng,
        popup: 'Pickup',
      });
    }

    if (typeof mapLocations.drop?.lat === 'number' && typeof mapLocations.drop?.lng === 'number') {
      nextMarkers.push({
        lat: mapLocations.drop.lat,
        lng: mapLocations.drop.lng,
        popup: 'Destination',
      });
    }

    return nextMarkers;
  }, [mapLocations.drop, mapLocations.pickup]);

  const fitBounds = markers.length === 2 ? markers.map((marker) => [marker.lat, marker.lng]) : null;
  const mapCenter = markers[0] ? [markers[0].lat, markers[0].lng] : [22.9734, 78.6569];

  return (
    <div className="bg-gradient-to-br from-[#101924] via-[#18222f] to-[#1a3a2c] min-h-screen text-white">



      {/* 🚗 HERO SECTION (Clean Centered Modern) */}
     <section
  className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden"
  style={{
    backgroundImage: `
      linear-gradient(rgba(2,6,23,0.6), rgba(2,6,23,0.7)),
      url('/images/driver.png')
    `,
    backgroundSize: "100%",
    backgroundPosition: "center",
  }}
>
  {/* 🌌 BACKGROUND */}
 
   
  {/* ✨ GLOW EFFECTS */}
  <div className="absolute top-20 left-20 w-72 h-72 bg-green-500/20 blur-[120px] rounded-full"></div>
  <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-500/20 blur-[120px] rounded-full"></div>

  {/* MAIN CONTENT */}
  <div className="relative z-10 max-w-7xl w-full grid md:grid-cols-2 gap-12 items-center">

    {/* 🔹 LEFT SIDE */}
    <div>

      <p className="text-green-400 mb-4 font-semibold">
        ✔ Safe. Reliable. Always On Time.
      </p>

      <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
        Reliable Rides, <br />
        <span className="text-green-400">Trusted Drivers</span>
      </h1>

      <p className="text-gray-300 mt-6 text-lg">
        Hire professional drivers for local and outstation travel.
        Safe, verified, and trusted by thousands.
      </p>

      {/* BUTTONS */}
      <div className="flex flex-wrap gap-4 mt-8">
        <button className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-semibold shadow-lg transition">
         Get Started
        </button>

        <button className="border border-gray-500 hover:border-green-400 px-6 py-3 rounded-xl transition">
          Explore Pricing
        </button>
      </div>

      {/* FEATURES */}
     <div className="flex flex-wrap gap-4 mt-10">

  {[
    "✔ Verified Drivers",
    "⚡Quick Scheduling",
    "🎧24/7 Support",
    "💰Transparent Pricing"
  ].map((item, index) => (
    <div
      key={index}
      className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-sm text-gray-200 shadow-lg hover:scale-105 hover:bg-green-500/30 transition-all duration-300"
    >
      {item}
    </div>
  ))}

</div>
    </div>

    {/* 🔹 RIGHT SIDE (BOOKING BOX) */}
    <div className="flex justify-center md:justify-end w-full">

      <div className="bg-[#0b1a2a]/70 backdrop-blur-xl p-4 rounded-2xl border border-green-500/20 shadow-2xl w-full max-w-md">

        <h2 className="text-lg font-bold mb-3 text-white text-center">
         Schedule Your Ride
        </h2>

        {/* 🔥 YOUR REAL COMPONENT */}
        <BookingBox onLocationsChange={setMapLocations} />

      </div>

    </div>

  </div>
</section>
      <div className="w-full px-6 mt-10">
  <div className="relative overflow-hidden rounded-2xl p-6 
                  bg-gradient-to-r from-green-900/40 to-emerald-700/30 
                  border border-green-500/20 
                  shadow-lg backdrop-blur-md flex flex-col md:flex-row items-center justify-between">

    {/* Left Content */}
    <div className="flex items-center gap-4">
      <div className="bg-green-500/20 p-4 rounded-full">
        <span className="text-3xl">%</span>
      </div>

      <div>
        <p className="text-green-400 text-sm font-semibold">
          Limited Time Offer!
        </p>
        <h2 className="text-white text-xl md:text-2xl font-bold">
          Get 20% OFF on your first booking 🎉
        </h2>
      </div>
    </div>

    {/* Right Coupon Box */}
    <div className="mt-4 md:mt-0 flex items-center gap-3">
      <div className="border border-dashed border-green-400 px-5 py-2 rounded-lg text-green-300 font-semibold tracking-wider">
        DRIVE20
      </div>

      <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition">
        Apply
      </button>
    </div>
  </div>
</div>

      {/* 🧭 HOW IT WORKS */}
      <section className="px-6 md:px-16 py-16 text-center">
        <h2 className="text-3xl md:text-4xl mb-10 font-extrabold text-primary">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-[#0d2233] p-8 rounded-xl shadow-lg flex flex-col items-center">
            <span className="text-4xl mb-3">📍</span>
            <h3 className="font-extrabold mb-2 text-white">Choose Pickup & Destination</h3>
            <p className="text-gray-200">Enter your location and where you want to go</p>

          </div>
         <div className="bg-[#0d2233] p-8 rounded-xl shadow-lg flex flex-col items-center">
            <span className="text-4xl mb-3">👨‍✈️</span>
            <h3 className="font-bold mb-2 text-white">Select Driver or Plan</h3>
            <p className="text-gray-300">Choose from available drivers or plans</p>

          </div>
          <div className="bg-[#0d2233] p-8 rounded-xl shadow-lg flex flex-col items-center">
            <span className="text-4xl mb-3">✅</span>
            <h3 className="font-bold mb-2 text-white">Confirm & Ride</h3>
            <p className="text-gray-200">Book instantly and enjoy your ride</p>
          </div>
        </div>
      </section>

      {/* 🚗 SERVICES */}
      <section className="px-6 md:px-16 py-16">
        <h2 className="text-3xl md:text-4xl mb-10 text-center font-bold">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#0d2233] p-8 rounded-xl shadow-lg flex flex-col items-center">
            <span className="text-3xl mb-2">🚗</span>
            <h3 className="font-bold mb-2">One Way Ride</h3>
            <p className="text-gray-300">Book a driver for a single trip across the city</p>
          </div>
          <div className="bg-[#0d2233] p-8 rounded-xl shadow-lg flex flex-col items-center">
            <span className="text-3xl mb-2">⏱️</span>
            <h3 className="font-bold mb-2">Hourly Driver (2h / 4h / 8h)</h3>
            <p className="text-gray-300">Hire a driver for flexible hourly travel</p>
          </div>
          <div className="bg-[#0d2233] p-8 rounded-xl shadow-lg flex flex-col items-center">
            <span className="text-3xl mb-2">🌄</span>
            <h3 className="font-bold mb-2">Outstation Trips</h3>
            <p className="text-gray-300">Travel long distances with trusted drivers</p>
          </div>
        </div>
      </section>

      {/* 🧑‍✈️ WHY CHOOSE US */}
      <section className="px-6 md:px-16 py-16 bg-[#081a28]">
        <h2 className="text-3xl md:text-4xl mb-10 text-center font-bold">Why Choose DriveEase</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#0d2233] p-8 rounded-xl shadow-lg flex flex-col items-start">
            <span className="mb-2">✔ Background Verified Drivers</span>
            <span className="mb-2">✔ Transparent & Affordable Pricing</span>
            <span className="mb-2">✔ Real-Time Driver Tracking</span>
          </div>
          <div className="bg-[#0d2233] p-8 rounded-xl shadow-lg flex flex-col items-start">
            <span className="mb-2">✔ 24/7 Customer Support</span>
            <span className="mb-2">✔ Instant Booking System</span>
            <span className="mb-2">✔ Insurance Covered Rides</span>
          </div>
          <div className="bg-[#0d2233] p-8 rounded-xl shadow-lg flex flex-col items-start">
            <span className="mb-2">✔ Best Pricing</span>
            <span className="mb-2">✔ Safe Rides</span>
            <span className="mb-2">✔ Live Tracking</span>
          </div>
        </div>
      </section>


      {/* 💰 PRICING SECTION */}
      <section className="px-6 md:px-16 py-16 text-center bg-[#081a28]">
        <h2 className="text-3xl md:text-4xl mb-10 font-bold">Simple & Transparent Pricing</h2>
        <div className="grid md:grid-cols-3 gap-6">

  {/* Hourly */}
  <div className="p-6 border rounded-xl">
    <h3>Quick Ride</h3>
    <p className="text-2xl font-bold text-green-400">
      ₹199<span className="text-sm">/hour</span>
    </p>
    <p className="text-gray-400">Min 4 hours</p>
  </div>

  {/* Full Day - Highlight */}
  <div className="p-6 border-2 border-green-500 rounded-xl bg-[#0a1a2a]">
    <h3>Full Day</h3>
    <p className="text-2xl font-bold text-green-400">₹999/day</p>
    <p className="text-gray-400">Up to 8 hours • Most Popular</p>
  </div>

  {/* Premium */}
  <div className="p-6 border rounded-xl">
    <h3>Premium Drive</h3>
    <p className="text-2xl font-bold text-green-400">₹1299/day</p>
    <p className="text-gray-400">For long & luxury rides</p>
  </div>

</div>
      </section>

      {/* ⭐ REVIEWS SECTION */}
      <section className="px-6 md:px-16 py-16 text-center">
        <h2 className="text-3xl md:text-4xl mb-4 font-bold">What Our Customers Say</h2>
        <div className="text-xl text-yellow-400 mb-6">⭐ 4.9/5 Average Rating</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#0d2233] p-8 rounded-xl shadow-lg flex flex-col items-center">
            <span className="font-bold mb-2">Rahul Sharma</span>
            <p className="text-gray-300">"Best driver service I’ve ever used. Very professional and safe."</p>
          </div>
          <div className="bg-[#0d2233] p-8 rounded-xl shadow-lg flex flex-col items-center">
            <span className="font-bold mb-2">Priya Verma</span>
            <p className="text-gray-300">"Perfect for family trips. Drivers are well trained."</p>
          </div>
          <div className="bg-[#0d2233] p-8 rounded-xl shadow-lg flex flex-col items-center">
            <span className="font-bold mb-2">Aman Gupta</span>
            <p className="text-gray-300">"Affordable and super fast booking experience."</p>
          </div>
        </div>
      </section>



      {/* 📱 CTA SECTION */}
      <div className="bg-[#06121C] p-8 rounded-xl text-center">
  <h2 className="text-2xl font-bold mb-2 text-white">
Your Ride Awaits!
  </h2>

  <p className="text-gray-400 mb-6">
Join 50,000+ satisfied customers. Instant booking with verified drivers – safe, fast, and affordable.
  </p>

  <div className="flex justify-center gap-4">
    <Link
      to="/book"
      className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg font-semibold"
    >
Book Now
    </Link>

    <Link
      to="/drivers"
      className="border border-gray-500 hover:border-green-400 px-6 py-2 rounded-lg"
    >
Find Drivers
    </Link>
  </div>
</div>

      {/* 👨‍💼 ABOUT US */}
      <section className="px-6 md:px-16 py-16 text-center">
        <h2 className="text-3xl md:text-4xl mb-8 font-bold text-white">About DriveEase</h2>
        <p className="max-w-3xl mx-auto text-xl text-gray-300 mb-6 leading-relaxed">
          DriveEase is not just a service — it's a movement towards smarter mobility. 
          We connect users with a network of trusted, verified drivers across India, making personal travel safer, simpler, and more accessible.
        </p>
        <p className="max-w-3xl mx-auto text-xl text-gray-300 leading-relaxed">
          With a focus on reliability, transparency, and user-first experience, we are shaping the future of driver-on-demand services.
        </p>
      </section>

      {/* 🔚 FOOTER */}
      <footer className="grid grid-cols-1 md:grid-cols-4 gap-10 px-6 md:px-16 py-10 bg-[#06121C] text-sm">
        <div>
          <h3 className="text-green-400 font-extrabold text-2xl mb-2">
            DriveEase 🚗
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Your personal driver, on demand. <br />
            Safe rides • Verified drivers • Pan India service
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-2">Quick Links</h3>
          <a href="/" className="block hover:text-green-400">Home</a>
          <a href="/drivers" className="block hover:text-green-400">Drivers</a>
          <a href="/book" className="block hover:text-green-400">Book Ride</a>
          <a href="/plans" className="block hover:text-green-400">Plans</a>
        </div>

        <div>
          <h3 className="font-bold mb-2">Support</h3>
          <a href="/faqs" className="block hover:text-green-400">FAQs</a>
          <a href="/terms" className="block hover:text-green-400">Terms & Conditions</a>
          <a href="/privacy" className="block hover:text-green-400">Privacy Policy</a>
        </div>

        <div>
          <h3 className="font-bold mb-2">Follow Us</h3>
          <a
  href="https://www.instagram.com/mydriveease"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-2 mb-2 hover:text-pink-400"
>
  <FaInstagram />
  @mydriveease
</a>
          <a
  href="https://wa.me/917836887228"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-2 mb-2 hover:text-green-400"
>
  <FaWhatsapp />
  Chat on WhatsApp
</a>
          <p className="mt-2">Contact: <span className="text-green-400">+91-78368 87228</span></p>
          <p>Email: <span className="text-green-400">driveeasesupport@gmail.com</span></p>
        </div>
      </footer>
    </div>
  );
}