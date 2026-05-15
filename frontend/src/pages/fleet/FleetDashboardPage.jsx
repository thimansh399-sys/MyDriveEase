import { useEffect, useState } from 'react';
<<<<<<< HEAD
import { Link } from 'react-router-dom';
import { BriefcaseBusiness, Car, CheckCircle2, Clock3, Gauge, MapPin, Navigation } from 'lucide-react';
import api from '../../utils/api';

const StatCard = ({ icon: Icon, label, value, tone = 'text-white' }) => (
  <div className="rounded-3xl border border-slate-700/70 bg-[#111827] p-6 shadow-xl shadow-black/10">
    <div className="mb-4 flex items-center justify-between gap-3">
      <p className="text-sm text-slate-400">{label}</p>
      <Icon size={22} className={tone} />
    </div>
    <p className={`text-5xl font-black ${tone}`}>{value}</p>
  </div>
);

const BookingPreview = ({ booking }) => (
  <div className="rounded-3xl border border-slate-700/70 bg-slate-950/40 p-5">
    <div className="mb-4 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="truncate text-lg font-black text-white">{booking.pickup?.address}</p>
        <p className="mt-2 truncate text-sm text-slate-400">To {booking.drop?.address}</p>
      </div>
      <span className="shrink-0 rounded-full bg-green-500/15 px-3 py-1 text-sm font-bold text-green-300">
        Rs {booking.fare?.total || 0}
      </span>
    </div>
    <div className="flex flex-wrap gap-3 text-sm text-slate-300">
      <span className="inline-flex items-center gap-2">
        <MapPin size={15} className="text-green-300" />
        {booking.distance || 0} km
      </span>
      <span className="inline-flex items-center gap-2">
        <Navigation size={15} className="text-blue-300" />
        {booking.carType || booking.tripType || 'ride'}
      </span>
    </div>
  </div>
);

