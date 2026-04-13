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
      await signup(data);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-[#101924] via-[#18222f] to-[#1a3a2c] px-4 py-8 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-2xl shadow-2xl p-10 border border-border">
          <div className="text-center mb-8">
            <span className="text-4xl">🚗</span>
            <h1 className="text-3xl font-extrabold text-primary mt-2">Create Account</h1>
            <p className="text-primary text-sm mt-1">Join DriveEase today</p>
          </div>

          {/* Role Toggle */}
          <div className="flex bg-[#18222f] rounded-xl p-1 mb-6 border border-border">
            {['user', 'driver'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setForm({ ...form, role: r })}
                className={`flex-1 py-2 rounded-lg text-sm font-extrabold transition-all cursor-pointer ${
                  form.role === r
                    ? 'bg-primary text-black shadow-sm'
                    : 'text-white hover:text-primary'
                }`}
              >
                {r === 'user' ? '👤 Rider' : '🚘 Driver'}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-900 text-red-200 rounded-lg px-4 py-2 mb-4 text-center text-sm font-extrabold border border-red-400">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-extrabold text-primary mb-1">Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full px-4 py-3 border border-border bg-[#18222f] text-white rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none placeholder-gray-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-extrabold text-primary mb-1">Phone Number</label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone number"
                className="w-full px-4 py-3 border border-border bg-[#18222f] text-white rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none placeholder-gray-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-extrabold text-primary mb-1">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                className="w-full px-4 py-3 border border-border bg-[#18222f] text-white rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none placeholder-gray-400"
                required
                minLength={6}
              />
            </div>

            {form.role === 'driver' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4 pt-2 border-t border-border"
              >
                <p className="text-sm font-extrabold text-primary">Vehicle Details</p>
                <select
                  name="vehicleType"
                  value={form.vehicleType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border bg-[#18222f] text-white rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
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
                  className="w-full px-4 py-3 border border-border bg-[#18222f] text-white rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none placeholder-gray-400"
                />
                <input
                  name="vehiclePlate"
                  value={form.vehiclePlate}
                  onChange={handleChange}
                  placeholder="License plate"
                  className="w-full px-4 py-3 border border-border bg-[#18222f] text-white rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none placeholder-gray-400"
                />
              </motion.div>
            )}

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-black py-3 rounded-2xl font-extrabold text-lg shadow-lg hover:bg-green-400 transition-all focus:outline-none focus:ring-2 focus:ring-primary active:scale-95 disabled:opacity-50 cursor-pointer mt-2"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </motion.button>
          </form>

          <p className="text-center text-sm text-white mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-extrabold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
