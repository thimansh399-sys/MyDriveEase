import { useState, useEffect } from 'react';
import api from '../utils/api';
// ...existing code...
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
// ...existing code...
import LoadingSpinner from '../components/LoadingSpinner';

const FILTERS = [
  { label: 'All', value: '' },
  { label: 'Online', value: 'online' },
  { label: 'Offline', value: 'offline' },
  { label: 'Driver Only', value: 'driver' },
  { label: 'Driver + Car', value: 'driver_car' },
];

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [driverType, setDriverType] = useState('');
  const [availability, setAvailability] = useState('');
  const [rating, setRating] = useState('');
  const navigate = useNavigate();
  const [bookingModal, setBookingModal] = useState(null); // {driver, pickup, drop}
  const [bookingSuccess, setBookingSuccess] = useState(null); // booking id
  const [bookingLoading, setBookingLoading] = useState(false);

  // Accept trip data from navigation state
  const location = typeof window !== 'undefined' ? window.location : {};
  const navState = (location && location.state) || {};
  const [trip, setTrip] = useState(navState || {});

  useEffect(() => {
    let interval;
    const fetchDrivers = async () => {
      setLoading(true);
      try {
        // Use /drivers/all to get all drivers, then filter client-side
        const res = await api.get('/drivers/all');
        let allDrivers = res.data || [];
        // Filter by state, city, pincode, type, status, rating
        if (state) allDrivers = allDrivers.filter(d => d.location?.state?.toLowerCase().includes(state.toLowerCase()));
        if (city) allDrivers = allDrivers.filter(d => d.location?.city?.toLowerCase().includes(city.toLowerCase()));
        if (pincode) allDrivers = allDrivers.filter(d => d.location?.pincode?.toLowerCase().includes(pincode.toLowerCase()));
        if (driverType) allDrivers = allDrivers.filter(d => d.vehicle?.type === driverType);
        if (availability) allDrivers = allDrivers.filter(d => d.status === availability);
        if (rating) allDrivers = allDrivers.filter(d => (d.rating || 0) >= Number(rating));
        setDrivers(allDrivers);
      } catch {
        setDrivers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
    interval = setInterval(fetchDrivers, 60000);
    return () => clearInterval(interval);
  }, [state, city, pincode, driverType, availability, rating]);

  const filteredDrivers = drivers.filter(d =>
    (d.name?.toLowerCase().includes(search.toLowerCase()) || d.city?.toLowerCase().includes(search.toLowerCase()))
  );

  // Accept pickup/drop from location state if navigated from homepage
  // Book driver with trip data
  const bookDriver = (driverId) => {
    const driver = drivers.find(d => d._id === driverId);
    setBookingModal({
      driver,
      pickup: trip.pickup,
      drop: trip.drop,
      distance: trip.distance,
      duration: trip.duration,
      insurance: trip.insurance,
      fare: trip.fare,
    });
  };

  const confirmBooking = async () => {
    if (!bookingModal) return;
    setBookingLoading(true);
    try {
      const { driver, pickup, drop, distance, duration, insurance, fare } = bookingModal;
      const res = await api.post('/bookings/create', {
        driverId: driver._id,
        pickup: { address: pickup?.address || pickup, coordinates: [pickup?.lng || 0, pickup?.lat || 0] },
        drop: { address: drop?.address || drop, coordinates: [drop?.lng || 0, drop?.lat || 0] },
        distance: distance || 10,
        duration: duration || 30,
        insurancePlan: insurance || 'none',
        fare: fare?.total || undefined,
      });
      setBookingSuccess(res.data.bookingId || res.data._id || 'BOOK123');
      setBookingModal(null);
    } catch {
      setBookingSuccess('ERROR');
    }
    setBookingLoading(false);
  };

  if (loading) return <LoadingSpinner text="Finding nearby drivers..." />;
  // Booking Success Modal
  if (bookingSuccess) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4 text-green-600">Booking Successful!</h2>
          <p className="mb-2">Your booking ID:</p>
          <div className="text-lg font-mono bg-gray-100 rounded p-2 mb-4">{bookingSuccess}</div>
          <button className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold" onClick={() => setBookingSuccess(null)}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0a1019]">
      <div className="max-w-7xl mx-auto p-2 sm:p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Approved Drivers</h1>
            <p className="text-[#19e68c] text-xs sm:text-sm">{filteredDrivers.length} drivers found</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <input placeholder="State" value={state} onChange={e => setState(e.target.value)} className="px-3 py-2 rounded bg-[#222c37] text-white" />
          <input placeholder="City" value={city} onChange={e => setCity(e.target.value)} className="px-3 py-2 rounded bg-[#222c37] text-white" />
          <input placeholder="Pincode" value={pincode} onChange={e => setPincode(e.target.value)} className="px-3 py-2 rounded bg-[#222c37] text-white" />
          <select value={driverType} onChange={e => setDriverType(e.target.value)} className="px-3 py-2 rounded bg-[#222c37] text-white">
            <option value="">All Types</option>
            <option value="driver">Driver Only</option>
            <option value="driver_car">Driver + Car</option>
          </select>
          <select value={availability} onChange={e => setAvailability(e.target.value)} className="px-3 py-2 rounded bg-[#222c37] text-white">
            <option value="">All Status</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        {drivers.length === 0 && (
          <div className="text-center py-20">
            <span className="text-5xl text-[#19e68c]">🔍</span>
            <p className="text-[#19e68c] mt-4">No drivers found. Try adjusting your filters.</p>
          </div>
        )}

        {/* Driver List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {drivers.map(driver => (
            <div key={driver._id} className="rounded-2xl bg-gradient-to-br from-black via-[#0a1019] to-green-900 p-7 shadow-xl border-2 border-green-400 flex flex-col gap-3 hover:scale-105 transition-transform duration-200">
              <div className="flex items-center gap-4 mb-2">
                <span className={`w-4 h-4 rounded-full border-2 ${driver.status === 'online' ? 'bg-green-400 border-green-300 animate-pulse' : 'bg-gray-400 border-gray-300'} shadow`}></span>
                <span className="font-extrabold text-2xl text-white tracking-tight">{driver.name}</span>
                <span className={`ml-auto px-3 py-1 rounded-2xl text-xs font-bold uppercase tracking-wider ${driver.status === 'online' ? 'bg-green-400 text-black' : 'bg-gray-700 text-white'}`}>{driver.status}</span>
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                <span className="text-green-300 font-bold text-lg">{driver.vehicle?.type?.toUpperCase()}</span>
                {driver.vehicle?.model && <span className="text-white text-md">{driver.vehicle.model}</span>}
                {driver.vehicle?.plate && <span className="text-gray-400 text-sm">({driver.vehicle.plate})</span>}
              </div>
              <div className="text-lg text-green-200">{driver.location?.city}, {driver.location?.state} {driver.location?.pincode}</div>
              <div className="flex gap-4 mt-2 items-center">
                <span className="text-yellow-400 font-extrabold text-lg">⭐ {driver.rating?.toFixed(1) || 'N/A'}</span>
                <span className="text-xs text-green-300 font-bold">{driver.totalRides || 0} rides</span>
                <span className="text-xs text-gray-400 ml-auto">{driver.phone}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Drivers;
