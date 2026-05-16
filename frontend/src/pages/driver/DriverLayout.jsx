import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Car, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/driver/dashboard', label: 'Dashboard' },
  { to: '/driver/ride-requests', label: 'Ride Requests' },
  { to: '/driver/my-rides', label: 'My Rides' },
  { to: '/driver/earnings', label: 'Earnings' },
  { to: '/driver/profile', label: 'Profile' },

];


export default function DriverLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activePath = location.pathname;

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const content = useMemo(() => {
    return (
      <div className="flex min-h-[calc(100vh-76px)] bg-slate-950">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:flex-col w-72 fixed left-0 top-[76px] h-[calc(100vh-76px)] bg-slate-900 border-r border-green-400/20">
          <div className="h-16 flex items-center px-6 border-b border-green-400/10">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-500 text-slate-950">
                <Car size={21} />
              </span>
              <div>
                <div className="text-white font-extrabold leading-none">DriveEase</div>
                <div className="text-xs text-green-400 font-semibold">Driver Console</div>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 py-5 space-y-2">
            {navItems.map((item) => {
              const isActive = activePath === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition border ${
                    isActive
                      ? 'bg-green-400/15 border-green-400 text-green-300'
                      : 'bg-transparent border-transparent text-gray-200 hover:border-green-400/20 hover:bg-green-400/5'
                  }`}
                  title={item.label}
                >
                  <span className="text-sm font-bold">{item.label}</span>
                  <ChevronRight size={16} className={isActive ? 'text-green-300' : 'text-gray-400'} />
                </Link>
              );
            })}

            <button
              onClick={handleLogout}
              className="w-full mt-4 px-4 py-3 rounded-xl border border-red-500/40 text-red-200 hover:bg-red-500/10 transition"
            >
              Logout
            </button>
          </nav>
        </aside>

        {/* Mobile sidebar overlay */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-40">
            <button
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute left-0 top-0 w-80 h-full bg-[#0f172a] border-r border-green-400/20 overflow-auto">
              <div className="h-16 flex items-center px-6 border-b border-green-400/10">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-500 text-slate-950">
                    <Car size={21} />
                  </span>
                  <div>
                    <div className="text-white font-extrabold leading-none">DriveEase</div>
                    <div className="text-xs text-green-400 font-semibold">Driver Console</div>
                  </div>
                </div>
              </div>
              <nav className="px-4 py-5 space-y-2">
                {navItems.map((item) => {
                  const isActive = activePath === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className={`block px-4 py-3 rounded-xl transition border ${
                        isActive
                          ? 'bg-green-400/15 border-green-400 text-green-300'
                          : 'bg-transparent border-transparent text-gray-200 hover:border-green-400/20 hover:bg-green-400/5'
                      }`}
                    >
                      <span className="text-sm font-bold">{item.label}</span>
                    </Link>
                  );
                })}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="w-full mt-4 px-4 py-3 rounded-xl border border-red-500/40 text-red-200 hover:bg-red-500/10 transition"
                >
                  Logout
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Main */}
        <div className="flex-1 md:ml-72">
          {/* Topbar */}
          <header className="md:hidden sticky top-0 z-30 bg-[#0f172a] border-b border-green-400/20 px-4 h-16 flex items-center justify-between text-white">
            <button
              className="text-2xl"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Open menu"
            >
              Menu
            </button>
            <div className="text-sm font-bold text-green-300">Driver</div>
            <button
              onClick={handleLogout}
              className="text-sm border border-red-500/40 text-red-200 px-3 py-1 rounded-xl"
            >
              Logout
            </button>
          </header>

          <main className="px-3 md:px-8 py-6">
            <Outlet />
          </main>
        </div>
      </div>
    );
  }, [activePath, mobileOpen, logout, user]);

  return content;
}

