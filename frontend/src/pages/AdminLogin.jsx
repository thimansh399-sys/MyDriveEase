import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Phone, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const [form, setForm] = useState({
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({
        phone: form.phone,
        password: form.password,
        role: 'admin',
      });

      navigate(location.state?.from?.pathname || '/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-74px)] bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-154px)] max-w-md items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-900 shadow-2xl"
        >
          <div className="h-1.5 bg-emerald-500" />
          <div className="p-7 sm:p-8">
            <div className="mb-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-emerald-500 text-slate-950">
                <ShieldCheck size={32} />
              </div>
              <h1 className="mt-5 text-3xl font-extrabold">Admin Login</h1>
              <p className="mt-2 text-sm font-semibold text-slate-400">DriveEase CRM access</p>
            </div>

            {error && (
              <div className="mb-5 rounded-lg border border-red-500/40 bg-red-500/15 px-4 py-3 text-sm font-bold text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-300">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" size={18} />
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter admin phone"
                    className="h-14 w-full rounded-lg border border-slate-700 bg-slate-800 pl-12 pr-4 font-semibold text-white outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" size={18} />
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter admin password"
                    className="h-14 w-full rounded-lg border border-slate-700 bg-slate-800 pl-12 pr-4 font-semibold text-white outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
                    required
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="flex h-14 w-full items-center justify-center gap-3 rounded-lg bg-emerald-500 text-base font-extrabold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
              >
                {loading ? (
                  'Logging in...'
                ) : (
                  <>
                    Open CRM
                    <ArrowRight size={19} />
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
