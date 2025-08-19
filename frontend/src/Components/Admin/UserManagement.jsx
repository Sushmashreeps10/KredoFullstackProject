import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, X, Edit, Trash2, Check, Truck, Package, XCircle } from 'lucide-react';
import '../assets/css/userManagement.css';

// --- MOCK DATA ---
const initialUsers = [
  { id: 'usr_001', name: 'Sushma Shree', email: 'sushma@example.com', password: '●●●●●●●●●●●', orders: [
    { id: 'ORD123', items: 'Aura Headphones, Quantum Watch', total: 27498, status: 'Delivered' },
    { id: 'ORD456', items: 'Floral Sundress', total: 1499, status: 'Shipped' },
  ]},
  { id: 'usr_002', name: 'Alex Doe', email: 'alex@example.com', password: '●●●●●●●●●●●', orders: [
    { id: 'ORD789', items: 'Pro Laptop', total: 125000, status: 'Pending' },
  ]},
  { id: 'usr_003', name: 'Jane Smith', email: 'jane@example.com', password: '●●●●●●●●●●●', orders: [
    { id: 'ORD101', items: 'Scented Soy Candle', total: 899, status: 'Cancelled' },
    { id: 'ORD112', items: 'Leather Crossbody Bag', total: 4500, status: 'Delivered' },
  ]},
];

// --- User Details Modal Component ---
const UserDetailsModal = ({ user, onClose, onUpdateStatus, onUpdateUser, onDeleteUser }) => {
  if (!user) return null;

  const statusOptions = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content user-details-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">User Details</h2>
          <button onClick={onClose} className="modal-close-btn"><X /></button>
        </div>
        
        <div className="modal-body">
          {/* Personal Info */}
          <div className="details-section">
            <h4>Personal Information</h4>
            <div className="info-grid">
              <p><strong>User ID:</strong> {user.id}</p>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Password:</strong> {user.password}</p>
            </div>
          </div>

          {/* Order History */}
          <div className="details-section">
            <h4>Order History</h4>
            <div className="order-list">
              {user.orders.length > 0 ? user.orders.map(order => (
                <div key={order.id} className="order-item">
                  <div className="order-info">
                    <p><strong>Order ID:</strong> {order.id}</p>
                    <p><strong>Items:</strong> {order.items}</p>
                    <p><strong>Total:</strong> ₹{order.total.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="order-status-updater">
                    <label>Status:</label>
                    <div className="status-buttons">
                      {statusOptions.map(status => (
                        <button 
                          key={status}
                          className={`status-btn ${status.toLowerCase()} ${order.status === status ? 'active' : ''}`}
                          onClick={() => onUpdateStatus(user.id, order.id, status)}
                        >
                          {status === 'Shipped' && <Truck size={16} />}
                          {status === 'Delivered' && <Check size={16} />}
                          {status === 'Pending' && <Package size={16} />}
                          {status === 'Cancelled' && <XCircle size={16} />}
                          <span>{status}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )) : <p>No orders found for this user.</p>}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={() => onDeleteUser(user.id)} className="btn btn-danger"><Trash2 /> Delete User</button>
          <button onClick={() => onUpdateUser(user)} className="btn btn-primary"><Edit /> Update User</button>
        </div>
      </div>
    </div>
  );
};


export default function UserManagement() {
  const [users, setUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleViewDetails = (user) => {
    setSelectedUser(user);
  };

  const handleUpdateStatus = (userId, orderId, newStatus) => {
    setUsers(prevUsers => prevUsers.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          orders: user.orders.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        };
      }
      return user;
    }));
    // Also update the selected user to reflect changes immediately in the modal
    setSelectedUser(prevUser => ({
        ...prevUser,
        orders: prevUser.orders.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
        )
    }));
  };

  const handleUpdateUser = (user) => {
    // Placeholder for update logic
    alert(`Update functionality for ${user.name} would be implemented here.`);
  };

  const handleDeleteUser = (userId) => {
    // Placeholder for delete logic
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      setSelectedUser(null); // Close modal after deletion
      alert(`User ${userId} has been deleted.`);
    }
  };

  return (
    <div className="management-page">
      <header className="management-header">
        <div className="management-header-container">
          <Link to="/AdminDashboard" className="header-logo">Kredo</Link>
        </div>
      </header>

      <main className="management-content">
        <div className="content-header">
          <Users size={32} />
          <h1>User Management</h1>
        </div>
        
        <div className="user-table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <button onClick={() => handleViewDetails(user)} className="btn btn-view">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {selectedUser && (
        <UserDetailsModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)}
          onUpdateStatus={handleUpdateStatus}
          onUpdateUser={handleUpdateUser}
          onDeleteUser={handleDeleteUser}
        />
      )}
    </div>
  );
}
