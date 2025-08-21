import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, ShoppingBag, Package, Facebook, Twitter, Instagram } from 'lucide-react';
import '../assets/css/adminDashboard.css';

// --- MOCK DATA ---
const adminData = {
    name: 'Sushmashree PS',
    mobile: '70192 *****',
    email: 'sushma@kredo.com',
    role: 'Admin Management',
    lastLogin: '20 Aug 2025, 04:00 PM',
    accountStatus: 'Active',
};

const categories = ["Electronics", "Womens Wear", "Mens Wear", "Kids Wear", "Groceries", "Accessories", "Makeup & Skincare", "Home Decor"];

// --- Reusable Components ---
const Header = () => (
    <header className="admin-header">
        <div className="admin-header-container">
            <h1 className="admin-header-logo">Kredo</h1>
        </div>
    </header>
);

const Footer = () => (
    <footer className="footer">
        <div className="footer-container">
            <div className="footer-section">
                <h3 className="footer-logo">Kredo</h3>
                <p className="footer-tagline">Your Style, Your Store.</p>
            </div>
            <div className="footer-section">
                <h4 className="footer-heading">Shop</h4>
                <ul className="footer-links">
                    {categories.map(cat => <li key={cat}><a href="#">{cat}</a></li>)}
                </ul>
            </div>
            <div className="footer-section">
                <h4 className="footer-heading">About</h4>
                <ul className="footer-links">
                    <li><a href="#">Our Story</a></li>
                    <li><a href="#">Careers</a></li>
                    <li><a href="#">Press</a></li>
                </ul>
            </div>
            <div className="footer-section">
                <h4 className="footer-heading">Connect</h4>
                <div className="social-links">
                    <a href="#"><Facebook /></a>
                    <a href="#"><Twitter /></a>
                    <a href="#"><Instagram /></a>
                </div>
            </div>
        </div>
        <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Kredo. All Rights Reserved.</p>
        </div>
    </footer>
);

export default function AdminDashboard() {
    return (
        <div className="admin-dashboard-wrapper">
            <Header />
            <main className="admin-main-content">
                <div className="admin-details-card">
                    <div className="admin-card-header">
                        <Shield size={32} />
                        <h2>Admin Details</h2>
                    </div>
                    <div className="admin-details-grid">
                        <div className="detail-item">
                            <span className="label">Admin Name</span>
                            <span className="value">{adminData.name}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Contact Number</span>
                            <span className="value">{adminData.mobile}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Email ID</span>
                            <span className="value">{adminData.email}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Password</span>
                            <span className="value">••••••••••••</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Role</span>
                            <span className="value">{adminData.role}</span>
                        </div>
                         <div className="detail-item">
                            <span className="label">Account Status</span>
                            <span className="value status-active">{adminData.accountStatus}</span>
                        </div>
                         <div className="detail-item full-width">
                            <span className="label">Last Login</span>
                            <span className="value">{adminData.lastLogin}</span>
                        </div>
                    </div>
                </div>

                <div className="management-actions">
                    <Link to="/admin/users" className="management-button">
                        <Users size={28} />
                        <span>User Management</span>
                    </Link>
                    <Link to="/admin/products" className="management-button">
                        <ShoppingBag size={28} />
                        <span>Product Management</span>
                    </Link>
                    {/* --- COMBINED ORDER BUTTON --- */}
                    <Link to="/OrderHistory" className="management-button">
                        <Package size={28} />
                        <span>Order Management</span>
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}