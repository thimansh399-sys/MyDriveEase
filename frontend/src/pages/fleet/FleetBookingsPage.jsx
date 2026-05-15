import { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function FleetBookingsPage() {

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {

    try {

      const res = await api.get(
        '/bookings/fleet/available'
      );

      setBookings(res.data.bookings || []);

    } catch (err) {
      console.log(err);
    }
  };

  const acceptBooking = async (id) => {

    try {

      await api.post(
        `/bookings/fleet/${id}/accept`,
        {}
      );

      alert('Booking Accepted');

      fetchBookings();

    } catch (err) {

      alert(
        err?.response?.data?.message ||
        'Failed to accept booking'
      );
    }
  };

  return (
    <div>

      <h1 className="text-4xl font-bold mb-8">
        Travel Partner Available Bookings
      </h1>

      <div className="grid gap-5">

        {bookings.map((booking) => (

          <div
            key={booking._id}
            className="bg-[#111827] p-6 rounded-3xl"
          >

            <div className="flex justify-between items-center">

              <div>

                <p className="text-lg font-bold">
                  {booking.pickup?.address}
                </p>

                <p className="text-gray-400 mt-2">
                  TO
                </p>

                <p className="text-lg font-bold mt-2">
                  {booking.drop?.address}
                </p>

                <p className="mt-4 text-green-400 font-bold">
                  ₹{booking?.fare?.total}
                </p>

              </div>

              <button
                onClick={() => acceptBooking(booking._id)}
                className="bg-green-500 hover:bg-green-400 text-black px-6 py-3 rounded-xl font-bold"
              >
                Accept Ride
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}
