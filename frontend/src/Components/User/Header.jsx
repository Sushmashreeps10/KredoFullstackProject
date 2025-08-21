import React from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, User } from "lucide-react";
import "../assets/css/dashboard.css";

const Header = ({ onSearch = () => {}, cartItemCount = 0, onCartClick = () => {} }) => {
  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <h1 className="header-logo">Kredo</h1>

        {/* Search Bar */}
        <div className="search-bar-wrapper">
          <div className="search-bar-container">
            <Search className="search-icon" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search for products..."
              onChange={(e) => onSearch(e.target.value)}
              className="search-input"
              aria-label="Search products"
            />
          </div>
        </div>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Cart Button */}
          <button
            className="header-button"
            onClick={onCartClick}
            aria-label="View cart"
          >
            <ShoppingCart />
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </button>

          {/* Profile Link */}
          <Link to="/Profile" className="header-button" aria-label="User profile">
            <User />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
