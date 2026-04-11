import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { getSocket } from '../utils/socket';
import MapView from '../components/MapView';
import LoadingSpinner from '../components/LoadingSpinner';
import { getUserLocation } from '../utils/helpers';

const LiveMap = () => {
  const [drivers, setDrivers] = useState([]);
  const [userLoc, setUserLoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on('driver-moved', (data) => {
      setDrivers((prev) => {
        const idx = prev.findIndex((d) => d._id === data.driverId);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = {
            ...updated[idx],
            location: {
              type: 'Point',
              coordinates: [data.location.lng, data.location.lat],
            },
          };
          return updated;
        }
        return prev;
      });
    });

    return () => {
      socket.off('driver-moved');
    };
  }, []);

  const init = async () => {
    try {
      const loc = await getUserLocation();
      setUserLoc(loc);

      const res = await api.get('/drivers/nearby', {
        params: { lng: loc.lng, lat: loc.lat, maxDistance: 20000 },
      });
      setDrivers(res.data);
    } catch {
      try {
        const res = await api.get('/drivers/all');
        setDrivers(res.data);
      } catch { /* ignore */ }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading map..." />;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">🗺️ Live Map</h1>
          <span className="text-sm text-gray-500">
            {drivers.filter((d) => d.status === 'online').length} drivers online
          </span>
        </div>

        <MapView
          center={userLoc ? [userLoc.lat, userLoc.lng] : [20.5937, 78.9629]}
          zoom={13}
          userLocation={userLoc}
          drivers={drivers}
          className="h-[calc(100vh-160px)]"
        />
      </div>
    </div>
  );
};

export default LiveMap;
