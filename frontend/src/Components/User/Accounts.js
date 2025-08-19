import React, { useState } from 'react';
import { User, ShoppingBag, Lock, Mail, LogOut, ChevronRight, Facebook, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../assets/css/accounts.css';
import '../assets/css/footer.css';

// --- MOCK DATA ---
const userData = {
  name: 'Sushma Shree',
  email: 'sushma@example.com',
  mobile: '+91 98765 43210',
  isEmailVerified: false,
};

const orderHistory = [
  { id: 'OD123456789', date: '15 Aug 2025', total: 2499, status: 'Delivered', items: ['Aura Headphones', 'Quantum Watch'] },
  { id: 'OD987654321', date: '02 Jul 2025', total: 899, status: 'Delivered', items: ['Floral Sundress'] },
  { id: 'OD555444333', date: '20 Jun 2025', total: 1250, status: 'Cancelled', items: ['Organic Avocados'] },
];

const categories = ["Electronics", "Womens Wear", "Mens Wear", "Kids Wear", "Groceries", "Accessories", "Makeup & Skincare", "Home Decor"];


// --- HEADER & FOOTER COMPONENTS ---

const Header = () => (
    <header className="accounts-header">
        <div className="accounts-header-container">
            <Link to="/dashboard" className="accounts-header-logo">Kredo</Link>
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
                    <li><a href="/Dashboard">Our Story</a></li>
                    <li><a href="/Dashboard">Careers</a></li>
                    <li><a href="/Dashboard">Press</a></li>
                </ul>
            </div>
            <div className="footer-section">
                <h4 className="footer-heading">Connect</h4>
                <div className="social-links">
                    <a href="https://www.facebook.com/profile.php?id=61571521810044"><Facebook /></a>
                    <a href="https://x.com/Sushmashreeps10"><Twitter /></a>
                    <a href="https://www.instagram.com/sushma__.10/#"><Instagram /></a>
                </div>
            </div>
        </div>
        <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Kredo. All Rights Reserved.</p>
        </div>
    </footer>
);


// --- SUB-COMPONENTS for different views ---

const ProfileView = ({ user }) => (
  <div className="account-view">
    <h3>My Profile</h3>
    <div className="profile-details">
      <div className="detail-item">
        <span className="label">Full Name</span>
        <span className="value">{user.name}</span>
      </div>
      <div className="detail-item">
        <span className="label">Email ID</span>
        <span className="value">{user.email} {user.isEmailVerified ? <span className="verified">(Verified)</span> : <span className="not-verified">(Not Verified)</span>}</span>
      </div>
      <div className="detail-item">
        <span className="label">Mobile Number</span>
        <span className="value">{user.mobile}</span>
      </div>
    </div>
    {!user.isEmailVerified && <button className="action-button verify-btn">Verify Email</button>}
  </div>
);

const OrderHistoryView = () => (
  <div className="account-view">
    <h3>Order History</h3>
    <div className="order-list">
      {orderHistory.map(order => (
        <div key={order.id} className={`order-card ${order.status.toLowerCase()}`}>
          <div className="order-header">
            <span>Order ID: {order.id}</span>
            <span>Status: {order.status}</span>
          </div>
          <div className="order-body">
            <p><strong>Items:</strong> {order.items.join(', ')}</p>
          </div>
          <div className="order-footer">
            <span>Ordered on: {order.date}</span>
            <span>Total: ₹{order.total.toLocaleString('en-IN')}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ChangePasswordView = () => (
    <div className="account-view">
        <h3>Change Password</h3>
        <form className="password-form">
            <div className="input-group">
                <label htmlFor="current-password">Current Password</label>
                <input id="current-password" type="password" placeholder="••••••••" />
            </div>
            <div className="input-group">
                <label htmlFor="new-password">New Password</label>
                <input id="new-password" type="password" placeholder="••••••••" />
            </div>
            <div className="input-group">
                <label htmlFor="confirm-password">Confirm New Password</label>
                <input id="confirm-password" type="password" placeholder="••••••••" />
            </div>
            <button type="submit" className="action-button">Update Password</button>
        </form>
    </div>
);


export default function Accounts() {
  const [activeView, setActiveView] = useState('profile');

  const renderView = () => {
    switch (activeView) {
      case 'orders':
        return <OrderHistoryView />;
      case 'password':
        return <ChangePasswordView />;
      case 'profile':
      default:
        return <ProfileView user={userData} />;
    }
  };

  return (
    <div className="accounts-page-wrapper">
      <Header />
      <div className="accounts-page-container">
        <div className="accounts-page">
          {/* Sidebar */}
          <aside className="sidebar">
            <div className="sidebar-header">
              <User size={40} />
              <div className="user-info">
                <span>Hello,</span>
                <h4>{userData.name}</h4>
              </div>
            </div>
            <nav className="sidebar-nav">
              <button onClick={() => setActiveView('profile')} className={activeView === 'profile' ? 'active' : ''}>
                <User /> My Profile <ChevronRight />
              </button>
              <button onClick={() => setActiveView('orders')} className={activeView === 'orders' ? 'active' : ''}>
                <ShoppingBag /> Order History <ChevronRight />
              </button>
              <button onClick={() => setActiveView('password')} className={activeView === 'password' ? 'active' : ''}>
                <Lock /> Change Password <ChevronRight />
              </button>
              <Link to="/" className="logout-link">
                <LogOut /> Logout
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="content-area">
            {renderView()}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
