import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function UserProfile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', avatar: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name, phone: user.phone, avatar: user.avatar || '' });
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/users/me', form);
      updateUser(res.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch {}
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-[#111827] rounded-2xl p-8 shadow-xl border border-[#19e68c]">
      <h2 className="text-2xl font-bold text-white mb-6">My Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col items-center gap-3 mb-4">
          <img
            src={form.avatar || '/default-avatar.png'}
            alt="Avatar"
            className="w-24 h-24 rounded-full border-4 border-[#19e68c] object-cover"
            onError={e => (e.target.src = '/default-avatar.png')}
          />
          <input
            type="url"
            name="avatar"
            value={form.avatar}
            onChange={handleChange}
            placeholder="Avatar image URL"
            className="w-full px-4 py-2 rounded-xl border border-[#19e68c] bg-[#222c37] text-white placeholder-gray-400"
          />
        </div>
        <div>
          <label className="block text-[#19e68c] mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-[#19e68c] rounded-xl bg-[#222c37] text-white"
            required
          />
        </div>
        <div>
          <label className="block text-[#19e68c] mb-1">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-[#19e68c] rounded-xl bg-[#222c37] text-white"
            required
            disabled
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#19e68c] text-black py-3 rounded-xl font-bold shadow-lg hover:bg-[#16a34a] transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
        {success && <div className="text-green-400 text-center font-bold">Profile updated!</div>}
      </form>
    </div>
  );
}
