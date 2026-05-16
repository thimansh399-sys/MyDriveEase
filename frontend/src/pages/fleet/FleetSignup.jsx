import { useState } from 'react';
import { Link } from 'react-router-dom';
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
    <div className="min-h-screen bg-[#0b1220] flex items-center justify-center px-5">
      <form
        onSubmit={handleSubmit}
        className="bg-[#111827] w-full max-w-md p-8 rounded-3xl text-white"
      >
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Travel Partner Signup</h1>

        {error && (
          <div className="rounded-2xl border border-red-400/40 bg-red-500/15 px-5 py-4 text-sm font-bold text-red-200 mb-5">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            className="w-full p-4 rounded-xl bg-[#1f2937] text-white outline-none"
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-4 rounded-xl bg-[#1f2937] text-white outline-none"
            type="text"
            name="ownerName"
            placeholder="Owner Name"
            value={formData.ownerName}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-4 rounded-xl bg-[#1f2937] text-white outline-none"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-4 rounded-xl bg-[#1f2937] text-white outline-none"
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-4 rounded-xl bg-[#1f2937] text-white outline-none"
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-4 rounded-xl bg-[#1f2937] text-white outline-none"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-xl mt-6 disabled:opacity-60"
        >
          {loading ? 'Creating...' : 'Create Account'}
        </button>

        <p className="text-center text-gray-400 mt-5">
          Already have an account?{' '}
          <Link to="/fleet/login" className="text-green-400">Login</Link>
        </p>
      </form>
    </div>
  );
}

