import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

import {
  Menu,
  X,
  User,
  UserPlus,
  LogOut,
  Car,
  LayoutDashboard,
  ChevronDown,
  Truck,
  LogIn,
  ShieldCheck,
  Sparkles,
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

  const mobileAccessCards = [
    {
      title: 'Customer',
      subtitle: 'Book and track trusted drivers',
      icon: User,
      tone: 'green',
      loginTo: '/login',
      signupTo: '/signup',
    },
    {
      title: 'Driver',
      subtitle: 'Accept rides and manage earnings',
      icon: ShieldCheck,
      tone: 'slate',
      loginTo: '/driver/login',
      signupTo: '/signup?role=driver',
    },
    {
      title: 'Travel Partner',
      subtitle: 'Manage cabs, leads, and bookings',
      icon: Truck,
      tone: 'blue',
      loginTo: '/fleet/login',
      signupTo: '/fleet/signup',
    },
  ];

  const mobileCardTone = {
    green: {
      icon: 'bg-green-400 text-slate-950',
      signup: 'bg-green-400 text-slate-950 hover:bg-green-300',
      border: 'border-green-400/25',
    },
    blue: {
      icon: 'bg-blue-500 text-white',
      signup: 'bg-blue-500 text-white hover:bg-blue-400',
      border: 'border-blue-400/25',
    },
    slate: {
      icon: 'bg-slate-700 text-white',
      signup: 'bg-white text-slate-950 hover:bg-slate-200',
      border: 'border-white/10',
    },
  };

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
            className="lg:hidden border-t border-white/10 bg-[#07111f]/98 shadow-2xl shadow-black/40 backdrop-blur-xl"
          >
            <div className="max-h-[calc(100vh-74px)] overflow-y-auto px-4 py-5 pb-28">
              <div className="mb-5 rounded-[24px] border border-green-400/20 bg-gradient-to-br from-green-400/14 via-slate-900 to-blue-500/10 p-4">
                <div className="flex items-start gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-green-400 text-slate-950 shadow-lg shadow-green-500/20">
                    <Sparkles size={21} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-white">
                      DriveEase access
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-300">
                      Book rides, join as a driver, or manage travel partner leads from one clean panel.
                    </p>
                  </div>
                </div>
              </div>

              {navLinks.length > 0 && (
                <div className="mb-5 grid grid-cols-2 gap-2">
                  {navLinks.slice(0, 4).map((link) => {
                    const isActive =
                      location.pathname === link.to;

                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() =>
                          setOpen(false)
                        }
                        className={`min-h-11 rounded-2xl px-3 py-3 text-center text-sm font-bold transition ${
                          isActive
                            ? 'bg-green-400 text-slate-950'
                            : 'border border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/10'
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              )}

              <div className="space-y-3">
                {user ? (
                  <>
                    {user?.role ===
                      'driver' && (
                      <Link
                        to="/driver/dashboard"
                        onClick={() =>
                          setOpen(false)
                        }
                        className="flex items-center justify-center gap-2 rounded-2xl bg-green-400 px-4 py-4 text-sm font-black text-slate-950"
                      >
                        <LayoutDashboard size={18} />
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
                        className="flex items-center justify-center gap-2 rounded-2xl bg-blue-500 px-4 py-4 text-sm font-black text-white"
                      >
                        <Truck size={18} />
                        Travel Partner Dashboard

                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-4 text-sm font-bold text-red-200"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    {mobileAccessCards.map((card) => {
                      const Icon = card.icon;
                      const tone = mobileCardTone[card.tone];

                      return (
                        <div
                          key={card.title}
                          className={`rounded-[24px] border ${tone.border} bg-white/[0.045] p-3 shadow-xl shadow-black/10`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${tone.icon}`}>
                              <Icon size={22} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="font-black text-white">
                                {card.title}
                              </p>
                              <p className="mt-0.5 text-xs leading-5 text-slate-400">
                                {card.subtitle}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <Link
                              to={card.loginTo}
                              onClick={() =>
                                setOpen(false)
                              }
                              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-950/40 px-3 text-sm font-bold text-slate-100 transition hover:bg-white/10"
                            >
                              <LogIn size={16} />
                              Login
                            </Link>

                            <Link
                              to={card.signupTo}
                              onClick={() =>
                                setOpen(false)
                              }
                              className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-3 text-sm font-black transition ${tone.signup}`}
                            >
                              <UserPlus size={16} />
                              Signup
                            </Link>
                          </div>
                        </div>
                      );
                    })}
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
