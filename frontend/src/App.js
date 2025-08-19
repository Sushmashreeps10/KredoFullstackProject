import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import Dashboard from "./Components/User/Dashboard";
import Accounts from "./Components/User/Accounts";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import UserManagement from "./Components/Admin/UserManagement";
import ProductManagement from "./Components/Admin/ProductManagement"; // Corrected import name


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Accounts" element={<Accounts />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/products" element={<ProductManagement />} /> {/* Corrected component name */}

      </Routes>
    </Router>
  );
}

export default App;
