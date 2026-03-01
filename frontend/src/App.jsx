import React from 'react';
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Properties from "./pages/Properties";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PropertyDetails from "./pages/PropertyDetails";
import SellerDashboard from "./pages/SellerDashboard";
import AddProperty from "./pages/AddProperty";
import EditProperty from "./pages/EditProperty";
import MyProperties from "./pages/MyProperties";
import Wishlist from "./pages/Wishlist";
import MyInquiries from "./pages/MyInquiries";
import Profile from "./pages/Profile";
import ChatMessages from "./pages/ChatMessages";
import SellerLayout from "./components/SellerLayout";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminProperties from "./pages/AdminProperties";
import AdminInquiries from "./pages/AdminInquiries";
import { ProtectedRoute, PublicRoute } from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import AIChatAssistant from "./components/AIChatAssistant";

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
        </Route>

        {/* Fully Public Routes (Always accessible) */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/property/:id" element={<PropertyDetails />} />

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