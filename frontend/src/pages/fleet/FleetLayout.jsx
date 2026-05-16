import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Car, LayoutDashboard, LogOut, Receipt, Truck, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { label: 'Dashboard', to: '/fleet/dashboard', icon: LayoutDashboard },
  { label: 'Leads', to: '/fleet/bookings', icon: Receipt },
  { label: 'My Rides', to: '/fleet/my-bookings', icon: Truck },
  { label: 'Cabs', to: '/fleet/vehicles', icon: Car },
  { label: 'Profile', to: '/fleet/profile', icon: User },
];

export default function FleetLayout() {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) navigate('/fleet/login');
  }, [loading, user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/fleet/login');
  };

  return (
    <div className="fleet-theme min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-[calc(100vh-76px)] flex-col lg:flex-row">
        <aside className="border-b border-slate-800 bg-slate-900/95 px-4 py-4 lg:sticky lg:top-[76px] lg:h-[calc(100vh-76px)] lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:px-5">
          <div className="flex items-center gap-3 lg:mb-8">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-emerald-500 text-slate-950">
              <Car size={22} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xl font-black leading-none">
                Drive<span className="text-emerald-400">Ease</span>
              </p>
              <p className="mt-1 hidden text-xs font-semibold text-slate-400 lg:block">Travel Partner Console</p>
            </div>
          </div>

          <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:mt-0 lg:flex-col lg:overflow-visible lg:pb-0">
            {navItems.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `inline-flex h-11 shrink-0 items-center gap-3 rounded-lg px-4 text-sm font-extrabold transition lg:w-full ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                      : 'border border-slate-700 bg-slate-800 text-slate-200 hover:border-emerald-400'
                  }`
                }
              >
                <Icon size={17} />
                {label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-11 shrink-0 items-center gap-3 rounded-lg border border-rose-500/50 px-4 text-sm font-extrabold text-rose-200 hover:bg-rose-500/10 lg:mt-2 lg:w-full"
            >
              <LogOut size={17} />
              Logout
            </button>
          </nav>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 lg:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
