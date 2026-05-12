import { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function DriverRideRequestsPage() {
  const [availableRides, setAvailableRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/bookings/available');
        setAvailableRides(res.data || []);
      } catch {
        setAvailableRides([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-extrabold text-green-300">Ride Requests</h1>
      <p className="text-gray-300 mt-1">New ride offers are shown here. Accept from Dashboard.</p>

      <div className="mt-6 bg-[#0f172a] border border-green-400/20 rounded-2xl p-4 md:p-6">
        {loading ? (
          <div className="text-gray-300">Loading...</div>
        ) : availableRides.length === 0 ? (
          <div className="text-gray-300">No ride requests right now.</div>
        ) : (
          <div className="space-y-4">
            {availableRides.map((ride) => (
              <div key={ride._id} className="border border-green-400/10 rounded-xl p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-white font-bold">
                      {ride.pickup?.address} → {ride.drop?.address}
                    </div>
                    <div className="text-gray-300 text-sm mt-1">
                      Requested: {new Date(ride.createdAt).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-300 font-extrabold">₹{ride.fare?.total || ride.fare || 0}</div>
                    <div className="text-gray-300 text-sm">{ride.distance} km</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

