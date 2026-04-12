import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    password: '',
    role: 'user',
    vehicleType: 'sedan',
    vehicleModel: '',
    vehiclePlate: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = {
        name: form.name,
        phone: form.phone,
        password: form.password,
        role: form.role,
      };
      if (form.role === 'driver') {
        data.vehicle = {
          type: form.vehicleType,
          model: form.vehicleModel,
          plate: form.vehiclePlate,
        };
      }
      const userData = await signup(data);
      navigate(userData.role === 'driver' ? '/driver/dashboard' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[#0a1019] px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#101a24] rounded-2xl shadow-2xl p-8 border border-[#19e68c]">
          <div className="text-center mb-8">
            <span className="text-4xl">🚗</span>
            <h1 className="text-2xl font-bold text-white mt-2">Create Account</h1>
            <p className="text-[#19e68c] text-sm mt-1">Join DriveEase today</p>
          </div>

          {/* Role Toggle */}
          <div className="flex bg-[#16202b] rounded-xl p-1 mb-6 border border-[#223040]">
            {['user', 'driver'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setForm({ ...form, role: r })}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  form.role === r
                    ? 'bg-[#19e68c] text-black shadow-sm'
                    : 'text-white hover:text-[#19e68c]'
                }`}
              >
                {r === 'user' ? '👤 Rider' : '🚘 Driver'}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-900 text-red-200 rounded-lg px-4 py-2 mb-4 text-center text-sm font-semibold border border-red-400">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full px-4 py-3 border border-[#223040] bg-[#16202b] text-white rounded-xl focus:ring-2 focus:ring-[#19e68c] focus:border-[#19e68c] outline-none placeholder-gray-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Phone Number</label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone number"
                className="w-full px-4 py-3 border border-[#223040] bg-[#16202b] text-white rounded-xl focus:ring-2 focus:ring-[#19e68c] focus:border-[#19e68c] outline-none placeholder-gray-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                className="w-full px-4 py-3 border border-[#223040] bg-[#16202b] text-white rounded-xl focus:ring-2 focus:ring-[#19e68c] focus:border-[#19e68c] outline-none placeholder-gray-400"
                required
                minLength={6}
              />
            </div>

            {form.role === 'driver' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4 pt-2 border-t border-[#223040]"
              >
                <p className="text-sm font-medium text-white">Vehicle Details</p>
                <select
                  name="vehicleType"
                  value={form.vehicleType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#223040] bg-[#16202b] text-white rounded-xl focus:ring-2 focus:ring-[#19e68c] focus:border-[#19e68c] outline-none"
                >
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="hatchback">Hatchback</option>
                  <option value="auto">Auto</option>
                  <option value="bike">Bike</option>
                </select>
                <input
                  name="vehicleModel"
                  value={form.vehicleModel}
                  onChange={handleChange}
                  placeholder="Vehicle model (e.g., Swift Dzire)"
                  className="w-full px-4 py-3 border border-[#223040] bg-[#16202b] text-white rounded-xl focus:ring-2 focus:ring-[#19e68c] focus:border-[#19e68c] outline-none placeholder-gray-400"
                />
                <input
                  name="vehiclePlate"
                  value={form.vehiclePlate}
                  onChange={handleChange}
                  placeholder="License plate"
                  className="w-full px-4 py-3 border border-[#223040] bg-[#16202b] text-white rounded-xl focus:ring-2 focus:ring-[#19e68c] focus:border-[#19e68c] outline-none placeholder-gray-400"
                />
              </motion.div>
            )}

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-[#19e68c] text-black py-3 rounded-xl font-bold hover:bg-[#16a34a] transition-all focus:outline-none focus:ring-2 focus:ring-[#19e68c] active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </motion.button>
          </form>

          <p className="text-center text-sm text-white mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#19e68c] font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
