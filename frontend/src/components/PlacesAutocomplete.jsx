import React from 'react';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

export default function PlacesAutocomplete({ value, onPlaceSelected, placeholder, className }) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const autocompleteRef = React.useRef(null);

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.formatted_address && place.geometry) {
      onPlaceSelected({
        address: place.formatted_address,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <input value={value} disabled placeholder="Loading..." className={className} />;

  return (
    <Autocomplete
      onLoad={ref => (autocompleteRef.current = ref)}
      onPlaceChanged={handlePlaceChanged}
      fields={["formatted_address", "geometry"]}
    >
      <input
        value={value}
        onChange={e => onPlaceSelected({ address: e.target.value, lat: null, lng: null })}
        placeholder={placeholder}
        className={className}
      />
    </Autocomplete>
  );
}
