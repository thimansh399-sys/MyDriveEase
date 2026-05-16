import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Car, CheckCircle2, LockKeyhole, Mail, MapPin, Phone, ShieldCheck, UserRound } from 'lucide-react';
import api from '../../utils/api';

export default function FleetSignup() {
  const [formData, setFormData] = useState({
    companyName: '',
    ownerName: '',
    email: '',
    phone: '',
    city: '',
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
      await api.post('/fleet-auth/register', formData);
      window.location.href = '/fleet/login';
    } catch (err) {
      setError(err?.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fleet-theme min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-170px)] w-full max-w-6xl items-center gap-6 lg:grid-cols-[1fr_520px]">
        <section className="hidden lg:block">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-4 py-2 text-sm font-extrabold text-emerald-200">
            <ShieldCheck size={17} />
            Partner onboarding
          </div>
          <h1 className="max-w-2xl text-5xl font-black leading-tight">
            Bring your fleet online and start receiving customer leads.
          </h1>
          <p className="mt-4 max-w-xl text-base font-semibold text-slate-300">
            Register your company, add cabs, complete KYC, and keep accepted rides moving from the partner dashboard.
          </p>

          <div className="mt-8 space-y-3">
            {[
              'Company profile for customer trust',
              'Lead dashboard for incoming ride requests',
              'Cab readiness tracking for every vehicle',
            ].map((item) => (
              <div key={item} className="flex max-w-xl items-center gap-3 rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-bold text-slate-200">
                <CheckCircle2 className="text-emerald-300" size={18} />
                {item}
              </div>
            ))}
          </div>
        </section>

        <form
          onSubmit={handleSubmit}
          className="w-full rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-black/30 sm:p-8"
        >
          <div className="mb-7">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-lg bg-emerald-500 text-slate-950">
              <Building2 size={24} />
            </div>
            <p className="text-sm font-extrabold uppercase text-emerald-300">Travel Partner</p>
            <h1 className="mt-2 text-3xl font-black text-white">Create partner account</h1>
            <p className="mt-2 text-sm font-semibold text-slate-400">Basic fleet details se onboarding start hoti hai.</p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-red-400/40 bg-red-500/15 px-4 py-3 text-sm font-bold text-red-200">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { name: 'companyName', label: 'Company name', placeholder: 'DriveEase Fleet Co.', icon: Building2, type: 'text' },
              { name: 'ownerName', label: 'Owner name', placeholder: 'Owner full name', icon: UserRound, type: 'text' },
              { name: 'email', label: 'Email address', placeholder: 'partner@company.com', icon: Mail, type: 'email' },
              { name: 'phone', label: 'Phone number', placeholder: '9876543210', icon: Phone, type: 'tel' },
              { name: 'city', label: 'Service city', placeholder: 'Delhi', icon: MapPin, type: 'text' },
              { name: 'password', label: 'Password', placeholder: 'Create password', icon: LockKeyhole, type: 'password' },
            ].map(({ name, label, placeholder, icon: Icon, type }) => (
              <label key={name} className="block">
                <span className="mb-2 block text-sm font-bold text-slate-300">{label}</span>
                <span className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-950 px-4 focus-within:border-emerald-400">
                  <Icon size={18} className="text-slate-400" />
                  <input
                    className="h-12 w-full bg-transparent text-white outline-none placeholder:text-slate-600"
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    value={formData[name]}
                    onChange={handleChange}
                    required
                  />
                </span>
              </label>
            ))}
          </div>

          <div className="mt-5 grid gap-3 rounded-lg border border-slate-800 bg-slate-950 p-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
              <Car size={18} className="text-emerald-300" />
              Add cabs after signup
            </div>
            <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
              <ShieldCheck size={18} className="text-emerald-300" />
              KYC can be completed later
            </div>
          </div>

          <button
            disabled={loading}
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 text-sm font-black text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create Account'}
            {!loading && <ArrowRight size={18} />}
          </button>

          <p className="mt-6 text-center text-sm font-semibold text-slate-400">
            Already have an account?{' '}
            <Link to="/fleet/login" className="font-black text-emerald-300 hover:text-emerald-200">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

