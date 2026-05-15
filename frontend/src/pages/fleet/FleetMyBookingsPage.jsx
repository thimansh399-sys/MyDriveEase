import { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function FleetMyBookingsPage() {

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {

    try {

      const res = await api.get(
        '/bookings/fleet/my'
      );

      setBookings(res.data.bookings || []);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>

      <h1 className="text-4xl font-bold mb-8">
        My Travel Partner Bookings
      </h1>

      <div className="grid gap-5">

        {bookings.map((booking) => (

          <div
            key={booking._id}
            className="bg-[#111827] p-6 rounded-3xl"
          >

            <p className="text-xl font-bold">
              {booking.pickup?.address}
            </p>

            <p className="mt-2 text-gray-400">
              To
            </p>

            <p className="text-xl font-bold mt-2">
              {booking.drop?.address}
            </p>

            <p className="mt-4 text-green-400 font-bold">
              ₹{booking?.fare?.total}
            </p>

            <p className="mt-3 inline-block bg-green-500 text-black px-4 py-2 rounded-full font-bold">
              {booking.status}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}
