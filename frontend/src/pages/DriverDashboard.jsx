import { useEffect, useMemo, useState } from 'react';
import { Bell, Car, CheckCircle2, Clock3, IndianRupee, MapPin, Navigation, Phone, Power, ShieldCheck, Star, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const money = (value = 0) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`;

export default function DriverDashboard() {
  const { user, updateUser } = useAuth();
  const [status, setStatus] = useState(user?.status || 'offline');
  const [driverData, setDriverData] = useState({});
  const [availableRides, setAvailableRides] = useState([]);
  const [myRides, setMyRides] = useState([]);
  const [activeRide, setActiveRide] = useState(null);
  const [loading, setLoading] = useState(true);

  const stats = useMemo(() => {
    const completed = myRides.filter((ride) => ride.status === 'completed');
    return {
      total: myRides.length || driverData?.totalRides || 0,
      completed: completed.length,
      earnings: driverData?.earnings || completed.reduce((sum, ride) => sum + Number(ride.fare?.total || 0), 0),
      rating: driverData?.rating || 5,
    };
  }, [driverData, myRides]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [driverRes, ridesRes, myRideRes] = await Promise.all([
        api.get('/drivers/profile'),
        api.get('/bookings/available'),
        api.get('/bookings/driver/my'),
      ]);

      const driver = driverRes.data || {};
      const assignedRides = myRideRes.data || [];
      setDriverData(driver);
      setStatus(driver.status || user?.status || 'offline');
      setAvailableRides(ridesRes.data || []);
      setMyRides(assignedRides);
      setActiveRide(assignedRides.find((ride) => ['accepted', 'in-progress'].includes(ride.status)) || null);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const toggleStatus = async () => {
    try {
      const res = await api.post('/drivers/toggle-status');
      setStatus(res.data.status);
      updateUser({ ...user, status: res.data.status });
    } catch (err) {
      console.log(err);
    }
  };

  const openRideNavigation = (ride) => {
    const pickup = ride?.pickup?.coordinates || [];
    const drop = ride?.drop?.coordinates || [];
    const hasCoords = pickup.length === 2 && drop.length === 2;
    const url = hasCoords
      ? `https://www.google.com/maps/dir/?api=1&origin=${pickup[1]},${pickup[0]}&destination=${drop[1]},${drop[0]}&travelmode=driving`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ride?.pickup?.address || '')}`;
    window.open(url, '_blank');
  };

  const acceptRide = async (id) => {
    try {
      const res = await api.post(`/bookings/${id}/accept`);
      setActiveRide(res.data);
      setAvailableRides((prev) => prev.filter((ride) => ride._id !== id));
      setStatus('on-ride');
    } catch (err) {
      console.log(err);
    }
  };

  const startRide = async () => {
    const res = await api.post(`/bookings/${activeRide._id}/start`);
    setActiveRide(res.data);
  };

  const completeRide = async () => {
    await api.post(`/bookings/${activeRide._id}/complete`);
    setActiveRide(null);
    setStatus('online');
    fetchDashboard();
  };

  if (loading) {
    return <div className="rounded-lg border border-slate-800 bg-slate-900 p-8 text-center font-bold text-slate-300">Loading driver dashboard...</div>;
  }

  return (
    <div className="space-y-6 text-white">
      <section className="rounded-lg border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/10">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-extrabold uppercase text-emerald-300">
                <ShieldCheck size={14} />
                Verified driver
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-extrabold uppercase text-slate-300">
                <MapPin size={14} />
                {driverData.city || 'Service city pending'}
              </span>
            </div>
            <h1 className="text-3xl font-black md:text-4xl">Welcome back, {driverData.name || user?.name || 'Driver'}</h1>
            <p className="mt-2 max-w-3xl text-sm font-semibold text-slate-400">
              Stay online to receive nearby rides, keep documents updated, and track today&apos;s earnings from one focused console.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-slate-950 p-4">
                <p className="text-xs font-bold uppercase text-slate-500">Next action</p>
                <p className="mt-2 font-black text-emerald-300">{activeRide ? 'Complete active ride' : status === 'online' ? 'Watch ride requests' : 'Go online'}</p>
              </div>
              <div className="rounded-lg bg-slate-950 p-4">
                <p className="text-xs font-bold uppercase text-slate-500">Open requests</p>
                <p className="mt-2 font-black text-white">{availableRides.length}</p>
              </div>
              <div className="rounded-lg bg-slate-950 p-4">
                <p className="text-xs font-bold uppercase text-slate-500">Profile health</p>
                <p className="mt-2 font-black text-white">{driverData.drivingLicenseNumber ? 'Ready' : 'Docs needed'}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-slate-500">Driver status</p>
                <p className="mt-2 text-2xl font-black capitalize">{status}</p>
              </div>
              <button className="grid h-11 w-11 place-items-center rounded-lg bg-slate-800">
                <Bell size={18} />
              </button>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={toggleStatus}
              className={`mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg text-sm font-black ${
                status === 'online' ? 'bg-emerald-500 text-slate-950' : status === 'on-ride' ? 'bg-amber-400 text-slate-950' : 'bg-rose-500 text-white'
              }`}
            >
              <Power size={18} />
              {status === 'online' ? 'ONLINE' : status === 'on-ride' ? 'ON RIDE' : 'GO ONLINE'}
            </motion.button>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: Wallet, label: 'Wallet', value: money(driverData.wallet), tone: 'text-emerald-300' },
          { icon: IndianRupee, label: 'Earnings', value: money(stats.earnings), tone: 'text-emerald-300' },
          { icon: Car, label: 'Total rides', value: stats.total, tone: 'text-white' },
          { icon: Star, label: 'Rating', value: stats.rating, tone: 'text-amber-200' },
        ].map(({ icon: Icon, label, value, tone }) => (
          <div key={label} className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
                <p className={`mt-3 text-3xl font-black ${tone}`}>{value}</p>
              </div>
              <span className="rounded-lg border border-slate-700 bg-slate-950 p-2 text-emerald-300"><Icon size={20} /></span>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black">Active ride</h2>
              <Clock3 className="text-emerald-300" size={20} />
            </div>
            {activeRide ? (
              <RideCard ride={activeRide} primaryLabel={activeRide.status === 'accepted' ? 'Start Ride' : 'Complete Ride'} onPrimary={activeRide.status === 'accepted' ? startRide : completeRide} onNavigate={() => openRideNavigation(activeRide)} />
            ) : (
              <div className="rounded-lg border border-dashed border-slate-700 bg-slate-950 p-8 text-center">
                <Car className="mx-auto text-emerald-300" size={38} />
                <p className="mt-3 text-lg font-black">No active ride</p>
                <p className="mt-1 text-sm font-semibold text-slate-400">Go online and accept a matching request.</p>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black">Available ride requests</h2>
              <Link to="/driver/ride-requests" className="text-sm font-extrabold text-emerald-300">View all</Link>
            </div>
            <div className="space-y-3">
              {availableRides.slice(0, 4).map((ride) => (
                <RideCard key={ride._id} ride={ride} primaryLabel="Accept Ride" onPrimary={() => acceptRide(ride._id)} onNavigate={() => openRideNavigation(ride)} compact />
              ))}
              {availableRides.length === 0 && <div className="rounded-lg bg-slate-950 p-6 text-sm font-semibold text-slate-400">No requests right now. Keep status online.</div>}
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-xl font-black">Driver summary</h2>
            <div className="mt-4 space-y-3">
              <Info label="Phone" value={driverData.phone || 'Not added'} />
              <Info label="Vehicle" value={driverData.vehicle?.model || 'Not added'} />
              <Info label="Area" value={[driverData.area, driverData.city].filter(Boolean).join(', ') || 'Not added'} />
            </div>
            <Link to="/driver/profile" className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-lg bg-emerald-500 text-sm font-black text-slate-950">Update Profile</Link>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-xl font-black">Support</h2>
            <a href="tel:100" className="mt-4 flex items-center gap-3 rounded-lg border border-rose-500/40 px-4 py-3 text-sm font-bold text-rose-200">
              <Phone size={18} />
              Emergency call
            </a>
          </div>
        </aside>
      </section>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-950 p-3">
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <p className="mt-1 font-bold text-white">{value}</p>
    </div>
  );
}

function RideCard({ ride, primaryLabel, onPrimary, onNavigate, compact = false }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex gap-3">
            <MapPin className="mt-1 shrink-0 text-emerald-300" size={18} />
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase text-slate-500">Pickup</p>
              <p className="truncate font-bold">{ride?.pickup?.address || 'Pickup location'}</p>
            </div>
          </div>
          {!compact && (
            <div className="flex gap-3">
              <Navigation className="mt-1 shrink-0 text-rose-300" size={18} />
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase text-slate-500">Drop</p>
                <p className="truncate font-bold">{ride?.drop?.address || 'Drop location'}</p>
              </div>
            </div>
          )}
        </div>
        <div className="shrink-0 lg:w-44">
          <p className="text-right text-2xl font-black text-emerald-300">{money(ride?.fare?.total || ride?.fare)}</p>
          <p className="text-right text-xs font-bold text-slate-500">{ride?.distance || 0} km</p>
          <button onClick={onPrimary} className="mt-3 h-10 w-full rounded-lg bg-emerald-500 text-sm font-black text-slate-950">{primaryLabel}</button>
          <button onClick={onNavigate} className="mt-2 h-10 w-full rounded-lg border border-slate-700 text-sm font-bold">Route</button>
        </div>
      </div>
    </div>
  );
}
