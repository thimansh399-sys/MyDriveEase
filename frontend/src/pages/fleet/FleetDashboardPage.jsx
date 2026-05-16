import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  BriefcaseBusiness,
  Car,
  CheckCircle2,
  Clock3,
  IndianRupee,
  MapPin,
  RefreshCcw,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import api from '../../utils/api';

const formatMoney = (value = 0) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatDate = (value) => {
  if (!value) return 'NA';
  return new Date(value).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const StatCard = ({ icon: Icon, label, value, tone = 'emerald' }) => {
  const tones = {
    emerald: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
    sky: 'border-sky-500/20 bg-sky-500/10 text-sky-300',
    amber: 'border-amber-500/20 bg-amber-500/10 text-amber-200',
    rose: 'border-rose-500/20 bg-rose-500/10 text-rose-200',
    slate: 'border-slate-700 bg-slate-900 text-white',
  };

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 shadow-xl shadow-black/10">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-black text-white">{value}</p>
        </div>
        <span className={`rounded-lg border p-2 ${tones[tone]}`}>
          <Icon size={20} />
        </span>
      </div>
    </div>
  );
};

const EmptyState = ({ title, body, action }) => (
  <div className="rounded-lg border border-dashed border-slate-700 bg-slate-900 p-8 text-center">
    <p className="text-lg font-black text-white">{title}</p>
    <p className="mx-auto mt-2 max-w-md text-sm font-semibold text-slate-400">{body}</p>
    {action}
  </div>
);

