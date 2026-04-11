import { useState, useEffect } from 'react';
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

  useEffect(() => {
    let interval;
    const fetchDrivers = async () => {
      setLoading(true);
      try {
        const params = {
          state,
          city,
          pincode,
          type: driverType,
          status: availability,
          rating: rating ? Number(rating) : undefined,
        };
        const res = await api.get('/drivers/approved', { params });
        setDrivers(res.data);
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

  const bookDriver = (driverId) => {
    navigate(`/book?driverId=${driverId}`);
  };

  if (loading) return <LoadingSpinner text="Finding nearby drivers..." />;

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
            <option value="">All</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
          <select value={rating} onChange={e => setRating(e.target.value)} className="px-3 py-2 rounded bg-[#222c37] text-white">
            <option value="">All Ratings</option>
            <option value="4">4+</option>
            <option value="4.5">4.5+</option>
            <option value="5">5</option>
          </select>
          <input placeholder="Search name/city" value={search} onChange={e => setSearch(e.target.value)} className="px-3 py-2 rounded bg-[#222c37] text-white" />
        </div>

        {/* Driver Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredDrivers.map((driver, i) => (
            <motion.div
              key={driver._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-[#111827] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow border border-[#19e68c] ${
                driver.status === 'offline' ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#222c37] rounded-full flex items-center justify-center text-2xl text-[#19e68c]">
                    🚗
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{driver.name}</h3>
                    <p className="text-xs text-[#19e68c] capitalize">
                      {driver.vehicle?.type || 'sedan'} {driver.vehicle?.model && `• ${driver.vehicle.model}`}
                    </p>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  driver.status === 'online' ? 'bg-green-400 pulse-online' : 'bg-gray-700'
                }`} />
              </div>

              <div className="flex items-center gap-4 text-sm text-[#19e68c] mb-4">
                <span>⭐ {driver.rating?.toFixed(1) || '5.0'}</span>
                <span>🚕 {driver.totalRides || 0} rides</span>
                <span className={`capitalize ${
                  driver.status === 'online' ? 'text-green-400 font-medium' : ''
                }`}>
                  {driver.status}
                </span>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => bookDriver(driver._id)}
                disabled={driver.status !== 'online'}
                className="w-full bg-[#19e68c] text-black py-2.5 rounded-xl text-sm font-medium hover:bg-[#16a34a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Book Now
              </motion.button>
            </motion.div>
          ))}
        </div>

        {drivers.length === 0 && (
          <div className="text-center py-20">
            <span className="text-5xl text-[#19e68c]">🔍</span>
            <p className="text-[#19e68c] mt-4">No drivers found nearby. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Drivers;
