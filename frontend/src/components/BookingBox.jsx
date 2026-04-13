import React, { useEffect, useRef, useState } from "react";
import api from '../utils/api';
import { INDIA_CENTER, resolveIndiaLocation, searchIndiaLocations } from '../utils/places';

export default function BookingBox({ onLocationsChange }) {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropLocation, setDropLocation] = useState(null);
  const [rideType, setRideType] = useState("oneway");
  const [hours, setHours] = useState(2);
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [suggestions, setSuggestions] = useState({ pickup: [], drop: [] });
  const [loadingField, setLoadingField] = useState('');
  const [activeField, setActiveField] = useState('');
  const requestIds = useRef({ pickup: 0, drop: 0 });

  useEffect(() => {
    if (!onLocationsChange) {
      return;
    }

    onLocationsChange({
      pickup: pickupLocation,
      drop: rideType === 'hourly' ? null : dropLocation,
    });
  }, [dropLocation, onLocationsChange, pickupLocation, rideType]);

  useEffect(() => {
    if (rideType === 'hourly') {
      setDrop('');
      setDropLocation(null);
      setSuggestions((current) => ({ ...current, drop: [] }));
    }
  }, [rideType]);

  useEffect(() => {
    const query = pickup.trim();
    if (query.length < 3) {
      setSuggestions((current) => ({ ...current, pickup: [] }));
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      const requestId = requestIds.current.pickup + 1;
      requestIds.current.pickup = requestId;
      setLoadingField('pickup');

      try {
        const results = await searchIndiaLocations(query);
        if (requestIds.current.pickup === requestId) {
          setSuggestions((current) => ({ ...current, pickup: results }));
        }
      } catch {
        if (requestIds.current.pickup === requestId) {
          setSuggestions((current) => ({ ...current, pickup: [] }));
        }
      } finally {
        if (requestIds.current.pickup === requestId) {
          setLoadingField((current) => (current === 'pickup' ? '' : current));
        }
      }
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [pickup]);

  useEffect(() => {
    const query = drop.trim();
    if (rideType === 'hourly' || query.length < 3) {
      setSuggestions((current) => ({ ...current, drop: [] }));
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      const requestId = requestIds.current.drop + 1;
      requestIds.current.drop = requestId;
      setLoadingField('drop');

      try {
        const results = await searchIndiaLocations(query);
        if (requestIds.current.drop === requestId) {
          setSuggestions((current) => ({ ...current, drop: results }));
        }
      } catch {
        if (requestIds.current.drop === requestId) {
          setSuggestions((current) => ({ ...current, drop: [] }));
        }
      } finally {
        if (requestIds.current.drop === requestId) {
          setLoadingField((current) => (current === 'drop' ? '' : current));
        }
      }
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [drop, rideType]);

  const handleFieldChange = (field, value) => {
    setActiveField(field);

    if (field === 'pickup') {
      setPickup(value);
      setPickupLocation((current) => (current?.address === value ? current : null));
      return;
    }

    setDrop(value);
    setDropLocation((current) => (current?.address === value ? current : null));
  };

  const handleLocationSelect = (field, location) => {
    if (field === 'pickup') {
      setPickup(location.address);
      setPickupLocation(location);
      setSuggestions((current) => ({ ...current, pickup: [] }));
    } else {
      setDrop(location.address);
      setDropLocation(location);
      setSuggestions((current) => ({ ...current, drop: [] }));
    }

    setActiveField('');
  };

  const handleSearch = async () => {
    if (!pickup.trim()) return alert("Enter pickup location");
    if ((rideType === "oneway" || rideType === "outstation") && !drop.trim()) {
      return alert("Enter destination");
    }

    setLoading(true);
    try {
      const resolvedPickup = pickupLocation || (await resolveIndiaLocation(pickup.trim())) || INDIA_CENTER;
      const resolvedDrop =
        rideType === 'hourly'
          ? null
          : dropLocation || (await resolveIndiaLocation(drop.trim()));

      if ((rideType === 'oneway' || rideType === 'outstation') && !resolvedDrop) {
        alert('Select a destination from the India suggestions.');
        setLoading(false);
        return;
      }

      const pickupObj = {
        address: resolvedPickup.address,
        coordinates: [resolvedPickup.lng, resolvedPickup.lat],
      };
      const dropObj = resolvedDrop
        ? {
            address: resolvedDrop.address,
            coordinates: [resolvedDrop.lng, resolvedDrop.lat],
          }
        : null;

      setPickupLocation(resolvedPickup);
      if (resolvedDrop) {
        setDropLocation(resolvedDrop);
      }

      let distance = 10;
      let duration = 30;
      let fare = 50;
      if (rideType === "hourly") {
        distance = hours * 10;
        duration = hours * 60;
        fare = 50 + hours * 100;
      } else if (rideType === "outstation") {
        distance = 100;
        duration = 180;
        fare = 500;
      }

      const res = await api.post('/bookings/create', {
        pickup: pickupObj,
        drop: dropObj,
        distance,
        duration,
        insurancePlan: 'none',
        fare,
      });
      setConfirmation(res.data);
    } catch {
      alert('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {confirmation && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4 text-green-600">Booking Confirmed!</h2>
            <div className="mb-2 text-left">
              <div className="text-xs text-gray-500">Booking ID</div>
              <div className="font-mono text-base mb-2">{confirmation._id}</div>
              <div className="text-xs text-gray-500">Status</div>
              <div className="font-semibold text-yellow-600 mb-2">Driver assignment pending</div>
              <div className="text-xs text-gray-500">Pickup</div>
              <div className="font-semibold mb-2">{confirmation.pickup?.address}</div>
              {confirmation.drop && <>
                <div className="text-xs text-gray-500">Drop</div>
                <div className="font-semibold mb-2">{confirmation.drop?.address}</div>
              </>}
              <div className="text-xs text-gray-500">Date & Time</div>
              <div className="mb-2">{new Date(confirmation.createdAt || Date.now()).toLocaleString()}</div>
              <div className="text-xs text-gray-500">Fare</div>
              <div className="font-bold text-lg mb-2">₹{confirmation.fare?.total || confirmation.fare || 0}</div>
            </div>
            <button
              onClick={() => {
                const pickup = confirmation.pickup?.coordinates;
                const drop = confirmation.drop?.coordinates;
                if (pickup && drop) {
                  const url = `https://www.google.com/maps/dir/?api=1&origin=${pickup[1]},${pickup[0]}&destination=${drop[1]},${drop[0]}&travelmode=driving`;
                  window.open(url, '_blank');
                }
              }}
              className="w-full bg-gradient-to-r from-[#16a34a] to-[#0ea5e9] text-white py-2 rounded-xl text-base font-bold shadow cursor-pointer mb-2 hover:opacity-90"
            >
              🚗 Navigate with Google Maps
            </button>
            <button className="w-full mt-2 border border-gray-300 py-2 rounded-xl text-base font-semibold cursor-pointer bg-white/70 hover:bg-gray-100" onClick={() => setConfirmation(null)}>
              Close
            </button>
          </div>
        </div>
      )}
      <div className="bg-card dark:bg-[#0d2233] p-8 rounded-2xl w-full max-w-md shadow-2xl border border-border">
      {/* 🔘 RIDE TYPE */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setRideType("oneway")}
          className={`flex-1 p-2 rounded-lg font-bold border-2 transition-colors duration-150 ${
            rideType === "oneway"
              ? "bg-primary text-black border-primary shadow"
              : "bg-white dark:bg-[#122c3f] text-black dark:text-white border-border hover:bg-primary/10"
          }`}
        >
          One Way
        </button>
        <button
          onClick={() => setRideType("hourly")}
          className={`flex-1 p-2 rounded-lg font-bold border-2 transition-colors duration-150 ${
            rideType === "hourly"
              ? "bg-primary text-black border-primary shadow"
              : "bg-white dark:bg-[#122c3f] text-black dark:text-white border-border hover:bg-primary/10"
          }`}
        >
          2h / 4h
        </button>
        <button
          onClick={() => setRideType("outstation")}
          className={`flex-1 p-2 rounded-lg font-bold border-2 transition-colors duration-150 ${
            rideType === "outstation"
              ? "bg-primary text-black border-primary shadow"
              : "bg-white dark:bg-[#122c3f] text-black dark:text-white border-border hover:bg-primary/10"
          }`}
        >
          Outstation
        </button>
      </div>
      <div className="relative mb-3">
        <input
          value={pickup}
          onChange={(e) => handleFieldChange('pickup', e.target.value)}
          onFocus={() => setActiveField('pickup')}
          onBlur={() => window.setTimeout(() => setActiveField((current) => (current === 'pickup' ? '' : current)), 150)}
          placeholder="Pickup location, area, city or state in India"
          className="w-full p-3 rounded-xl bg-white dark:bg-[#122c3f] text-black dark:text-white border border-border focus:ring-2 focus:ring-primary outline-none"
        />
        {loadingField === 'pickup' && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-300">Searching India locations...</div>
        )}
        {activeField === 'pickup' && suggestions.pickup.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 z-20 rounded-xl border border-border bg-white dark:bg-[#122c3f] shadow-xl max-h-56 overflow-y-auto">
            {suggestions.pickup.map((location) => (
              <button
                key={`${location.address}-${location.lat}-${location.lng}`}
                type="button"
                onMouseDown={(event) => {
                  event.preventDefault();
                  handleLocationSelect('pickup', location);
                }}
                className="w-full text-left px-3 py-3 text-sm text-black dark:text-white hover:bg-primary/10 border-b border-black/5 dark:border-white/5 last:border-b-0"
              >
                {location.address}
              </button>
            ))}
          </div>
        )}
      </div>
      {/* 🏁 DROP (only for one-way & outstation) */}
      {(rideType === "oneway" || rideType === "outstation") && (
        <div className="relative mb-3">
          <input
            value={drop}
            onChange={(e) => handleFieldChange('drop', e.target.value)}
            onFocus={() => setActiveField('drop')}
            onBlur={() => window.setTimeout(() => setActiveField((current) => (current === 'drop' ? '' : current)), 150)}
            placeholder="Destination area, city or state in India"
            className="w-full p-3 rounded-xl bg-white dark:bg-[#122c3f] text-black dark:text-white border border-border focus:ring-2 focus:ring-primary outline-none"
          />
          {loadingField === 'drop' && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-300">Searching India locations...</div>
          )}
          {activeField === 'drop' && suggestions.drop.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 z-20 rounded-xl border border-border bg-white dark:bg-[#122c3f] shadow-xl max-h-56 overflow-y-auto">
              {suggestions.drop.map((location) => (
                <button
                  key={`${location.address}-${location.lat}-${location.lng}`}
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    handleLocationSelect('drop', location);
                  }}
                  className="w-full text-left px-3 py-3 text-sm text-black dark:text-white hover:bg-primary/10 border-b border-black/5 dark:border-white/5 last:border-b-0"
                >
                  {location.address}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      {/* ⏱️ HOURS (only hourly) */}
      {rideType === "hourly" && (
        <select
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          className="w-full p-3 mb-3 rounded-xl bg-white dark:bg-[#122c3f] text-black dark:text-white border border-border focus:ring-2 focus:ring-primary outline-none"
        >
          <option value={2}>2 Hours</option>
          <option value={4}>4 Hours</option>
          <option value={8}>8 Hours</option>
        </select>
      )}
      {/* 🚀 BUTTON */}
      <button
        onClick={handleSearch}
        disabled={loading}
        className="w-full bg-primary hover:bg-green-400 py-3 rounded-2xl text-black font-extrabold text-lg shadow-lg transition-colors duration-150 mt-2 disabled:opacity-60"
      >
        {loading ? 'Booking...' : 'Book Ride'}
      </button>
      <p className="mt-3 text-xs text-gray-600 dark:text-gray-300">
        Type any India area, city or state such as Kanpur Nagar, Noida Sector 62, Indiranagar Bengaluru, or Jaipur Rajasthan.
      </p>
    </div>
    </>
  );
}
