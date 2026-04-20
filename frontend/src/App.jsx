import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import MyRides from './pages/MyRides';
import RateRide from './pages/RateRide';
import LiveMap from './pages/LiveMap';
import DriverDashboard from './pages/DriverDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DriverRides from './pages/DriverRides';
import ProfileDashboard from './pages/ProfileDashboard';
import PaymentGateway from './pages/PaymentGateway';
import Plans from './pages/Plans';
import Insurance from './pages/Insurance';

import DriverLogin from './pages/DriverLogin';

import { useLocation } from 'react-router-dom';
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
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
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />

      {/* Dedicated Driver Login Route */}
      <Route path="/driver/login" element={<GuestRoute><DriverLogin /></GuestRoute>} />

      {/* User Routes */}
      <Route path="/drivers" element={<ProtectedRoute role="user"><Drivers /></ProtectedRoute>} />
      <Route path="/book" element={<ProtectedRoute role="user"><BookRide /></ProtectedRoute>} />
      <Route path="/plans" element={<Plans />} />
      <Route path="/insurance" element={<Insurance />} />
      <Route path="/track/:bookingId" element={<ProtectedRoute role="user"><TrackRide /></ProtectedRoute>} />
      <Route path="/my-rides" element={<ProtectedRoute role="user"><MyRides /></ProtectedRoute>} />
      <Route path="/rate/:bookingId" element={<ProtectedRoute role="user"><RateRide /></ProtectedRoute>} />
      <Route path="/track" element={<ProtectedRoute role="user"><LiveMap /></ProtectedRoute>} />

      <Route path="/payment" element={<ProtectedRoute role="user"><PaymentGateway /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfileDashboard /></ProtectedRoute>} />

      {/* Driver Routes */}

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />

      <Route path="/driver/dashboard" element={<ProtectedRoute role="driver"><DriverDashboard /></ProtectedRoute>} />
      <Route path="/driver/rides" element={<ProtectedRoute role="driver"><DriverRides /></ProtectedRoute>} />


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
