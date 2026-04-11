import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { getSocket } from '../utils/socket';
import { useAuth } from '../context/AuthContext';
import MapView from '../components/MapView';
import { getUserLocation, formatCurrency } from '../utils/helpers';

const DriverDashboard = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [driverData, setDriverData] = useState(null);
  const [status, setStatus] = useState(user?.status || 'offline');
  const [location, setLocation] = useState(null);
  const [rideRequest, setRideRequest] = useState(null);
  const [activeRide, setActiveRide] = useState(null);
  const locationInterval = useRef(null);

  useEffect(() => {
    fetchDriverData();
    fetchActiveRide();
  }, []);

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

  const acceptRide = async () => {
    if (!rideRequest) return;
    try {
      const res = await api.post(`/bookings/${rideRequest.bookingId}/accept`);
      setActiveRide(res.data);
      setRideRequest(null);
      setStatus('on-ride');
    } catch (err) {
      console.error('Accept error:', err);
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
    } catch (err) {
      console.error('Complete error:', err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">📊 Driver Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Status', value: status, icon: status === 'online' ? '🟢' : status === 'on-ride' ? '🚗' : '🔴' },
            { label: 'Rating', value: `⭐ ${driverData?.rating?.toFixed(1) || '5.0'}`, icon: '⭐' },
            { label: 'Total Rides', value: driverData?.totalRides || 0, icon: '🚕' },
            { label: 'Earnings', value: formatCurrency(driverData?.earnings || 0), icon: '💰' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-4 shadow-sm"
            >
              <span className="text-2xl">{stat.icon}</span>
              <p className="text-xs text-gray-500 mt-2">{stat.label}</p>
              <p className="text-lg font-bold text-gray-900 capitalize">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Map */}
          <div>
            {location && (
              <MapView
                center={[location.lat, location.lng]}
                zoom={15}
                userLocation={location}
                className="h-[400px]"
              />
            )}
            {!location && (
              <div className="h-[400px] bg-gray-200 rounded-2xl flex items-center justify-center">
                <p className="text-gray-500">Go online to see your location</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {/* Toggle Online/Offline */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Go Online</h3>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={toggleStatus}
                disabled={status === 'on-ride'}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-colors cursor-pointer disabled:opacity-50 ${
                  status === 'online'
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : status === 'on-ride'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {status === 'online'
                  ? '🔴 Go Offline'
                  : status === 'on-ride'
                  ? '🚗 On a Ride'
                  : '🟢 Go Online'}
              </motion.button>
            </div>

            {/* Active Ride */}
            {activeRide && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm border-2 border-green-200"
              >
                <h3 className="font-bold text-gray-900 mb-3">🚗 Active Ride</h3>
                <div className="space-y-2 text-sm mb-4">
                  <p><span className="text-gray-500">📍 Pickup:</span> {activeRide.pickup?.address}</p>
                  <p><span className="text-gray-500">🏁 Drop:</span> {activeRide.drop?.address}</p>
                  <p><span className="text-gray-500">💰 Fare:</span> <strong>{formatCurrency(activeRide.fare?.total)}</strong></p>
                  <p><span className="text-gray-500">Status:</span> <span className="capitalize font-medium">{activeRide.status}</span></p>
                </div>

                {activeRide.status === 'accepted' && (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={startRide}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium cursor-pointer"
                  >
                    🚗 Start Ride
                  </motion.button>
                )}
                {activeRide.status === 'in-progress' && (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={completeRide}
                    className="w-full bg-green-600 text-white py-3 rounded-xl font-medium cursor-pointer"
                  >
                    ✅ Complete Ride
                  </motion.button>
                )}
              </motion.div>
            )}

            {/* Vehicle Info */}
            {driverData?.vehicle && (
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">🚘 Vehicle</h3>
                <p className="text-sm text-gray-600 capitalize">
                  {driverData.vehicle.type} {driverData.vehicle.model && `— ${driverData.vehicle.model}`}
                </p>
                {driverData.vehicle.plate && (
                  <p className="text-xs text-gray-400 mt-1">{driverData.vehicle.plate}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Ride Request Modal */}
        <AnimatePresence>
          {rideRequest && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl p-6 max-w-md w-full"
              >
                <div className="text-center mb-4">
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="text-5xl inline-block"
                  >
                    🔔
                  </motion.span>
                  <h3 className="text-xl font-bold text-gray-900 mt-2">New Ride Request!</h3>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm space-y-2">
                  <p><span className="text-gray-500">📍 Pickup:</span> {rideRequest.pickup?.address}</p>
                  <p><span className="text-gray-500">🏁 Drop:</span> {rideRequest.drop?.address}</p>
                  <p><span className="text-gray-500">📏 Distance:</span> {rideRequest.distance} km</p>
                  <p><span className="text-gray-500">💰 Fare:</span> <strong>{formatCurrency(rideRequest.fare?.total)}</strong></p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={rejectRide}
                    className="flex-1 py-3 border border-red-300 text-red-600 rounded-xl font-medium cursor-pointer hover:bg-red-50"
                  >
                    Reject
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={acceptRide}
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl font-medium cursor-pointer hover:bg-green-700"
                  >
                    Accept ✓
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DriverDashboard;
