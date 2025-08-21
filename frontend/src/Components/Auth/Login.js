import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/css/auth.css";

export default function Login() {
  const navigate = useNavigate();

  // states for form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ===================================================================
    // --- NEW CODE: Hardcoded check for the admin user ---
    // This will bypass the normal backend call for this specific user.
    if (email === "sushma@kredo.com" && password === "sushma@kredo.com") {
      console.log("🔑 Admin bypass successful. Navigating to Admin Dashboard.");

      // Manually set the role so the PrivateRoute allows access.
      localStorage.setItem("role", "ADMIN");
      // You might also need to set a dummy token if your PrivateRoute checks for it.
      localStorage.setItem("token", "dummy-admin-token");
      
      navigate("/AdminDashboard");
      return; // IMPORTANT: This stops the function from calling the backend.
    }
    // --- END OF NEW CODE ---
    // ===================================================================


    // Regular login logic for all other users
    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });

      if (response.data.statusCode === 200) {
        console.log("✅ Login success:", response.data);

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("role", response.data.role);

        if (response.data.role === "ADMIN") {
          navigate("/AdminDashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError("Invalid email or password.");
        alert("❌ Invalid email or password. Please try again.");
      }
    } catch (err) {
      console.error("❌ Login failed:", err);
      setError("Invalid email or password. Please try again.");
      alert("❌ Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Branding Section */}
        <div className="auth-branding">
          <div className="branding-content">
            <h1 className="brand-logo">KREDO</h1>
            <p className="brand-tagline">Your Style, Your Store.</p>
            <p className="brand-welcome">
              Welcome back! Please log in to continue.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="auth-form-section">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email ID</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}

            <button type="submit" className="auth-button">
              Login
            </button>
          </form>
          <div className="auth-switch">
            Don’t have an account?
            <Link to="/register" className="switch-link">
              {" "}
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}