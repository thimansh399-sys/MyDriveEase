import { Link, useLocation } from 'react-router-dom';
import { CalendarCheck, Car, Home, LayoutDashboard, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MobileAppNav() {
  const { user } = useAuth();
  const location = useLocation();

  const items =
    user?.role === 'driver'
      ? [
          { to: '/driver/dashboard', label: 'Home', icon: LayoutDashboard },
          { to: '/driver/ride-requests', label: 'Requests', icon: Car },
          { to: '/driver/my-rides', label: 'Rides', icon: CalendarCheck },
          { to: '/driver/profile', label: 'Profile', icon: UserRound },
        ]
      : user?.role === 'fleet'
      ? [
          { to: '/fleet/dashboard', label: 'Home', icon: LayoutDashboard },
          { to: '/fleet/bookings', label: 'Leads', icon: CalendarCheck },
          { to: '/fleet/vehicles', label: 'Cabs', icon: Car },
          { to: '/fleet/profile', label: 'Profile', icon: UserRound },
        ]
      : [
          { to: '/', label: 'Home', icon: Home },
          { to: '/book', label: 'Book', icon: Car },
          { to: '/my-rides', label: 'Trips', icon: CalendarCheck },
          { to: '/profile', label: 'Profile', icon: UserRound },
        ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#07111f]/95 px-3 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2 shadow-[0_-12px_36px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        {items.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className={`flex min-h-[58px] flex-col items-center justify-center rounded-2xl text-[11px] font-bold transition ${
                active ? 'bg-green-500 text-slate-950' : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="mt-1">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
