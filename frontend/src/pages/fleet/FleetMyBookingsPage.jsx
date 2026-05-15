import { useEffect, useMemo, useState } from 'react';
import api from '../../utils/api';

export default function FleetMyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fleetId = useMemo(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.fleetId || user?._id || user?.id;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    let active = true;

    const fetchBookings = async () => {
      try {
        setError('');
        setLoading(true);

        // API shape may vary; try the intended endpoint first.
        const res = await api.get('/bookings/fleet/my');
        if (!active) return;

        setBookings(res.data?.bookings || res.data || []);
      } catch (err) {
        if (!active) return;
        setError(err?.response?.data?.message || 'Failed to load bookings');
      } finally {
        if (!active) return;
        setLoading(false);
      }
    };

    fetchBookings();
    return () => {
      active = false;
    };
  }, []);

  const completeBooking = async (id) => {
    try {
      await api.post(`/bookings/${id}/complete`);
      setBookings((prev) => prev.filter((b) => b._id !== id && b.id !== id));
    } catch (err) {
      // keep UI simple
      setError(err?.response?.data?.message || 'Failed to update booking');
    }
  };

  return (
    <div className="min-h-[60vh]">
      <h2 className="mb-4 text-2xl font-black">My Bookings</h2>

      {error && (
        <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-slate-300">Loading...</div>
      ) : bookings.length === 0 ? (
        <div className="text-slate-400">No bookings found.</div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const pickup = booking?.pickup?.address || 'Pickup';
            const drop = booking?.drop?.address || 'Drop';
            const status = booking?.status || 'unknown';
            const id = booking?._id || booking?.id;

            return (
              <div key={id || `${pickup}-${drop}`} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-300">{pickup} → {drop}</p>
                    <p className="mt-1 text-lg font-bold">Status: <span className="text-green-300">{status}</span></p>
                  </div>

                  {status !== 'completed' && status !== 'cancelled' && (
                    <button
                      type="button"
                      onClick={() => id && completeBooking(id)}
                      className="mt-2 rounded-2xl bg-green-500 px-4 py-2 text-black font-bold hover:bg-green-400 disabled:opacity-60"
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

