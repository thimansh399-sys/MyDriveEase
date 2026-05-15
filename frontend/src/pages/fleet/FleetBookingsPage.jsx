import { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function FleetBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await api.get('/bookings/fleet/available');
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

  const acceptBooking = async (id) => {
    try {
      await api.post(`/bookings/${id}/accept`);
      setBookings((prev) => prev.filter((b) => (b?._id || b?.id) !== id));
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to accept booking');
    }
  };

  return (
    <div className="min-h-[60vh]">
      <h2 className="mb-4 text-2xl font-black">Fleet Bookings</h2>

      {error && (
        <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-slate-300">Loading...</div>
      ) : bookings.length === 0 ? (
        <div className="text-slate-400">No leads available.</div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const id = booking?._id || booking?.id;
            const pickup = booking?.pickup?.address || 'Pickup';
            const drop = booking?.drop?.address || 'Drop';
            const status = booking?.status || 'pending';

            return (
              <div key={id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-300">{pickup} → {drop}</p>
                    <p className="mt-1 text-sm text-slate-400">Status: {status}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => id && acceptBooking(id)}
                    className="mt-2 rounded-2xl bg-green-500 px-4 py-2 text-black font-bold hover:bg-green-400 disabled:opacity-60"
                    disabled={status !== 'pending'}
                  >
                    Accept
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

