import React from "react";

const categories = [
  "All",
  "Electronics",
  "Womens Wear",
  "Mens Wear",
  "Kids Wear",
  "Groceries",
  "Accessories",
  "Makeup & Skincare",
  "Home Decor"
];

const Banner = ({ activeCategory, onSelectCategory }) => {
  // Base styles for buttons for cleaner JSX
  const buttonStyle = {
    padding: '10px 22px',
    border: '1px solid #D1D5DB',
    borderRadius: '9999px', // Creates a "pill" shape
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Slightly transparent
    color: '#5B21B6',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    backdropFilter: 'blur(10px)', // Frosted glass effect
  };

  // Styles for the currently active button
  const activeButtonStyle = {
    backgroundColor: '#5B21B6',
    color: '#FFFFFF',
    border: '1px solid #5B21B6',
    boxShadow: '0 4px 14px 0 rgba(91, 33, 182, 0.35)',
  };

  return (
    <div style={{
      // New light pink to light purple gradient background
      background: 'linear-gradient(to top right, #FCE7F3, #F5F3FF)',
      padding: '48px 24px',
      textAlign: 'center',
      fontFamily: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif`,
      borderRadius: '24px',
      margin: '20px',
      overflow: 'hidden',
    }}>
      {/* The stylish "Kredo" title */}
      <h2 style={{
        fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
        color: '#5B21B6',
        fontWeight: '700',
        marginBottom: '8px', // Adjusted margin for the tagline
        letterSpacing: '1px',
        fontFamily: `'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif`,
      }}>
        Kredo
      </h2>

      {/* --- NEW TAGLINE --- */}
      <p style={{
        fontSize: '1.1rem',
        color: '#4B5563', // A stylish, dark gray
        fontWeight: '600',
        marginBottom: '32px', // Space between tagline and buttons
        letterSpacing: '0.5px',
      }}>
        Discover Your Style, Define Your Moment.
      </p>

      {/* The properly aligned category list */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '12px 16px',
      }}>
        {categories.map((category) => (
          <button
            key={category}
            style={
              activeCategory === category
                ? { ...buttonStyle, ...activeButtonStyle }
                : buttonStyle
            }
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Banner;