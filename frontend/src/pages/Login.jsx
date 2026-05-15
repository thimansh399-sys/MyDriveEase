import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

import {
  Phone,
  Lock,
  User,
  Car,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

const Login = () => {

  const [form, setForm] = useState({
    phone: '',
    password: '',
    role: 'user',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

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

      await login({
        phone: form.phone,
        password: form.password,
        role: form.role,
      });

      if (form.role === 'driver') {

        navigate('/driver/dashboard');

      } else {

        navigate('/');

      }

    } catch (err) {

      setError(
        err.response?.data?.message ||
        err.message ||
        'Login failed'
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-[calc(100vh-74px)] relative overflow-hidden bg-[#050816] text-white flex items-center justify-center px-4 py-10">

      {/* BACKGROUND */}

      <div className="absolute inset-0">

        <div className="absolute top-[-150px] left-[-120px] w-[340px] h-[340px] rounded-full bg-green-500/20 blur-[120px]" />

        <div className="absolute bottom-[-180px] right-[-100px] w-[340px] h-[340px] rounded-full bg-cyan-500/10 blur-[120px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.12),transparent_35%)]" />

      </div>

      {/* LOGIN CARD */}

      <motion.div
        initial={{
          opacity: 0,
          y: 25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.45,
        }}
        className="relative z-10 w-full max-w-lg"
      >

        <div className="relative bg-[#0c1424]/95 backdrop-blur-2xl border border-[#1d2b45] rounded-[34px] overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.65)]">

          {/* TOP BORDER */}

          <div className="h-2 w-full bg-gradient-to-r from-green-400 via-emerald-500 to-cyan-400" />

          <div className="p-8 md:p-10">

            {/* HEADER */}

            <div className="text-center mb-8">

              <motion.div
                initial={{
                  scale: 0.8,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
                transition={{
                  delay: 0.1,
                }}
                className="w-24 h-24 rounded-[28px] bg-gradient-to-br from-green-400 to-emerald-600 mx-auto flex items-center justify-center shadow-[0_10px_40px_rgba(34,197,94,0.35)] border border-green-300/30"
              >

                <Car
                  size={42}
                  className="text-black"
                />

              </motion.div>

              <h1 className="text-4xl font-black mt-6 leading-tight">

                Welcome Back

                <span className="block text-green-400 mt-1">
                  DriveEase
                </span>

              </h1>

              <p className="text-gray-400 mt-3 text-base">
                Login to continue your journey with us
              </p>

            </div>

            {/* ROLE SWITCH */}

            <div className="bg-[#101b2f] border border-[#1d2b45] rounded-[22px] p-1.5 flex mb-8 relative overflow-hidden">

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
                  className={`relative flex-1 py-4 rounded-2xl font-black text-sm transition-all duration-300 flex items-center justify-center gap-2 z-10 ${
                    form.role === r
                      ? 'text-black'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >

                  {form.role === r && (

                    <motion.div
                      layoutId="login-role-switch"
                      className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl"
                      transition={{
                        type: 'spring',
                        bounce: 0.25,
                        duration: 0.4,
                      }}
                    />

                  )}

                  <span className="relative z-10 flex items-center gap-2">

                    {r === 'user' ? (
                      <>
                        <User size={18} />
                        Customer
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={18} />
                        Driver
                      </>
                    )}

                  </span>

                </button>

              ))}

            </div>

            {/* ERROR */}

            {error && (

              <div className="bg-red-500/15 border border-red-500/40 text-red-300 rounded-2xl px-4 py-3 mb-6 text-sm font-bold">

                {error}

              </div>

            )}

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* PHONE */}

              <div>

                <label className="text-sm font-bold text-gray-300 mb-2 block">

                  Phone Number

                </label>

                <div className="relative">

                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400"
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="w-full h-[60px] bg-[#101b2f] border border-[#24344f] rounded-2xl pl-12 pr-4 outline-none focus:border-green-400 focus:ring-4 focus:ring-green-500/10 transition-all placeholder:text-gray-500"
                    required
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div>

                <label className="text-sm font-bold text-gray-300 mb-2 block">

                  Password

                </label>

                <div className="relative">

                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400"
                  />

                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full h-[60px] bg-[#101b2f] border border-[#24344f] rounded-2xl pl-12 pr-4 outline-none focus:border-green-400 focus:ring-4 focus:ring-green-500/10 transition-all placeholder:text-gray-500"
                    required
                  />

                </div>

              </div>

              {/* LOGIN BUTTON */}

              <motion.button
                whileHover={{
                  scale: 1.01,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                type="submit"
                disabled={loading}
                className="w-full h-[62px] rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 text-black font-black text-lg shadow-[0_12px_40px_rgba(34,197,94,0.35)] hover:shadow-[0_16px_50px_rgba(34,197,94,0.45)] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >

                {loading ? (
                  'Logging in...'
                ) : (
                  <>
                    Continue
                    <ArrowRight size={20} />
                  </>
                )}

              </motion.button>

            </form>

            {/* EXTRA LINKS */}

            <div className="mt-8 flex items-center justify-between text-sm">

              <button className="text-gray-400 hover:text-green-400 transition">
                Forgot Password?
              </button>

              <Link
                to="/signup"
                className="text-green-400 font-black hover:text-green-300 transition"
              >
                Create Account
              </Link>

            </div>

          </div>

        </div>

      </motion.div>

    </div>

  );

};

export default Login;