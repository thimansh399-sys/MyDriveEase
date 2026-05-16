import { useEffect, useMemo, useState } from 'react';
import { BadgeCheck, Car, CheckCircle2, ClipboardCheck, IdCard, MapPin, Phone, Save, ShieldCheck, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const emptyForm = {
  name: '',
  phone: '',
  avatar: '',
  aadhaarNumber: '',
  drivingLicenseNumber: '',
  experience: '',
  city: '',
  area: '',
};

export default function DriverProfile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get('/drivers/me');
        const driver = res.data || user || {};
        setForm({
          name: driver.name || '',
          phone: driver.phone || '',
          avatar: driver.avatar || '',
          aadhaarNumber: driver.aadhaarNumber || '',
          drivingLicenseNumber: driver.drivingLicenseNumber || '',
          experience: driver.experience || '',
          city: driver.city || '',
          area: driver.area || '',
        });
      } catch {
        if (user) {
          setForm({ ...emptyForm, ...user, avatar: user.avatar || '' });
        }
      }
    };
    loadProfile();
  }, [user]);

  const completion = useMemo(() => {
    const checks = [form.name, form.phone, form.aadhaarNumber, form.drivingLicenseNumber, form.experience, form.city];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [form]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.put('/drivers/me', {
        name: form.name,
        avatar: form.avatar,
        aadhaarNumber: form.aadhaarNumber,
        drivingLicenseNumber: form.drivingLicenseNumber,
        experience: form.experience,
        city: form.city,
        area: form.area,
      });
      updateUser(res.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Profile update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-white">
      {error && <div className="rounded-lg border border-rose-400/40 bg-rose-500/15 px-4 py-3 text-sm font-bold text-rose-200">{error}</div>}
      {success && <div className="rounded-lg border border-emerald-400/40 bg-emerald-500/15 px-4 py-3 text-sm font-bold text-emerald-200">Profile updated successfully</div>}

      <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-lg border border-emerald-400/30 bg-emerald-500 text-2xl font-black text-slate-950">
              {form.avatar ? <img src={form.avatar} alt="Driver" className="h-full w-full object-cover" /> : (form.name || 'DR').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="mb-2 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-extrabold uppercase text-emerald-300">
                  <BadgeCheck size={14} />
                  Driver profile
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-extrabold uppercase text-slate-300">
                  <MapPin size={14} />
                  {form.city || 'City pending'}
                </span>
              </div>
              <h1 className="text-3xl font-black">{form.name || 'Driver'}</h1>
              <p className="mt-1 text-sm font-semibold text-slate-400">Keep professional details current for faster ride approvals.</p>
            </div>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 lg:w-64">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-300">Profile readiness</p>
              <span className="font-black text-emerald-300">{completion}%</span>
            </div>
            <div className="mt-3 h-3 rounded-full bg-slate-800">
              <div className="h-3 rounded-full bg-emerald-500" style={{ width: `${completion}%` }} />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <StatusCard icon={Phone} label="Phone" value={form.phone || 'Not added'} />
          <StatusCard icon={IdCard} label="License" value={form.drivingLicenseNumber || 'Missing'} />
          <StatusCard icon={ShieldCheck} label="Aadhaar" value={form.aadhaarNumber ? 'Added' : 'Missing'} />
          <StatusCard icon={Car} label="Experience" value={form.experience || 'Not added'} />
        </aside>

        <form onSubmit={handleSubmit} className="rounded-lg border border-slate-800 bg-slate-900 p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-emerald-500/10 text-emerald-300">
              <ClipboardCheck size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-black">Professional details</h2>
              <p className="mt-1 text-sm font-semibold text-slate-400">Documents and service area shown to operations.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Profile image URL" name="avatar" value={form.avatar} onChange={handleChange} placeholder="https://example.com/image.jpg" type="url" />
            <Field label="Full name" name="name" value={form.name} onChange={handleChange} placeholder="Driver name" required />
            <Field label="Phone number" value={form.phone} disabled />
            <Field label="Aadhaar number" name="aadhaarNumber" value={form.aadhaarNumber} onChange={handleChange} placeholder="XXXX XXXX XXXX" />
            <Field label="Driving license" name="drivingLicenseNumber" value={form.drivingLicenseNumber} onChange={handleChange} placeholder="DL-XXXXXXXXXXXX" />
            <Field label="Driving experience" name="experience" value={form.experience} onChange={handleChange} placeholder="5 Years" />
            <Field label="City" name="city" value={form.city} onChange={handleChange} placeholder="Delhi" />
            <Field label="Area" name="area" value={form.area} onChange={handleChange} placeholder="Connaught Place" />
          </div>

          <button disabled={loading} className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 text-sm font-black text-slate-950 hover:bg-emerald-400 disabled:opacity-60">
            <Save size={18} />
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </section>
    </div>
  );
}

function StatusCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
        <Icon className="text-emerald-300" size={18} />
      </div>
      <p className="font-black text-white">{value}</p>
      <div className="mt-3 flex items-center gap-2 text-xs font-bold text-emerald-300">
        <CheckCircle2 size={14} />
        Review anytime
      </div>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-emerald-300">{label}</span>
      <input
        {...props}
        className="h-12 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 text-white outline-none placeholder:text-slate-600 focus:border-emerald-400 disabled:cursor-not-allowed disabled:text-slate-500"
      />
    </label>
  );
}
