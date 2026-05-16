import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Car, IndianRupee, MapPin, Navigation, UserRound } from 'lucide-react';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const money = (value = 0) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`;

const statusStyles = {
  pending: 'bg-amber-500/10 text-amber-100 border-amber-400/30',
  accepted: 'bg-sky-500/10 text-sky-100 border-sky-400/30',
  'in-progress': 'bg-emerald-500/10 text-emerald-200 border-emerald-400/30',
  completed: 'bg-slate-800 text-slate-200 border-slate-700',
  cancelled: 'bg-rose-500/10 text-rose-200 border-rose-400/30',
};

export default function DriverRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await api.get('/bookings/driver/my');
        setRides(res.data || []);
      } catch (err) {
        console.error('Failed to fetch rides:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRides();
  }, []);

  if (loading) return <LoadingSpinner text="Loading your rides..." />;

  const completedRides = rides.filter((ride) => ride.status === 'completed');
  const totalEarnings = completedRides.reduce((sum, ride) => sum + Number(ride.fare?.total || 0), 0);

  return (
    <div className="space-y-6 text-white">
      <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
        <p className="text-sm font-bold uppercase text-emerald-300">Ride history</p>
        <h1 className="mt-1 text-3xl font-black">My Rides</h1>
        <p className="mt-2 text-sm font-semibold text-slate-400">Completed, active, and cancelled rides in one dark console view.</p>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <Stat label="Total rides" value={rides.length} />
        <Stat label="Completed" value={completedRides.length} />
        <Stat label="Total earnings" value={money(totalEarnings)} />
      </section>

      {rides.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-700 bg-slate-900 p-10 text-center">
          <Car className="mx-auto text-emerald-300" size={38} />
          <p className="mt-4 font-black">No rides yet</p>
          <p className="mt-1 text-sm font-semibold text-slate-400">Go online to receive requests.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rides.map((ride, index) => (
            <motion.div
              key={ride._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="rounded-lg border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/10"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${statusStyles[ride.status] || statusStyles.pending}`}>
                      {ride.status}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {new Date(ride.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <RouteLine icon={MapPin} label="Pickup" value={ride.pickup?.address} />
                  <RouteLine icon={Navigation} label="Drop" value={ride.drop?.address} />
                  {ride.userId && (
                    <div className="mt-4 flex items-center gap-2 border-t border-slate-800 pt-3 text-sm font-semibold text-slate-300">
                      <UserRound size={17} className="text-emerald-300" />
                      {ride.userId.name} {ride.userId.phone ? `| ${ride.userId.phone}` : ''}
                    </div>
                  )}
                </div>
                <div className="shrink-0 rounded-lg bg-slate-950 p-4 text-right lg:w-44">
                  <IndianRupee className="ml-auto text-emerald-300" size={18} />
                  <p className="mt-2 text-2xl font-black text-emerald-300">{money(ride.fare?.total)}</p>
                  <p className="mt-1 text-xs font-bold text-slate-500">{ride.distance || 0} km</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-center">
      <p className="text-3xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase text-slate-500">{label}</p>
    </div>
  );
}

function RouteLine({ icon: Icon, label, value }) {
  return (
    <div className="mt-2 flex gap-3">
      <Icon className="mt-1 shrink-0 text-emerald-300" size={17} />
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
        <p className="truncate font-semibold text-slate-200">{value || 'Not available'}</p>
      </div>
    </div>
  );
}
