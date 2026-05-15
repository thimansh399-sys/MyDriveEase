import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

export default function FleetLogin() {
  const [formData, setFormData] = useState({
    email: '',
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

    try {
      setLoading(true);

      const res = await api.post('/fleet-auth/login', formData);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem(
        'user',
        JSON.stringify({
          ...res.data.fleet,
          role: 'fleet',
        })
      );

      window.location.href = '/fleet/dashboard';
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1220] flex items-center justify-center px-5">
      <form onSubmit={handleSubmit} className="bg-[#111827] w-full max-w-md p-8 rounded-3xl">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Travel Partner Login
        </h1>

        {error && (
          <div className="rounded-2xl border border-red-400/40 bg-red-500/15 px-5 py-4 text-sm font-bold text-red-200 mb-5">
            {error}
          </div>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full mb-4 p-4 rounded-xl bg-[#1f2937] text-white outline-none"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full mb-6 p-4 rounded-xl bg-[#1f2937] text-white outline-none"
        />

        <button
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-xl"
        >
          {loading ? 'Please wait...' : 'Login'}
        </button>

        <p className="text-center text-gray-400 mt-5">
          Create Travel Partner Account?{' '}
          <Link to="/fleet/signup" className="text-green-400">Signup</Link>
        </p>
      </form>
    </div>
  );
}

