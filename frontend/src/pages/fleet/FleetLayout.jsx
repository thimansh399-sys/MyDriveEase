import { Outlet, Link, useLocation } from 'react-router-dom';

export default function FleetLayout() {

  const location = useLocation();

  const navItems = [
    {
      label: 'Dashboard',
      path: '/fleet/dashboard',
    },
    {
      label: 'Available Bookings',
      path: '/fleet/bookings',
    },
    {
      label: 'My Cabs',
      path: '/fleet/vehicles',
    },
    {
      label: 'My Bookings',
      path: '/fleet/my-bookings',
    },
    {
      label: 'Profile',
      path: '/fleet/profile',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b1220] text-white flex">

      <div className="w-[260px] bg-[#111827] border-r border-[#1f2937] p-5">

        <h1 className="text-3xl font-bold text-green-400 mb-10">
          Travel Partner Panel
        </h1>

        <div className="flex flex-col gap-4">

          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-3 rounded-xl transition ${
                location.pathname === item.path
                  ? 'bg-green-500 text-black font-bold'
                  : 'bg-[#1f2937] hover:bg-[#374151]'
              }`}
            >
              {item.label}
            </Link>
          ))}

        </div>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <Outlet />
      </div>

    </div>
  );
}
