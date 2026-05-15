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

<<<<<<< HEAD
  const completeBooking = async (id) => {
    try {
      await api.post(`/bookings/fleet/${id}/complete`);
      alert('Booking completed');
      fetchBookings();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to complete booking');
    }
  };

  const releaseBooking = async (id) => {
    if (!window.confirm('Release this booking and make the cab available again?')) return;

    try {
      await api.post(`/bookings/fleet/${id}/cancel`);
      alert('Booking released');
      fetchBookings();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to release booking');
    }
  };

=======
>>>>>>> 75a1a7472bf64f17c60a8dbc480344b8287f1640
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

<<<<<<< HEAD
            {booking.fleetVehicleId && (
              <div className="mt-4 bg-[#1f2937] rounded-2xl p-4 text-sm text-gray-200">
                <p className="font-bold text-white">
                  Assigned Cab: {booking.fleetVehicleId.carType} - {booking.fleetVehicleId.plateNumber}
                </p>
                <p className="mt-1">
                  {[booking.fleetVehicleId.brand, booking.fleetVehicleId.model].filter(Boolean).join(' ')}
                </p>
                <p className="mt-1">
                  Driver: {booking.fleetVehicleId.driverName || 'Not assigned'} {booking.fleetVehicleId.driverPhone ? `• ${booking.fleetVehicleId.driverPhone}` : ''}
                </p>
              </div>
            )}

            {booking.status !== 'completed' && (
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => completeBooking(booking._id)}
                  className="bg-green-500 text-black px-5 py-3 rounded-xl font-bold"
                >
                  Mark Completed
                </button>
                <button
                  onClick={() => releaseBooking(booking._id)}
                  className="bg-red-500 px-5 py-3 rounded-xl font-bold"
                >
                  Release Booking
                </button>
              </div>
            )}

=======
>>>>>>> 75a1a7472bf64f17c60a8dbc480344b8287f1640
          </div>

        ))}

<<<<<<< HEAD
        {bookings.length === 0 && (
          <div className="bg-[#111827] p-8 rounded-3xl text-gray-300 border border-[#1f2937]">
            No accepted bookings yet.
          </div>
        )}

=======
>>>>>>> 75a1a7472bf64f17c60a8dbc480344b8287f1640
      </div>

    </div>
  );
}
