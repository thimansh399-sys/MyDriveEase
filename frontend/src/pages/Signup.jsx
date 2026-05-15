import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Car,
  ShieldCheck,
  Phone,
  Lock,
  CreditCard,
  BadgeCheck,
} from 'lucide-react';

const Signup = () => {
  const [searchParams] = useSearchParams();
  const initialRole =
    searchParams.get('role') === 'driver'
      ? 'driver'
      : 'user';

  const [form, setForm] = useState({
    name: '',
    phone: '',
    password: '',
    role: initialRole,

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
    <div className="min-h-[calc(100vh-74px)] relative overflow-hidden bg-[#050816] text-white flex items-center justify-center px-4 py-10">

      {/* BACKGROUND EFFECTS */}

      <div className="absolute inset-0">
        <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-green-500/20 blur-[120px] rounded-full" />

        <div className="absolute bottom-[-150px] right-[-120px] w-[350px] h-[350px] bg-cyan-500/10 blur-[120px] rounded-full" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.12),transparent_35%)]" />
      </div>

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
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

        {/* CARD */}

        <div className="relative bg-[#0c1424]/95 backdrop-blur-2xl border border-[#1d2b45] rounded-[34px] overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.6)]">

          {/* TOP BAR */}

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
                <Car size={42} className="text-black" />
              </motion.div>

              <h1 className="text-4xl font-black mt-6 leading-tight">
                Create Your
                <span className="block text-green-400">
                  DriveEase Account
                </span>
              </h1>

              <p className="text-gray-400 mt-3 text-base">
                Start booking trusted drivers or earn with DriveEase.
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
                      layoutId="signup-role-switch"
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
                        <Car size={18} />
                        Driver
                      </>
                    )}
                  </span>
                </button>
              ))}
            </div>

            {/* ERROR */}

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  className="bg-red-500/15 border border-red-500/40 text-red-300 rounded-2xl px-4 py-3 mb-6 text-sm font-bold"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* NAME */}

              <div>
                <label className="text-sm font-bold text-gray-300 mb-2 block">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400"
                  />

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full h-[60px] bg-[#101b2f] border border-[#24344f] rounded-2xl pl-12 pr-4 outline-none focus:border-green-400 focus:ring-4 focus:ring-green-500/10 transition-all placeholder:text-gray-500"
                    required
                  />
                </div>
              </div>

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
                    name="phone"
                    type="tel"
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
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    className="w-full h-[60px] bg-[#101b2f] border border-[#24344f] rounded-2xl pl-12 pr-4 outline-none focus:border-green-400 focus:ring-4 focus:ring-green-500/10 transition-all placeholder:text-gray-500"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {/* DRIVER DETAILS */}

              <AnimatePresence>
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
                    exit={{
                      opacity: 0,
                      height: 0,
                    }}
                    transition={{
                      duration: 0.3,
                    }}
                    className="overflow-hidden"
                  >

                    <div className="mt-2 bg-[#101b2f]/70 border border-[#24344f] rounded-[28px] p-5 space-y-5">

                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-green-500/15 flex items-center justify-center">
                          <ShieldCheck
                            size={22}
                            className="text-green-400"
                          />
                        </div>

                        <div>
                          <h3 className="font-black text-lg">
                            Driver Verification
                          </h3>

                          <p className="text-sm text-gray-400">
                            Secure your account with verification details
                          </p>
                        </div>
                      </div>

                      {/* AADHAAR */}

                      <div>
                        <label className="text-sm font-bold text-gray-300 mb-2 block">
                          Aadhaar Number
                        </label>

                        <div className="relative">
                          <CreditCard
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400"
                          />

                          <input
                            name="aadhaarNumber"
                            value={form.aadhaarNumber}
                            onChange={handleChange}
                            placeholder="Enter Aadhaar number"
                            className="w-full h-[58px] bg-[#0b1527] border border-[#24344f] rounded-2xl pl-12 pr-4 outline-none focus:border-green-400 focus:ring-4 focus:ring-green-500/10 transition-all placeholder:text-gray-500"
                            required={form.role === 'driver'}
                          />
                        </div>
                      </div>

                      {/* LICENSE */}

                      <div>
                        <label className="text-sm font-bold text-gray-300 mb-2 block">
                          Driving License Number
                        </label>

                        <div className="relative">
                          <BadgeCheck
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400"
                          />

                          <input
                            name="licenseNumber"
                            value={form.licenseNumber}
                            onChange={handleChange}
                            placeholder="Enter driving license number"
                            className="w-full h-[58px] bg-[#0b1527] border border-[#24344f] rounded-2xl pl-12 pr-4 outline-none focus:border-green-400 focus:ring-4 focus:ring-green-500/10 transition-all placeholder:text-gray-500"
                            required={form.role === 'driver'}
                          />
                        </div>
                      </div>

                    </div>

                  </motion.div>
                )}
              </AnimatePresence>

              {/* SUBMIT */}

              <motion.button
                whileHover={{
                  scale: 1.01,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                type="submit"
                disabled={loading}
                className="w-full h-[62px] rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 text-black font-black text-lg shadow-[0_12px_40px_rgba(34,197,94,0.35)] hover:shadow-[0_16px_50px_rgba(34,197,94,0.45)] transition-all disabled:opacity-50"
              >
                {loading
                  ? 'Creating account...'
                  : form.role === 'driver'
                  ? 'Create Driver Account'
                  : 'Create Account'}
              </motion.button>

            </form>

            {/* FOOTER */}

            <div className="mt-8 text-center">

              <p className="text-gray-400">
                Already have an account?
              </p>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-green-400 font-black mt-2 hover:text-green-300 transition-all"
              >
                Sign In Instead →
              </Link>

            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
