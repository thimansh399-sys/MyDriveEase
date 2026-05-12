import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  Menu,
  X,
  User,
  LogOut,
  Car,
  LayoutDashboard,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isDriverArea = user?.role === 'driver' || location.pathname.startsWith('/driver');

  // USER / DRIVER BASED ROUTES
  const navLinks = isDriverArea
    ? [
      ]
    : [
        {
          to: '/',
          label: 'Home',
        },
        {
          to: '/drivers',
          label: 'Our Drivers',
        },
        {
          to: '/plans',
          label: 'Pricing',
        },
        {
          to: '/insurance',
          label: 'Coverage',
        },
        {
          to: '/payment',
          label: 'Payments',
        },
        {
          to: user ? '/my-rides' : '/login',
          label: 'My Trips',
        },
      ];



  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 bg-[#0b1220]/95 backdrop-blur border-b border-[#1f2937]"
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8 h-[74px] flex items-center justify-between">

        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <div className="w-11 h-11 rounded-2xl bg-green-500 flex items-center justify-center shadow-lg">
            <Car className="text-black" size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-white">
              Drive<span className="text-green-400">Ease</span>
            </h1>

            <p className="text-[10px] text-gray-400 -mt-1">
              Trusted Driver Service
            </p>
          </div>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive =
              location.pathname === link.to;

            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative text-[15px] font-semibold transition-all duration-300 ${
                  isActive
                    ? 'text-green-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.label}

                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute left-0 -bottom-2 w-full h-[3px] bg-green-400 rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="hidden lg:flex items-center gap-4">

          {user ? (
            <>
              {/* DRIVER DASHBOARD */}
              {user?.role === 'driver' && (
                <Link
                  to="/driver/dashboard"
                  className="px-5 py-2.5 rounded-2xl bg-green-500 text-black font-bold hover:bg-green-400 transition flex items-center gap-2"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
              )}

              {/* PROFILE */}
              <Link
                to={
                  user?.role === 'driver'
                    ? '/driver/profile'
                    : '/profile'
                }
                className="px-5 py-2.5 rounded-2xl bg-[#182235] border border-[#243041] text-white font-semibold hover:border-green-400 hover:text-green-400 transition flex items-center gap-2"
              >
                <User size={18} />

                {user?.role === 'driver'
                  ? 'Driver Profile'
                  : 'Profile'}
              </Link>

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 rounded-2xl border border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition font-semibold flex items-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-300 hover:text-white font-semibold transition"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="px-6 py-2.5 rounded-2xl bg-green-500 text-black font-bold hover:bg-green-400 transition shadow-lg"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-white"
        >
          {open ? (
            <X size={30} />
          ) : (
            <Menu size={30} />
          )}
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="lg:hidden bg-[#0b1220] border-t border-[#1f2937]"
          >
            <div className="px-5 py-5 flex flex-col gap-4">

              {navLinks.map((link) => {
                const isActive =
                  location.pathname === link.to;

                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={`px-4 py-3 rounded-xl font-semibold transition ${
                      isActive
                        ? 'bg-green-500 text-black'
                        : 'text-gray-300 hover:bg-[#182235] hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className="border-t border-[#1f2937] pt-4 flex flex-col gap-4">

                {user ? (
                  <>
                    {user?.role === 'driver' && (
                      <Link
                        to="/driver/dashboard"
                        onClick={() => setOpen(false)}
                        className="px-4 py-3 rounded-xl bg-green-500 text-black font-bold text-center"
                      >
                        Driver Dashboard
                      </Link>
                    )}

                    <Link
                      to={
                        user?.role === 'driver'
                          ? '/driver/profile'
                          : '/profile'
                      }
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 rounded-xl bg-[#182235] text-white font-semibold text-center"
                    >
                      {user?.role === 'driver'
                        ? 'Driver Profile'
                        : 'Profile'}
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="px-4 py-3 rounded-xl border border-red-500 text-red-400 font-semibold"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 rounded-xl bg-[#182235] text-white text-center font-semibold"
                    >
                      Login
                    </Link>

                    <Link
                      to="/signup"
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 rounded-xl bg-green-500 text-black text-center font-bold"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;