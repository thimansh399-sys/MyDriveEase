import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency } from '../utils/helpers';

const MyRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [status, setStatus] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  useEffect(() => {
    let interval;
    const fetchRides = async () => {
      setLoading(true);
      try {
        const params = {};
        if (status !== 'all') params.status = status;
        if (from) params.from = from;
        if (to) params.to = to;
        const res = await api.get('/bookings/user/my', { params });
        setRides(res.data);
      } catch (err) {
        setRides([]);
        console.error('Failed to fetch rides:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRides();
    interval = setInterval(fetchRides, 60000);
    return () => clearInterval(interval);
  }, [status, from, to]);

  if (loading) return <LoadingSpinner text="Loading your rides..." />;

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    accepted: 'bg-blue-100 text-blue-700',
    'in-progress': 'bg-green-100 text-green-700',
    completed: 'bg-gray-100 text-gray-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#06121C] text-white">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-green-400 mb-6">📋 My Rides</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 items-end">
          <div>
            <label className="block text-xs font-semibold text-green-400 mb-1">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)} className="rounded-lg border px-3 py-2 bg-[#0d2233] text-white border-[#122c3f]">
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-green-400 mb-1">From</label>
            <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="rounded-lg border px-3 py-2 bg-[#0d2233] text-white border-[#122c3f]" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-green-400 mb-1">To</label>
            <input type="date" value={to} onChange={e => setTo(e.target.value)} className="rounded-lg border px-3 py-2 bg-[#0d2233] text-white border-[#122c3f]" />
          </div>
        </div>

        {rides.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-5xl">🚗</span>
            <p className="text-gray-400 mt-4">No rides yet. Book your first ride!</p>
            <Link
              to="/book"
              className="inline-block mt-4 bg-green-500 text-black px-6 py-2 rounded-xl text-sm font-medium"
            >
              Book a Ride
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {rides.map((ride, i) => (
              <motion.div
                key={ride._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-[#0d2233] rounded-2xl p-5 shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[ride.status]}`}>{ride.status}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(ride.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-300">📍 {ride.pickup?.address}</p>
                      <p className="text-gray-300">🏁 {ride.drop?.address}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-400">{formatCurrency(ride.fare?.total)}</p>
                    <p className="text-xs text-gray-400">{ride.distance} km</p>
                  </div>
                </div>

                {ride.driverId && (
                  <div className="flex items-center gap-2 pt-3 border-t border-[#122c3f] text-sm text-gray-400">
                    <span>🚗</span>
                    <span>{ride.driverId.name}</span>
                    <span>• ⭐ {ride.driverId.rating?.toFixed(1)}</span>
                  </div>
                )}

                <div className="flex gap-2 mt-3">
                  <Link
                    to={`/track/${ride._id}`}
                    className="text-xs bg-green-500 text-black px-4 py-2 rounded-lg font-medium animate-pulse"
                  >
                    Track & Invoice
                  </Link>
                  {ride.status === 'completed' && !ride.rating && (
                    <Link
                      to={`/rate/${ride._id}`}
                      className="text-xs bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-medium"
                    >
                      ⭐ Rate
                    </Link>
                  )}
                  {ride.rating && (
                    <span className="text-xs text-gray-400 py-2">
                      Rated: {'⭐'.repeat(ride.rating)}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRides;
