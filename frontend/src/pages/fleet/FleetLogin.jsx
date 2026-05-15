import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Lock, Mail, ShieldCheck, Truck } from 'lucide-react';
import api from '../../utils/api';
import { connectSocket } from '../../utils/socket';

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
    setLoading(true);

    try {
      const res = await api.post('/fleet-auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem(
        'user',
        JSON.stringify({
          ...res.data.fleet,
          role: 'fleet',
        })
      );
      connectSocket(res.data.token);
      window.location.href = '/fleet/dashboard';
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020817] px-6 py-14 text-white">
      <div className="absolute left-[-160px] top-[-160px] h-[440px] w-[440px] rounded-full bg-green-500/20 blur-[130px]" />
      <div className="absolute bottom-[-180px] right-[-140px] h-[440px] w-[440px] rounded-full bg-blue-500/20 blur-[130px]" />

      <div className="relative z-10 grid w-full max-w-6xl overflow-hidden rounded-[40px] border border-white/10 bg-white/5 shadow-[0_0_90px_rgba(0,255,136,0.08)] backdrop-blur-xl lg:grid-cols-[0.95fr_1.05fr]">
        <div className="hidden flex-col justify-between border-r border-white/10 bg-gradient-to-br from-green-500/10 to-transparent p-12 lg:flex">
          <div>
            <div className="grid h-20 w-20 place-items-center rounded-3xl bg-green-500 shadow-2xl shadow-green-500/30">
              <Truck className="text-black" size={40} />
            </div>
            <h1 className="mt-10 text-5xl font-black leading-tight">
              Partner command center
              <span className="block text-green-400">for faster bookings</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-400">
              Keep cabs online, accept new leads, and track your partner operations from one focused dashboard.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-5">
              <ShieldCheck className="text-green-400" size={30} />
              <div>
                <h3 className="text-lg font-bold text-white">Live booking alerts</h3>
                <p className="text-sm text-gray-400">Get notified when matching requests arrive.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-5">
              <Building2 className="text-green-400" size={30} />
              <div>
                <h3 className="text-lg font-bold text-white">Fleet readiness</h3>
                <p className="text-sm text-gray-400">Manage cab status and accepted rides quickly.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 lg:p-14">
          <div className="mx-auto max-w-md">
            <div className="mb-9 text-center">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-green-500 shadow-2xl shadow-green-500/30">
                <Building2 className="text-black" size={38} />
              </div>
              <h2 className="mt-6 text-4xl font-black">Travel Partner Login</h2>
              <p className="mt-3 text-gray-400">Open your DriveEase partner workspace</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-2xl border border-red-400/40 bg-red-500/15 px-5 py-4 text-sm font-bold text-red-200">
                  {error}
                </div>
              )}

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-gray-300">Business Email</span>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-green-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="h-16 w-full rounded-2xl border border-white/10 bg-white/5 pl-14 pr-5 text-white outline-none transition focus:border-green-400"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-gray-300">Password</span>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-green-400" size={20} />
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="h-16 w-full rounded-2xl border border-white/10 bg-white/5 pl-14 pr-5 text-white outline-none transition focus:border-green-400"
                  />
                </div>
              </label>

              <button
                disabled={loading}
                className="h-16 w-full rounded-2xl bg-green-500 text-xl font-black text-black shadow-2xl shadow-green-500/20 transition hover:scale-[1.02] hover:bg-green-400 disabled:opacity-60"
              >
                {loading ? 'Opening workspace...' : 'Login to Dashboard'}
              </button>
            </form>

            <p className="mt-7 text-center text-gray-400">
              New partner?{' '}
              <Link to="/fleet/signup" className="font-bold text-green-400 hover:text-green-300">
                Create partner account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
