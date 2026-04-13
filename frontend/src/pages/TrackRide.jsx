import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { formatCurrency } from '../utils/helpers';
import { generateInvoicePDF } from '../utils/invoice';

const TrackRide = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get(`/bookings/${bookingId}`);
        setBooking(res.data);
      } catch (err) {
        console.error('Failed to fetch booking:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#101924] via-[#18222f] to-[#1a3a2c] text-[#19e68c] flex items-center justify-center">
        <p className="text-lg font-semibold">Loading ride details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#101924] via-[#18222f] to-[#1a3a2c] text-[#19e68c] flex items-center justify-center px-4">
        <div className="w-full max-w-2xl border border-[#19e68c] rounded-2xl p-6 bg-[#0a0f0a]/90 text-center">
          <h2 className="text-2xl font-bold mb-2">Ride Details Unavailable</h2>
          <p className="text-[#8af0bf]">Booking data could not be loaded.</p>
        </div>
      </div>
    );
  }

  const isCompleted = booking.status === 'completed';
  const driverName = typeof booking.driverId === 'object' ? booking.driverId?.name : 'Not assigned';
  const completedAt = booking.completedAt || booking.updatedAt || booking.createdAt;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#101924] via-[#18222f] to-[#1a3a2c] text-[#19e68c] py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto border border-[#19e68c] rounded-2xl p-6 bg-[#0a0f0a]/90 shadow-2xl"
      >
        <h1 className="text-2xl font-bold mb-6">Track Ride Details</h1>

        {!isCompleted ? (
          <motion.div
            initial={{ opacity: 0.7 }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="border border-[#19e68c] rounded-xl p-4 bg-black"
          >
            <p className="font-semibold">Ride is not completed yet.</p>
            <p className="mt-2 text-[#8af0bf]">Booking ID: {booking._id}</p>
            <p className="text-[#8af0bf]">Status: {booking.status}</p>
          </motion.div>
        ) : (
          <>
            <div className="space-y-3 text-sm md:text-base border border-[#19e68c] rounded-xl p-4 bg-black">
              <p><span className="font-semibold">Booking ID:</span> {booking._id}</p>
              <p><span className="font-semibold">Driver Name:</span> {driverName || 'Not available'}</p>
              <p><span className="font-semibold">Pickup:</span> {booking.pickup?.address || 'N/A'}</p>
              <p><span className="font-semibold">Drop:</span> {booking.drop?.address || 'N/A'}</p>
              <p><span className="font-semibold">Date & Time:</span> {new Date(completedAt).toLocaleString()}</p>
              <p><span className="font-semibold">Distance:</span> {booking.distance || 0} km</p>
              <p><span className="font-semibold">Fare:</span> {formatCurrency(booking.fare?.total || 0)}</p>
              <p><span className="font-semibold">Status:</span> completed</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => generateInvoicePDF(booking)}
              className="w-full mt-5 bg-[#19e68c] text-black py-3 rounded-xl font-bold hover:bg-[#16c579] transition-colors"
            >
              Download PDF
            </motion.button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default TrackRide;
