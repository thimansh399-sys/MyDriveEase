import { useEffect, useState } from 'react';
import {
  Car,
  MapPin,
  Wallet,
  Clock3,
  Star,
  Power,
  Navigation,
  Phone,
  Bell,
  IndianRupee,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function DriverDashboard() {
  const { user, updateUser } = useAuth();

  const [status, setStatus] = useState(user?.status || 'offline');
  const [driverData, setDriverData] = useState({});
  const [availableRides, setAvailableRides] = useState([]);
  const [activeRide, setActiveRide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const driverRes = await api.get('/drivers/profile');
      setDriverData(driverRes.data);

      const ridesRes = await api.get('/bookings/available');
      setAvailableRides(ridesRes.data || []);

      const myRideRes = await api.get('/bookings/driver/my');

      const active = myRideRes.data.find((r) =>
        ['accepted', 'in-progress'].includes(r.status)
      );

      if (active) {
        setActiveRide(active);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async () => {
    try {
      const res = await api.post('/drivers/toggle-status');

      setStatus(res.data.status);

      updateUser({
        ...user,
        status: res.data.status,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const acceptRide = async (id) => {
    try {
      const res = await api.post(`/bookings/${id}/accept`);

      setActiveRide(res.data);

      setAvailableRides((prev) =>
        prev.filter((ride) => ride._id !== id)
      );

      setStatus('on-ride');
    } catch (err) {
      console.log(err);
    }
  };

  const startRide = async () => {
    try {
      const res = await api.post(
        `/bookings/${activeRide._id}/start`
      );

      setActiveRide(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const completeRide = async () => {
    try {
      await api.post(
        `/bookings/${activeRide._id}/complete`
      );

      setActiveRide(null);

      setStatus('online');

      fetchDashboard();
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f14] flex items-center justify-center text-white text-2xl font-bold">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f14] text-white">
      {/* TOP HEADER */}
      <div className="sticky top-0 z-50 bg-[#111827]/95 backdrop-blur border-b border-[#1f2937]">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold">
              DriveEase Driver
            </h1>

            <p className="text-gray-400 text-sm mt-1">
              Welcome back, {driverData?.name}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="w-11 h-11 rounded-full bg-[#1f2937] flex items-center justify-center hover:bg-[#2d3748] transition">
              <Bell size={20} />
            </button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleStatus}
              className={`px-5 py-3 rounded-2xl font-bold flex items-center gap-2 transition ${
                status === 'online'
                  ? 'bg-green-500 text-black'
                  : status === 'on-ride'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-red-500 text-white'
              }`}
            >
              <Power size={18} />

              {status === 'online'
                ? 'ONLINE'
                : status === 'on-ride'
                ? 'ON RIDE'
                : 'OFFLINE'}
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-6">
        {/* HERO CARD */}
        <div className="bg-gradient-to-r from-[#16a34a] to-[#22c55e] rounded-3xl p-8 mb-8 text-black shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h2 className="text-4xl font-extrabold mb-2">
                Ready For Your Next Ride 🚖
              </h2>

              <p className="text-lg font-medium">
                Stay online and accept rides instantly.
              </p>
            </div>

            <div className="flex gap-4 flex-wrap">
              <a
                href="/driver/profile"
                className="bg-black text-white px-6 py-3 rounded-2xl font-bold hover:scale-105 transition"
              >
                Profile
              </a>

              <a
                href="/driver/rides"
                className="bg-white text-black px-6 py-3 rounded-2xl font-bold hover:scale-105 transition"
              >
                Ride History
              </a>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-[#111827] rounded-3xl p-6 border border-[#1f2937]">
            <div className="flex items-center justify-between mb-4">
              <Wallet className="text-green-400" size={28} />
              <span className="text-sm text-gray-400">
                Wallet
              </span>
            </div>

            <h3 className="text-3xl font-extrabold">
              ₹{driverData?.wallet || 0}
            </h3>
          </div>

          <div className="bg-[#111827] rounded-3xl p-6 border border-[#1f2937]">
            <div className="flex items-center justify-between mb-4">
              <IndianRupee
                className="text-yellow-400"
                size={28}
              />

              <span className="text-sm text-gray-400">
                Earnings
              </span>
            </div>

            <h3 className="text-3xl font-extrabold">
              ₹{driverData?.earnings || 0}
            </h3>
          </div>

          <div className="bg-[#111827] rounded-3xl p-6 border border-[#1f2937]">
            <div className="flex items-center justify-between mb-4">
              <Car className="text-blue-400" size={28} />

              <span className="text-sm text-gray-400">
                Total Rides
              </span>
            </div>

            <h3 className="text-3xl font-extrabold">
              {driverData?.totalRides || 0}
            </h3>
          </div>

          <div className="bg-[#111827] rounded-3xl p-6 border border-[#1f2937]">
            <div className="flex items-center justify-between mb-4">
              <Star className="text-orange-400" size={28} />

              <span className="text-sm text-gray-400">
                Rating
              </span>
            </div>

            <h3 className="text-3xl font-extrabold">
              {driverData?.rating || 5.0}
            </h3>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* ACTIVE RIDE */}
            {activeRide ? (
              <div className="bg-[#111827] rounded-3xl p-6 border border-[#1f2937]">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-extrabold">
                    Active Ride
                  </h2>

                  <span className="bg-green-500 text-black px-4 py-2 rounded-full text-sm font-bold">
                    {activeRide.status}
                  </span>
                </div>

                <div className="space-y-5">
                  <div className="bg-[#1a2332] rounded-2xl p-5">
                    <div className="flex gap-4">
                      <div className="mt-1">
                        <MapPin className="text-green-400" />
                      </div>

                      <div>
                        <p className="text-sm text-gray-400">
                          Pickup Location
                        </p>

                        <h3 className="font-bold text-lg">
                          {activeRide?.pickup?.address}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1a2332] rounded-2xl p-5">
                    <div className="flex gap-4">
                      <div className="mt-1">
                        <Navigation className="text-red-400" />
                      </div>

                      <div>
                        <p className="text-sm text-gray-400">
                          Drop Location
                        </p>

                        <h3 className="font-bold text-lg">
                          {activeRide?.drop?.address}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1a2332] rounded-2xl p-5">
                      <p className="text-sm text-gray-400 mb-1">
                        Fare
                      </p>

                      <h3 className="text-3xl font-extrabold text-green-400">
                        ₹
                        {activeRide?.fare?.total ||
                          activeRide?.fare}
                      </h3>
                    </div>

                    <div className="bg-[#1a2332] rounded-2xl p-5">
                      <p className="text-sm text-gray-400 mb-1">
                        Payment
                      </p>

                      <h3 className="text-2xl font-bold">
                        Cash
                      </h3>
                    </div>
                  </div>

                  <div className="flex gap-4 flex-wrap">
                    {activeRide.status === 'accepted' && (
                      <button
                        onClick={startRide}
                        className="bg-yellow-400 text-black px-6 py-4 rounded-2xl font-bold hover:scale-105 transition"
                      >
                        Start Ride
                      </button>
                    )}

                    {activeRide.status ===
                      'in-progress' && (
                      <button
                        onClick={completeRide}
                        className="bg-green-500 text-black px-6 py-4 rounded-2xl font-bold hover:scale-105 transition"
                      >
                        Complete Ride
                      </button>
                    )}

                    <button
                      onClick={() =>
                        window.open(
                          `https://maps.google.com`,
                          '_blank'
                        )
                      }
                      className="bg-[#1f2937] px-6 py-4 rounded-2xl font-bold hover:bg-[#2d3748] transition"
                    >
                      Open Navigation
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#111827] rounded-3xl p-10 border border-[#1f2937] text-center">
                <Car
                  size={60}
                  className="mx-auto mb-5 text-green-400"
                />

                <h2 className="text-3xl font-extrabold mb-2">
                  No Active Ride
                </h2>

                <p className="text-gray-400 text-lg">
                  Go online to receive ride requests.
                </p>
              </div>
            )}

            {/* AVAILABLE RIDES */}
            <div className="bg-[#111827] rounded-3xl p-6 border border-[#1f2937]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-extrabold">
                  Available Rides
                </h2>

                <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-bold">
                  {availableRides.length} rides
                </span>
              </div>

              <div className="space-y-5">
                {availableRides.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    No rides available right now
                  </div>
                )}

                {availableRides.map((ride) => (
                  <div
                    key={ride._id}
                    className="bg-[#1a2332] rounded-3xl p-6 border border-[#243041]"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                      <div className="flex-1">
                        <div className="space-y-4">
                          <div className="flex gap-3">
                            <MapPin className="text-green-400 mt-1" />

                            <div>
                              <p className="text-sm text-gray-400">
                                Pickup
                              </p>

                              <h3 className="font-bold text-lg">
                                {ride?.pickup?.address}
                              </h3>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <Navigation className="text-red-400 mt-1" />

                            <div>
                              <p className="text-sm text-gray-400">
                                Drop
                              </p>

                              <h3 className="font-bold text-lg">
                                {ride?.drop?.address}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="lg:w-[240px]">
                        <div className="bg-[#111827] rounded-2xl p-5 mb-4">
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-400">
                              Fare
                            </span>

                            <span className="font-bold text-green-400 text-xl">
                              ₹
                              {ride?.fare?.total ||
                                ride?.fare}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-gray-400">
                              Distance
                            </span>

                            <span className="font-bold">
                              {ride?.distance || 0} km
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            acceptRide(ride._id)
                          }
                          className="w-full bg-green-500 text-black py-4 rounded-2xl font-extrabold hover:bg-green-400 transition"
                        >
                          Accept Ride
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            {/* DRIVER CARD */}
            <div className="bg-[#111827] rounded-3xl p-6 border border-[#1f2937]">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={
                    driverData?.avatar ||
                    'https://ui-avatars.com/api/?name=Driver'
                  }
                  alt="driver"
                  className="w-20 h-20 rounded-full object-cover border-4 border-green-400"
                />

                <div>
                  <h2 className="text-2xl font-extrabold">
                    {driverData?.name}
                  </h2>

                  <p className="text-gray-400">
                    Professional Driver
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-[#1a2332] rounded-2xl p-4 flex justify-between">
                  <span className="text-gray-400">
                    Vehicle
                  </span>

                  <span className="font-bold">
                    {driverData?.vehicle?.model ||
                      'Innova'}
                  </span>
                </div>

                <div className="bg-[#1a2332] rounded-2xl p-4 flex justify-between">
                  <span className="text-gray-400">
                    Number
                  </span>

                  <span className="font-bold">
                    {driverData?.vehicle?.plate ||
                      'UP32AB1234'}
                  </span>
                </div>

                <div className="bg-[#1a2332] rounded-2xl p-4 flex justify-between">
                  <span className="text-gray-400">
                    Phone
                  </span>

                  <span className="font-bold">
                    {driverData?.phone}
                  </span>
                </div>
              </div>
            </div>

            {/* SUPPORT */}
            <div className="bg-[#111827] rounded-3xl p-6 border border-[#1f2937]">
              <h2 className="text-2xl font-extrabold mb-5">
                Support
              </h2>

              <div className="space-y-4">
                <a
                  href="tel:100"
                  className="flex items-center gap-4 bg-red-500 px-5 py-4 rounded-2xl font-bold hover:bg-red-600 transition"
                >
                  <Phone />
                  Emergency Call
                </a>

                <a
                  href="mailto:support@driveease.com"
                  className="flex items-center gap-4 bg-[#1a2332] px-5 py-4 rounded-2xl font-bold hover:bg-[#243041] transition"
                >
                  <Clock3 />
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}