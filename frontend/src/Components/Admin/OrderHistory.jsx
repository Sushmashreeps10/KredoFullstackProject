import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowLeft, ChevronDown } from 'lucide-react';
import axios from 'axios';
import '../assets/css/OrderHistroy.css';

// --- Helper to handle clicks outside an element ---
const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [ref, handler]);
};

// --- Header & Footer Components ---
const Header = () => (
  <header className="management-header">
    <div className="management-header-container">
      <Link to="/AdminDashboard" className="header-logo">Kredo</Link>
    </div>
  </header>
);

const Footer = () => (
  <footer className="management-footer">
    <p>© {new Date().getFullYear()} Kredo. All Rights Reserved.</p>
  </footer>
);

// --- Inline Status Update Component ---
const StatusEditor = ({ currentStatus, onStatusUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const statuses = ["Processing", "Shipped", "Delivered", "Canceled"];
  const dropdownRef = useRef(null);
  useClickOutside(dropdownRef, () => setIsOpen(false));

  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return { class: 'status-delivered' };
      case 'shipped': return { class: 'status-shipped' };
      case 'processing': return { class: 'status-processing' };
      case 'canceled': return { class: 'status-canceled' };
      default: return {};
    }
  };

  const handleSelect = (status) => {
    onStatusUpdate(status);
    setIsOpen(false);
  };

  return (
    <div className="status-editor" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className={`status-badge ${getStatusInfo(currentStatus).class}`}>
        {currentStatus}
        <ChevronDown size={16} className={`chevron-icon ${isOpen ? 'open' : ''}`} />
      </button>
      {isOpen && (
        <div className="status-dropdown">
          {statuses.map(status => (
            <div key={status} onClick={() => handleSelect(status)} className="dropdown-item">
              <span className={`status-dot ${getStatusInfo(status).class}`}></span> {status}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Order Row Component ---
const OrderRow = ({ order, onStatusUpdate }) => (
  <div className="order-row">
    <div className="order-info">
      <span className="order-id">#{order.orderId}</span>
      <span className="order-date">{new Date(order.orderDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
    </div>
    <div className="order-items">
      <span className="order-item-line"><strong>{order.items}</strong></span>
    </div>
    <div className="order-total">
      ₹{order.totalPrice?.toLocaleString('en-IN')}
    </div>
    <div className="order-status">
      <StatusEditor 
        currentStatus={order.status} 
        onStatusUpdate={(newStatus) => onStatusUpdate(order.orderId, newStatus)} 
      />
    </div>
  </div>
);

// --- Customer Table View ---
const CustomerTableView = ({ customers, onSelectCustomer, onSearch, searchQuery, setSearchQuery }) => (
  <>
    <div className="view-header">
      <h1>Customer Directory</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by ID or Email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSearch()}
        />
        <button onClick={onSearch} className="search-button"><Search size={18}/></button>
      </div>
    </div>
    <div className="table-container">
      <table className="customer-table">
        <thead>
          <tr>
            <th style={{width: "40%"}}>Customer</th>
            <th style={{width: "20%"}}>Order ID</th>
            <th style={{width: "20%"}}>Total Orders</th>
            <th style={{width: "20%"}}>Ordered Date</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.customerId} onClick={() => onSelectCustomer(customer)}>
              <td>
                <div className="customer-cell">
                  <div className="customer-avatar">
                    {/* FIX: Safely handle null emails. If email is null, use an empty string '' as a fallback. */}
                    {(customer.customerEmail || '').substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="customer-email" style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                      {/* FIX: Display a user-friendly message if email is null */}
                      {customer.customerEmail || 'No Email Provided'}
                    </div>
                  </div>
                </div>
              </td>
              <td>#{customer.customerId}</td>
              <td>{customer.orders.length} Orders</td>
              <td>{new Date(customer.lastOrderDate).toLocaleDateString('en-GB')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

// --- Customer Order Detail View ---
const CustomerOrderDetailView = ({ customer, onBack, onStatusUpdate }) => (
  <>
    <div className="detail-view-header">
      <button onClick={onBack} className="back-button"><ArrowLeft size={20} /> Back to Directory</button>
    </div>
    <div className="order-list-container">
      <div className="order-list-header">
        <h3>Orders for {customer.customerEmail || 'Unknown Customer'}</h3>
      </div>
      <div className="order-list">
        {customer.orders.map(order => (
          <OrderRow key={order.orderId} order={order} onStatusUpdate={onStatusUpdate} />
        ))}
      </div>
    </div>
  </>
);

// --- Main Order Management Page ---
export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios.get("http://localhost:8080/api/orders/all")
      .then(res => setOrders(res.data || [])) // Ensure orders is always an array
      .catch(err => console.error("Error fetching orders:", err));
  }, []);

  // Group orders by customer
  const groupedCustomers = useMemo(() => {
    const customerMap = {};
    orders.forEach(order => {
      // FIX: Skip any order that doesn't have a valid email to prevent bad data
      if (!order || !order.customerEmail) {
        return; 
      }

      if (!customerMap[order.customerEmail]) {
        customerMap[order.customerEmail] = {
          customerId: order.orderId,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          orders: [],
          lastOrderDate: order.orderDate
        };
      }
      customerMap[order.customerEmail].orders.push(order);
      if (new Date(order.orderDate) > new Date(customerMap[order.customerEmail].lastOrderDate)) {
        customerMap[order.customerEmail].lastOrderDate = order.orderDate;
      }
    });
    return Object.values(customerMap);
  }, [orders]);

  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return groupedCustomers;
    const lowerCaseQuery = searchQuery.toLowerCase();
    return groupedCustomers.filter(c => 
      (c.customerEmail && c.customerEmail.toLowerCase().includes(lowerCaseQuery)) ||
      String(c.customerId).includes(lowerCaseQuery)
    );
  }, [groupedCustomers, searchQuery]);

  // ✅ Update order status
  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.orderId === orderId ? { ...order, status: newStatus } : order
      )
    );

    axios.post("http://localhost:8080/api/orders/create", {
      ...orders.find(o => o.orderId === orderId),
      status: newStatus
    }).catch(err => console.error("Error updating order:", err));
  };

  const currentCustomerData = selectedCustomer 
    ? groupedCustomers.find(c => c.customerId === selectedCustomer.customerId)
    : null;

  return (
    <div className="management-page">
      <Header />
      <main className="management-content">
        {currentCustomerData ? (
          <CustomerOrderDetailView
            customer={currentCustomerData}
            onBack={() => setSelectedCustomer(null)}
            onStatusUpdate={handleStatusUpdate}
          />
        ) : (
          <CustomerTableView
            customers={filteredCustomers}
            onSelectCustomer={setSelectedCustomer}
            onSearch={() => setSearchQuery(searchInput)}
            searchQuery={searchInput}
            setSearchQuery={setSearchInput}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}