import { useState, useEffect, useCallback } from 'react';
import PlacesAutocomplete from '../components/PlacesAutocomplete';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MapView from '../components/MapView';
import { getUserLocation, calculateDistance, formatCurrency } from '../utils/helpers';

const BASE_FARE = 50;
const PER_KM_RATE = 12;
const glass = 'bg-[#101924] border border-[#19e68c]/40 shadow-2xl';

function BookRide() {
  const [searchParams] = useSearchParams();
  const driverId = searchParams.get('driverId');
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Enter locations, 2: Review fare
  const [pickup, setPickup] = useState({ address: '', lat: null, lng: null });
  const [drop, setDrop] = useState({ address: '', lat: null, lng: null });
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [insurance, setInsurance] = useState('none');
  const [fare, setFare] = useState(null);
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState([]);
  const [userLoc, setUserLoc] = useState(null);
  const [panelTab, setPanelTab] = useState('form');

  useEffect(() => {
    getUserLocation()
      .then((loc) => {
        setUserLoc(loc);
        setPickup({ address: 'Current Location', lat: loc.lat, lng: loc.lng });
      })
      .catch(() => {});
  }, []);

  // Use Google Maps Geocoding API
  const geocodeAddress = async (address) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return null;
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
      );
      const data = await res.json();
      if (data.status === 'OK' && data.results.length > 0) {
        const loc = data.results[0].geometry.location;
        return { lat: loc.lat, lng: loc.lng, display: data.results[0].formatted_address };
      }
    } catch { /* ignore */ }
    return null;
  };

  const fetchRoute = useCallback(async (pLat, pLng, dLat, dLng) => {
    try {
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${pLng},${pLat};${dLng},${dLat}?overview=full&geometries=geojson`
      );
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const r = data.routes[0];
        const coords = r.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
        setRoute(coords);
        const dist = parseFloat((r.distance / 1000).toFixed(2));
        const dur = Math.ceil(r.duration / 60);
        setDistance(dist);
        setDuration(dur);
        return { distance: dist, duration: dur };
      }
    } catch { /* ignore */ }
    // Fallback: straight-line distance
    const dist = calculateDistance(pLat, pLng, dLat, dLng);
    setDistance(dist);
    setDuration(Math.ceil(dist * 3));
    return { distance: dist, duration: Math.ceil(dist * 3) };
  }, []);

  const calculateFare = (dist, insurancePlan) => {
    const distanceCost = parseFloat((dist * PER_KM_RATE).toFixed(2));
    const insuranceAmt = insurancePlan === 'mini' ? 10 : insurancePlan === 'premium' ? 20 : 0;
    const total = parseFloat((BASE_FARE + distanceCost + insuranceAmt).toFixed(2));
    return { baseFare: BASE_FARE, distanceCost, insurance: insuranceAmt, total };
  };

  const handleSearch = async () => {
    if (!pickup.address || !drop.address) return;
    setLoading(true);

    let pLat = pickup.lat, pLng = pickup.lng;
    let dLat = drop.lat, dLng = drop.lng;

    if (!pLat || !pLng) {
      const geo = await geocodeAddress(pickup.address);
      if (geo) {
        pLat = geo.lat;
        pLng = geo.lng;
        setPickup({ address: pickup.address, lat: pLat, lng: pLng });
      }
    }
    if (!dLat || !dLng) {
      const geo = await geocodeAddress(drop.address);
      if (geo) {
        dLat = geo.lat;
        dLng = geo.lng;
        setDrop({ address: drop.address, lat: dLat, lng: dLng });
      }
    }

    if (pLat && pLng && dLat && dLng) {
      const result = await fetchRoute(pLat, pLng, dLat, dLng);
      const fareCalc = calculateFare(result.distance, insurance);
      setFare(fareCalc);
      setStep(2);
    }

    setLoading(false);
  };

  const handleInsuranceChange = (plan) => {
    setInsurance(plan);
    if (distance > 0) {
      setFare(calculateFare(distance, plan));
    }
  };

  // Instead of booking here, redirect to /drivers with trip data
  const handleFindDrivers = () => {
    navigate('/drivers', {
      state: {
        pickup,
        drop,
        distance,
        duration,
        insurance,
        fare,
      },
    });
  };

  const markers = [];
  if (pickup.lat && pickup.lng) {
    markers.push({ lat: pickup.lat, lng: pickup.lng, popup: 'Pickup' });
  }
  if (drop.lat && drop.lng) {
    markers.push({ lat: drop.lat, lng: drop.lng, popup: 'Drop-off' });
  }

  const fitBounds = markers.length === 2
    ? markers.map((m) => [m.lat, m.lng])
    : null;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#101924] via-[#18222f] to-[#1a3a2c] pb-6 sm:pb-10">
      <div className="max-w-5xl mx-auto p-2 sm:p-4">
        <motion.h1
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-[#19e68c]">
            {driverId ? 'Book Selected Driver' : 'Book a Ride'}
          </span>
          <span className="text-xl sm:text-2xl">🚖</span>
        </motion.h1>

        {/* Progress Steps */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-4 sm:mb-8">
          {['Location', 'Review'].map((s, i) => (
            <div key={i} className="flex items-center gap-1 sm:gap-2">
              <motion.div
                className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm sm:text-base font-bold shadow-lg border-2 ${
                  step > i + 1
                    ? 'bg-gradient-to-br from-[#16a34a] to-[#0ea5e9] text-white border-[#16a34a]'
                    : step === i + 1
                    ? 'bg-white text-[#16a34a] border-[#16a34a]'
                    : 'bg-gray-100 text-gray-400 border-gray-200'
                }`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                {step > i + 1 ? '✓' : i + 1}
              </motion.div>
              <span className={`text-xs sm:text-base ${step === i + 1 ? 'text-white font-semibold' : 'text-gray-400'}`}>
                {s}
              </span>
              {i < 1 && <div className="w-8 sm:w-12 h-0.5 bg-gradient-to-r from-[#16a34a] to-[#0ea5e9] mx-1 opacity-60" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Map always visible on the left */}
          <motion.div
            className={`bg-[#111827]/90 rounded-2xl sm:rounded-3xl overflow-hidden h-[220px] sm:h-[400px] lg:h-[500px] mb-4 lg:mb-0 border border-[#19e68c]`} 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            <MapView
              center={userLoc ? [userLoc.lat, userLoc.lng] : [20.5937, 78.9629]}
              zoom={13}
              markers={markers}
              route={route}
              fitBounds={fitBounds}
              userLocation={step === 1 ? userLoc : null}
              className="h-full"
            />
          </motion.div>

          {/* Booking Form always visible on the right */}
          <div>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`bg-[#111827] rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-[#19e68c]`}
                >
                  <h2 className="text-base sm:text-xl font-bold text-white mb-2 sm:mb-4 flex items-center gap-1 sm:gap-2">
                    <span>Enter Trip Details</span> <span className="text-sm sm:text-lg">📝</span>
                  </h2>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-base font-semibold text-[#19e68c] mb-1">📍 Pickup Location</label>
                      <PlacesAutocomplete
                        value={pickup.address}
                        onPlaceSelected={(place) => setPickup(place)}
                        placeholder="Enter pickup address"
                        className="w-full px-5 py-3 border border-[#19e68c] rounded-xl outline-none focus:ring-2 focus:ring-[#19e68c] bg-[#222c37] text-white placeholder-gray-400"
                      />
                      {userLoc && (
                        <button
                          onClick={() => setPickup({ address: 'Current Location', lat: userLoc.lat, lng: userLoc.lng })}
                          className="text-xs text-[#19e68c] mt-1 hover:underline cursor-pointer"
                        >
                          📍 Use current location
                        </button>
                      )}
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-[#19e68c] mb-1">🏁 Drop Location <span className='text-red-500'>*</span></label>
                      <PlacesAutocomplete
                        value={drop.address}
                        onPlaceSelected={(place) => setDrop(place)}
                        placeholder="Enter drop-off address"
                        className="w-full px-5 py-3 border border-[#19e68c] rounded-xl outline-none focus:ring-2 focus:ring-[#19e68c] bg-[#222c37] text-white placeholder-gray-400"
                      />
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSearch}
                      disabled={loading || !pickup.address || !drop.address || !drop.lat || !drop.lng}
                      className="w-full bg-[#19e68c] text-black py-3 rounded-xl font-bold shadow-lg disabled:opacity-50 cursor-pointer text-lg hover:bg-[#16a34a]"
                    >
                      {loading ? 'Calculating Route...' : 'Find Route & Fare'}
                    </motion.button>
                  </div>
                </motion.div>
              )}
              {step === 2 && fare && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`${glass} rounded-3xl p-8`}
                >
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span>Trip Summary</span> <span className="text-lg">🧾</span>
                  </h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-base">
                      <span className="text-gray-300">📍 Pickup</span>
                      <span className="text-white font-semibold text-right max-w-[200px] truncate">{pickup.address}</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-300">🏁 Drop</span>
                      <span className="text-white font-semibold text-right max-w-[200px] truncate">{drop.address}</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-300">📏 Distance</span>
                      <span className="text-white font-semibold">{distance} km</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-300">⏱️ Est. Time</span>
                      <span className="text-white font-semibold">{duration} min</span>
                    </div>
                  </div>

                  {/* Fare Breakdown */}
                  <div className="bg-[#0b1118] rounded-xl p-5 mb-4 border border-[#19e68c]/30">
                    <h3 className="text-base font-bold text-[#19e68c] mb-3">Fare Breakdown (₹12/km)</h3>
                    <div className="space-y-2 text-base">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Base Fare</span>
                        <span className="text-white">{formatCurrency(fare.baseFare)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Distance ({distance} km × ₹{PER_KM_RATE})</span>
                        <span className="text-white">{formatCurrency(fare.distanceCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Insurance</span>
                        <span className="text-white">{formatCurrency(fare.insurance)}</span>
                      </div>
                      <div className="border-t border-[#19e68c]/20 pt-2 flex justify-between font-bold text-white">
                        <span>Total</span>
                        <span className="text-lg text-[#19e68c]">{formatCurrency(fare.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Insurance Options */}
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-white mb-3">🛡️ Insurance Add-on</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {(
                        [
                          { key: 'none', label: 'None', price: '₹0' },
                          { key: 'mini', label: 'Mini', price: '+₹10' },
                          { key: 'premium', label: 'Premium', price: '+₹20' },
                        ]
                      ).map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => handleInsuranceChange(opt.key)}
                          className={`p-3 rounded-xl text-center text-base border-2 transition-all cursor-pointer font-semibold ${
                            insurance === opt.key
                              ? 'border-[#16a34a] bg-gradient-to-r from-[#16a34a] to-[#0ea5e9] text-white shadow-lg'
                              : 'border-[#19e68c]/30 bg-[#0b1118] hover:border-[#16a34a] text-white'
                          }`}
                        >
                          <div>{opt.label}</div>
                          <div className="text-xs opacity-75">{opt.price}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="py-3 border border-[#19e68c]/40 rounded-xl text-base font-semibold cursor-pointer bg-[#0b1118] text-white hover:bg-[#13202e]"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        if (!pickup.lat || !pickup.lng || !drop.lat || !drop.lng) return;
                        const url = `https://www.google.com/maps/dir/?api=1&origin=${pickup.lat},${pickup.lng}&destination=${drop.lat},${drop.lng}&travelmode=driving`;
                        window.open(url, '_blank');
                      }}
                      className="py-3 border border-[#19e68c]/40 rounded-xl text-base font-semibold cursor-pointer bg-[#0b1118] text-[#19e68c] hover:bg-[#13202e]"
                    >
                      Open Map Route
                    </button>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleFindDrivers}
                      className="bg-gradient-to-r from-[#16a34a] to-[#0ea5e9] text-white py-3 rounded-xl font-bold shadow-lg cursor-pointer text-lg"
                    >
                      Find Drivers
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookRide;
