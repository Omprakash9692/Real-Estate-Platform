import React from 'react';
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import LandingPage from "./pages/shared/LandingPage";
import Properties from "./pages/shared/Properties";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PropertyDetails from "./pages/shared/PropertyDetails";
import SellerDashboard from "./pages/seller/SellerDashboard";
import AddProperty from "./pages/seller/AddProperty";
import EditProperty from "./pages/seller/EditProperty";
import MyProperties from "./pages/seller/MyProperties";
import Wishlist from "./pages/buyer/Wishlist";
import MyInquiries from "./pages/buyer/MyInquiries";
import Profile from "./pages/shared/Profile";
import ChatMessages from "./pages/shared/ChatMessages";
import SellerLayout from "./components/SellerLayout";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminInquiries from "./pages/admin/AdminInquiries";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import SellerProfile from "./pages/shared/SellerProfile";
import { ProtectedRoute, PublicRoute } from "./components/common/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import AIChatAssistant from "./components/common/AIChatAssistant";

// Smart Layout Wrapper to dynamically apply SellerLayout for Sellers
const SellerLayoutWrapper = () => {
  const { user } = useAuth();
  return user?.role === 'seller' ? <SellerLayout /> : <Outlet />;
};

function App() {
  const { user } = useAuth();
  return (
    <>
      <Routes>
        {/* Public-only Routes (Redirects if already logged in) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

        {/* Fully Public Routes (Always accessible) */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/seller/:id" element={<SellerProfile />} />

        {/* Protected Routes (Requires Login) */}
        <Route element={<ProtectedRoute allowedRoles={['buyer', 'seller', 'admin']} />}>
          {/* Dynamic Sidebar/Navbar Wrapper */}
          <Route element={<SellerLayoutWrapper />}>
            <Route path="/inquiries" element={<MyInquiries />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/chat-messages" element={<ChatMessages />} />
          </Route>

          {/* Seller-Only Management */}
          <Route element={<ProtectedRoute allowedRoles={['seller']} />}>
            <Route element={<SellerLayout />}>
              <Route path="/dashboard" element={<SellerDashboard />} />
              <Route path="/seller-dashboard" element={<SellerDashboard />} />
              <Route path="/add-property" element={<AddProperty />} />
              <Route path="/edit-property/:id" element={<EditProperty />} />
              <Route path="/my-properties" element={<MyProperties />} />
            </Route>
          </Route>

          {/* Admin-Only Management */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/properties" element={<AdminProperties />} />
              <Route path="/admin/inquiries" element={<AdminInquiries />} />
            </Route>
          </Route>
        </Route>

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {user?.role === 'buyer' && <AIChatAssistant />}
    </>
  );
}

export default App;