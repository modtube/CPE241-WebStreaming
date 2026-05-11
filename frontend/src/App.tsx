// src/App.tsx
// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import AuthLayout from "./layouts/AuthLayout";
import CustomerLayout from "./layouts/CustomerLayout";
import Login from "./pages/auth/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import MoviesView from "./pages/admin/Movie/Movies";
import ReviewsView from "./pages/admin/Review/Reviews";
import CrewView from "./pages/admin/Crew/Crew";
import CrewForm from "./pages/admin/Crew/CrewForm";
import UserManagement from "./pages/admin/User/User";
import TransactionsView from "./pages/admin/Transaction/Transactions";
import TransactionDetail from "./pages/admin/Transaction/TransactionDetail";
import SetupsView from "./pages/admin/Setup/Setups";
import Home from "./pages/customer/Home";
import PersonalLibrary from "./pages/customer/PersonalLibrary";
import Playlists from "./pages/customer/Playlists";
import TransactionHistory from "./pages/customer/TransactionHistory";
import EditProfile from "./pages/customer/EditProfile";

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
        <Route path="crew/add" element={<CrewForm />} />
        <Route path="crew/edit/:id" element={<CrewForm />} />        
        <Route path="users" element={<UserManagement />} />
        <Route path="transactions" element={<TransactionsView />} />
        <Route path="transactions/:id" element={<TransactionDetail />} />
        <Route path="setups" element={<SetupsView />} />
      </Route>

      {/* Customer Routes */}
      <Route path="/customer" element={<CustomerLayout />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="personal-library" element={<PersonalLibrary />} />
        <Route path="playlists" element={<Playlists />} />
        <Route path="transaction-history" element={<TransactionHistory />} />
        <Route path="edit-profile" element={<EditProfile />} />
      </Route>

      {/* Redirect unknown URLs back to login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
export default App;
