import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Car,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  UserRound,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const formatDate = (value) => {
  if (!value) return 'Not available';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
};

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-slate-700/70 bg-slate-950/40 p-4">
    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-400">
      <Icon size={16} className="text-green-300" />
      {label}
    </div>
    <p className="break-words text-lg font-bold text-white">{value || 'Not added'}</p>
  </div>
);

const StatCard = ({ icon: Icon, label, value, tone = 'text-white' }) => (
  <div className="rounded-2xl border border-slate-700/70 bg-[#111827] p-5 shadow-xl shadow-black/10">
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm text-slate-400">{label}</p>
      <Icon size={19} className={tone} />
    </div>
    <p className={`mt-4 text-4xl font-black ${tone}`}>{value}</p>
  </div>
);

export default function FleetProfilePage() {
  const { user } = useAuth();

  const storedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || {};
    } catch {
      return {};
    }
  }, []);

  const profile = user || storedUser;

  const [stats, setStats] = useState({
    availableBookings: 0,
    acceptedBookings: 0,
    totalCabs: 0,
    availableCabs: 0,
    busyCabs: 0,
    offlineCabs: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchProfileStats = async () => {
      try {
        const [availableRes, myBookingsRes, vehiclesRes] = await Promise.all([
          api.get('/bookings/fleet/available'),
          api.get('/bookings/fleet/my'),
          api.get('/fleet/vehicles'),
        ]);

        if (!active) return;

        const vehicles = vehiclesRes.data.vehicles || [];

        setStats({
          availableBookings: availableRes.data.bookings?.length || 0,
          acceptedBookings: myBookingsRes.data.bookings?.length || 0,
          totalCabs: vehicles.length,
          availableCabs: vehicles.filter((vehicle) => vehicle.status === 'available').length,
          busyCabs: vehicles.filter((vehicle) => vehicle.status === 'busy').length,
          offlineCabs: vehicles.filter((vehicle) => vehicle.status === 'offline').length,
        });
      } catch (err) {
        console.log(err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProfileStats();

    return () => {
      active = false;
    };
  }, []);

  const companyName = profile?.companyName || 'Travel Partner';
  const ownerName = profile?.ownerName || profile?.name || 'Owner';

  const initials = companyName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  const isVerified = Boolean(profile?.verified);

  const readinessScore = stats.totalCabs ? Math.round((stats.availableCabs / stats.totalCabs) * 100) : 0;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-emerald-400/20 bg-[#0d1728] p-6 shadow-2xl shadow-black/20 lg:p-8">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.22),transparent_42%),linear-gradient(135deg,rgba(47,134,255,0.2),transparent_48%)] lg:block" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="grid h-24 w-24 shrink-0 place-items-center rounded-3xl bg-green-500 text-3xl font-black text-slate-950 shadow-xl shadow-green-500/20">
              {initials || 'TP'}
            </div>

            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                    isVerified
                      ? 'border-green-400/30 bg-green-500/15 text-green-200'
                      : 'border-amber-400/30 bg-amber-500/15 text-amber-100'
                  }`}
                >
                  <ShieldCheck size={14} />
                  {isVerified ? 'Verified partner' : 'Verification pending'}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-100">
                  <BadgeCheck size={14} />
                  {profile?.status || 'online'}
                </span>
              </div>

              <h1 className="text-4xl font-black text-white md:text-5xl">{companyName}</h1>
              <p className="mt-3 max-w-2xl text-slate-300">
                Managed by <span className="font-bold text-white">{ownerName}</span>. Keep your cabs available,
                accept matching requests, and maintain a clean partner profile for faster bookings.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:w-[360px]">
            <Link
              to="/fleet/vehicles"
              className="rounded-2xl bg-green-500 px-5 py-4 text-center font-black text-slate-950 transition hover:bg-green-400"
            >
              Manage Cabs
            </Link>
            <Link
              to="/fleet/bookings"
              className="rounded-2xl border border-slate-600 bg-slate-950/40 px-5 py-4 text-center font-bold text-white transition hover:border-green-400"
            >
              View Leads
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={BriefcaseBusiness} label="Available Bookings" value={loading ? '...' : stats.availableBookings} tone="text-green-400" />
        <StatCard icon={CheckCircle2} label="Accepted Rides" value={loading ? '...' : stats.acceptedBookings} tone="text-blue-400" />
        <StatCard icon={Car} label="Total Cabs" value={loading ? '...' : stats.totalCabs} />
        <StatCard icon={Star} label="Readiness" value={loading ? '...' : `${readinessScore}%`} tone="text-amber-300" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-slate-700/70 bg-[#111827] p-6 shadow-2xl shadow-black/10">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-green-400">Business details</p>
              <h2 className="mt-1 text-2xl font-black text-white">Partner information</h2>
            </div>
            <Building2 className="text-green-300" size={28} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <DetailItem icon={Building2} label="Company Name" value={companyName} />
            <DetailItem icon={UserRound} label="Owner Name" value={ownerName} />
            <DetailItem icon={Mail} label="Email" value={profile?.email} />
            <DetailItem icon={Phone} label="Phone" value={profile?.phone} />
            <DetailItem icon={MapPin} label="City" value={profile?.city} />
            <DetailItem icon={CalendarDays} label="Joined" value={formatDate(profile?.createdAt)} />
          </div>
        </section>

        <section className="rounded-3xl border border-slate-700/70 bg-[#111827] p-6 shadow-2xl shadow-black/10">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-wide text-blue-300">Fleet health</p>
            <h2 className="mt-1 text-2xl font-black text-white">Availability snapshot</h2>
          </div>

          <div className="space-y-5">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-300">Available cabs</span>
                <span className="font-bold text-white">
                  {stats.availableCabs}/{stats.totalCabs}
                </span>
              </div>
              <div className="h-3 rounded-full bg-slate-800">
                <div className="h-3 rounded-full bg-green-500" style={{ width: `${readinessScore}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-green-500/10 p-4">
                <p className="text-2xl font-black text-green-300">{stats.availableCabs}</p>
                <p className="mt-1 text-xs text-slate-400">Available</p>
              </div>
              <div className="rounded-2xl bg-amber-500/10 p-4">
                <p className="text-2xl font-black text-amber-200">{stats.busyCabs}</p>
                <p className="mt-1 text-xs text-slate-400">Busy</p>
              </div>
              <div className="rounded-2xl bg-slate-500/10 p-4">
                <p className="text-2xl font-black text-slate-200">{stats.offlineCabs}</p>
                <p className="mt-1 text-xs text-slate-400">Offline</p>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-5">
              <p className="text-sm text-slate-300">Next best action</p>
              <p className="mt-2 text-lg font-black text-white">
                {stats.availableCabs === 0
                  ? 'Mark one cab available to start accepting requests.'
                  : `${stats.availableCabs} cab${stats.availableCabs === 1 ? '' : 's'} ready for booking requests.`}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

