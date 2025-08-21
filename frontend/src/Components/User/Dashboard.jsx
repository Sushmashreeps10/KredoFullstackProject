import React, { useState, useMemo, useEffect } from 'react';
import { X, Plus, Minus, CheckCircle, CreditCard, Landmark, Wallet } from 'lucide-react';
import { ProductCard, ProductDetailModal } from './Product';
import Footer from './Footer';
import Header from './Header';
import Banner from './Banner';
import { jwtDecode } from "jwt-decode";

import '../assets/css/dashboard.css';
import CheckoutModal from './CheckoutModal';

const API_BASE_URL = 'http://localhost:8080';
const categories = ["Electronics", "Womens Wear", "Mens Wear", "Kids Wear", "Groceries", "Accessories", "Makeup & Skincare", "Home Decor"];



// ---------------- CART MODAL ----------------
const CartModal = ({ isOpen, onClose, cart, onUpdateCart, onCheckout }) => {
    if (!isOpen) return null;
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content cart-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Your Cart</h2>
                    <button onClick={onClose} className="modal-close-btn"><X /></button>
                </div>
                {cart.length > 0 ? (
                    <>
                        <div className="cart-items">
                            {cart.map(item => (
                                <div key={item.id} className="cart-item">
                                    {item.imageUrl ? (
                                        <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
                                    ) : (
                                        <div className="cart-item-image placeholder"></div>
                                    )}
                                    <div className="cart-item-details">
                                        <p>{item.name}</p>
                                        <p className="cart-item-price">₹{item.price.toLocaleString('en-IN')}</p>
                                    </div>
                                    <div className="cart-item-quantity">
                                        <button onClick={() => onUpdateCart(item.id, item.quantity - 1)}><Minus size={16} /></button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => onUpdateCart(item.id, item.quantity + 1)}><Plus size={16} /></button>
                                    </div>
                                    <p className="cart-item-total">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                </div>
                            ))}
                        </div>
                        <div className="cart-footer">
                            <div className="cart-total">
                                <strong>Total:</strong>
                                <strong>₹{total.toLocaleString('en-IN')}</strong>
                            </div>
                            <button onClick={onCheckout} className="btn btn-buy-now checkout-btn">Proceed to Checkout</button>
                        </div>
                    </>
                ) : (
                    <p className="empty-cart-message">Your cart is empty.</p>
                )}
            </div>
        </div>
    );
};


export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [sortBy, setSortBy] = useState('default');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cart, setCart] = useState([]);

    // ✅ decode JWT to get user info
    const getUserFromToken = () => {
        const token = localStorage.getItem("token"); // store your JWT at login
        if (!token) return null;
        try {
            return jwtDecode(token); // {sub: email, name: "sushma", ...}
        } catch (e) {
            console.error("Invalid token:", e);
            return null;
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/api/products/all`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();

                const productsWithDate = data.map(p => ({
                    ...p,
                    createdAt: p.createdAt ? new Date(p.createdAt) : new Date()
                }));
                setProducts(productsWithDate);
            } catch (e) {
                console.error("Failed to fetch products:", e);
                setError("Could not load products. Please check the connection and try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleBuyNow = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
        setSelectedProduct(null);
        setIsCartOpen(false);
        setIsCheckoutOpen(true);
    };

    const handleAddToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const handleUpdateCart = (productId, quantity) => {
        if (quantity < 1) {
            setCart(prev => prev.filter(item => item.id !== productId));
        } else {
            setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
        }
    };

    const handleCheckout = () => {
        setIsCartOpen(false);
        setIsCheckoutOpen(true);
    };

    // ✅ Confirm order and POST to backend
    const handleConfirmOrder = async () => {
        const user = getUserFromToken();
        if (!user) {
            alert("You must be logged in!");
            return;
        }

        const items = cart.map(item => `${item.name} (x${item.quantity})`).join(", ");
        const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

        const orderData = {
            customerEmail: user.sub,     // email from JWT
            customerName: user.name,     // name from JWT
            items: items,
            totalPrice: totalPrice,
            status: "Pending"
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/orders/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) throw new Error("Failed to create order");

            alert("✅ Order placed successfully!");
            setCart([]);
            setIsCheckoutOpen(false);
        } catch (err) {
            console.error("Order error:", err);
            alert("❌ Could not place order. Try again.");
        }
    };

    const filteredAndSortedProducts = useMemo(() => {
        let filtered = products;

        if (activeCategory !== 'All') {
            filtered = filtered.filter(p => p.category === activeCategory);
        }

        if (searchQuery) {
            filtered = filtered.filter(p => p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        return [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'price-asc': return a.price - b.price;
                case 'price-desc': return b.price - a.price;
                case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
                default: return 0;
            }
        });
    }, [products, searchQuery, activeCategory, sortBy]);

    const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <div className="dashboard-container">
            <Header onSearch={setSearchQuery} cartItemCount={cartItemCount} onCartClick={() => setIsCartOpen(true)} />
            <main>
                <Banner activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
                <div className="main-content">
                    <div className="sort-container">
                        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="sort-select">
                            <option value="default">Sort by</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="newest">Newest First</option>
                        </select>
                    </div>

                    {loading && <p className="status-message">Loading products...</p>}
                    {error && <p className="status-message error-message">{error}</p>}

                    {!loading && !error && (
                        <div className="product-grid">
                            {filteredAndSortedProducts.length > 0 ? (
                                filteredAndSortedProducts.map(product => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onProductClick={setSelectedProduct}
                                        onAddToCart={handleAddToCart}
                                        onBuyNow={handleBuyNow}
                                    />
                                ))
                            ) : (
                                <p className="status-message">No products found matching your criteria.</p>
                            )}
                        </div>
                    )}
                </div>
            </main>
            <Footer />

            <ProductDetailModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
            />

            <CartModal
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cart={cart}
                onUpdateCart={handleUpdateCart}
                onCheckout={handleCheckout}
            />

            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                onConfirm={handleConfirmOrder}  // ✅ pass confirm order
                cart={cart}
            />
        </div>
    );
}
