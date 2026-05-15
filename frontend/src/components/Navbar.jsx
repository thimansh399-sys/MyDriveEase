import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

import {
  Menu,
  X,
  User,
  LogOut,
  Car,
  LayoutDashboard,
  ChevronDown,
  Truck,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const authMenuRef = useRef(null);

  // LOGIN DROPDOWNS
  const [showLoginOptions, setShowLoginOptions] =
    useState(false);

  const [showSignupOptions, setShowSignupOptions] =
    useState(false);

  const [showPartnerOptions, setShowPartnerOptions] =
    useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeAuthMenus = () => {
    setShowLoginOptions(false);
    setShowSignupOptions(false);
    setShowPartnerOptions(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        authMenuRef.current &&
        !authMenuRef.current.contains(event.target)
      ) {
        closeAuthMenus();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeAuthMenus();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const isDriverArea =
    user?.role === 'driver' ||
    location.pathname.startsWith('/driver');

  const isFleetArea =
    user?.role === 'fleet' ||
    location.pathname.startsWith('/fleet');

  // =========================
  // NAV LINKS
  // =========================

  const navLinks =
    isDriverArea || isFleetArea
      ? []
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
              Drive
              <span className="text-green-400">
                Ease
              </span>
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
        <div
          ref={authMenuRef}
          className="hidden lg:flex items-center gap-4"
        >
          {user ? (
            <>
              {/* DRIVER DASHBOARD */}
              {user?.role === 'driver' && (
                <Link
                  to="/driver/dashboard"
                  className="px-5 py-2.5 rounded-2xl bg-green-500 text-black font-bold hover:bg-green-400 transition flex items-center gap-2"
                >
                  <LayoutDashboard size={18} />
                  Driver Dashboard
                </Link>
              )}

              {/* FLEET DASHBOARD */}
              {user?.role === 'fleet' && (
                <Link
                  to="/fleet/dashboard"
                  className="px-5 py-2.5 rounded-2xl bg-blue-500 text-white font-bold hover:bg-blue-400 transition flex items-center gap-2"
                >
                  <Truck size={18} />
                  Travel Partner Dashboard
                </Link>
              )}

              {/* PROFILE */}
              <Link
                to={
                  user?.role === 'driver'
                    ? '/driver/profile'
                    : user?.role === 'fleet'
                    ? '/fleet/profile'
                    : '/profile'
                }
                className="px-5 py-2.5 rounded-2xl bg-[#182235] border border-[#243041] text-white font-semibold hover:border-green-400 hover:text-green-400 transition flex items-center gap-2"
              >
                <User size={18} />

                {user?.role === 'driver'
                  ? 'Driver Profile'
                  : user?.role === 'fleet'
                  ? 'Travel Partner Profile'
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
              {/* LOGIN DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowLoginOptions(
                      !showLoginOptions
                    );
                    setShowSignupOptions(false);
                    setShowPartnerOptions(false);
                  }}
                  className="flex items-center gap-2 text-gray-300 hover:text-white font-semibold transition"
                >
                  Login
                  <ChevronDown size={16} />
                </button>

                <AnimatePresence>
                  {showLoginOptions && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: 10,
                      }}
                      className="absolute right-0 mt-4 w-56 bg-[#111827] border border-[#1f2937] rounded-2xl shadow-2xl overflow-hidden"
                    >
                      <Link
                        to="/login"
                        className="block px-5 py-4 text-white hover:bg-[#1f2937] transition"
                        onClick={() =>
                          setShowLoginOptions(
                            false
                          )
                        }
                      >
                        Customer Login
                      </Link>

                      <Link
                        to="/driver/login"
                        className="block px-5 py-4 text-white hover:bg-[#1f2937] transition"
                        onClick={() =>
                          setShowLoginOptions(
                            false
                          )
                        }
                      >
                        Driver Login
                      </Link>

                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* SIGNUP DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowSignupOptions(
                      !showSignupOptions
                    );
                    setShowLoginOptions(false);
                    setShowPartnerOptions(false);
                  }}
                  className="px-6 py-2.5 rounded-2xl bg-green-500 text-black font-bold hover:bg-green-400 transition shadow-lg flex items-center gap-2"
                >
                  Sign Up
                  <ChevronDown size={16} />
                </button>

                <AnimatePresence>
                  {showSignupOptions && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: 10,
                      }}
                      className="absolute right-0 mt-4 w-56 bg-[#111827] border border-[#1f2937] rounded-2xl shadow-2xl overflow-hidden"
                    >
                      <Link
                        to="/signup"
                        className="block px-5 py-4 text-white hover:bg-[#1f2937] transition"
                        onClick={() =>
                          setShowSignupOptions(
                            false
                          )
                        }
                      >
                        Customer Signup
                      </Link>

                      <Link
                        to="/signup?role=driver"
                        className="block px-5 py-4 text-white hover:bg-[#1f2937] transition"
                        onClick={() =>
                          setShowSignupOptions(
                            false
                          )
                        }
                      >
                        Driver Signup
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* TRAVEL PARTNER DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowPartnerOptions(
                      !showPartnerOptions
                    );
                    setShowLoginOptions(false);
                    setShowSignupOptions(false);
                  }}
                  className="px-5 py-2.5 rounded-2xl border border-blue-400/40 text-blue-200 font-bold hover:border-blue-300 hover:text-white hover:bg-blue-500/10 transition flex items-center gap-2"
                >
                  <Truck size={18} />
                  Travel Partner
                  <ChevronDown size={16} />
                </button>

                <AnimatePresence>
                  {showPartnerOptions && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: 10,
                      }}
                      className="absolute right-0 mt-4 w-60 bg-[#111827] border border-[#1f2937] rounded-2xl shadow-2xl overflow-hidden"
                    >
                      <Link
                        to="/fleet/login"
                        className="block px-5 py-4 text-white hover:bg-[#1f2937] transition"
                        onClick={() =>
                          setShowPartnerOptions(
                            false
                          )
                        }
                      >
                        Travel Partner Login
                      </Link>

                      <Link
                        to="/fleet/signup"
                        className="block px-5 py-4 text-white hover:bg-[#1f2937] transition"
                        onClick={() =>
                          setShowPartnerOptions(
                            false
                          )
                        }
                      >
                        Travel Partner Signup
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
            initial={{
              opacity: 0,
              y: -15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -15,
            }}
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
                    onClick={() =>
                      setOpen(false)
                    }
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
                    {user?.role ===
                      'driver' && (
                      <Link
                        to="/driver/dashboard"
                        onClick={() =>
                          setOpen(false)
                        }
                        className="px-4 py-3 rounded-xl bg-green-500 text-black font-bold text-center"
                      >
                        Driver Dashboard
                      </Link>
                    )}

                    {user?.role ===
                      'fleet' && (
                      <Link
                        to="/fleet/dashboard"
                        onClick={() =>
                          setOpen(false)
                        }
                        className="px-4 py-3 rounded-xl bg-blue-500 text-white font-bold text-center"
                      >
                        Travel Partner Dashboard

                      </Link>
                    )}

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
                      onClick={() =>
                        setOpen(false)
                      }
                      className="px-4 py-3 rounded-xl bg-[#182235] text-white text-center font-semibold"
                    >
                      Customer Login
                    </Link>

                    <Link
                      to="/driver/login"
                      onClick={() =>
                        setOpen(false)
                      }
                      className="px-4 py-3 rounded-xl bg-[#182235] text-white text-center font-semibold"
                    >
                      Driver Login
                    </Link>

                    <Link
                      to="/fleet/login"
                      onClick={() =>
                        setOpen(false)
                      }
                      className="px-4 py-3 rounded-xl border border-blue-400/40 text-blue-200 text-center font-bold"
                    >
                        Travel Partner Login
                    </Link>

                    <Link
                      to="/signup"
                      onClick={() =>
                        setOpen(false)
                      }
                      className="px-4 py-3 rounded-xl bg-green-500 text-black text-center font-bold"
                    >
                      Customer Signup
                    </Link>

                    <Link
                      to="/signup?role=driver"
                      onClick={() =>
                        setOpen(false)
                      }
                      className="px-4 py-3 rounded-xl bg-[#182235] text-white text-center font-semibold"
                    >
                      Driver Signup
                    </Link>

                    <Link
                      to="/fleet/signup"
                      onClick={() =>
                        setOpen(false)
                      }
                      className="px-4 py-3 rounded-xl bg-blue-500 text-white text-center font-bold"
                    >
                        Travel Partner Signup
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
