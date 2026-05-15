import { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function FleetBookingsPage() {

  const [bookings, setBookings] = useState([]);
<<<<<<< HEAD
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicles, setSelectedVehicles] = useState({});

  useEffect(() => {
    fetchBookings();
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await api.get('/fleet/vehicles');
      setVehicles((res.data.vehicles || []).filter((vehicle) => vehicle.status === 'available'));
    } catch (err) {
      console.log(err);
    }
  };

=======

  useEffect(() => {
    fetchBookings();
  }, []);

>>>>>>> 75a1a7472bf64f17c60a8dbc480344b8287f1640
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
<<<<<<< HEAD
      const fleetVehicleId = selectedVehicles[id];

      await api.post(
        `/bookings/fleet/${id}/accept`,
        fleetVehicleId ? { fleetVehicleId } : {}
=======

      await api.post(
        `/bookings/fleet/${id}/accept`,
        {}
>>>>>>> 75a1a7472bf64f17c60a8dbc480344b8287f1640
      );

      alert('Booking Accepted');

      fetchBookings();
<<<<<<< HEAD
      fetchVehicles();
=======
>>>>>>> 75a1a7472bf64f17c60a8dbc480344b8287f1640

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

<<<<<<< HEAD
        {vehicles.length === 0 && (
          <div className="bg-yellow-500/10 border border-yellow-400/30 text-yellow-100 rounded-3xl p-5">
            Add at least one available cab in My Cabs to accept matching bookings.
          </div>
        )}

=======
>>>>>>> 75a1a7472bf64f17c60a8dbc480344b8287f1640
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

<<<<<<< HEAD
            <div className="mt-5 grid md:grid-cols-[1fr_auto] gap-3">
              <select
                value={selectedVehicles[booking._id] || ''}
                onChange={(e) =>
                  setSelectedVehicles((current) => ({
                    ...current,
                    [booking._id]: e.target.value,
                  }))
                }
                className="fleet-input"
              >
                <option value="">Auto-select best available cab</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle._id} value={vehicle._id}>
                    {vehicle.carType} - {vehicle.plateNumber} - {vehicle.brand} {vehicle.model}
                  </option>
                ))}
              </select>
            </div>

=======
>>>>>>> 75a1a7472bf64f17c60a8dbc480344b8287f1640
          </div>

        ))}

<<<<<<< HEAD
        {bookings.length === 0 && (
          <div className="bg-[#111827] p-8 rounded-3xl text-gray-300 border border-[#1f2937]">
            No matching booking requests right now.
          </div>
        )}

=======
>>>>>>> 75a1a7472bf64f17c60a8dbc480344b8287f1640
      </div>

    </div>
  );
}
