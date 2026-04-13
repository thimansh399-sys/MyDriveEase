import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { getSocket } from '../utils/socket';
import { useAuth } from '../context/AuthContext';
import MapView from '../components/MapView';
import { getUserLocation, formatCurrency } from '../utils/helpers';

const EMERGENCY_NUMBER = '100'; // Change to your real helpline
const DriverDashboard = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [driverData, setDriverData] = useState(null);
  const [status, setStatus] = useState(user?.status || 'offline');
  const [location, setLocation] = useState(null);
  const [rideRequest, setRideRequest] = useState(null);
  const [activeRide, setActiveRide] = useState(null);
  const [rideHistory, setRideHistory] = useState([]);
  const [availableRides, setAvailableRides] = useState([]);
  const [loadingRides, setLoadingRides] = useState(false);
  const locationInterval = useRef(null);

  useEffect(() => {
    fetchDriverData();
    fetchActiveRide();
    fetchRideHistory();
    fetchAvailableRides();
  }, []);

  // Poll for available rides every 30s if online
  useEffect(() => {
    if (status === 'online') {
      const interval = setInterval(fetchAvailableRides, 30000);
      return () => clearInterval(interval);
    }
  }, [status]);
    const fetchAvailableRides = async () => {
      setLoadingRides(true);
      try {
        const res = await api.get('/bookings/available');
        setAvailableRides(res.data);
      } catch {
        setAvailableRides([]);
      } finally {
        setLoadingRides(false);
      }
    };
  // Fetch all completed and past rides for history
  const fetchRideHistory = async () => {
    try {
      const res = await api.get('/bookings/driver/my');
      const history = res.data.filter((b) => b.status === 'completed' || b.status === 'cancelled');
      setRideHistory(history);
    } catch { /* ignore */ }
  };

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on('ride-request', (data) => {
      setRideRequest(data);
    });

    return () => {
      socket.off('ride-request');
    };
  }, []);

  // Send location updates when online
  useEffect(() => {
    if (status === 'online' || status === 'on-ride') {
      startLocationUpdates();
    } else {
      stopLocationUpdates();
    }
    return () => stopLocationUpdates();
  }, [status]);

  const startLocationUpdates = () => {
    stopLocationUpdates();

    const send = async () => {
      try {
        const loc = await getUserLocation();
        setLocation(loc);
        const socket = getSocket();
        if (socket) {
          socket.emit('driver-location-update', { lng: loc.lng, lat: loc.lat });
        }
      } catch { /* ignore */ }
    };

    send();
    locationInterval.current = setInterval(send, 5000);
  };

  const stopLocationUpdates = () => {
    if (locationInterval.current) {
      clearInterval(locationInterval.current);
      locationInterval.current = null;
    }
  };

  const fetchDriverData = async () => {
    try {
      const res = await api.get('/drivers/me');
      setDriverData(res.data);
      setStatus(res.data.status);
    } catch { /* ignore */ }
  };

  const fetchActiveRide = async () => {
    try {
      const res = await api.get('/bookings/driver/my');
      const active = res.data.find((b) =>
        ['accepted', 'in-progress'].includes(b.status)
      );
      if (active) setActiveRide(active);
    } catch { /* ignore */ }
  };

  const toggleStatus = async () => {
    try {
      const res = await api.post('/drivers/toggle-status');
      setStatus(res.data.status);
      updateUser({ status: res.data.status });
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  const acceptRide = async (bookingId) => {
    try {
      const res = await api.post(`/bookings/${bookingId}/accept`);
      setActiveRide(res.data);
      setAvailableRides((prev) => prev.filter((r) => r._id !== bookingId));
      setStatus('on-ride');
    } catch (err) {
      console.error('Accept error:', err);
      fetchAvailableRides();
    }
  };

  const rejectRide = () => {
    setRideRequest(null);
  };

  const startRide = async () => {
    if (!activeRide) return;
    try {
      const res = await api.post(`/bookings/${activeRide._id}/start`);
      setActiveRide(res.data);
    } catch (err) {
      console.error('Start error:', err);
    }
  };

  const completeRide = async () => {
    if (!activeRide) return;
    try {
      await api.post(`/bookings/${activeRide._id}/complete`);
      setActiveRide(null);
      setStatus('online');
      fetchDriverData();
      fetchRideHistory();
    } catch (err) {
      console.error('Complete error:', err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-black via-[#0a1019] to-green-900 px-2 py-6 text-white font-sans">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, type: 'spring' }} className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
          <motion.h1 initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }} className="text-4xl md:text-5xl font-extrabold mb-2 text-green-400 tracking-tight">Welcome, Captain!</motion.h1>
          <div className="ml-auto flex flex-col gap-2 items-end">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open(`tel:${EMERGENCY_NUMBER}`)}
              className="px-5 py-2 rounded-xl bg-red-600 text-white font-bold shadow hover:bg-red-700 transition flex items-center gap-2 text-lg"
              title="Emergency Helpline"
            >
              🚨 Emergency: {EMERGENCY_NUMBER}
            </motion.button>
            <span className="text-xs text-gray-300">Tap to call emergency helpline</span>
          </div>
        </div>
        {/* Quick Links & Support */}
        <div className="flex flex-wrap gap-4 mb-8">
          <a href="/profile" className="bg-green-900/80 hover:bg-green-800 text-green-300 px-5 py-3 rounded-xl font-bold shadow transition text-lg">Profile</a>
          <a href="/driver/rides" className="bg-green-900/80 hover:bg-green-800 text-green-300 px-5 py-3 rounded-xl font-bold shadow transition text-lg">Ride History</a>
          <a href="mailto:support@driveease.com" className="bg-green-900/80 hover:bg-green-800 text-green-300 px-5 py-3 rounded-xl font-bold shadow transition text-lg">Support</a>
          <a href="tel:1800123456" className="bg-green-900/80 hover:bg-green-800 text-green-300 px-5 py-3 rounded-xl font-bold shadow transition text-lg">Call Support</a>
        </div>
        {/* Status Toggle & Wallet */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
          <div className="flex items-center gap-3">
            <motion.span animate={{ scale: status === 'online' ? 1.2 : 1 }} className={`w-4 h-4 rounded-full ${status === 'online' ? 'bg-green-400' : status === 'on-ride' ? 'bg-yellow-400' : 'bg-gray-400'} border-2 border-white shadow`}></motion.span>
            <span className="text-2xl font-bold text-white uppercase tracking-wide">{status === 'online' ? 'Online' : status === 'on-ride' ? 'On Ride' : 'Offline'}</span>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={toggleStatus}
              disabled={status === 'on-ride'}
              className={`ml-4 px-6 py-3 rounded-2xl text-lg font-extrabold shadow transition disabled:opacity-50 ${status === 'online' ? 'bg-black text-green-400 border-2 border-green-400 hover:bg-green-900' : 'bg-green-400 text-black hover:bg-green-500'}`}
            >
              {status === 'online' ? 'Go Offline' : 'Go Online'}
            </motion.button>
          </div>
          <div className="ml-auto flex flex-col gap-2 items-end">
            <div className="text-lg text-green-300">Wallet Balance</div>
            <div className="text-3xl font-extrabold text-green-400">₹{driverData?.wallet || 0}</div>
            <div className="flex gap-2 mt-2">
              <input
                type="number"
                min="1"
                placeholder="Withdraw amount"
                className="px-4 py-3 rounded bg-[#222c37] text-white border border-green-400 w-36 text-lg"
              />
              <button
                className="px-5 py-3 rounded-2xl bg-green-400 text-black font-bold shadow hover:bg-green-500 transition text-lg"
              >
                Withdraw
              </button>
            </div>
          </div>
        </motion.div>
        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-6 mb-8">
          <div className="bg-black/80 rounded-2xl p-8 flex flex-col items-center shadow border-2 border-green-400 min-w-[160px]">
            <div className="text-green-300 text-lg mb-1">Earnings Today</div>
            <div className="text-3xl font-extrabold text-green-400">₹{driverData?.earningsToday || 0}</div>
          </div>
          <div className="bg-black/80 rounded-2xl p-8 flex flex-col items-center shadow border-2 border-green-400 min-w-[160px]">
            <div className="text-green-300 text-lg mb-1">Rides Today</div>
            <div className="text-3xl font-extrabold text-green-400">{driverData?.ridesToday || 0}</div>
          </div>
          <div className="bg-black/80 rounded-2xl p-8 flex flex-col items-center shadow border-2 border-green-400 min-w-[160px]">
            <div className="text-green-300 text-lg mb-1">Total Earnings</div>
            <div className="text-3xl font-extrabold text-green-400">₹{driverData?.earnings || 0}</div>
          </div>
          <div className="bg-black/80 rounded-2xl p-8 flex flex-col items-center shadow border-2 border-green-400 min-w-[160px]">
            <div className="text-green-300 text-lg mb-1">Total Rides</div>
            <div className="text-3xl font-extrabold text-green-400">{driverData?.totalRides || 0}</div>
          </div>
        </motion.div>
        {/* Map, Available Rides, Ride Logic, and Ride History */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Map */}
          <div className="lg:col-span-1">
            {location && (
              <MapView
                center={[location.lat, location.lng]}
                zoom={15}
                userLocation={location}
                className="h-[400px]"
              />
            )}
            {!location && (
              <div className="h-[400px] bg-black/60 rounded-2xl flex items-center justify-center">
                <p className="text-green-400 text-xl">Go online to see your location</p>
              </div>
            )}
          </div>
          {/* Available Rides */}
          <div className="bg-black/80 rounded-2xl p-6 shadow border-2 border-green-400 max-h-[400px] overflow-y-auto lg:col-span-1">
            <div className="font-extrabold mb-4 text-green-400 text-2xl">Available Rides</div>
            {loadingRides && <div className="text-green-300">Loading...</div>}
            {!loadingRides && availableRides.length === 0 && <div className="text-green-300">No available rides right now.</div>}
            {availableRides.map((ride) => (
              <div key={ride._id} className="mb-6 pb-6 border-b border-green-900 last:border-b-0 last:mb-0 last:pb-0">
                <div className="text-white font-bold text-lg">{ride.pickup?.address} <span className="text-green-400">→</span> {ride.drop?.address}</div>
                <div className="text-green-300 text-md">Fare: ₹{ride.fare?.total || ride.fare}</div>
                <div className="text-green-300 text-md">Distance: {ride.distance} km</div>
                <div className="text-green-300 text-md">Requested: {new Date(ride.createdAt).toLocaleString()}</div>
                <button onClick={() => acceptRide(ride._id)} className="mt-2 px-5 py-2 rounded-xl bg-green-400 text-black font-bold shadow hover:bg-green-500 transition text-md">Accept Ride</button>
              </div>
            ))}
          </div>
          {/* Ride Request/Active Ride */}
          <div className="space-y-4 lg:col-span-1">
            {rideRequest && (
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }} className="bg-black/80 rounded-2xl p-8 shadow border-2 border-green-400">
                <div className="font-extrabold mb-2 text-green-400 text-2xl animate-pulse">New Ride Request</div>
                <div className="mb-2 text-white text-lg">Pickup: <span className="text-green-300">{rideRequest.pickup?.address}</span></div>
                <div className="mb-2 text-white text-lg">Drop: <span className="text-green-300">{rideRequest.drop?.address}</span></div>
                <div className="flex gap-4 mt-4">
                  <button onClick={() => acceptRide(rideRequest.bookingId)} className="px-6 py-3 rounded-2xl bg-green-400 text-black font-extrabold shadow hover:bg-green-500 transition text-lg">Accept</button>
                  <button onClick={rejectRide} className="px-6 py-3 rounded-2xl bg-red-600 text-white font-extrabold shadow hover:bg-red-700 transition text-lg">Reject</button>
                </div>
              </motion.div>
            )}
            {activeRide && (
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }} className="bg-black/80 rounded-2xl p-8 shadow border-2 border-green-400">
                <div className="font-extrabold mb-2 text-green-400 text-2xl">Active Ride</div>
                <div className="mb-2 text-white text-lg">Pickup: <span className="text-green-300">{activeRide.pickup?.address}</span></div>
                <div className="mb-2 text-white text-lg">Drop: <span className="text-green-300">{activeRide.drop?.address}</span></div>
                <div className="mb-2 text-white text-lg">Fare: <span className="text-green-300">₹{activeRide.fare?.total || activeRide.fare}</span></div>
                <div className="mb-2 text-white text-lg">Status: <span className="text-green-300">{activeRide.status}</span></div>
                <div className="flex gap-4 mt-4">
                  {activeRide.status === 'accepted' && <button onClick={startRide} className="px-6 py-3 rounded-2xl bg-yellow-400 text-black font-extrabold shadow hover:bg-yellow-300 transition text-lg">Start Ride</button>}
                  {activeRide.status === 'in-progress' && <button onClick={completeRide} className="px-6 py-3 rounded-2xl bg-green-400 text-black font-extrabold shadow hover:bg-green-500 transition text-lg">Complete Ride</button>}
                </div>
              </motion.div>
            )}
          </div>
          {/* Ride History */}
          <div className="bg-black/80 rounded-2xl p-8 shadow border-2 border-green-400 max-h-[400px] overflow-y-auto lg:col-span-1">
            <div className="font-extrabold mb-4 text-green-400 text-2xl">Ride History</div>
            {rideHistory.length === 0 && <div className="text-green-300">No completed rides yet.</div>}
            {rideHistory.map((ride) => (
              <div key={ride._id} className="mb-6 pb-6 border-b border-green-900 last:border-b-0 last:mb-0 last:pb-0">
                <div className="text-white font-bold text-lg">{ride.pickup?.address} <span className="text-green-400">→</span> {ride.drop?.address}</div>
                <div className="text-green-300 text-md">Status: {ride.status}</div>
                <div className="text-green-300 text-md">Fare: ₹{ride.fare?.total || ride.fare}</div>
                <div className="text-green-300 text-md">Date: {new Date(ride.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DriverDashboard;
