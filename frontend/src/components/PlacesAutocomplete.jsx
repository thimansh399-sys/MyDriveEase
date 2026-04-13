import React, { useEffect, useRef, useState } from 'react';
import { searchIndiaLocations } from '../utils/places';

export default function PlacesAutocomplete({ value, onPlaceSelected, placeholder, className }) {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const query = value.trim();
    if (query.length < 3) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      setIsLoading(true);

      try {
        const results = await searchIndiaLocations(query);
        if (requestIdRef.current === requestId) {
          setSuggestions(results);
        }
      } catch {
        if (requestIdRef.current === requestId) {
          setSuggestions([]);
        }
      } finally {
        if (requestIdRef.current === requestId) {
          setIsLoading(false);
        }
      }
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [value]);

  return (
    <div className="relative">
      <input
        value={value}
        onChange={(event) => onPlaceSelected({ address: event.target.value, lat: null, lng: null })}
        onFocus={() => setIsFocused(true)}
        onBlur={() => window.setTimeout(() => setIsFocused(false), 150)}
        placeholder={placeholder}
        className={className}
      />

      {isLoading && (
        <div className="mt-2 text-xs text-gray-300">Searching India locations...</div>
      )}

      {isFocused && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 z-20 rounded-xl border border-[#19e68c]/30 bg-[#122c3f] shadow-xl max-h-56 overflow-y-auto">
          {suggestions.map((location) => (
            <button
              key={`${location.address}-${location.lat}-${location.lng}`}
              type="button"
              onMouseDown={(event) => {
                event.preventDefault();
                onPlaceSelected(location);
                setIsFocused(false);
                setSuggestions([]);
              }}
              className="w-full text-left px-3 py-3 text-sm text-white hover:bg-[#19e68c]/10 border-b border-white/5 last:border-b-0"
            >
              {location.address}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
