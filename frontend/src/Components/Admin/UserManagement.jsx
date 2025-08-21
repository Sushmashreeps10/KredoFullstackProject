import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Users, X, Edit, Trash2, Search, UserCheck, UserX, BarChart2 } from 'lucide-react';
import '../assets/css/userManagement.css'; // We will use the new CSS below

// --- User Card Component ---
const UserCard = ({ user, onSelectUser }) => (
    <div className="user-card" onClick={() => onSelectUser(user)}>
        <img 
            src={`https://ui-avatars.com/api/?name=${user.name.replace(/\s/g, '+')}&background=E9D5FF&color=6B21A8`} 
            alt={user.name} 
            className="user-avatar"
        />
        <div className="user-card-info">
            <h3 className="user-card-name">{user.name}</h3>
            <p className="user-card-email">{user.email}</p>
        </div>
        <span className={`user-status-badge status-${user.status.toLowerCase()}`}>
            {user.status}
        </span>
    </div>
);


// --- User Details Modal Component (Redesigned) ---
const UserDetailsModal = ({ user, onClose, onUpdateUser, onDeleteUser }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);

    const handleUpdate = () => onUpdateUser(user.id, { name, email });
    const handleDelete = () => onDeleteUser(user.id);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content user-details-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">User Profile</h2>
                    <button onClick={onClose} className="modal-close-btn"><X /></button>
                </div>
                
                <div className="modal-body">
                    <div className="profile-summary">
                        <img 
                            src={`https://ui-avatars.com/api/?name=${name.replace(/\s/g, '+')}&background=F3E8FF&color=9333EA&size=96`} 
                            alt={name} 
                            className="profile-avatar"
                        />
                        <div className="profile-summary-text">
                           <input type="text" className="profile-name-input" value={name} onChange={e => setName(e.target.value)} />
                           <input type="email" className="profile-email-input" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                    </div>

                    <div className="details-section">
                        <h4>Account Information</h4>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">User ID</span>
                                <span className="info-value">{user.id}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Status</span>
                                <span className={`user-status-badge status-${user.status.toLowerCase()}`}>{user.status}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Member Since</span>
                                <span className="info-value">{new Date(user.createdAt).toLocaleDateString('en-IN')}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Last Login</span>
                                <span className="info-value">{new Date(user.lastLogin).toLocaleString('en-IN')}</span>
                            </div>
                             <div className="info-item">
                                <span className="info-label">Role</span>
                                <span className="info-value">{user.role}</span>
                            </div>
                             <div className="info-item">
                                <span className="info-label">Total Orders</span>
                                <span className="info-value">{user.totalOrders}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button onClick={handleDelete} className="btn btn-danger"><Trash2 size={16} /> Delete User</button>
                    <button onClick={handleUpdate} className="btn btn-primary"><Edit size={16} /> Save Changes</button>
                </div>
            </div>
        </div>
    );
};

// --- Main User Management Page ---
export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/auth/admin/get-all-users', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data && response.data.usersList) {
                    const userList = response.data.usersList
                        .filter(u => u.role === 'USER')
                        // Add mock data for a richer UI until backend provides it
                        .map(u => ({
                            ...u,
                            status: Math.random() > 0.3 ? 'Active' : 'Inactive',
                            createdAt: new Date(Date.now() - Math.random() * 3e10).toISOString(),
                            lastLogin: new Date(Date.now() - Math.random() * 1e9).toISOString(),
                            totalOrders: Math.floor(Math.random() * 20),
                        }));
                    setUsers(userList);
                }
            } catch (err) {
                console.error('Error fetching users:', err);
            }
        };
        if (token) fetchUsers();
    }, [token]);

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  user.email.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [users, searchQuery, statusFilter]);

    const stats = useMemo(() => ({
        total: users.length,
        active: users.filter(u => u.status === 'Active').length,
    }), [users]);


    const handleUpdateUser = async (userId, updatedData) => {
        try {
            await axios.put(`http://localhost:8080/auth/admin/update/${userId}`, updatedData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedData } : u));
            setSelectedUser(null);
            alert('User updated successfully!');
        } catch (err) {
            console.error('Error updating user:', err);
            alert('Failed to update user');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await axios.delete(`http://localhost:8080/auth/admin/delete/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(prev => prev.filter(u => u.id !== userId));
            setSelectedUser(null);
            alert('User deleted successfully!');
        } catch (err) {
            console.error('Error deleting user:', err);
            alert('Failed to delete user');
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

                {/* --- Stats Cards --- */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon-wrapper" style={{backgroundColor: 'var(--purple-100)'}}>
                            <Users size={24} style={{color: 'var(--purple-600)'}}/>
                        </div>
                        <div className="stat-info">
                            <p className="stat-label">Total Users</p>
                            <p className="stat-value">{stats.total}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon-wrapper" style={{backgroundColor: 'var(--pink-100)'}}>
                             <UserCheck size={24} style={{color: 'var(--pink-600)'}}/>
                        </div>
                        <div className="stat-info">
                            <p className="stat-label">Active Users</p>
                            <p className="stat-value">{stats.active}</p>
                        </div>
                    </div>
                </div>

                {/* --- Filter and Search Bar --- */}
                <div className="filter-bar">
                    <div className="search-wrapper">
                        <Search size={20} className="search-icon"/>
                        <input 
                            type="text" 
                            placeholder="Search by name or email..."
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="status-filters">
                        <button onClick={() => setStatusFilter('All')} className={statusFilter === 'All' ? 'active' : ''}>All</button>
                        <button onClick={() => setStatusFilter('Active')} className={statusFilter === 'Active' ? 'active' : ''}>Active</button>
                        <button onClick={() => setStatusFilter('Inactive')} className={statusFilter === 'Inactive' ? 'active' : ''}>Inactive</button>
                    </div>
                </div>
                
                {/* --- User Grid --- */}
                <div className="user-grid">
                    {filteredUsers.length > 0 ? filteredUsers.map(user => (
                        <UserCard key={user.id} user={user} onSelectUser={setSelectedUser} />
                    )) : (
                        <p className="no-results-message">No users found.</p>
                    )}
                </div>
            </main>

            {selectedUser && (
                <UserDetailsModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onUpdateUser={handleUpdateUser}
                    onDeleteUser={handleDeleteUser}
                />
            )}
        </div>
    );
}