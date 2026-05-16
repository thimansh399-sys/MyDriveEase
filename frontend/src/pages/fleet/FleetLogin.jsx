import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Car, CheckCircle2, LockKeyhole, Mail, ShieldCheck, Truck } from 'lucide-react';
import api from '../../utils/api';

export default function FleetLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);

      const res = await api.post('/fleet-auth/login', formData);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem(
        'user',
        JSON.stringify({
          ...res.data.fleet,
          role: 'fleet',
        })
      );

      window.location.href = '/fleet/dashboard';
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fleet-theme min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-170px)] w-full max-w-6xl items-center gap-6 lg:grid-cols-[1fr_440px]">
        <section className="hidden lg:block">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-4 py-2 text-sm font-extrabold text-emerald-200">
            <ShieldCheck size={17} />
            Verified partner access
          </div>
          <h1 className="max-w-2xl text-5xl font-black leading-tight">
            Manage bookings, cabs, and revenue from one partner console.
          </h1>
          <p className="mt-4 max-w-xl text-base font-semibold text-slate-300">
            Incoming leads, fleet readiness, accepted rides, and KYC actions stay together so your team can move faster.
          </p>

          <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3">
            {[
              { icon: Truck, label: 'Live rides', value: '24/7' },
              { icon: Car, label: 'Cab control', value: 'Fast' },
              { icon: Building2, label: 'Fleet profile', value: 'Ready' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                <Icon className="text-emerald-300" size={22} />
                <p className="mt-4 text-2xl font-black">{value}</p>
                <p className="mt-1 text-xs font-bold uppercase text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <form onSubmit={handleSubmit} className="w-full rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-black/30 sm:p-8">
          <div className="mb-7">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-lg bg-emerald-500 text-slate-950">
              <Truck size={24} />
            </div>
            <p className="text-sm font-extrabold uppercase text-emerald-300">Travel Partner</p>
            <h1 className="mt-2 text-3xl font-black text-white">Welcome back</h1>
            <p className="mt-2 text-sm font-semibold text-slate-400">Sign in to accept leads and manage your fleet.</p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-red-400/40 bg-red-500/15 px-4 py-3 text-sm font-bold text-red-200">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-300">Email address</span>
              <span className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-950 px-4 focus-within:border-emerald-400">
                <Mail size={18} className="text-slate-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="partner@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-12 w-full bg-transparent text-white outline-none placeholder:text-slate-600"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-300">Password</span>
              <span className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-950 px-4 focus-within:border-emerald-400">
                <LockKeyhole size={18} className="text-slate-400" />
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="h-12 w-full bg-transparent text-white outline-none placeholder:text-slate-600"
                />
              </span>
            </label>
          </div>

          <button
            disabled={loading}
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 text-sm font-black text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Open Dashboard'}
            {!loading && <ArrowRight size={18} />}
          </button>

          <div className="mt-5 flex items-center gap-2 rounded-lg bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-100">
            <CheckCircle2 size={18} />
            Leads aur cabs dashboard login ke baad ready milenge.
          </div>

          <p className="mt-6 text-center text-sm font-semibold text-slate-400">
            Create Travel Partner Account?{' '}
            <Link to="/fleet/signup" className="font-black text-emerald-300 hover:text-emerald-200">Signup</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

