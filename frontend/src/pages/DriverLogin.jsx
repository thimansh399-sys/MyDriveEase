import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const DriverLogin = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userData = await login(phone, password, 'driver');
      navigate('/driver/dashboard', { replace: true, state: {} });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-[#0a1019] via-[#0d2233] to-[#19e68c] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#101a24] rounded-2xl shadow-2xl p-8 border-2 border-[#19e68c]">
          <div className="text-center mb-8">
            <span className="text-5xl">🧑‍✈️</span>
            <h1 className="text-3xl font-extrabold text-[#19e68c] mt-2">Driver Login</h1>
            <p className="text-gray-300 text-sm mt-1">Sign in as a DriveEase Captain</p>
          </div>

          {error && (
            <div className="bg-red-900 text-red-200 rounded-lg px-4 py-2 mb-4 text-center text-sm font-semibold border border-red-400">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 border border-[#223040] bg-[#16202b] text-white rounded-xl focus:ring-2 focus:ring-[#19e68c] focus:border-[#19e68c] outline-none transition-all placeholder-gray-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-[#223040] bg-[#16202b] text-white rounded-xl focus:ring-2 focus:ring-[#19e68c] focus:border-[#19e68c] outline-none transition-all placeholder-gray-400"
                required
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-[#19e68c] text-black py-3 rounded-xl font-bold hover:bg-[#16a34a] transition-all focus:outline-none focus:ring-2 focus:ring-[#19e68c] active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>

          <p className="text-center text-sm text-white mt-6">
            Not a driver?{' '}
            <Link to="/login" className="text-[#19e68c] font-medium hover:underline">
              User Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default DriverLogin;
// (intentionally left blank - removed custom driver login page)
