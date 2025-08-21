import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; 
import "../assets/css/auth.css";


function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/auth/register", {
        name,
        email,
        password,
        role: "USER", // backend requires role
      });

      console.log(response);
      

      if (response.data.statusCode === 200) {
        alert("✅ Registration successful! Please login.");
        navigate("/login"); // redirect to login page
      } else {
        alert(`⚠️ ${response.data.message || "Registration failed"}`);
      }
    } catch (err) {
      console.error("❌ Registration failed:", err);
      alert("⚠️ Registration failed. User may already exist.");
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
              Join our community and start shopping today!
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="auth-form-section">
          <h2>Create Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="Alex Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
            <button type="submit" className="auth-button">
              Register
            </button>
          </form>
          <div className="auth-switch">
            Already have an account?
            <Link to="/login" className="switch-link">
              {" "}
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
