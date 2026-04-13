import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function ProfileDashboard() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    avatar: '',
    vehicleType: '',
    vehicleModel: '',
    vehiclePlate: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [otpEdit, setOtpEdit] = useState(false);
  const [otp, setOtp] = useState('');
  const [selfie, setSelfie] = useState(null);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        phone: user.phone,
        avatar: user.avatar || '',
        vehicleType: user.vehicle?.type || '',
        vehicleModel: user.vehicle?.model || '',
        vehiclePlate: user.vehicle?.plate || '',
      });
    }
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSelfieChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelfie(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let avatarUrl = form.avatar;
      if (selfie) {
        // Simulate upload, replace with real upload logic
        avatarUrl = URL.createObjectURL(selfie);
      }
      const payload = {
        name: form.name,
        avatar: avatarUrl,
      };
      if (user.role === 'driver') {
        payload.vehicle = {
          type: form.vehicleType,
          model: form.vehicleModel,
          plate: form.vehiclePlate,
        };
      }
      const res = await api.put(user.role === 'driver' ? '/drivers/me' : '/users/me', payload);
      updateUser(res.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch {}
    setLoading(false);
  };

  const handleOtpEdit = async (e) => {
    e.preventDefault();
    // Simulate OTP update logic
    setOtpEdit(false);
    setOtp('');
    // Add real OTP update logic here
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-[#111827] rounded-2xl p-8 shadow-xl border border-[#19e68c]">
      <h2 className="text-2xl font-bold text-white mb-6">{user?.role === 'driver' ? 'Driver' : 'User'} Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col items-center gap-3 mb-4">
          <img
            src={selfie ? URL.createObjectURL(selfie) : form.avatar || '/default-avatar.png'}
            alt="Avatar"
            className="w-24 h-24 rounded-full border-4 border-[#19e68c] object-cover"
            onError={e => (e.target.src = '/default-avatar.png')}
          />
          <input
            type="file"
            accept="image/*"
            capture="user"
            onChange={handleSelfieChange}
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
        {user?.role === 'driver' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[#19e68c] mb-1">Vehicle Type</label>
              <input
                name="vehicleType"
                value={form.vehicleType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#19e68c] rounded-xl bg-[#222c37] text-white"
              />
            </div>
            <div>
              <label className="block text-[#19e68c] mb-1">Vehicle Model</label>
              <input
                name="vehicleModel"
                value={form.vehicleModel}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#19e68c] rounded-xl bg-[#222c37] text-white"
              />
            </div>
            <div>
              <label className="block text-[#19e68c] mb-1">Vehicle Plate</label>
              <input
                name="vehiclePlate"
                value={form.vehiclePlate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#19e68c] rounded-xl bg-[#222c37] text-white"
              />
            </div>
          </div>
        )}
        <div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#19e68c] text-[#111827] font-bold text-lg hover:bg-[#13c26b] transition"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          {success && <div className="text-green-400 mt-2">Profile updated!</div>}
        </div>
      </form>
      <div className="mt-6">
        {!otpEdit ? (
          <button
            className="text-[#19e68c] underline"
            onClick={() => setOtpEdit(true)}
          >
            Edit OTP
          </button>
        ) : (
          <form onSubmit={handleOtpEdit} className="flex gap-2 mt-2">
            <input
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              placeholder="Enter new OTP"
              className="px-3 py-2 rounded bg-[#222c37] text-white border border-[#19e68c]"
            />
            <button type="submit" className="bg-[#19e68c] px-4 py-2 rounded text-[#111827] font-bold">Save</button>
          </form>
        )}
      </div>
    </div>
  );
}
