import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const createCustomIcon = (emoji, size = 30) => {
  return L.divIcon({
    html: `<div style="font-size:${size}px;line-height:1;text-align:center">${emoji}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    className: '',
  });
};

export const pickupIcon = createCustomIcon('📍', 32);
export const dropIcon = createCustomIcon('🏁', 32);
export const driverIcon = createCustomIcon('🚗', 28);
export const driverOnlineIcon = createCustomIcon('🟢', 14);
export const userIcon = createCustomIcon('🧑', 28);

const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

const FitBounds = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length >= 2) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  return null;
};

const MapView = ({
  center = [20.5937, 78.9629],
  zoom = 13,
  markers = [],
  route = [],
  drivers = [],
  userLocation = null,
  fitBounds = null,
  children,
  className = 'h-[400px]',
}) => {
  return (
    <div className={`rounded-2xl overflow-hidden shadow-lg ${className}`}>
      <MapContainer center={center} zoom={zoom} className="w-full h-full" scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {fitBounds && <FitBounds bounds={fitBounds} />}

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>Your Location</Popup>
          </Marker>
        )}

        {markers.map((m, i) => (
          <Marker
            key={i}
            position={[m.lat, m.lng]}
            icon={m.icon || new L.Icon.Default()}
          >
            {m.popup && <Popup>{m.popup}</Popup>}
          </Marker>
        ))}

        {drivers.map((d) => (
          <Marker
            key={d._id}
            position={[d.location.coordinates[1], d.location.coordinates[0]]}
            icon={driverIcon}
          >
            <Popup>
              <div className="text-sm">
                <strong>{d.name}</strong>
                <br />
                {d.vehicle?.type} • ⭐ {d.rating}
                <br />
                <span className={d.status === 'online' ? 'text-green-600' : 'text-gray-400'}>
                  {d.status}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}

        {route.length > 0 && (
          <Polyline positions={route} color="#1f2937" weight={4} opacity={0.8} />
        )}

        {children}
      </MapContainer>
    </div>
  );
};

export default MapView;
