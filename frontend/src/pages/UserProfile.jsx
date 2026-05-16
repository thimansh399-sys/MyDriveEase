import { useEffect, useMemo, useState } from 'react';
import { CalendarCheck, Camera, Car, CheckCircle2, IndianRupee, Mail, MapPin, Phone, Save, ShieldCheck, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const money = (value = 0) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`;

export default function UserProfile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', avatar: '' });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', phone: user.phone || '', avatar: user.avatar || '' });
    }
  }, [user]);

  useEffect(() => {
    let active = true;
    const loadBookings = async () => {
      try {
        const res = await api.get('/bookings/user/my');
        if (active) setBookings(res.data || []);
      } catch {
        if (active) setBookings([]);
      }
    };
    loadBookings();
    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const completed = bookings.filter((booking) => booking.status === 'completed');
    return {
      total: bookings.length,
      active: bookings.filter((booking) => ['pending', 'accepted', 'in-progress', 'fleet-accepted'].includes(booking.status)).length,
      completed: completed.length,
      spend: completed.reduce((sum, booking) => sum + Number(booking.fare?.total || 0), 0),
    };
  }, [bookings]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/users/me', form);
      updateUser(res.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-dashboard min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-lg border border-emerald-400/30 bg-emerald-500 text-2xl font-black text-slate-950">
                {form.avatar ? <img src={form.avatar} alt="profile" className="h-full w-full object-cover" /> : (form.name || 'DU').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-extrabold uppercase text-emerald-300">
                  <ShieldCheck size={14} />
                  Customer dashboard
                </div>
                <h1 className="text-3xl font-black md:text-4xl">Hi, {form.name || 'DriveEase User'}</h1>
                <p className="mt-1 text-sm font-semibold text-slate-400">Your rides, account info, and next actions in one place.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/book" className="inline-flex h-11 items-center gap-2 rounded-lg bg-emerald-500 px-4 text-sm font-black text-slate-950">
                <Car size={17} />
                Book Ride
              </Link>
              <Link to="/my-rides" className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-700 px-4 text-sm font-black">
                <CalendarCheck size={17} />
                My Trips
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat icon={CalendarCheck} label="Total trips" value={stats.total} />
          <Stat icon={Car} label="Active requests" value={stats.active} />
          <Stat icon={CheckCircle2} label="Completed" value={stats.completed} />
          <Stat icon={IndianRupee} label="Completed spend" value={money(stats.spend)} />
        </section>

        <section className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="space-y-5">
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-emerald-500/10 text-emerald-300">
                  <UserRound size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-black">Account summary</h2>
                  <p className="text-sm font-semibold text-slate-400">Verified customer account</p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <Info icon={Phone} label="Phone" value={form.phone || 'Not added'} />
                <Info icon={Mail} label="Email" value={user?.email || 'Not added'} />
                <Info icon={MapPin} label="Default city" value="India" />
              </div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
              <h2 className="text-xl font-black">Quick actions</h2>
              <div className="mt-4 grid gap-2">
                <Link to="/book" className="rounded-lg bg-emerald-500 px-4 py-3 text-center text-sm font-black text-slate-950">Schedule a ride</Link>
                <Link to="/plans" className="rounded-lg border border-slate-700 px-4 py-3 text-center text-sm font-black">View plans</Link>
                <Link to="/faqs" className="rounded-lg border border-slate-700 px-4 py-3 text-center text-sm font-black">Help & FAQs</Link>
              </div>
            </div>
          </aside>

          <div className="space-y-5">
            <form onSubmit={handleSubmit} className="rounded-lg border border-slate-800 bg-slate-900 p-5">
              <div className="mb-5 flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-emerald-500/10 text-emerald-300">
                  <Camera size={22} />
                </div>
                <div>
                  <h2 className="text-2xl font-black">Personal information</h2>
                  <p className="text-sm font-semibold text-slate-400">Update your visible account details.</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Avatar image URL" name="avatar" value={form.avatar} onChange={handleChange} placeholder="https://example.com/avatar.jpg" type="url" />
                <Field label="Full name" name="name" value={form.name} onChange={handleChange} required />
                <Field label="Phone number" name="phone" value={form.phone} disabled />
                <Field label="Email address" value={user?.email || ''} disabled />
              </div>
              <button disabled={loading} className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 text-sm font-black text-slate-950 disabled:opacity-60">
                <Save size={18} />
                {loading ? 'Saving...' : 'Save Account'}
              </button>
              {success && <div className="mt-4 rounded-lg border border-emerald-400/40 bg-emerald-500/15 p-3 text-center text-sm font-bold text-emerald-200">Account updated successfully</div>}
            </form>

            <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-black">Recent trips</h2>
                <Link to="/my-rides" className="text-sm font-black text-emerald-300">View all</Link>
              </div>
              <div className="space-y-3">
                {bookings.slice(0, 4).map((booking) => (
                  <div key={booking._id} className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase text-emerald-300">{booking.status}</span>
                        <p className="mt-3 truncate font-bold">{booking.pickup?.address || 'Pickup'}</p>
                        <p className="mt-1 truncate text-sm font-semibold text-slate-400">To {booking.drop?.address || 'Drop'}</p>
                      </div>
                      <p className="text-xl font-black text-emerald-300">{money(booking.fare?.total)}</p>
                    </div>
                  </div>
                ))}
                {bookings.length === 0 && <div className="rounded-lg border border-dashed border-slate-700 bg-slate-950 p-6 text-center text-sm font-semibold text-slate-400">No trips yet. Book your first ride.</div>}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-black">{value}</p>
        </div>
        <span className="rounded-lg border border-slate-700 bg-slate-950 p-2 text-emerald-300"><Icon size={20} /></span>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg bg-slate-950 p-3">
      <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
        <Icon size={14} className="text-emerald-300" />
        {label}
      </div>
      <p className="font-bold">{value}</p>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-emerald-300">{label}</span>
      <input {...props} className="h-12 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 text-white outline-none placeholder:text-slate-600 focus:border-emerald-400 disabled:cursor-not-allowed disabled:text-slate-500" />
    </label>
  );
}
