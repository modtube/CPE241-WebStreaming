// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import AuthLayout from './layouts/AuthLayout';
import CustomerLayout from './layouts/CustomerLayout';
import Login from './pages/auth/Login';
import AdminDashboard from './pages/admin/Dashboard';
import MoviesView from './pages/admin/Movies';
import ReviewsView from './pages/admin/Reviews';
import CrewView from './pages/admin/Crew';
import UserManagement from './pages/admin/UserManagement';
import TransactionsView from './pages/admin/Transactions';
import SetupsView from './pages/admin/Setups';
import Home from './pages/customer/Home';
import Profile from './pages/customer/Profile';

function App() {
  return (
    <Routes>
      {/* Public auth pages */}
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<Login />} />
        <Route path="login" element={<Login />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="movies" element={<MoviesView />} />
        <Route path="reviews" element={<ReviewsView />} />
        <Route path="crew" element={<CrewView />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="transactions" element={<TransactionsView />} />
        <Route path="setups" element={<SetupsView />} />
      </Route>

      {/* Customer Routes */}
      <Route path="/customer" element={<CustomerLayout />}>
        <Route index element={<Home />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Redirect unknown URLs back to login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;