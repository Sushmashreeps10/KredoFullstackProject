import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, X, Edit, Trash2, PlusCircle } from 'lucide-react';
import '../assets/css/productManagement.css';

// --- MOCK DATA ---
const categories = ["Electronics", "Womens Wear", "Mens Wear", "Kids Wear", "Groceries", "Accessories", "Makeup & Skincare", "Home Decor"];

const initialProducts = [
  // Sample products for each category
  { id: 'p1', name: 'Aura Headphones', category: 'Electronics', price: 18999, stock: 150, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop', description: 'Noise-cancelling over-ear headphones.' },
  { id: 'p2', name: 'Floral Sundress', category: 'Womens Wear', price: 2499, stock: 80, image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1887&auto=format&fit=crop', description: 'A light and airy sundress for summer.' },
  { id: 'p3', name: 'Oxford Shirt', category: 'Mens Wear', price: 1999, stock: 120, image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1887&auto=format&fit=crop', description: 'A crisp, timeless white oxford shirt.' },
  { id: 'p4', name: 'Dinosaur Tee', category: 'Kids Wear', price: 799, stock: 200, image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=1887&auto=format&fit=crop', description: 'Fun and comfortable 100% cotton t-shirt.' },
  { id: 'p5', name: 'Organic Avocados', category: 'Groceries', price: 450, stock: 300, image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=1975&auto=format&fit=crop', description: 'A box of six fresh, organic avocados.' },
  { id: 'p6', name: 'Leather Crossbody Bag', category: 'Accessories', price: 3999, stock: 60, image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1887&auto=format&fit=crop', description: 'Stylish and versatile leather bag.' },
  { id: 'p7', name: 'Glow Serum', category: 'Makeup & Skincare', price: 1299, stock: 180, image: 'https://images.unsplash.com/photo-1590153594449-c89db12a690e?q=80&w=2070&auto=format&fit=crop', description: 'A lightweight serum for a radiant glow.' },
  { id: 'p8', name: 'Scented Soy Candle', category: 'Home Decor', price: 999, stock: 250, image: 'https://images.unsplash.com/photo-1594030726496-a81b333a8a71?q=80&w=1887&auto=format&fit=crop', description: 'Hand-poured soy candle with a relaxing scent.' },
];

// --- Product Add/Edit Modal ---
const ProductModal = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState(
    product || { name: '', category: categories[0], price: '', stock: '', image: '', description: '' }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content product-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="modal-close-btn"><X /></button>
        </div>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-grid">
            <div className="input-group">
              <label htmlFor="name">Product Name</label>
              <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label htmlFor="category">Category</label>
              <select id="category" name="category" value={formData.category} onChange={handleChange}>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="price">Price (₹)</label>
              <input id="price" name="price" type="number" value={formData.price} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label htmlFor="stock">Stock Quantity</label>
              <input id="stock" name="stock" type="number" value={formData.stock} onChange={handleChange} required />
            </div>
            <div className="input-group full-width">
              <label htmlFor="image">Image URL</label>
              <input id="image" name="image" type="text" value={formData.image} onChange={handleChange} required />
            </div>
            <div className="input-group full-width">
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="3" required />
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


export default function ProductManagement() {
  const [products, setProducts] = useState(initialProducts);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      // Update existing product
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...productData } : p));
    } else {
      // Add new product
      const newProduct = { ...productData, id: `p${Date.now()}` };
      setProducts([...products, newProduct]);
    }
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

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
          <button onClick={() => setActiveCategory('All')} className={activeCategory === 'All' ? 'active' : ''}>All</button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={activeCategory === cat ? 'active' : ''}>{cat}</button>
          ))}
        </div>

        <div className="product-grid-header">
          <h3>{activeCategory} Products ({filteredProducts.length})</h3>
          <button onClick={handleAddNew} className="btn btn-add-new"><PlusCircle /> Add New Product</button>
        </div>

        <div className="product-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="admin-product-card">
              <img src={product.image} alt={product.name} />
              <div className="card-content">
                <h4>{product.name}</h4>
                <p className="price">₹{product.price.toLocaleString('en-IN')}</p>
                <p className="stock">Stock: {product.stock}</p>
              </div>
              <div className="card-actions">
                <button onClick={() => handleEdit(product)} className="btn btn-edit"><Edit size={16} /> Edit</button>
                <button onClick={() => handleDelete(product.id)} className="btn btn-delete"><Trash2 size={16} /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {isModalOpen && (
        <ProductModal 
          product={editingProduct}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
}
