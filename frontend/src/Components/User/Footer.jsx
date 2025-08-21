import React from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import '../assets/css/footer.css';

const categories = ["Electronics", "Womens Wear", "Mens Wear", "Kids Wear", "Groceries", "Accessories", "Makeup & Skincare", "Home Decor"];

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

export default Footer;
