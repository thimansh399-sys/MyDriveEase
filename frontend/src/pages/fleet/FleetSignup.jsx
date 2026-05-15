import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import {
  Building2,
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  ShieldCheck,
  Car,
} from 'lucide-react';

const FleetSignup = () => {
  const [form, setForm] = useState({
    companyName: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    city: '',
    address: '',
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Backend register call
      const res = await api.post(
        '/fleet-auth/register',
        form
      );

      // login via returned token (optional). Here we simply store and redirect.
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
      alert(
        err?.response?.data?.message ||
          'Signup failed'
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#020817] flex items-center justify-center px-6 py-20 relative overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-[-200px] left-[-150px] w-[500px] h-[500px] bg-green-500/20 blur-[140px] rounded-full" />

      <div className="absolute bottom-[-200px] right-[-150px] w-[500px] h-[500px] bg-emerald-500/20 blur-[140px] rounded-full" />

      {/* MAIN CONTAINER */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 rounded-[40px] overflow-hidden border border-white/10 backdrop-blur-xl bg-white/5 shadow-[0_0_80px_rgba(0,255,136,0.08)]"
      >

        {/* LEFT SIDE */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#00ff88]/10 to-transparent border-r border-white/10">

          <div>
            <div className="w-20 h-20 rounded-3xl bg-green-500 flex items-center justify-center shadow-2xl shadow-green-500/30">
              <Car className="text-black" size={40} />
            </div>

            <h1 className="text-5xl font-black text-white leading-tight mt-10">
              Grow Your
              <span className="text-green-400"> Travel Business</span>
            </h1>

            <p className="text-gray-400 text-lg mt-6 leading-relaxed">
              Join DriveEase Partner Network and manage bookings,
              drivers, earnings, and customers from one powerful dashboard.
            </p>
          </div>

          {/* TRUST BOXES */}
          <div className="space-y-5 mt-10">

            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-3xl p-5">
              <ShieldCheck className="text-green-400" size={30} />

              <div>
                <h3 className="text-white font-bold text-lg">
                  Verified Platform
                </h3>

                <p className="text-gray-400 text-sm">
                  Trusted by travel companies across India
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-3xl p-5">
              <Building2 className="text-green-400" size={30} />

              <div>
                <h3 className="text-white font-bold text-lg">
                  Business Dashboard
                </h3>

                <p className="text-gray-400 text-sm">
                  Manage rides, drivers & payments easily
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-8 lg:p-14">

          <div className="max-w-xl mx-auto">

            <div className="text-center mb-10">

              <div className="w-20 h-20 mx-auto rounded-3xl bg-green-500 flex items-center justify-center shadow-2xl shadow-green-500/30">
                <Building2 className="text-black" size={38} />
              </div>

              <h2 className="text-4xl font-black text-white mt-6">
                Travel Partner Signup
              </h2>

              <p className="text-gray-400 mt-3 text-lg">
                Create your DriveEase partner account
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              <div className="grid md:grid-cols-2 gap-5">

                <InputField
                  icon={<Building2 size={20} />}
                  name="companyName"
                  placeholder="Company Name"
                  value={form.companyName}
                  onChange={handleChange}
                />

                <InputField
                  icon={<User size={20} />}
                  name="ownerName"
                  placeholder="Owner Name"
                  value={form.ownerName}
                  onChange={handleChange}
                />

                <InputField
                  icon={<Mail size={20} />}
                  name="email"
                  placeholder="Business Email"
                  value={form.email}
                  onChange={handleChange}
                />

                <InputField
                  icon={<Phone size={20} />}
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                />

                <InputField
                  icon={<Lock size={20} />}
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                />

                <InputField
                  icon={<MapPin size={20} />}
                  name="city"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                />

                <InputField
                  icon={<MapPin size={20} />}
                  name="address"
                  placeholder="Office Address"
                  value={form.address}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="w-full h-16 rounded-2xl bg-green-500 text-black font-black text-xl hover:scale-[1.02] transition-all shadow-2xl shadow-green-500/20"
              >
                Create Partner Account
              </button>

              <p className="text-center text-gray-400">
                Already have an account?{' '}
                <Link
                  to="/fleet/login"
                  className="text-green-400 font-bold hover:text-green-300 transition"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const InputField = ({
  icon,
  ...props
}) => {
  return (
    <div className="relative">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </div>

      <input
        {...props}
        className="w-full h-16 rounded-2xl bg-white/5 border border-white/10 pl-14 pr-5 text-white placeholder:text-gray-500 outline-none focus:border-green-400 transition-all"
      />
    </div>
  );
};

export default FleetSignup;
