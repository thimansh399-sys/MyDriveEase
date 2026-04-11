import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { getSocket } from '../utils/socket';
import MapView, { pickupIcon, dropIcon, driverIcon } from '../components/MapView';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency } from '../utils/helpers';

const TrackRide = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !bookingId) return;

    socket.emit('join-booking', bookingId);

    socket.on('driver-moved', (data) => {
      if (booking?.driverId?._id === data.driverId || booking?.driverId === data.driverId) {
        setDriverLocation({ lat: data.location.lat, lng: data.location.lng });
      }
    });

    socket.on('booking-accepted', () => {
      fetchBooking();
    });

    socket.on('ride-started', () => {
      fetchBooking();
    });

    socket.on('ride-completed', () => {
      fetchBooking();
    });

    socket.on('ride-cancelled', () => {
      fetchBooking();
    });

    return () => {
      socket.emit('leave-booking', bookingId);
      socket.off('driver-moved');
      socket.off('booking-accepted');
      socket.off('ride-started');
      socket.off('ride-completed');
      socket.off('ride-cancelled');
    };
  }, [bookingId, booking?.driverId]);

  const fetchBooking = async () => {
    try {
      const res = await api.get(`/bookings/${bookingId}`);
      setBooking(res.data);
      if (res.data.driverId?.location) {
        const coords = res.data.driverId.location.coordinates;
        setDriverLocation({ lat: coords[1], lng: coords[0] });
      }
    } catch (err) {
      console.error('Failed to fetch booking:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      await api.post(`/bookings/${bookingId}/cancel`);
      fetchBooking();
    } catch (err) {
      console.error('Cancel error:', err);
    }
  };

  if (loading) return <LoadingSpinner text="Loading ride details..." />;
  if (!booking) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Booking not found</p>
      </div>
    );
  }

  const markers = [];
  if (booking.pickup?.coordinates) {
    markers.push({
      lat: booking.pickup.coordinates[1],
      lng: booking.pickup.coordinates[0],
      icon: pickupIcon,
      popup: `Pickup: ${booking.pickup.address}`,
    });
  }
  if (booking.drop?.coordinates) {
    markers.push({
      lat: booking.drop.coordinates[1],
      lng: booking.drop.coordinates[0],
      icon: dropIcon,
      popup: `Drop: ${booking.drop.address}`,
    });
  }
  if (driverLocation) {
    markers.push({
      lat: driverLocation.lat,
      lng: driverLocation.lng,
      icon: driverIcon,
      popup: 'Driver',
    });
  }

  const fitBounds = markers.length >= 2
    ? markers.map((m) => [m.lat, m.lng])
    : null;

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    accepted: 'bg-blue-100 text-blue-700',
    arriving: 'bg-indigo-100 text-indigo-700',
    'in-progress': 'bg-green-100 text-green-700',
    completed: 'bg-gray-100 text-gray-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="max-w-5xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">🗺️ Track Ride</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusColors[booking.status]}`}>
            {booking.status}
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MapView
              center={
                booking.pickup?.coordinates
                  ? [booking.pickup.coordinates[1], booking.pickup.coordinates[0]]
                  : [20.5937, 78.9629]
              }
              zoom={13}
              markers={markers}
              fitBounds={fitBounds}
              className="h-[400px] lg:h-[500px]"
            />
          </div>

          <div className="space-y-4">
            {/* Ride Info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-5 shadow-sm"
            >
              <h3 className="font-bold text-gray-900 mb-3">Ride Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-500">📍 Pickup</span>
                  <p className="text-gray-900">{booking.pickup?.address}</p>
                </div>
                <div>
                  <span className="text-gray-500">🏁 Drop</span>
                  <p className="text-gray-900">{booking.drop?.address}</p>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-gray-500">Distance</span>
                  <span className="font-medium">{booking.distance} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Fare</span>
                  <span className="font-bold text-lg">{formatCurrency(booking.fare?.total)}</span>
                </div>
              </div>
            </motion.div>

            {/* Driver Info */}
            {booking.driverId && typeof booking.driverId === 'object' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-5 shadow-sm"
              >
                <h3 className="font-bold text-gray-900 mb-3">Your Driver</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                    🚗
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{booking.driverId.name}</p>
                    <p className="text-xs text-gray-500">
                      {booking.driverId.vehicle?.type} • ⭐ {booking.driverId.rating?.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-400">{booking.driverId.phone}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Status Updates */}
            {booking.status === 'pending' && (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="bg-yellow-50 rounded-2xl p-5 text-center"
              >
                <span className="text-3xl">⏳</span>
                <p className="text-yellow-700 font-medium mt-2">Finding Driver...</p>
                <p className="text-yellow-600 text-xs mt-1">Please wait while we match you</p>
              </motion.div>
            )}

            {booking.status === 'accepted' && (
              <div className="bg-blue-50 rounded-2xl p-5 text-center">
                <span className="text-3xl">🚗</span>
                <p className="text-blue-700 font-medium mt-2">Driver is on the way!</p>
              </div>
            )}

            {booking.status === 'in-progress' && (
              <div className="bg-green-50 rounded-2xl p-5 text-center">
                <span className="text-3xl">🛣️</span>
                <p className="text-green-700 font-medium mt-2">Ride in progress</p>
              </div>
            )}

            {booking.status === 'completed' && (
              <div className="space-y-3">
                <div className="bg-green-50 rounded-2xl p-5 text-center">
                  <span className="text-3xl">✅</span>
                  <p className="text-green-700 font-medium mt-2">Ride Completed!</p>
                </div>
                {!booking.rating && (
                  <button
                    onClick={() => navigate(`/rate/${booking._id}`)}
                    className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium cursor-pointer"
                  >
                    ⭐ Rate Your Ride
                  </button>
                )}
              </div>
            )}

            {!['completed', 'cancelled'].includes(booking.status) && (
              <button
                onClick={handleCancel}
                className="w-full border border-red-300 text-red-600 py-3 rounded-xl text-sm font-medium hover:bg-red-50 cursor-pointer"
              >
                Cancel Ride
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackRide;
