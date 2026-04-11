import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency } from '../utils/helpers';

const DriverRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await api.get('/bookings/driver/my');
        setRides(res.data);
      } catch (err) {
        console.error('Failed to fetch rides:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRides();
  }, []);

  if (loading) return <LoadingSpinner text="Loading your rides..." />;

  const completedRides = rides.filter((r) => r.status === 'completed');
  const totalEarnings = completedRides.reduce((sum, r) => sum + (r.fare?.total || 0), 0);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    accepted: 'bg-blue-100 text-blue-700',
    'in-progress': 'bg-green-100 text-green-700',
    completed: 'bg-gray-100 text-gray-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">📋 My Rides</h1>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-gray-900">{rides.length}</p>
            <p className="text-xs text-gray-500">Total Rides</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-green-600">{completedRides.length}</p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalEarnings)}</p>
            <p className="text-xs text-gray-500">Total Earnings</p>
          </div>
        </div>

        {rides.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-5xl">🚗</span>
            <p className="text-gray-500 mt-4">No rides yet. Go online to receive requests!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {rides.map((ride, i) => (
              <motion.div
                key={ride._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl p-5 shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[ride.status]}`}>
                        {ride.status}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(ride.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-600">📍 {ride.pickup?.address}</p>
                      <p className="text-gray-600">🏁 {ride.drop?.address}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(ride.fare?.total)}</p>
                    <p className="text-xs text-gray-500">{ride.distance} km</p>
                  </div>
                </div>

                {ride.userId && (
                  <div className="flex items-center gap-2 pt-3 border-t text-sm text-gray-500">
                    <span>👤</span>
                    <span>{ride.userId.name}</span>
                    <span>• {ride.userId.phone}</span>
                  </div>
                )}

                {ride.rating && (
                  <div className="mt-2 text-sm text-yellow-600">
                    Rating: {'⭐'.repeat(ride.rating)} {ride.feedback && `— "${ride.feedback}"`}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverRides;
