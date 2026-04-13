import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MapView from './MapView';

function toInputDate(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getRoutePoints(ride) {
  if (!ride?.pickup?.coordinates || !ride?.drop?.coordinates) {
    return null;
  }

  const [pLng, pLat] = ride.pickup.coordinates;
  const [dLng, dLat] = ride.drop.coordinates;

  if ([pLng, pLat, dLng, dLat].some((v) => typeof v !== 'number')) {
    return null;
  }

  return { pLng, pLat, dLng, dLat };
}

export default function RideHistoryList({ rideHistory = [] }) {
  const [selectedRideId, setSelectedRideId] = useState(null);
  const [routeByRide, setRouteByRide] = useState({});
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [minFare, setMinFare] = useState('');
  const [maxFare, setMaxFare] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [quickRange, setQuickRange] = useState('all');

  const applyQuickRange = (range) => {
    const today = new Date();
    const end = toInputDate(today);

    if (range === 'all') {
      setQuickRange('all');
      setFromDate('');
      setToDate('');
      return;
    }

    const startDate = new Date(today);
    if (range === 'today') {
      // keep same day
    } else if (range === 'last7') {
      startDate.setDate(startDate.getDate() - 6);
    } else if (range === 'last30') {
      startDate.setDate(startDate.getDate() - 29);
    }

    setQuickRange(range);
    setFromDate(toInputDate(startDate));
    setToDate(end);
  };

  useEffect(() => {
    if (!selectedRideId) {
      return;
    }

    const ride = rideHistory.find((r) => r._id === selectedRideId);
    const points = getRoutePoints(ride);

    if (!ride || !points) {
      return;
    }

    if (routeByRide[selectedRideId]) {
      return;
    }

    let alive = true;

    const fetchRoute = async () => {
      try {
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${points.pLng},${points.pLat};${points.dLng},${points.dLat}?overview=full&geometries=geojson`
        );
        const data = await res.json();
        const coords = data.routes?.[0]?.geometry?.coordinates?.map(([lng, lat]) => [lat, lng]) || [];

        if (alive) {
          setRouteByRide((prev) => ({ ...prev, [selectedRideId]: coords }));
        }
      } catch {
        if (alive) {
          setRouteByRide((prev) => ({ ...prev, [selectedRideId]: [] }));
        }
      }
    };

    fetchRoute();

    return () => {
      alive = false;
    };
  }, [selectedRideId, rideHistory, routeByRide]);

  const filteredRides = rideHistory.filter((ride) => {
    const fare = Number(ride?.fare?.total || ride?.fare || 0);
    const created = new Date(ride.createdAt);
    const searchable = `${ride.pickup?.address || ''} ${ride.drop?.address || ''} ${ride._id || ''}`.toLowerCase();
    const query = searchText.trim().toLowerCase();

    if (query && !searchable.includes(query)) {
      return false;
    }

    if (statusFilter !== 'all' && ride.status !== statusFilter) {
      return false;
    }

    if (minFare !== '' && fare < Number(minFare)) {
      return false;
    }

    if (maxFare !== '' && fare > Number(maxFare)) {
      return false;
    }

    if (fromDate) {
      const start = new Date(`${fromDate}T00:00:00`);
      if (created < start) {
        return false;
      }
    }

    if (toDate) {
      const end = new Date(`${toDate}T23:59:59`);
      if (created > end) {
        return false;
      }
    }

    return true;
  });

  const selectedRide = filteredRides.find((ride) => ride._id === selectedRideId)
    || rideHistory.find((ride) => ride._id === selectedRideId)
    || null;

  const selectedPoints = getRoutePoints(selectedRide);
  const pLat = selectedPoints?.pLat;
  const pLng = selectedPoints?.pLng;
  const dLat = selectedPoints?.dLat;
  const dLng = selectedPoints?.dLng;

  const statusOptions = ['all', ...Array.from(new Set(rideHistory.map((ride) => ride.status).filter(Boolean)))];

  if (rideHistory.length === 0) {
    return <div className="text-green-300">No completed rides yet.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 rounded-xl border border-green-900/70 bg-[#0c141f]/90 p-3">
        <input
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Search by booking ID, pickup or drop"
          className="w-full rounded-lg bg-[#121c29] border border-green-900/80 px-3 py-2 text-sm text-white"
        />
        <div className="grid grid-cols-2 gap-2">
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg bg-[#121c29] border border-green-900/80 px-3 py-2 text-sm text-white"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Status' : status}
              </option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min="0"
              value={minFare}
              onChange={(event) => setMinFare(event.target.value)}
              placeholder="Min Rs"
              className="rounded-lg bg-[#121c29] border border-green-900/80 px-3 py-2 text-sm text-white"
            />
            <input
              type="number"
              min="0"
              value={maxFare}
              onChange={(event) => setMaxFare(event.target.value)}
              placeholder="Max Rs"
              className="rounded-lg bg-[#121c29] border border-green-900/80 px-3 py-2 text-sm text-white"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            value={fromDate}
            onChange={(event) => {
              setFromDate(event.target.value);
              setQuickRange('custom');
            }}
            className="rounded-lg bg-[#121c29] border border-green-900/80 px-3 py-2 text-sm text-white"
          />
          <input
            type="date"
            value={toDate}
            onChange={(event) => {
              setToDate(event.target.value);
              setQuickRange('custom');
            }}
            className="rounded-lg bg-[#121c29] border border-green-900/80 px-3 py-2 text-sm text-white"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => applyQuickRange('today')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
              quickRange === 'today'
                ? 'bg-green-400 text-black'
                : 'bg-[#121c29] border border-green-900/80 text-green-200 hover:bg-green-900/40'
            }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => applyQuickRange('last7')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
              quickRange === 'last7'
                ? 'bg-green-400 text-black'
                : 'bg-[#121c29] border border-green-900/80 text-green-200 hover:bg-green-900/40'
            }`}
          >
            Last 7 Days
          </button>
          <button
            type="button"
            onClick={() => applyQuickRange('last30')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
              quickRange === 'last30'
                ? 'bg-green-400 text-black'
                : 'bg-[#121c29] border border-green-900/80 text-green-200 hover:bg-green-900/40'
            }`}
          >
            Last 30 Days
          </button>
          <button
            type="button"
            onClick={() => applyQuickRange('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
              quickRange === 'all'
                ? 'bg-green-400 text-black'
                : 'bg-[#121c29] border border-green-900/80 text-green-200 hover:bg-green-900/40'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {filteredRides.length === 0 && (
        <div className="text-green-300">No rides match the selected filters.</div>
      )}

      {filteredRides.map((ride) => {

        return (
          <div key={ride._id} className="rounded-xl border border-green-900/70 bg-[#0c141f]/90 p-4">
            <button
              onClick={() => setSelectedRideId(ride._id)}
              className="w-full text-left"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="font-bold text-white text-base truncate">
                  {ride.pickup?.address} <span className="text-green-400">to</span> {ride.drop?.address}
                </div>
                <span className="text-xs px-2 py-1 rounded-full border border-green-500/40 text-green-300 uppercase">
                  {ride.status}
                </span>
              </div>
              <div className="mt-2 text-sm text-green-200/90">{new Date(ride.createdAt).toLocaleString()}</div>
            </button>
          </div>
        );
      })}

      <AnimatePresence>
        {selectedRide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 md:p-8"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="h-full w-full rounded-2xl border border-green-700 bg-[#08111a] p-4 md:p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between gap-4 border-b border-green-900 pb-4">
                <h3 className="text-xl md:text-2xl font-extrabold text-green-300">Ride Full Details</h3>
                <button
                  onClick={() => setSelectedRideId(null)}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition"
                >
                  Close
                </button>
              </div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">
                <div><span className="text-green-400 font-semibold">Booking ID:</span> <span className="text-white">{selectedRide._id}</span></div>
                <div><span className="text-green-400 font-semibold">Status:</span> <span className="text-white uppercase">{selectedRide.status}</span></div>
                <div><span className="text-green-400 font-semibold">Pickup:</span> <span className="text-white">{selectedRide.pickup?.address || '-'}</span></div>
                <div><span className="text-green-400 font-semibold">Drop:</span> <span className="text-white">{selectedRide.drop?.address || '-'}</span></div>
                <div><span className="text-green-400 font-semibold">Fare:</span> <span className="text-white">Rs {selectedRide.fare?.total || selectedRide.fare || 0}</span></div>
                <div><span className="text-green-400 font-semibold">Distance:</span> <span className="text-white">{selectedRide.distance || 0} km</span></div>
                <div><span className="text-green-400 font-semibold">Duration:</span> <span className="text-white">{selectedRide.duration || 0} min</span></div>
                <div><span className="text-green-400 font-semibold">Insurance:</span> <span className="text-white">{selectedRide.insurancePlan || 'none'}</span></div>
                <div><span className="text-green-400 font-semibold">Created:</span> <span className="text-white">{new Date(selectedRide.createdAt).toLocaleString()}</span></div>
                {selectedRide.updatedAt && <div><span className="text-green-400 font-semibold">Updated:</span> <span className="text-white">{new Date(selectedRide.updatedAt).toLocaleString()}</span></div>}
              </div>

              {selectedPoints && (
                <div className="mt-6 h-[45vh] rounded-xl overflow-hidden border border-green-900/70">
                  <MapView
                    center={[pLat, pLng]}
                    zoom={8}
                    markers={[
                      { lat: pLat, lng: pLng, popup: 'Pickup' },
                      { lat: dLat, lng: dLng, popup: 'Drop-off' },
                    ]}
                    route={routeByRide[selectedRide._id] || []}
                    fitBounds={[
                      [pLat, pLng],
                      [dLat, dLng],
                    ]}
                    className="h-full"
                  />
                </div>
              )}

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => {
                    if (!selectedPoints) return;
                    window.open(
                      `https://www.google.com/maps/dir/?api=1&origin=${pLat},${pLng}&destination=${dLat},${dLng}&travelmode=driving`,
                      '_blank'
                    );
                  }}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-400 to-emerald-500 text-black font-bold hover:brightness-110 transition"
                >
                  Open Navigation
                </button>
                <button
                  onClick={() => setSelectedRideId(null)}
                  className="px-4 py-2 rounded-lg border border-green-500/50 text-green-200 hover:bg-green-900/40 transition"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
