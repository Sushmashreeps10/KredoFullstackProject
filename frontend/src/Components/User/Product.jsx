import React from 'react';
import '../assets/css/dashboard.css';

export const ProductCard = ({ product, onProductClick, onAddToCart, onBuyNow }) => {
    const imageUrl = product.imageUrl;

    return (
        <div className="product-card">
            {imageUrl ? (
                <img 
                    src={imageUrl} 
                    alt={product.name} 
                    className="product-image" 
                    onClick={() => onProductClick(product)} 
                />
            ) : (
                <div 
                    className="product-image placeholder" 
                    onClick={() => onProductClick(product)}
                ></div>
            )}
            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">₹{product.price.toLocaleString('en-IN')}</p>
                <div className="product-buttons">
                    <button onClick={() => onAddToCart(product)} className="btn btn-add-cart">Add to Cart</button>
                </div>
            </div>
        </div>
    );
};

// 👇 Add this inside Product.jsx
export const ProductDetailModal = ({ product, onClose, onAddToCart, onBuyNow }) => {
    if (!product) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content product-modal" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="modal-close-btn">×</button>
                <img src={product.imageUrl} alt={product.name} className="modal-product-image" />
                <h2>{product.name}</h2>
                <p className="modal-product-price">₹{product.price.toLocaleString('en-IN')}</p>
                <div className="modal-actions">
                    <button onClick={() => onAddToCart(product)} className="btn btn-add-cart">Add to Cart</button>
                    <button onClick={() => onBuyNow(product)} className="btn btn-buy-now">Buy Now</button>
                </div>
            </div>
        </div>
    );
};
