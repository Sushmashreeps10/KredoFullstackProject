import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import Dashboard from "./Components/User/Dashboard";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import UserManagement from "./Components/Admin/UserManagement";
import ProductManagement from "./Components/Admin/ProductManagement";
import Profile from "./Components/User/Profile";
import Banner from "./Components/User/Banner";
import PrivateRoute from "./Components/PrivateRoute";
import OrderHistory from "./Components/Admin/OrderHistory";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute role="USER">
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute role="USER">
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/Banner"
          element={
            <PrivateRoute role="USER">
              <Banner />
            </PrivateRoute>
          }
        />
        <Route
          path="/OrderHistory"
          element={
            <PrivateRoute role="ADMIN">
              <OrderHistory />
            </PrivateRoute>
          }
        />

        {/* Admin Only Routes */}
        <Route
          path="/AdminDashboard"
          element={
            <PrivateRoute role="ADMIN">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <PrivateRoute role="ADMIN">
              <UserManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <PrivateRoute role="ADMIN">
              <ProductManagement />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;