export default function FleetDashboardPage() {
  const [stats, setStats] = useState({
    available: 0,
    myBookings: 0,
    totalCabs: 0,
    availableCabs: 0,
    busyCabs: 0,
    offlineCabs: 0,
  });
  const [availableBookings, setAvailableBookings] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [availableRes, myRes, vehiclesRes] = await Promise.all([
        api.get('/bookings/fleet/available'),
        api.get('/bookings/fleet/my'),
        api.get('/fleet/vehicles'),
      ]);

      const vehicles = vehiclesRes.data.vehicles || [];
      const bookings = availableRes.data.bookings || [];
      const accepted = myRes.data.bookings || [];

      setAvailableBookings(bookings);
      setMyBookings(accepted);
      setStats({
        available: bookings.length,
        myBookings: accepted.length,
        totalCabs: vehicles.length,
        availableCabs: vehicles.filter((vehicle) => vehicle.status === 'available').length,
        busyCabs: vehicles.filter((vehicle) => vehicle.status === 'busy').length,
        offlineCabs: vehicles.filter((vehicle) => vehicle.status === 'offline').length,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const readiness = stats.totalCabs ? Math.round((stats.availableCabs / stats.totalCabs) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-green-400">Travel partner command center</p>
          <h1 className="text-4xl font-black text-white">Dashboard</h1>
          <p className="mt-2 max-w-2xl text-slate-400">
            Watch live demand, keep cabs ready, and accept the best requests before they go cold.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/fleet/bookings" className="rounded-2xl bg-green-500 px-5 py-3 font-black text-black hover:bg-green-400">
            Accept Leads
          </Link>
          <Link to="/fleet/vehicles" className="rounded-2xl border border-slate-600 bg-slate-900 px-5 py-3 font-bold text-white hover:border-green-400">
            Update Cabs
          </Link>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={BriefcaseBusiness} label="Available Bookings" value={loading ? '...' : stats.available} tone="text-green-400" />
        <StatCard icon={CheckCircle2} label="My Accepted Rides" value={loading ? '...' : stats.myBookings} tone="text-blue-400" />
        <StatCard icon={Car} label="Total Cabs" value={loading ? '...' : stats.totalCabs} />
        <StatCard icon={Gauge} label="Readiness" value={loading ? '...' : `${readiness}%`} tone="text-amber-300" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-slate-700/70 bg-[#111827] p-6 shadow-2xl shadow-black/10">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-white">Hot booking requests</h2>
              <p className="mt-1 text-sm text-slate-400">Newest matching customer requests from your available cab inventory.</p>
            </div>
            <Link to="/fleet/bookings" className="text-sm font-bold text-green-300 hover:text-green-200">View all</Link>
          </div>

          <div className="space-y-4">
            {availableBookings.slice(0, 3).map((booking) => (
              <BookingPreview key={booking._id} booking={booking} />
            ))}
            {availableBookings.length === 0 && (
              <div className="rounded-3xl border border-dashed border-slate-600 bg-slate-950/40 p-8 text-center text-slate-300">
                No matching requests right now. Keep at least one cab available.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-700/70 bg-[#111827] p-6 shadow-2xl shadow-black/10">
          <div className="mb-5">
            <h2 className="text-2xl font-black text-white">Fleet readiness</h2>
            <p className="mt-1 text-sm text-slate-400">Availability affects how many booking requests you receive.</p>
          </div>

          <div className="mb-6">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-slate-300">Available cab ratio</span>
              <span className="font-bold text-white">{stats.availableCabs}/{stats.totalCabs}</span>
            </div>
            <div className="h-3 rounded-full bg-slate-800">
              <div className="h-3 rounded-full bg-green-500" style={{ width: `${readiness}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl bg-green-500/10 p-4">
              <p className="text-3xl font-black text-green-300">{stats.availableCabs}</p>
              <p className="mt-1 text-xs text-slate-400">Available</p>
            </div>
            <div className="rounded-2xl bg-amber-500/10 p-4">
              <p className="text-3xl font-black text-amber-200">{stats.busyCabs}</p>
              <p className="mt-1 text-xs text-slate-400">Busy</p>
            </div>
            <div className="rounded-2xl bg-slate-500/10 p-4">
              <p className="text-3xl font-black text-slate-200">{stats.offlineCabs}</p>
              <p className="mt-1 text-xs text-slate-400">Offline</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-5">
            <div className="flex items-start gap-3">
              <Clock3 className="mt-1 text-blue-300" />
              <div>
                <p className="font-black text-white">Next best action</p>
                <p className="mt-1 text-sm text-slate-300">
                  {stats.availableCabs === 0
                    ? 'Mark a cab available so new requests can appear.'
                    : stats.available > 0
                    ? 'Accept the newest request while customer intent is fresh.'
                    : 'Keep cab status fresh and wait for matching requests.'}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-3xl border border-slate-700/70 bg-[#111827] p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-black text-white">Accepted ride queue</h2>
          <Link to="/fleet/my-bookings" className="text-sm font-bold text-blue-300 hover:text-blue-200">Open queue</Link>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {myBookings.slice(0, 2).map((booking) => (
            <BookingPreview key={booking._id} booking={booking} />
          ))}
          {myBookings.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-600 bg-slate-950/40 p-8 text-center text-slate-300 xl:col-span-2">
              No accepted rides yet.
            </div>
          )}
        </div>
      </section>
=======
import api from '../../utils/api';

export default function FleetDashboardPage() {

  const [stats, setStats] = useState({
    available: 0,
    myBookings: 0,
  });

  useEffect(() => {

    fetchDashboard();

  }, []);

  const fetchDashboard = async () => {

    try {

      const availableRes = await api.get(
        '/bookings/fleet/available'
      );

      const myRes = await api.get(
        '/bookings/fleet/my'
      );

      setStats({
        available: availableRes.data.bookings.length,
        myBookings: myRes.data.bookings.length,
      });

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>

      <h1 className="text-4xl font-bold mb-8">
        Travel Partner Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-5">

        <div className="bg-[#111827] p-6 rounded-3xl">
          <h2 className="text-gray-400">
            Available Bookings
          </h2>

          <p className="text-5xl font-bold mt-4 text-green-400">
            {stats.available}
          </p>
        </div>

        <div className="bg-[#111827] p-6 rounded-3xl">
          <h2 className="text-gray-400">
            My Accepted Rides
          </h2>

          <p className="text-5xl font-bold mt-4 text-blue-400">
            {stats.myBookings}
          </p>
        </div>

      </div>

>>>>>>> 75a1a7472bf64f17c60a8dbc480344b8287f1640
    </div>
  );
}
