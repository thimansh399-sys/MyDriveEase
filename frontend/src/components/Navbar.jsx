import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/drivers', label: 'Our Drivers' },
    { to: '/plans', label: 'Pricing' },
    { to: '/insurance', label: 'Coverage' },
    { to: '/payment', label: 'Payments' },
    { to: user ? '/my-rides' : '/login', label: 'My Trips' },
  ];

  return (
    <motion.nav
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 backdrop-blur bg-[#0f172a]/90 border-b border-gray-700"
    >
      <div className="w-full px-6 lg:px-16 h-16 flex items-center justify-between text-white">

        {/* LEFT - LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🚗</span>
          <span className="text-xl font-extrabold text-green-400">DriveEase</span>
        </Link>

        {/* CENTER - NAV LINKS */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-semibold transition ${
                  isActive
                    ? 'text-green-400 border-b-2 border-green-400 pb-1'
                    : 'text-gray-300 hover:text-green-400'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* RIGHT - ACTIONS */}
        <div className="hidden md:flex items-center gap-4">

          {user ? (
            <>
              <Link
                to="/profile"
                className="px-4 py-1.5 rounded-full bg-gray-200 text-black text-sm font-semibold"
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-1.5 rounded-full border border-red-500 text-red-400 hover:bg-red-500 hover:text-white text-sm"
              >
                Logout
              </button>

              <Link
                to="/book"
                className="px-5 py-2 rounded-full bg-green-500 text-black font-bold hover:bg-green-400"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-300 hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2 rounded-full bg-green-500 text-black font-bold hover:bg-green-400"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden px-6 pb-4 space-y-3 bg-[#0f172a] text-white">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="block text-sm text-gray-300 hover:text-green-400"
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <>
              <Link to="/profile" className="block">Profile</Link>
              <button onClick={handleLogout} className="block text-red-400">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;