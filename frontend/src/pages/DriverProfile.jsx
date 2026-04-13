import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function DriverProfile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', avatar: '', vehicleType: '', vehicleModel: '', vehiclePlate: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) setForm({
      name: user.name,
      phone: user.phone,
      avatar: user.avatar || '',
      vehicleType: user.vehicle?.type || '',
      vehicleModel: user.vehicle?.model || '',
      vehiclePlate: user.vehicle?.plate || ''
    });
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/drivers/me', {
        name: form.name,
        avatar: form.avatar,
        vehicle: {
          type: form.vehicleType,
          model: form.vehicleModel,
          plate: form.vehiclePlate
        }
      });
      updateUser(res.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch {}
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-card dark:bg-[#111827] rounded-2xl p-10 shadow-2xl border border-border">
      <h2 className="text-3xl font-extrabold text-primary mb-8 text-center">Driver Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center gap-3 mb-4">
          <img
            src={form.avatar || '/default-avatar.png'}
            alt="Avatar"
            className="w-24 h-24 rounded-full border-4 border-primary object-cover"
            onError={e => (e.target.src = '/default-avatar.png')}
          />
          <input
            type="url"
            name="avatar"
            value={form.avatar}
            onChange={handleChange}
            placeholder="Avatar image URL"
            className="w-full px-4 py-2 rounded-xl border border-border bg-white dark:bg-[#222c37] text-black dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-primary font-bold mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-border rounded-xl bg-white dark:bg-[#222c37] text-black dark:text-white focus:ring-2 focus:ring-primary outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-primary font-bold mb-1">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-border rounded-xl bg-white dark:bg-[#222c37] text-black dark:text-white focus:ring-2 focus:ring-primary outline-none"
            required
            disabled
          />
        </div>
        <div>
          <label className="block text-primary font-bold mb-1">Vehicle Type</label>
          <input
            name="vehicleType"
            value={form.vehicleType}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-border rounded-xl bg-white dark:bg-[#222c37] text-black dark:text-white focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-primary font-bold mb-1">Vehicle Model</label>
          <input
            name="vehicleModel"
            value={form.vehicleModel}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-border rounded-xl bg-white dark:bg-[#222c37] text-black dark:text-white focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-primary font-bold mb-1">Vehicle Plate</label>
          <input
            name="vehiclePlate"
            value={form.vehiclePlate}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-border rounded-xl bg-white dark:bg-[#222c37] text-black dark:text-white focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-black py-3 rounded-2xl font-extrabold text-lg shadow-lg hover:bg-green-400 transition-colors disabled:opacity-50 mt-2"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
        {success && <div className="text-primary text-center font-extrabold">Profile updated!</div>}
      </form>
    </div>
  );
}
