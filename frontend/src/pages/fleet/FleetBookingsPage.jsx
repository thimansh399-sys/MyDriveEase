import { useEffect, useState } from 'react';
import { ArrowRight, BriefcaseBusiness, Car, MapPin, RefreshCcw } from 'lucide-react';
import api from '../../utils/api';

const formatMoney = (value = 0) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export default function FleetBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/bookings/fleet/available');
      setBookings(res.data?.bookings || res.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const acceptBooking = async (id) => {
    setActionLoading(id);
    setError('');
    try {
      await api.post(`/bookings/fleet/${id}/accept`);
      await fetchBookings();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to accept booking');
    } finally {
      setActionLoading('');
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-emerald-400">Booking Leads</p>
            <h1 className="mt-1 text-3xl font-black text-white">Available Fleet Requests</h1>
            <p className="mt-2 text-sm font-semibold text-slate-400">
              Matching customer bookings yahan dikhenge. Accept karne ke liye available cab zaroori hai.
            </p>
          </div>
          <button
            type="button"
            onClick={fetchBookings}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 text-sm font-extrabold text-white hover:border-emerald-400"
          >
            <RefreshCcw size={16} />
            Refresh
          </button>
        </div>
      </section>

      {error && (
        <div className="rounded-lg border border-rose-400/40 bg-rose-500/15 px-4 py-3 text-sm font-bold text-rose-200">
          {error}
        </div>
      )}

      <section className="grid gap-4 xl:grid-cols-2">
        {bookings.map((booking) => {
          const id = booking?._id || booking?.id;

          return (
            <div key={id} className="rounded-lg border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/10">
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-100">
                  <BriefcaseBusiness size={14} />
                  {booking?.status || 'pending'}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-500/15 px-3 py-1 text-xs font-bold text-sky-100">
                  <Car size={14} />
                  {booking?.carType || 'cab'} | {booking?.distance || 0} km
                </span>
              </div>

              <div className="space-y-3">
                <div className="rounded-lg bg-slate-950 p-4">
                  <p className="mb-1 flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                    <MapPin size={14} />
                    Pickup
                  </p>
                  <p className="font-bold text-white">{booking?.pickup?.address || 'Pickup'}</p>
                </div>
                <div className="rounded-lg bg-slate-950 p-4">
                  <p className="mb-1 flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                    <MapPin size={14} />
                    Drop
                  </p>
                  <p className="font-bold text-white">{booking?.drop?.address || 'Drop'}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase text-slate-500">Fare</p>
                  <p className="text-2xl font-black text-emerald-300">{formatMoney(booking?.fare?.total)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => id && acceptBooking(id)}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 text-sm font-extrabold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
                  disabled={!id || booking?.status !== 'pending' || Boolean(actionLoading)}
                >
                  {actionLoading === id ? 'Accepting...' : 'Accept Lead'}
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          );
        })}
      </section>

      {!loading && bookings.length === 0 && (
        <div className="rounded-lg border border-dashed border-slate-700 bg-slate-900 p-10 text-center">
          <BriefcaseBusiness className="mx-auto text-emerald-300" size={34} />
          <h2 className="mt-4 text-xl font-black text-white">No leads available</h2>
          <p className="mx-auto mt-2 max-w-md text-sm font-semibold text-slate-400">
            Cabs available rakho. New customer fleet request aate hi yahan show hogi.
          </p>
        </div>
      )}

      {loading && <div className="rounded-lg bg-slate-900 p-8 text-center font-bold text-slate-300">Loading leads...</div>}
    </div>
  );
}
