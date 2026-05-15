import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import NotificationList from './components/NotificationList';
import useNotifications from './hooks/useNotifications';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Drivers from './pages/Drivers';
import BookRide from './pages/BookRide';
import TrackRide from './pages/TrackRide';
import MyRides from './pages/MyTrips';
import RateRide from './pages/RateRide';
import LiveMap from './pages/LiveMap';
import AdminDashboard from './pages/AdminDashboard';
import ProfileDashboard from './pages/ProfileDashboard';
import FleetLayout from './pages/fleet/FleetLayout';
import FleetDashboardPage from './pages/fleet/FleetDashboardPage';
import FleetBookingsPage from './pages/fleet/FleetBookingsPage';
import FleetMyBookingsPage from './pages/fleet/FleetMyBookingsPage';
import FleetProfilePage from './pages/fleet/FleetProfilePage';

import FleetLogin from './pages/fleet/FleetLogin';
import FleetSignup from './pages/fleet/FleetSignup';
import PaymentGateway from './pages/PaymentGateway';
import Plans from './pages/Plans';
import Insurance from './pages/Insurance';
import Faqs from './pages/Faqs';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import HireDriver from "./pages/HireDriver";

import DriverLogin from './pages/DriverLogin';
import DriverProfilePage from './pages/DriverProfile';

import DriverLayout from './pages/driver/DriverLayout';
import DriverDashboardPage from './pages/driver/DriverDashboardPage';
import DriverRideRequestsPage from './pages/driver/DriverRideRequestsPage';
import DriverMyRidesPage from './pages/driver/DriverMyRidesPage';
import DriverEarningsPage from './pages/driver/DriverEarningsPage';



const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!user) {
    const loginPath =
      role === 'driver'
        ? '/driver/login'
        : role === 'fleet'
        ? '/fleet/login'
        : '/login';

    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/hire-driver" element={<HireDriver />} />
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
      <Route path="/fleet/login" element={<FleetLogin />} />
      <Route path="/fleet/signup" element={<FleetSignup />} />

      {/* Dedicated Driver Login Route */}
      <Route path="/driver/login" element={<GuestRoute><DriverLogin /></GuestRoute>} />

      {/* User Routes */}
      <Route path="/drivers" element={<ProtectedRoute role="user"><Drivers /></ProtectedRoute>} />
      <Route path="/book" element={<ProtectedRoute role="user"><BookRide /></ProtectedRoute>} />
      <Route path="/plans" element={<Plans />} />
      <Route path="/faqs" element={<Faqs />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/insurance" element={<Insurance />} />

      <Route path="/track/:bookingId" element={<ProtectedRoute role="user"><TrackRide /></ProtectedRoute>} />
      <Route path="/my-rides" element={<ProtectedRoute role="user"><MyRides /></ProtectedRoute>} />
      <Route path="/rate/:bookingId" element={<ProtectedRoute role="user"><RateRide /></ProtectedRoute>} />
      <Route path="/track" element={<ProtectedRoute role="user"><LiveMap /></ProtectedRoute>} />

      <Route path="/payment" element={<ProtectedRoute role="user"><PaymentGateway /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfileDashboard /></ProtectedRoute>} />

      {/* Driver Routes */}
      <Route
        path="/driver"
        element={
          <ProtectedRoute role="driver">
            <DriverLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DriverDashboardPage />} />
        <Route path="ride-requests" element={<DriverRideRequestsPage />} />
        <Route path="my-rides" element={<DriverMyRidesPage />} />
        <Route path="earnings" element={<DriverEarningsPage />} />
        <Route path="profile" element={<DriverProfilePage />} />
      </Route>
<Route
  path="/fleet"
  element={
    <ProtectedRoute role="fleet">
      <FleetLayout />
    </ProtectedRoute>
  }
>
  <Route
    path="dashboard"
    element={<FleetDashboardPage />}
  />

  <Route
    path="bookings"
    element={<FleetBookingsPage />}
  />

  <Route
    path="my-bookings"
    element={<FleetMyBookingsPage />}
  />

  <Route
    path="profile"
    element={<FleetProfilePage />}
  />
</Route>

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />




      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  const { notifications, addNotification } = useNotifications();
  // Optionally, pass addNotification via context or props for use in pages
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a1019]">
          <Navbar />
          <AppRoutes />
          <NotificationList notifications={notifications} />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
