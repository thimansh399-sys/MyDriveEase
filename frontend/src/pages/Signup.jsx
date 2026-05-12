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

    // DRIVER DETAILS
    aadhaarNumber: '',
    licenseNumber: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();

  const navigate = useNavigate();

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

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

      // DRIVER EXTRA DETAILS
      if (form.role === 'driver') {

        data.aadhaarNumber = form.aadhaarNumber;
        data.licenseNumber = form.licenseNumber;

      }

      await signup(data);

      navigate(
        form.role === 'driver'
          ? '/driver/login'
          : '/login'
      );

    } catch (err) {

      setError(
        err.response?.data?.message ||
        err.message ||
        'Signup failed'
      );

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

          {/* HEADER */}

          <div className="text-center mb-8">

            <span className="text-4xl">
              🚗
            </span>

            <h1 className="text-3xl font-extrabold text-primary mt-2">
              Create Account
            </h1>

            <p className="text-primary text-sm mt-1">
              Join DriveEase today
            </p>

          </div>

          {/* ROLE TOGGLE */}

          <div className="flex bg-[#18222f] rounded-xl p-1 mb-6 border border-border">

            {['user', 'driver'].map((r) => (

              <button
                key={r}
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    role: r,
                  })
                }
                className={`flex-1 py-2 rounded-lg text-sm font-extrabold transition-all cursor-pointer ${
                  form.role === r
                    ? 'bg-primary text-black shadow-sm'
                    : 'text-white hover:text-primary'
                }`}
              >

                {r === 'user'
                  ? '👤 Customer'
                  : '🚘 Driver'}

              </button>

            ))}

          </div>

          {/* ERROR */}

          {error && (

            <div className="bg-red-900 text-red-200 rounded-lg px-4 py-2 mb-4 text-center text-sm font-extrabold border border-red-400">

              {error}

            </div>

          )}

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* NAME */}

            <div>

              <label className="block text-sm font-extrabold text-primary mb-1">

                Full Name

              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter full name"
                className="w-full px-4 py-3 border border-border bg-[#18222f] text-white rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none placeholder-gray-400"
                required
              />

            </div>

            {/* PHONE */}

            <div>

              <label className="block text-sm font-extrabold text-primary mb-1">

                Phone Number

              </label>

              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full px-4 py-3 border border-border bg-[#18222f] text-white rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none placeholder-gray-400"
                required
              />

            </div>

            {/* PASSWORD */}

            <div>

              <label className="block text-sm font-extrabold text-primary mb-1">

                Password

              </label>

              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                className="w-full px-4 py-3 border border-border bg-[#18222f] text-white rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none placeholder-gray-400"
                required
                minLength={6}
              />

            </div>

            {/* DRIVER SECTION */}

            {form.role === 'driver' && (

              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: 'auto',
                }}
                className="space-y-4 pt-2 border-t border-border"
              >

                <p className="text-sm font-extrabold text-primary">

                  Driver Verification Details

                </p>

                {/* AADHAAR */}

                <div>

                  <label className="block text-sm font-extrabold text-primary mb-1">

                    Aadhaar Number

                  </label>

                  <input
                    name="aadhaarNumber"
                    value={form.aadhaarNumber}
                    onChange={handleChange}
                    placeholder="Enter Aadhaar Number"
                    className="w-full px-4 py-3 border border-border bg-[#18222f] text-white rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none placeholder-gray-400"
                    required={form.role === 'driver'}
                  />

                </div>

                {/* DL */}

                <div>

                  <label className="block text-sm font-extrabold text-primary mb-1">

                    Driving License Number

                  </label>

                  <input
                    name="licenseNumber"
                    value={form.licenseNumber}
                    onChange={handleChange}
                    placeholder="Enter License Number"
                    className="w-full px-4 py-3 border border-border bg-[#18222f] text-white rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none placeholder-gray-400"
                    required={form.role === 'driver'}
                  />

                </div>

              </motion.div>

            )}

            {/* BUTTON */}

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-black py-3 rounded-2xl font-extrabold text-lg shadow-lg hover:bg-green-400 transition-all focus:outline-none focus:ring-2 focus:ring-primary active:scale-95 disabled:opacity-50 cursor-pointer mt-2"
            >

              {loading
                ? 'Creating account...'
                : 'Create Account'}

            </motion.button>

          </form>

          {/* LOGIN */}

          <p className="text-center text-sm text-white mt-6">

            Already have an account?{' '}

            <Link
              to="/login"
              className="text-primary font-extrabold hover:underline"
            >

              Sign In

            </Link>

          </p>

        </div>

      </motion.div>

    </div>
  );
};

export default Signup;