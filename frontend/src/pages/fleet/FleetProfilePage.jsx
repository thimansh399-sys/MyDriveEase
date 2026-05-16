import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  BadgeCheck,
  Building2,
  CalendarDays,
  Car,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
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
  <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
    <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
      <Icon size={15} className="text-emerald-300" />
      {label}
    </div>
    <p className="break-words text-base font-extrabold text-white">{value || 'Not added'}</p>
  </div>
);

const StatusRow = ({ done, label }) => (
  <div className={`flex items-center justify-between gap-3 rounded-lg p-3 text-sm font-bold ${
    done ? 'bg-emerald-500/10 text-emerald-200' : 'bg-amber-500/10 text-amber-100'
  }`}>
    <span>{label}</span>
    {done ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
  </div>
);

export default function FleetProfilePage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/fleet/dashboard');
        if (active) setDashboard(res.data);
      } catch (err) {
        if (active) setError(err.response?.data?.message || 'Profile load nahi ho paya.');
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      active = false;
    };
  }, []);

  const profile = dashboard?.profile || {};
  const stats = dashboard?.stats || {};

  const initials = useMemo(() => {
    const companyName = profile.companyName || 'Travel Partner';
    return companyName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }, [profile.companyName]);

  const readinessScore = stats.totalCabs ? Math.round((stats.availableCabs / stats.totalCabs) * 100) : 0;

  const kycChecks = [
    { label: 'Company name added', done: Boolean(profile.companyName) },
    { label: 'Owner name added', done: Boolean(profile.ownerName) },
    { label: 'Phone number added', done: Boolean(profile.phone) },
    { label: 'GST number added', done: Boolean(profile.gstNumber) },
    { label: 'Owner Aadhaar added', done: Boolean(profile.aadhaarNumber) },
    { label: 'Admin verified', done: Boolean(profile.verified) },
  ];

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-rose-400/40 bg-rose-500/15 px-4 py-3 text-sm font-bold text-rose-200">
          {error}
        </div>
      )}

      <section className="rounded-lg border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-lg bg-emerald-500 text-2xl font-black text-slate-950">
              {initials || 'TP'}
            </div>
            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-extrabold uppercase ${
                    profile.verified
                      ? 'border-emerald-400/30 bg-emerald-500/15 text-emerald-200'
                      : 'border-amber-400/30 bg-amber-500/15 text-amber-100'
                  }`}
                >
                  <ShieldCheck size={14} />
                  {profile.verified ? 'Verified partner' : 'Verification pending'}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/15 px-3 py-1 text-xs font-extrabold uppercase text-sky-100">
                  <BadgeCheck size={14} />
                  {profile.status || 'online'}
                </span>
              </div>
              <h1 className="text-3xl font-black text-white md:text-4xl">{profile.companyName || 'Travel Partner'}</h1>
              <p className="mt-2 text-sm font-semibold text-slate-400">
                Managed by <span className="text-white">{profile.ownerName || 'Owner'}</span>
              </p>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:w-[320px]">
            <Link to="/fleet/vehicles" className="rounded-lg bg-emerald-500 px-4 py-3 text-center text-sm font-extrabold text-slate-950">
              Manage Cabs
            </Link>
            <Link to="/fleet/bookings" className="rounded-lg border border-slate-700 px-4 py-3 text-center text-sm font-extrabold hover:border-emerald-400">
              View Leads
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <p className="text-xs font-bold uppercase text-slate-500">Available leads</p>
          <p className="mt-3 text-3xl font-black text-white">{loading ? '...' : stats.availableLeads || 0}</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <p className="text-xs font-bold uppercase text-slate-500">Accepted rides</p>
          <p className="mt-3 text-3xl font-black text-white">{loading ? '...' : stats.acceptedBookings || 0}</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <p className="text-xs font-bold uppercase text-slate-500">Total cabs</p>
          <p className="mt-3 text-3xl font-black text-white">{loading ? '...' : stats.totalCabs || 0}</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <p className="text-xs font-bold uppercase text-slate-500">Readiness</p>
          <p className="mt-3 text-3xl font-black text-emerald-300">{loading ? '...' : `${readinessScore}%`}</p>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/10">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-emerald-400">Business details</p>
              <h2 className="mt-1 text-2xl font-black text-white">Partner Information</h2>
            </div>
            <Building2 className="text-emerald-300" size={26} />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <DetailItem icon={Building2} label="Company" value={profile.companyName} />
            <DetailItem icon={UserRound} label="Owner" value={profile.ownerName} />
            <DetailItem icon={Mail} label="Email" value={profile.email} />
            <DetailItem icon={Phone} label="Phone" value={profile.phone} />
            <DetailItem icon={MapPin} label="City" value={profile.city} />
            <DetailItem icon={CalendarDays} label="Joined" value={formatDate(profile.createdAt)} />
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/10">
            <h2 className="text-xl font-black text-white">KYC Checklist</h2>
            <div className="mt-4 space-y-2">
              {kycChecks.map((check) => (
                <StatusRow key={check.label} done={check.done} label={check.label} />
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white">Fleet Health</h2>
              <Car className="text-emerald-300" size={22} />
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
    </div>
  );
}
