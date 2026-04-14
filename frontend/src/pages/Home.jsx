import React, { useEffect, useMemo, useState } from "react";
import BookingBox from "../components/BookingBox";
import MapView from "../components/MapView";

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
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden px-4">
        {/* Green Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#101924] via-[#18222f]/80 to-[#1a3a2c] opacity-95"></div>
        {/* Content */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center">
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 text-white drop-shadow-lg text-center">
            Welcome to <span className="text-primary">DriveEase</span>
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">
            Book your trusted driver in seconds
          </h2>
          <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 items-stretch justify-center mb-10">
            <div className="flex-1 flex items-center justify-center">
              <BookingBox onLocationsChange={setMapLocations} />
            </div>
            <div className="flex-1 min-h-[320px] max-h-[400px] rounded-2xl overflow-hidden shadow-lg border border-primary bg-black flex items-center justify-center">
              <MapView
                center={mapCenter}
                zoom={markers.length ? 10 : 5}
                markers={markers}
                route={route}
                fitBounds={fitBounds}
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 📊 STATS SECTION */}
      <section className="relative z-30 flex flex-wrap justify-around py-10 text-center bg-card rounded-2xl mx-4 md:mx-16 mt-20 shadow-lg border border-border">
        <div>
          <h2 className="text-3xl md:text-4xl text-primary font-extrabold">10K+</h2>
          <p className="text-gray-700 dark:text-gray-200">Happy Customers</p>
        </div>
        <div>
          <h2 className="text-3xl md:text-4xl text-primary font-extrabold">500+</h2>
          <p className="text-gray-700 dark:text-gray-200">Verified Drivers</p>
        </div>
        <div>
          <h2 className="text-3xl md:text-4xl text-primary font-extrabold">24/7</h2>
          <p className="text-gray-700 dark:text-gray-200">Customer Support</p>
        </div>
        <div>
          <h2 className="text-3xl md:text-4xl text-primary font-extrabold">50+</h2>
          <p className="text-gray-700 dark:text-gray-200">Cities Covered</p>
        </div>
      </section>

      {/* 🧭 HOW IT WORKS */}
      <section className="px-6 md:px-16 py-16 text-center">
        <h2 className="text-3xl md:text-4xl mb-10 font-extrabold text-primary">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-[#0d2233] p-8 rounded-xl shadow-lg flex flex-col items-center">
            <span className="text-4xl mb-3">📍</span>
            <h3 className="font-extrabold mb-2 text-">Choose Pickup & Destination</h3>
            <p className="text-gray-20">Enter your location and where you want to go</p>
          </div>
         <div className="bg-[#0d2233] p-8 rounded-xl shadow-lg flex flex-col items-center">
            <span className="text-4xl mb-3">👨‍✈️</span>
            <h3 className="font-bold mb-2 text-white">Select Driver or Plan</h3>
            <p className="text-gray-">Choose from available drivers or plans</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-[#0d2233] p-8 rounded-xl shadow-lg flex flex-col items-center">
            <h3 className="font-bold mb-2">Basic Plan</h3>
            <span className="text-2xl mb-2">₹199/hour</span>
            <p className="text-gray-300 mb-2">Best for short rides</p>
          </div>
          <div className="bg-[#0d2233] p-8 rounded-xl shadow-lg flex flex-col items-center">
            <h3 className="font-bold mb-2">Standard Plan</h3>
            <span className="text-2xl mb-2">₹399/hour</span>
            <p className="text-gray-300 mb-2">Perfect for daily use</p>
          </div>
          <div className="bg-[#0d2233] p-8 rounded-xl shadow-lg flex flex-col items-center">
            <h3 className="font-bold mb-2">Premium Plan</h3>
            <span className="text-2xl mb-2">₹699/hour</span>
            <p className="text-gray-300 mb-2">For luxury & long rides</p>
          </div>
        </div>
        <button className="bg-green-500 px-8 py-3 rounded-xl text-black font-bold text-lg shadow-lg">
          View All Plans
        </button>
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
      <section className="text-center py-16 bg-[#081a28]">
        <h2 className="text-4xl mb-4 font-bold">Ready to Ride?</h2>
        <p className="mb-6 text-gray-300">Join 10,000+ happy customers using DriveEase every day.</p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button className="bg-green-500 px-8 py-3 rounded-xl text-black font-bold text-lg shadow-lg">Get Started</button>
          <button className="bg-[#0d2233] px-8 py-3 rounded-xl text-green-400 font-bold text-lg shadow-lg border border-green-400">Browse Drivers</button>
        </div>
      </section>

      {/* 👨‍💼 ABOUT US */}
      <section className="px-6 md:px-16 py-16 text-center">
        <h2 className="text-3xl md:text-4xl mb-4 font-bold">About DriveEase</h2>
        <p className="max-w-2xl mx-auto text-gray-300 mb-4">
          DriveEase is India’s first personal driver network, built to make travel safer, more convenient, and affordable.
        </p>
        <p className="max-w-2xl mx-auto text-gray-300">
          We connect users with verified professional drivers across multiple cities, ensuring a reliable and stress-free travel experience every time.
        </p>
      </section>

      {/* 🔚 FOOTER */}
      <footer className="grid grid-cols-1 md:grid-cols-4 gap-10 px-6 md:px-16 py-10 bg-[#06121C] text-sm">
        <div>
          <h3 className="text-green-400 font-bold text-lg mb-2">DriveEase</h3>
          <p>India’s #1 Personal Driver Service</p>
        </div>
        <div>
          <h3 className="font-bold mb-2">Quick Links</h3>
          {/* If you want links here, use <a> tags or remove these lines to avoid duplicate tabs */}
        </div>
        <div>
          <h3 className="font-bold mb-2">Support</h3>
          <p>FAQs</p>
          <p>Terms & Conditions</p>
          <p>Privacy Policy</p>
        </div>
        <div>
          <h3 className="font-bold mb-2">Follow Us</h3>
          <p>Instagram</p>
          <p>WhatsApp</p>
          <p>LinkedIn</p>
          <p className="mt-2">Contact: <span className="text-green-400">+91-XXXXXXXXXX</span></p>
          <p>Email: <span className="text-green-400">support@driveease.in</span></p>
        </div>
      </footer>
    </div>
  );
}