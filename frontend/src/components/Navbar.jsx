import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import DarkModeToggle from './DarkModeToggle';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      className="bg-gradient-to-r from-[#101924] to-[#18222f] shadow-md sticky top-0 z-50 border-b border-border text-white"
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl text-primary">🚗</span>
          <span className="text-2xl font-extrabold text-primary tracking-tight">DriveEase</span>
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Top bar navigation buttons */}
          {user && user.role === 'driver' ? (
            <>
              <NavButton to="/driver/dashboard" label="Dashboard" />
              <NavButton to="/driver/rides" label="Ride History" />
              <Link
                to="/profile"
                className="ml-2 px-4 py-2 rounded-2xl text-sm font-bold bg-blue-100 border border-blue-400 text-blue-700 hover:bg-blue-200 transition-colors flex items-center gap-2 shadow"
              >
                <span role="img" aria-label="profile">👤</span> Profile
              </Link>
              <button
                onClick={handleLogout}
                className="ml-2 px-4 py-2 rounded-2xl text-sm font-bold bg-transparent border border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavButton to="/" label="Home" />
              <NavButton to="/drivers" label="Drivers" />
              <NavButton to="/plans" label="Plans" />
              <NavButton to="/insurance" label="Insurance" />
              <NavButton to="/payment" label="Pay" />
              <NavButton to={user ? '/my-rides' : '/login'} label="My Bookings" />
              {/* Auth buttons */}
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="ml-2 px-4 py-2 rounded-2xl text-sm font-bold bg-blue-100 border border-blue-400 text-blue-700 hover:bg-blue-200 transition-colors flex items-center gap-2 shadow"
                  >
                    <span role="img" aria-label="profile">👤</span> Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="ml-2 px-4 py-2 rounded-2xl text-sm font-bold bg-transparent border border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                  >
                    Logout
                  </button>
                  <Link
                    to="/book"
                    className="ml-2 px-4 py-2 rounded-2xl text-sm font-extrabold bg-primary text-black hover:bg-green-400 transition-colors flex items-center gap-2 shadow"
                  >
                    <span role="img" aria-label="car">🚕</span> Book a Driver
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="ml-2 px-4 py-2 rounded-2xl text-sm font-extrabold bg-transparent border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="ml-2 px-4 py-2 rounded-2xl text-sm font-extrabold bg-primary text-black hover:bg-green-400 transition-colors shadow"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

// Navigation button with active state
import { useLocation } from 'react-router-dom';
function NavButton({ to, label, disabled }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
        isActive
          ? 'bg-primary text-[#0a1019] shadow-md'
          : 'text-primary hover:bg-primary/20'
      } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      tabIndex={disabled ? -1 : 0}
    >
      {label}
    </Link>
  );
}

export default Navbar;
