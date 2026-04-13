import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, useMap } from 'react-leaflet';

function FitBounds({ fitBounds }) {
  const map = useMap();

  useEffect(() => {
    if (!fitBounds || fitBounds.length < 2) {
      return;
    }

    map.fitBounds(fitBounds, { padding: [32, 32] });
  }, [fitBounds, map]);

  return null;
}

function MapView({
  center = [20.5937, 78.9629],
  zoom = 13,
  markers = [],
  route = [],
  fitBounds = null,
  className = '',
  maxZoom = 20,
  minZoom = 4,
}) {
  const locationIqKey = import.meta.env.VITE_LOCATIONIQ_KEY;
  const tileUrl = locationIqKey
    ? `https://tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${locationIqKey}`
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const attribution = locationIqKey
    ? '&copy; LocationIQ, OpenStreetMap contributors'
    : '&copy; OpenStreetMap contributors';

  const computedCenter = useMemo(() => {
    if (markers.length === 1) return [markers[0].lat, markers[0].lng];
    if (markers.length >= 2) {
      const avgLat = markers.reduce((sum, m) => sum + m.lat, 0) / markers.length;
      const avgLng = markers.reduce((sum, m) => sum + m.lng, 0) / markers.length;
      return [avgLat, avgLng];
    }
    return center;
  }, [center, markers]);

  return (
    <div className={className}>
      <MapContainer center={computedCenter} zoom={zoom} minZoom={minZoom} maxZoom={maxZoom} className="h-full w-full rounded-2xl">
        <TileLayer
          attribution={attribution}
          url={tileUrl}
        />

        <FitBounds fitBounds={fitBounds} />

        {route.length > 1 && <Polyline positions={route} pathOptions={{ color: '#19e68c', weight: 5 }} />}

        {markers.map((m, idx) => {
          const color = m.popup === 'Pickup' ? '#19e68c' : m.popup === 'Drop-off' ? '#ef4444' : '#60a5fa';
          return (
            <CircleMarker
              key={`${m.lat}-${m.lng}-${idx}`}
              center={[m.lat, m.lng]}
              radius={8}
              pathOptions={{ color, fillColor: color, fillOpacity: 0.9 }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}

export default MapView;