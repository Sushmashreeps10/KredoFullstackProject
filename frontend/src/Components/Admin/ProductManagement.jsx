import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, X, Edit, Trash2, PlusCircle } from 'lucide-react';
import '../assets/css/productManagement.css';

// --- Categories ---
const categories = [
    "Electronics", "Womens Wear", "Mens Wear", "Kids Wear", 
    "Groceries", "Accessories", "Makeup & Skincare", "Home Decor"
];

// --- API Base ---
const API_BASE_URL = 'http://localhost:8080/api/products';

// --- Get JWT token from localStorage ---
const getAuthToken = () => localStorage.getItem('token');

// --- API Service ---
const apiService = {
    getProducts: () => fetch(`${API_BASE_URL}/all`),
    addProduct: (productData) => fetch(`${API_BASE_URL}/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(productData)
    }),
    updateProduct: (productId, productData) => fetch(`${API_BASE_URL}/update/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(productData)
    }),
    deleteProduct: (productId) => fetch(`${API_BASE_URL}/delete/${productId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    })
};

// --- Product Modal ---
const ProductModal = ({ product, onClose, onSave }) => {
    const [formData, setFormData] = useState(
        product || { name: '', category: categories[0], price: '', stockQuantity: '', imageUrl: '', description: '' }
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSave = {
            ...formData,
            price: parseFloat(formData.price),
            stockQuantity: parseInt(formData.stockQuantity, 10)
        };
        onSave(dataToSave);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content product-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
                    <button onClick={onClose}><X /></button>
                </div>
                <form onSubmit={handleSubmit} className="product-form">
                    <div className="form-grid">
                        <div className="input-group">
                            <label>Product Name</label>
                            <input name="name" type="text" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>Category</label>
                            <select name="category" value={formData.category} onChange={handleChange}>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Price (₹)</label>
                            <input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>Stock Quantity</label>
                            <input name="stockQuantity" type="number" value={formData.stockQuantity} onChange={handleChange} required />
                        </div>
                        <div className="input-group full-width">
                            <label>Image URL</label>
                            <input name="imageUrl" type="text" value={formData.imageUrl} onChange={handleChange} required />
                        </div>
                        <div className="input-group full-width">
                            <label>Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" required />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="submit" className="btn btn-primary">Save Product</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Main Component ---
export default function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => { fetchProducts(); }, []);

    const fetchProducts = async () => {
        setIsLoading(true); setError(null);
        try {
            const response = await apiService.getProducts();
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveProduct = async (productData) => {
        try {
            let response;
            if (editingProduct) {
                response = await apiService.updateProduct(editingProduct.id, productData);
            } else {
                response = await apiService.addProduct(productData);
            }
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save product');
            }
            fetchProducts();
        } catch (err) {
            alert(`Error: ${err.message}`);
        } finally {
            setIsModalOpen(false);
            setEditingProduct(null);
        }
    };

    const handleEdit = (product) => { setEditingProduct(product); setIsModalOpen(true); };

    const handleDelete = async (productId) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const response = await apiService.deleteProduct(productId);
            if (!response.ok) throw new Error('Failed to delete product');
            setProducts(products.filter(p => p.id !== productId));
        } catch (err) { alert(`Error: ${err.message}`); }
    };

    const handleAddNew = () => { setEditingProduct(null); setIsModalOpen(true); };

    const filteredProducts = useMemo(() => {
        if (activeCategory === 'All') return products;
        return products.filter(p => p.category === activeCategory);
    }, [products, activeCategory]);

    return (
        <div className="management-page">
            <header className="management-header">
                <div className="management-header-container">
                    <Link to="/AdminDashboard" className="header-logo">Kredo</Link>
                </div>
            </header>

            <main className="management-content">
                <div className="content-header">
                    <ShoppingBag size={32} />
                    <h1>Product Management</h1>
                </div>

                <div className="category-filters">
                    <button onClick={() => setActiveCategory('All')} className={activeCategory==='All'?'active':''}>All</button>
                    {categories.map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat)} className={activeCategory===cat?'active':''}>{cat}</button>
                    ))}
                </div>

                <div className="product-grid-header">
                    <h3>{activeCategory} Products ({filteredProducts.length})</h3>
                    <button onClick={handleAddNew} className="btn btn-add-new"><PlusCircle /> Add New Product</button>
                </div>

                {isLoading && <p>Loading products...</p>}
                {error && <p className="error-message">Error: {error}</p>}

                {!isLoading && !error && (
                    <div className="product-grid">
                        {filteredProducts.map(product => (
                            <div key={product.id} className="admin-product-card">
                                <img src={product.imageUrl} alt={product.name} />
                                <div className="card-content">
                                    <h4>{product.name}</h4>
                                    <p className="price">₹{product.price.toLocaleString('en-IN')}</p>
                                    <p className="stock">Stock: {product.stockQuantity}</p>
                                </div>
                                <div className="card-actions">
                                    <button onClick={() => handleEdit(product)} className="btn btn-edit"><Edit size={16} /> Edit</button>
                                    <button onClick={() => handleDelete(product.id)} className="btn btn-delete"><Trash2 size={16} /> Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {isModalOpen && <ProductModal product={editingProduct} onClose={() => setIsModalOpen(false)} onSave={handleSaveProduct} />}
        </div>
    );
}
