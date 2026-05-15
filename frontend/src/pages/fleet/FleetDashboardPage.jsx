import { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function FleetDashboardPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await api.get('/bookings/fleet/available');
        if (!active) return;
        setBookings(res.data?.bookings || res.data || []);
      } catch (err) {
        // ignore for now
        if (!active) return;
        setBookings([]);
      } finally {
        if (!active) return;
        setLoading(false);
      }
    };

    fetchDashboard();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-[60vh]">
      <h2 className="mb-4 text-2xl font-black">Fleet Dashboard</h2>

      {loading ? (
        <div className="text-slate-300">Loading...</div>
      ) : bookings.length === 0 ? (
        <div className="text-slate-400">No booking requests available.</div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => {
            const id = b?._id || b?.id;
            const pickup = b?.pickup?.address || 'Pickup';
            const drop = b?.drop?.address || 'Drop';

            return (
              <div key={id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-300">{pickup} → {drop}</p>
                <p className="mt-1 text-lg font-bold">
                  {b?.fare?.total ? `₹${b.fare.total}` : ''}
                </p>
                <p className="mt-1 text-sm text-slate-400">Status: {b?.status || 'pending'}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

