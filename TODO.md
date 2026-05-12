# TODO — Fleet/Tour-Travel Proper Flow

- [ ] Backend: Update `backend/models/Fleet.js` to include `status`, `totalCars`, `availableCars`, and `cars[]` fields (keep existing fields).
- [x] Backend: Add Fleet accept endpoint in `backend/routes/bookings.js` => `POST /api/bookings/fleet/:id/accept`.

- [x] Backend: Add fleet socket room join in `backend/socket/index.js` => `join-fleet` and auto-join for `role=fleet`.

- [ ] Frontend: Add pages `FleetLogin.jsx`, `FleetRegister.jsx`, `FleetDashboard.jsx`.
- [ ] Frontend: Add Navbar item for Fleet Panel.
- [ ] Frontend: Wire socket notifications in FleetDashboard (listen `new-driver-booking` and render list).
- [ ] Test: Customer `/hire-driver` notifies all online fleets; fleet accept assigns booking.