export default function FleetDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/fleet/dashboard');
      setDashboard(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Dashboard load nahi ho paya.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const acceptBooking = async (id) => {
    setActionLoading(id);
    setError('');
    try {
      await api.post(`/bookings/fleet/${id}/accept`);
      await fetchDashboard();
    } catch (err) {
      setError(err.response?.data?.message || 'Booking accept nahi ho payi.');
    } finally {
      setActionLoading('');
    }
  };

  const stats = dashboard?.stats || {};
  const profile = dashboard?.profile || {};
  const availableBookings = dashboard?.availableBookings || [];
  const myBookings = dashboard?.myBookings || [];
  const vehicles = dashboard?.vehicles || [];

  const readinessScore = useMemo(() => {
    if (!stats.totalCabs) return 0;
    return Math.round((stats.availableCabs / stats.totalCabs) * 100);
  }, [stats.availableCabs, stats.totalCabs]);

  const kycMissing = [
    !profile.gstNumber && 'GST number',
    !profile.aadhaarNumber && 'Owner Aadhaar',
    !profile.verified && 'Admin verification',
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-extrabold uppercase ${
                  profile.verified
                    ? 'border-emerald-400/30 bg-emerald-500/15 text-emerald-200'
                    : 'border-amber-400/30 bg-amber-500/15 text-amber-100'
                }`}
              >
                <ShieldCheck size={14} />
                {profile.verified ? 'KYC verified' : 'KYC pending'}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/15 px-3 py-1 text-xs font-extrabold uppercase text-sky-100">
                <MapPin size={14} />
                {profile.city || 'Service city missing'}
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-black text-white md:text-4xl">
              {profile.companyName || 'Travel Partner Dashboard'}
            </h1>
            <p className="mt-2 max-w-3xl text-sm font-semibold text-slate-400">
              Leads accept karo, cabs available rakho, aur KYC complete karke customer requests fast convert karo.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={fetchDashboard}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 text-sm font-extrabold text-white hover:border-emerald-400"
            >
              <RefreshCcw size={16} />
              Refresh
            </button>
            <Link
              to="/fleet/vehicles"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-emerald-500 px-4 text-sm font-extrabold text-slate-950 hover:bg-emerald-400"
            >
              <Car size={16} />
              Manage Cabs
            </Link>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-lg border border-rose-400/40 bg-rose-500/15 px-4 py-3 text-sm font-bold text-rose-200">
          {error}
        </div>
      )}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={BriefcaseBusiness} label="Available leads" value={loading ? '...' : stats.availableLeads || 0} tone="sky" />
        <StatCard icon={Truck} label="Active rides" value={loading ? '...' : stats.activeBookings || 0} tone="amber" />
        <StatCard icon={Car} label="Available cabs" value={loading ? '...' : `${stats.availableCabs || 0}/${stats.totalCabs || 0}`} />
        <StatCard icon={IndianRupee} label="Completed revenue" value={loading ? '...' : formatMoney(stats.revenue)} tone="emerald" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-lg border border-slate-800 bg-slate-900 shadow-xl shadow-black/10">
          <div className="flex items-center justify-between gap-3 border-b border-slate-800 p-4">
            <div>
              <h2 className="text-xl font-black text-white">New Booking Leads</h2>
              <p className="mt-1 text-sm font-semibold text-slate-400">Pending fleet requests jo aap accept kar sakte ho.</p>
            </div>
            <Link to="/fleet/bookings" className="hidden text-sm font-extrabold text-emerald-300 hover:text-emerald-200 sm:inline-flex">
              View all
            </Link>
          </div>

          <div className="grid gap-3 p-4">
            {availableBookings.slice(0, 5).map((booking) => (
              <div key={booking._id} className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-amber-500/15 px-2 py-1 text-xs font-bold text-amber-100">
                        {booking.status}
                      </span>
                      <span className="rounded-full bg-sky-500/15 px-2 py-1 text-xs font-bold text-sky-100">
                        {booking.carType} | {booking.distance || 0} km
                      </span>
                    </div>
                    <p className="truncate font-bold text-white">{booking.pickup?.address}</p>
                    <p className="mt-1 truncate text-sm font-semibold text-slate-400">To {booking.drop?.address}</p>
                    <p className="mt-2 text-xs font-semibold text-slate-500">
                      Customer: {booking.userId?.name || 'NA'} {booking.userId?.phone ? `| ${booking.userId.phone}` : ''}
                    </p>
                  </div>
                  <div className="shrink-0 text-left lg:text-right">
                    <p className="text-lg font-black text-emerald-300">{formatMoney(booking.fare?.total)}</p>
                    <button
                      type="button"
                      onClick={() => acceptBooking(booking._id)}
                      disabled={Boolean(actionLoading)}
                      className="mt-3 inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-500 px-4 text-sm font-extrabold text-slate-950 disabled:opacity-60"
                    >
                      {actionLoading === booking._id ? 'Accepting...' : 'Accept'}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {!loading && availableBookings.length === 0 && (
              <EmptyState
                title="No booking leads right now"
                body="Cabs available rakho. Matching customer request aate hi yahan lead dikhegi."
                action={<Link to="/fleet/vehicles" className="mt-4 inline-flex rounded-lg bg-emerald-500 px-4 py-2 text-sm font-extrabold text-slate-950">Check Cabs</Link>}
              />
            )}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/10">
            <h2 className="text-lg font-black text-white">KYC & Profile</h2>
            <div className="mt-4 space-y-3">
              {kycMissing.length ? (
                kycMissing.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-lg bg-amber-500/10 p-3 text-sm font-bold text-amber-100">
                    <AlertTriangle size={17} />
                    {item} missing
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-3 rounded-lg bg-emerald-500/10 p-3 text-sm font-bold text-emerald-200">
                  <CheckCircle2 size={17} />
                  Profile verified
                </div>
              )}
            </div>
            <Link to="/fleet/profile" className="mt-4 inline-flex w-full justify-center rounded-lg border border-slate-700 px-4 py-2 text-sm font-extrabold hover:border-emerald-400">
              Open Profile
            </Link>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/10">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white">Fleet Readiness</h2>
              <span className="font-black text-emerald-300">{readinessScore}%</span>
            </div>
            <div className="mt-4 h-3 rounded-full bg-slate-800">
              <div className="h-3 rounded-full bg-emerald-500" style={{ width: `${readinessScore}%` }} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-bold text-slate-300">
              <span className="rounded-lg bg-emerald-500/10 p-2">{stats.availableCabs || 0} Available</span>
              <span className="rounded-lg bg-amber-500/10 p-2">{stats.busyCabs || 0} Busy</span>
              <span className="rounded-lg bg-slate-800 p-2">{stats.offlineCabs || 0} Offline</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="rounded-lg border border-slate-800 bg-slate-900 shadow-xl shadow-black/10">
        <div className="border-b border-slate-800 p-4">
          <h2 className="text-xl font-black text-white">Recent Accepted Rides</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-950 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Route</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Cab</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Fare</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {myBookings.slice(0, 8).map((booking) => (
                <tr key={booking._id}>
                  <td className="max-w-[300px] px-4 py-3">
                    <p className="truncate font-bold text-white">{booking.pickup?.address}</p>
                    <p className="truncate text-xs font-semibold text-slate-400">To {booking.drop?.address}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-300">{booking.userId?.name || 'NA'}</td>
                  <td className="px-4 py-3 font-semibold text-slate-300">{booking.fleetVehicleId?.plateNumber || 'NA'}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-sky-500/15 px-2 py-1 text-xs font-bold text-sky-100">{booking.status}</span>
                  </td>
                  <td className="px-4 py-3 font-black text-emerald-300">{formatMoney(booking.fare?.total)}</td>
                  <td className="px-4 py-3 text-slate-400">{formatDate(booking.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && myBookings.length === 0 && (
            <div className="p-8 text-center text-sm font-semibold text-slate-400">Accepted rides yahan dikhenge.</div>
          )}
        </div>
      </section>
    </div>
  );
}
