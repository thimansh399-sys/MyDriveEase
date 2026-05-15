import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import { Car, LayoutDashboard, Receipt, User, Truck } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', to: 'dashboard', icon: LayoutDashboard },
  { label: 'Bookings', to: 'bookings', icon: Receipt },
  { label: 'My Bookings', to: 'my-bookings', icon: Truck },
  { label: 'Profile', to: 'profile', icon: User },
];

export default function FleetLayout() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    // If user loads but is missing role, protect route will redirect
    // Still safe to noop here.
    if (!loading && !user) navigate('/fleet/login');
  }, [loading, user, navigate]);

  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-black">Fleet Partner</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="rounded-3xl border border-white/10 bg-white/5 p-3">
            <div className="space-y-2">
              {navItems.map(({ label, to, icon: Icon }) => (
                <button
                  key={to}
                  type="button"
                  onClick={() => navigate(`/fleet/${to}`)}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold hover:bg-white/10"
                >
                  <Icon size={18} className="text-green-400" />
                  {label}
                </button>
              ))}
            </div>
          </aside>

          <main className="rounded-3xl border border-white/10 bg-white/5 p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

