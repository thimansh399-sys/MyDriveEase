import { useState, useEffect, useCallback } from 'react';
// removed duplicate import of motion
import { CheckCircle, MapPin, Calendar, CreditCard, KeyRound } from 'lucide-react';
import PlacesAutocomplete from '../components/PlacesAutocomplete';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import MapView from '../components/MapView';
import LoadingSpinner from '../components/LoadingSpinner';
import { getUserLocation, calculateDistance, formatCurrency } from '../utils/helpers';

const BASE_FARE = 50;
const PER_KM_RATE = 12;
const glass = 'bg-white/80 backdrop-blur-xl shadow-2xl border border-[#e5e5e5]';

function BookRide() {
  const [searchParams] = useSearchParams();
  const driverId = searchParams.get('driverId');
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Enter locations, 2: Review fare, 3: Booking
  const [pickup, setPickup] = useState({ address: '', lat: null, lng: null });
  const [drop, setDrop] = useState({ address: '', lat: null, lng: null });
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [insurance, setInsurance] = useState('none');
  const [fare, setFare] = useState(null);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [findingDriver, setFindingDriver] = useState(false);
  const [route, setRoute] = useState([]);
  const [userLoc, setUserLoc] = useState(null);

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
    <div className="min-h-[calc(100vh-64px)] bg-[#0a1019] pb-6 sm:pb-10">
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
          {['Location', 'Review', 'Confirmed'].map((s, i) => (
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
              <span className={`text-xs sm:text-base ${step === i + 1 ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>
                {s}
              </span>
              {i < 2 && <div className="w-8 sm:w-12 h-0.5 bg-gradient-to-r from-[#16a34a] to-[#0ea5e9] mx-1 opacity-60" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Map */}
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

          {/* Right Side Panel */}
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
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>Trip Summary</span> <span className="text-lg">🧾</span>
                  </h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-base">
                      <span className="text-gray-500">📍 Pickup</span>
                      <span className="text-gray-900 font-semibold text-right max-w-[200px] truncate">{pickup.address}</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-500">🏁 Drop</span>
                      <span className="text-gray-900 font-semibold text-right max-w-[200px] truncate">{drop.address}</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-500">📏 Distance</span>
                      <span className="text-gray-900 font-semibold">{distance} km</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-500">⏱️ Est. Time</span>
                      <span className="text-gray-900 font-semibold">{duration} min</span>
                    </div>
                  </div>

                  {/* Fare Breakdown */}
                  <div className="bg-gradient-to-br from-[#e0f7fa] to-[#e8f5e9] rounded-xl p-5 mb-4 border border-[#e5e5e5]">
                    <h3 className="text-base font-bold text-gray-900 mb-3">Fare Breakdown</h3>
                    <div className="space-y-2 text-base">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Base Fare</span>
                        <span>{formatCurrency(fare.baseFare)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Distance ({distance} km × ₹{PER_KM_RATE})</span>
                        <span>{formatCurrency(fare.distanceCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Insurance</span>
                        <span>{formatCurrency(fare.insurance)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-bold text-gray-900">
                        <span>Total</span>
                        <span className="text-lg">{formatCurrency(fare.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Insurance Options */}
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-gray-900 mb-3">🛡️ Insurance Add-on</h3>
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
                              : 'border-gray-200 bg-white/70 hover:border-[#16a34a] text-gray-700'
                          }`}
                        >
                          <div>{opt.label}</div>
                          <div className="text-xs opacity-75">{opt.price}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 py-3 border border-gray-300 rounded-xl text-base font-semibold cursor-pointer bg-white/70 hover:bg-gray-100"
                    >
                      Back
                    </button>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleFindDrivers}
                      className="flex-1 bg-gradient-to-r from-[#16a34a] to-[#0ea5e9] text-white py-3 rounded-xl font-bold shadow-lg cursor-pointer text-lg"
                    >
                      Find Drivers
                    </motion.button>
                  </div>
                </motion.div>
              )}


              {step === 3 && booking && (
                <BookingConfirmedModal booking={booking} navigate={navigate} setStep={setStep} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookRide;

// Inline BookingConfirmedModal with updated style and black text
function BookingConfirmedModal({ booking, navigate, setStep }) {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      navigate(`/track/${booking._id}`);
    }, 60000); // 1 minute
    return () => clearTimeout(timer);
  }, [booking, navigate]);
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-[380px] rounded-2xl shadow-2xl p-6"
      >
        {/* Header */}
        <div className="text-center mb-4">
          <CheckCircle className="text-green-500 mx-auto mb-2" size={40} />
          <h2 className="text-2xl font-bold text-gray-800">Booking Confirmed</h2>
          <p className="text-sm text-gray-500">Your ride is being arranged 🚗</p>
        </div>

        {/* Status */}
        <div className="bg-yellow-100 text-yellow-700 text-sm font-semibold px-4 py-2 rounded-lg text-center mb-4">
          {booking.status === 'pending' || booking.status === 'driver-assignment-pending' ? 'Driver assignment pending' : booking.status ? booking.status.replace(/-/g, ' ') : 'Status Unknown'}
        </div>

        {/* Details */}
        <div className="space-y-3 text-sm text-gray-700 mb-4">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-green-500" />
            <span><b>Pickup:</b> {booking.pickup?.address || 'Not Available'}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-red-500" />
            <span><b>Drop:</b> {booking.drop?.address || 'Not Available'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-blue-500" />
            <span><b>Date & Time:</b> {booking.createdAt ? new Date(booking.createdAt).toLocaleString() : 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard size={16} className="text-purple-500" />
            <span><b>Fare:</b> ₹{booking.fare?.total ?? '0'}</span>
          </div>
          {booking.otp && (
            <div className="flex items-center gap-2">
              <KeyRound size={16} className="text-orange-500" />
              <span><b>OTP:</b> <span className="font-mono text-lg text-black bg-yellow-100 px-3 py-1 rounded-lg tracking-widest">{booking.otp}</span></span>
            </div>
          )}
        </div>

        {/* Button */}
        <button
          className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transition"
          onClick={() => {
            setShow(false);
            navigate(`/track/${booking._id}`);
          }}
        >
          🚗 Navigate with Google Maps
        </button>

        {/* Footer */}
        <p className="text-xs text-center text-gray-400 mt-3">
          Booking ID: {booking._id || 'XXXXXX'}
        </p>
      </motion.div>
    </div>
  );
}
