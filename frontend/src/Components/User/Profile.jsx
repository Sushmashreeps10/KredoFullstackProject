import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, ShoppingBag, LogOut, Search, ShoppingCart, Info, Sparkles, Check, HeartHandshake } from 'lucide-react';
import '../assets/css/Profile.css';
import { jwtDecode } from "jwt-decode";

// --- Header Component ---
const Header = () => (
    <header className="profile-main-header">
        <div className="header-container">
            <Link to="/dashboard" className="header-logo">Kredo</Link>
            <div className="header-actions">
                <Link to="/dashboard" className="header-button">
                    <Search size={20}/>
                </Link>
                <Link to="/cart" className="header-button">
                    <ShoppingCart size={20}/>
                </Link>
            </div>
        </div>
    </header>
);

// --- Footer Component ---
const Footer = () => (
    <footer className="profile-main-footer">
        <p>© {new Date().getFullYear()} Kredo. All Rights Reserved.</p>
    </footer>
);

// --- Profile Details (Verification Removed) ---
const ProfileDetailsView = ({ user }) => (
    <div className="content-card">
        <div className="content-header">
            <User className="header-icon" />
            <h2>Profile Details</h2>
        </div>
        <div className="details-grid">
            <div className="detail-item"><span className="detail-label">Full Name</span><span className="detail-value">{user.name}</span></div>
            <div className="detail-item"><span className="detail-label">Email Address</span><span className="detail-value">{user.email}</span></div>
            <div className="detail-item"><span className="detail-label">User ID</span><span className="detail-value">{user.id}</span></div>
            <div className="detail-item"><span className="detail-label">Account Role</span><span className="detail-value">{user.role}</span></div>
        </div>
    </div>
);

// --- Order History (Unchanged) ---
const OrderHistoryView = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.warn("No token found");
                    setLoading(false);
                    return;
                }
                const decoded = jwtDecode(token);
                const customerEmail = decoded.sub || decoded.email;
                if (!customerEmail) {
                    console.error("Email not found in token");
                    setLoading(false);
                    return;
                }
                const response = await fetch(
                    `http://localhost:8080/api/orders/get-by-email/${customerEmail}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (!response.ok) throw new Error("Failed to fetch orders");
                const data = await response.json();
                setOrders(data || []);
            } catch (error) {
                console.error("Error fetching orders:", error);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusClass = (status) => `status-${status?.toLowerCase()}`;

    if (loading) return <div className="loading-container">Loading orders...</div>;

    if (orders.length === 0) {
        return (
            <div className="content-card">
                <div className="content-header">
                    <ShoppingBag className="header-icon" />
                    <h2>Order History</h2>
                </div>
                <p className="no-orders-text">No orders yet</p>
            </div>
        );
    }

    return (
        <div className="content-card">
            <div className="content-header">
                <ShoppingBag className="header-icon" />
                <h2>Order History</h2>
            </div>
            <div className="order-list">
                {orders.map((order) => (
                    <div className="order-item-card" key={order.orderId}>
                        <div className="order-info">
                            <span className="order-id">#{order.orderId}</span>
                            <span className="order-date">{new Date(order.orderDate).toLocaleDateString()}</span>
                            <span className={`order-status ${getStatusClass(order.status)}`}>{order.status}</span>
                        </div>
                        <div className="order-details">
                            <p className="order-products">{order.items}</p>
                            <p className="order-total">₹{order.totalPrice.toLocaleString("en-IN")}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- NEW: Customer Service / About View ---
const CustomerServiceView = () => (
    <div className="content-card">
        <div className="content-header">
            <Info className="header-icon" />
            <h2>Welcome to Kredo</h2>
        </div>
        <div className="customer-service-content">
            <p className="intro-text">
                Your destination for curated style and timeless pieces. We believe shopping should be an inspiring and joyful experience.
            </p>
            <div className="service-section">
                <h3><Sparkles size={22} /> What Makes Us Special</h3>
                <ul className="feature-list">
                    <li className="feature-item">
                        <div className="feature-item-header"><Check size={18}/> Seamless Checkout </div>
                        <p>We've built a simple, user-friendly experience from browsing to checkout. Your order is finalized and sent for dispatch instantly.</p>
                    </li>
                    <li className="feature-item">
                        <div className="feature-item-header"><Check size={18}/> Quality Promise</div>
                        <p>We partner with trusted artisans and brands to bring you products that are made to last.</p>
                    </li>
                     <li className="feature-item">
                        <div className="feature-item-header"><Check size={18}/> Conscious Shopping</div>
                        <p>We are committed to offering sustainable and ethically-sourced options for a better future.</p>
                    </li>
                </ul>
            </div>
            <div className="service-section">
                <h3><HeartHandshake size={22} /> We're Here For You</h3>
                <p>
                    Have a question about your order, our products, or just want to say hello? Our dedicated support team is here to help you every step of the way.
                </p>
                <p>Contact us anytime at: <strong>sushre10@gmail.com</strong></p>
            </div>
        </div>
    </div>
);


// --- Main Profile (Updated) ---
const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState('profile');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
                    return;
                }
                const response = await fetch("http://localhost:8080/auth/user/get-profile", {
                    headers: { "Authorization": `Bearer ${token}` },
                });
                if (!response.ok) throw new Error("Failed to fetch profile");
                const data = await response.json();
                setUser(data.users);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (loading) return <div className="loading-container">Loading Profile...</div>;
    if (!user) return <div className="loading-container">Could not load profile. Please try logging in again.</div>;

    const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2);

    return (
        <div className="profile-layout-container">
            <Header />
            <div className="profile-page">
                <aside className="profile-sidebar">
                    <div className="sidebar-header">
                        <div className="user-avatar">{initials}</div>
                        <div className="user-info">
                            <h3 className="user-name">{user.name}</h3>
                            <p className="user-email">{user.email}</p>
                        </div>
                    </div>
                    <nav className="nav-menu">
                        <button onClick={() => setActiveView('profile')} className={`nav-item ${activeView === 'profile' ? 'active' : ''}`}>
                            <User /> Profile Details
                        </button>
                        <button onClick={() => setActiveView('orders')} className={`nav-item ${activeView === 'orders' ? 'active' : ''}`}>
                            <ShoppingBag /> Order History
                        </button>
                        {/* --- Replaced Security with Customer Service --- */}
                        <button onClick={() => setActiveView('service')} className={`nav-item ${activeView === 'service' ? 'active' : ''}`}>
                            <HeartHandshake /> Customer Service
                        </button>
                    </nav>
                    <div className="sidebar-footer">
                        <button onClick={handleLogout} className="logout-button">
                            <LogOut /> Logout
                        </button>
                    </div>
                </aside>
                <main className="profile-content">
                    {activeView === 'profile' && <ProfileDetailsView user={user} />}
                    {activeView === 'orders' && <OrderHistoryView />}
                    {/* --- Added Customer Service View --- */}
                    {activeView === 'service' && <CustomerServiceView />}
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default Profile;