import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import BookingBox from "../components/BookingBox";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const getAddress = (location) => location?.address || "Location not available";

const getInitials = (booking, index) => {
  const name = booking?.userId?.name || booking?.customerName || `Lead ${index + 1}`;
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

const getFare = (booking) => {
  const total = booking?.fare?.total ?? booking?.fare;
  return total ? `Rs ${total}` : "Fare pending";
};

const getVehicleLabel = (vehicle) => {
  if (!vehicle) return "No cab assigned";
  return [vehicle.carType, vehicle.plateNumber].filter(Boolean).join(" - ") || "Assigned cab";
};

export default function Home() {
  const { user } = useAuth();
  const [mapLocations, setMapLocations] = useState({ pickup: null, drop: null });
  const [route, setRoute] = useState([]);
  const [fleetHome, setFleetHome] = useState({
    availableBookings: [],
    myBookings: [],
    vehicles: [],
    loading: false,
  });
  const canBookRide = !user || user.role === "user";
  const isFleetUser = user?.role === "fleet";

  const fleetStats = useMemo(() => {
    const vehicles = fleetHome.vehicles || [];
    return {
      available: fleetHome.availableBookings.length,
      myBookings: fleetHome.myBookings.length,
      totalCabs: vehicles.length,
      availableCabs: vehicles.filter((vehicle) => vehicle.status === "available").length,
    };
  }, [fleetHome.availableBookings, fleetHome.myBookings, fleetHome.vehicles]);

  const heroBadges = isFleetUser
    ? [
        `${fleetStats.available} available bookings`,
        `${fleetStats.myBookings} accepted rides`,
        `${fleetStats.totalCabs} total cabs`,
        `${fleetStats.availableCabs} cabs ready`,
      ]
    : ["Verified Drivers", "Quick Scheduling", "24/7 Support", "Transparent Pricing"];

  const previewAvailableBookings = fleetHome.availableBookings.slice(0, 2);
  const previewMyBookings = fleetHome.myBookings.slice(0, 2);

  useEffect(() => {
    const pickup = mapLocations.pickup;
    const drop = mapLocations.drop;

    if (
      typeof pickup?.lat !== "number" ||
      typeof pickup?.lng !== "number" ||
      typeof drop?.lat !== "number" ||
      typeof drop?.lng !== "number"
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

  useEffect(() => {
    if (!isFleetUser) return;

    let isActive = true;

    const fetchFleetHome = async () => {
      setFleetHome((current) => ({ ...current, loading: true }));

      try {
        const [availableRes, myRes, vehiclesRes] = await Promise.all([
          api.get("/bookings/fleet/available"),
          api.get("/bookings/fleet/my"),
          api.get("/fleet/vehicles"),
        ]);

        if (!isActive) return;

        setFleetHome({
          availableBookings: availableRes.data.bookings || [],
          myBookings: myRes.data.bookings || [],
          vehicles: vehiclesRes.data.vehicles || [],
          loading: false,
        });
      } catch (err) {
        console.log(err);
        if (isActive) {
          setFleetHome((current) => ({ ...current, loading: false }));
        }
      }
    };

    fetchFleetHome();

    return () => {
      isActive = false;
    };
  }, [isFleetUser]);

  const markers = useMemo(() => {
    const nextMarkers = [];

    if (typeof mapLocations.pickup?.lat === "number" && typeof mapLocations.pickup?.lng === "number") {
      nextMarkers.push({
        lat: mapLocations.pickup.lat,
        lng: mapLocations.pickup.lng,
        popup: "Pickup",
      });
    }

    if (typeof mapLocations.drop?.lat === "number" && typeof mapLocations.drop?.lng === "number") {
      nextMarkers.push({
        lat: mapLocations.drop.lat,
        lng: mapLocations.drop.lng,
        popup: "Destination",
      });
    }

    return nextMarkers;
  }, [mapLocations.drop, mapLocations.pickup]);

  const fitBounds = markers.length === 2 ? markers.map((marker) => [marker.lat, marker.lng]) : null;
  const mapCenter = markers[0] ? [markers[0].lat, markers[0].lng] : [22.9734, 78.6569];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101924] via-[#18222f] to-[#1a3a2c] text-white">
      <section
        className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
        style={{
          backgroundImage: `
            linear-gradient(rgba(2,6,23,0.72), rgba(2,6,23,0.82)),
            url('/images/driver.png')
          `,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_28%)]"></div>
        <div className="absolute left-20 top-20 h-72 w-72 rounded-full bg-green-500/20 blur-[120px]"></div>
        <div className="absolute bottom-16 right-16 h-72 w-72 rounded-full bg-blue-500/20 blur-[120px]"></div>

        <div className={`relative z-10 mx-auto grid w-full max-w-7xl gap-12 items-center ${canBookRide || isFleetUser ? "lg:grid-cols-[1.05fr_0.95fr]" : "md:grid-cols-1"}`}>
          <div className={isFleetUser ? "max-w-3xl" : "max-w-2xl"}>
            <p className="mb-4 font-semibold text-green-400">
              {isFleetUser ? "Travel partner demand insights are ready." : "Safe. Reliable. Always On Time."}
            </p>

            <h1 className="text-5xl font-extrabold leading-tight md:text-6xl">
              {isFleetUser ? (
                <>
                  Grow your travel business,
                  <br />
                  <span className="text-green-400">with verified ride demand</span>
                </>
              ) : (
                <>
                  Reliable Rides,
                  <br />
                  <span className="text-green-400">Trusted Drivers</span>
                </>
              )}
            </h1>

            <p className="mt-6 text-lg text-gray-300">
              {isFleetUser
                ? "Track incoming customer requests, fleet readiness, route demand, and the next best action from one focused partner home screen."
                : "Hire professional drivers for local and outstation travel. Safe, verified, and trusted by thousands."}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              {isFleetUser ? (
                <>
                  <Link
                    to="/fleet/bookings"
                    className="rounded-xl bg-green-500 px-6 py-3 font-semibold text-slate-950 shadow-lg transition hover:bg-green-400"
                  >
                    View New Leads
                  </Link>
                  <Link
                    to="/fleet/vehicles"
                    className="rounded-xl border border-gray-500 px-6 py-3 transition hover:border-green-400"
                  >
                    Manage Vehicles
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to={user ? "/book" : "/login"}
                    className="rounded-xl bg-green-500 px-6 py-3 font-semibold shadow-lg transition hover:bg-green-600"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/plans"
                    className="rounded-xl border border-gray-500 px-6 py-3 transition hover:border-green-400"
                  >
                    Explore Pricing
                  </Link>
                </>
              )}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              {heroBadges.map((item) => (
                <div
                  key={item}
                  className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-gray-200 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-green-500/20"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {canBookRide && (
            <div className="flex w-full justify-center lg:justify-end">
              <div className="w-full max-w-md rounded-2xl border border-green-500/20 bg-[#0b1a2a]/70 p-4 shadow-2xl backdrop-blur-xl">
                <h2 className="mb-3 text-center text-lg font-bold text-white">Schedule Your Ride</h2>
                <BookingBox onLocationsChange={setMapLocations} />
              </div>
            </div>
          )}

          {isFleetUser && (
            <div className="flex w-full justify-center lg:justify-end">
              <div className="w-full max-w-2xl overflow-hidden rounded-[28px] border border-emerald-400/20 bg-[#071524]/85 shadow-2xl shadow-black/40 backdrop-blur-xl">
                <div className="flex flex-col gap-4 border-b border-white/10 bg-[#0c1b2d] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-extrabold text-white">Travel Partner Dashboard</h2>
                    <p className="mt-1 text-sm text-slate-400">Live view of demand, fleet capacity, and response actions.</p>
                  </div>
                  <div className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-300">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
                    Live demand
                  </div>
                </div>

                <div className="space-y-6 p-6">
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-slate-700/70 bg-[#0a1322] p-4">
                      <p className="text-sm text-slate-400">Available Bookings</p>
                      <p className="mt-3 text-3xl font-extrabold text-green-400">{fleetStats.available}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-700/70 bg-[#0a1322] p-4">
                      <p className="text-sm text-slate-400">My Accepted Rides</p>
                      <p className="mt-3 text-3xl font-extrabold text-blue-400">{fleetStats.myBookings}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-700/70 bg-[#0a1322] p-4">
                      <p className="text-sm text-slate-400">Total Cabs</p>
                      <p className="mt-3 text-3xl font-extrabold text-white">{fleetStats.totalCabs}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-700/70 bg-[#0a1322] p-4">
                      <p className="text-sm text-slate-400">Available Cabs</p>
                      <p className="mt-3 text-3xl font-extrabold text-green-400">{fleetStats.availableCabs}</p>
                    </div>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white">New customer requests</h3>
                      <Link to="/fleet/bookings" className="text-sm font-semibold text-emerald-300 hover:text-emerald-200">
                        Open bookings
                      </Link>
                    </div>

                    <div className="space-y-3">
                      {previewAvailableBookings.map((booking, index) => (
                        <div
                          key={booking._id || `${booking.pickup?.address}-${index}`}
                          className="flex flex-col gap-4 rounded-2xl border border-slate-700/70 bg-[#0a1322] p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blue-100 text-sm font-extrabold text-slate-900">
                              {getInitials(booking, index)}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-bold text-white">{getAddress(booking.pickup)}</p>
                              <p className="mt-1 truncate text-sm text-slate-400">To {getAddress(booking.drop)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                            <span className="text-sm font-bold text-green-300">{getFare(booking)}</span>
                            <Link to="/fleet/bookings" className="rounded-xl bg-green-500 px-4 py-2 text-sm font-bold text-slate-950">
                              Accept
                            </Link>
                          </div>
                        </div>
                      ))}

                      {previewAvailableBookings.length === 0 && (
                        <div className="rounded-2xl border border-slate-700/70 bg-[#0a1322] p-5 text-sm text-slate-300">
                          {fleetHome.loading ? "Loading available bookings..." : "No matching booking requests right now."}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white">My accepted rides</h3>
                      <Link to="/fleet/my-bookings" className="text-sm font-semibold text-blue-300 hover:text-blue-200">
                        My bookings
                      </Link>
                    </div>

                    <div className="rounded-2xl border border-slate-700/70 bg-[#0a1322] p-4">
                      <div className="space-y-3">
                        {previewMyBookings.map((booking, index) => (
                          <div key={booking._id || `${booking.drop?.address}-${index}`} className="rounded-xl bg-slate-900/70 p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-white">{getAddress(booking.pickup)}</p>
                                <p className="mt-1 truncate text-xs text-slate-400">To {getAddress(booking.drop)}</p>
                              </div>
                              <span className="shrink-0 rounded-full bg-green-500/15 px-3 py-1 text-xs font-bold text-green-300">
                                {booking.status || "accepted"}
                              </span>
                            </div>
                            <p className="mt-2 text-xs text-slate-400">{getVehicleLabel(booking.fleetVehicleId)}</p>
                          </div>
                        ))}

                        {previewMyBookings.length === 0 && (
                          <div className="text-sm text-slate-300">
                            {fleetHome.loading ? "Loading accepted rides..." : "No accepted bookings yet."}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-slate-300">Recommended next step</p>
                      <p className="mt-1 text-lg font-bold text-white">
                        {fleetStats.availableCabs === 0
                          ? "Add or mark a cab available to accept bookings"
                          : `${fleetStats.availableCabs} cab${fleetStats.availableCabs === 1 ? "" : "s"} ready for new bookings`}
                      </p>
                    </div>
                    <Link
                      to="/fleet/vehicles"
                      className="rounded-xl bg-blue-500 px-5 py-3 text-center font-bold text-white transition hover:bg-blue-400"
                    >
                      Update fleet
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="mt-10 w-full px-6">
        <div className="relative flex flex-col items-center justify-between overflow-hidden rounded-2xl border border-green-500/20 bg-gradient-to-r from-green-900/40 to-emerald-700/30 p-6 shadow-lg backdrop-blur-md md:flex-row">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-green-500/20 p-4">
              <span className="text-3xl">%</span>
            </div>

            <div>
              <p className="text-sm font-semibold text-green-400">Limited Time Offer!</p>
              <h2 className="text-xl font-bold text-white md:text-2xl">Get 20% OFF on your first booking</h2>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 md:mt-0">
            <div className="rounded-lg border border-dashed border-green-400 px-5 py-2 font-semibold tracking-wider text-green-300">
              DRIVE20
            </div>

            <button className="rounded-lg bg-green-500 px-4 py-2 text-white transition hover:bg-green-600">
              Apply
            </button>
          </div>
        </div>
      </div>

      <section className="px-6 py-16 text-center md:px-16">
        <h2 className="mb-10 text-3xl font-extrabold text-primary md:text-4xl">How It Works</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center rounded-xl bg-[#0d2233] p-8 shadow-lg">
            <span className="mb-3 text-4xl">Pick</span>
            <h3 className="mb-2 font-extrabold text-white">Choose Pickup & Destination</h3>
            <p className="text-gray-200">Enter your location and where you want to go</p>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-[#0d2233] p-8 shadow-lg">
            <span className="mb-3 text-4xl">Plan</span>
            <h3 className="mb-2 font-bold text-white">Select Driver or Plan</h3>
            <p className="text-gray-300">Choose from available drivers or plans</p>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-[#0d2233] p-8 shadow-lg">
            <span className="mb-3 text-4xl">Ride</span>
            <h3 className="mb-2 font-bold text-white">Confirm & Ride</h3>
            <p className="text-gray-200">Book instantly and enjoy your ride</p>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-16">
        <h2 className="mb-10 text-center text-3xl font-bold md:text-4xl">Our Services</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center rounded-xl bg-[#0d2233] p-8 shadow-lg">
            <span className="mb-2 text-3xl">Ride</span>
            <h3 className="mb-2 font-bold">One Way Ride</h3>
            <p className="text-gray-300">Book a driver for a single trip across the city</p>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-[#0d2233] p-8 shadow-lg">
            <span className="mb-2 text-3xl">Hour</span>
            <h3 className="mb-2 font-bold">Hourly Driver (2h / 4h / 8h)</h3>
            <p className="text-gray-300">Hire a driver for flexible hourly travel</p>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-[#0d2233] p-8 shadow-lg">
            <span className="mb-2 text-3xl">Trip</span>
            <h3 className="mb-2 font-bold">Outstation Trips</h3>
            <p className="text-gray-300">Travel long distances with trusted drivers</p>
          </div>
        </div>
      </section>

      <section className="bg-[#081a28] px-6 py-16 md:px-16">
        <h2 className="mb-10 text-center text-3xl font-bold md:text-4xl">Why Choose DriveEase</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-start rounded-xl bg-[#0d2233] p-8 shadow-lg">
            <span className="mb-2">Background Verified Drivers</span>
            <span className="mb-2">Transparent & Affordable Pricing</span>
            <span className="mb-2">Real-Time Driver Tracking</span>
          </div>
          <div className="flex flex-col items-start rounded-xl bg-[#0d2233] p-8 shadow-lg">
            <span className="mb-2">24/7 Customer Support</span>
            <span className="mb-2">Instant Booking System</span>
            <span className="mb-2">Insurance Covered Rides</span>
          </div>
          <div className="flex flex-col items-start rounded-xl bg-[#0d2233] p-8 shadow-lg">
            <span className="mb-2">Best Pricing</span>
            <span className="mb-2">Safe Rides</span>
            <span className="mb-2">Live Tracking</span>
          </div>
        </div>
      </section>

      <section className="bg-[#081a28] px-6 py-16 text-center md:px-16">
        <h2 className="mb-10 text-3xl font-bold md:text-4xl">Simple & Transparent Pricing</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border p-6">
            <h3>Quick Ride</h3>
            <p className="text-2xl font-bold text-green-400">
              Rs 199<span className="text-sm">/hour</span>
            </p>
            <p className="text-gray-400">Min 4 hours</p>
          </div>

          <div className="rounded-xl border-2 border-green-500 bg-[#0a1a2a] p-6">
            <h3>Full Day</h3>
            <p className="text-2xl font-bold text-green-400">Rs 999/day</p>
            <p className="text-gray-400">Up to 8 hours • Most Popular</p>
          </div>

          <div className="rounded-xl border p-6">
            <h3>Premium Drive</h3>
            <p className="text-2xl font-bold text-green-400">Rs 1299/day</p>
            <p className="text-gray-400">For long & luxury rides</p>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 text-center md:px-16">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">What Our Customers Say</h2>
        <div className="mb-6 text-xl text-yellow-400">4.9/5 Average Rating</div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center rounded-xl bg-[#0d2233] p-8 shadow-lg">
            <span className="mb-2 font-bold">Rahul Sharma</span>
            <p className="text-gray-300">"Best driver service I've ever used. Very professional and safe."</p>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-[#0d2233] p-8 shadow-lg">
            <span className="mb-2 font-bold">Priya Verma</span>
            <p className="text-gray-300">"Perfect for family trips. Drivers are well trained."</p>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-[#0d2233] p-8 shadow-lg">
            <span className="mb-2 font-bold">Aman Gupta</span>
            <p className="text-gray-300">"Affordable and super fast booking experience."</p>
          </div>
        </div>
      </section>

      <div className="rounded-xl bg-[#06121C] p-8 text-center">
        <h2 className="mb-2 text-2xl font-bold text-white">Your Ride Awaits!</h2>
        <p className="mb-6 text-gray-400">
          Join 50,000+ satisfied customers. Instant booking with verified drivers, safe, fast, and affordable.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/book" className="rounded-lg bg-green-500 px-6 py-2 font-semibold hover:bg-green-600">
            Book Now
          </Link>
          <Link to="/drivers" className="rounded-lg border border-gray-500 px-6 py-2 hover:border-green-400">
            Find Drivers
          </Link>
        </div>
      </div>

      <section className="px-6 py-16 text-center md:px-16">
        <h2 className="mb-8 text-3xl font-bold text-white md:text-4xl">About DriveEase</h2>
        <p className="mx-auto mb-6 max-w-3xl text-xl leading-relaxed text-gray-300">
          DriveEase is not just a service, it's a movement towards smarter mobility. We connect users with a network
          of trusted, verified drivers across India, making personal travel safer, simpler, and more accessible.
        </p>
        <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-300">
          With a focus on reliability, transparency, and user-first experience, we are shaping the future of
          driver-on-demand services.
        </p>
      </section>

      <footer className="grid grid-cols-1 gap-10 bg-[#06121C] px-6 py-10 text-sm md:grid-cols-4 md:px-16">
        <div>
          <h3 className="mb-2 text-2xl font-extrabold text-green-400">DriveEase</h3>
          <p className="text-sm leading-relaxed text-gray-400">
            Your personal driver, on demand.
            <br />
            Safe rides • Verified drivers • Pan India service
          </p>
        </div>

        <div>
          <h3 className="mb-2 font-bold">Quick Links</h3>
          <a href="/" className="block hover:text-green-400">Home</a>
          <a href="/drivers" className="block hover:text-green-400">Drivers</a>
          <a href="/book" className="block hover:text-green-400">Book Ride</a>
          <a href="/plans" className="block hover:text-green-400">Plans</a>
        </div>

        <div>
          <h3 className="mb-2 font-bold">Support</h3>
          <a href="/faqs" className="block hover:text-green-400">FAQs</a>
          <a href="/terms" className="block hover:text-green-400">Terms & Conditions</a>
          <a href="/privacy" className="block hover:text-green-400">Privacy Policy</a>
        </div>

        <div>
          <h3 className="mb-2 font-bold">Follow Us</h3>
          <a
            href="https://www.instagram.com/mydriveease"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-2 flex items-center gap-2 hover:text-pink-400"
          >
            <FaInstagram />
            @mydriveease
          </a>
          <a
            href="https://wa.me/917007515654"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-2 flex items-center gap-2 hover:text-green-400"
          >
            <FaWhatsapp />
            Chat on WhatsApp
          </a>
          <p className="mt-2">
            Contact: <span className="text-green-400">+91-7007515654</span>
          </p>
          <p>
            Email: <span className="text-green-400">driveeasesupport@gmail.com</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
