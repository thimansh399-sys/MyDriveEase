import { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function FleetDashboardPage() {

  const [stats, setStats] = useState({
    available: 0,
    myBookings: 0,
  });

  useEffect(() => {

    fetchDashboard();

  }, []);

  const fetchDashboard = async () => {

    try {

      const availableRes = await api.get(
        '/bookings/fleet/available'
      );

      const myRes = await api.get(
        '/bookings/fleet/my'
      );

      setStats({
        available: availableRes.data.bookings.length,
        myBookings: myRes.data.bookings.length,
      });

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>

      <h1 className="text-4xl font-bold mb-8">
        Travel Partner Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-5">

        <div className="bg-[#111827] p-6 rounded-3xl">
          <h2 className="text-gray-400">
            Available Bookings
          </h2>

          <p className="text-5xl font-bold mt-4 text-green-400">
            {stats.available}
          </p>
        </div>

        <div className="bg-[#111827] p-6 rounded-3xl">
          <h2 className="text-gray-400">
            My Accepted Rides
          </h2>

          <p className="text-5xl font-bold mt-4 text-blue-400">
            {stats.myBookings}
          </p>
        </div>

      </div>

    </div>
  );
}
