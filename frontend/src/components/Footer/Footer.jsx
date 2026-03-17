import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="logo-icon">⚡</span>
              <span className="logo-text">ShopNex</span>
            </Link>
            <p className="brand-description">
              Experience the future of shopping with ShopNex. Premium quality, lightning-fast delivery, and curated collections just for you.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook"><FiFacebook /></a>
              <a href="#" aria-label="Twitter"><FiTwitter /></a>
              <a href="#" aria-label="Instagram"><FiInstagram /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/orders">My Orders</Link></li>
              <li><Link to="/profile">My Profile</Link></li>
              <li><Link to="/cart">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-links">
            <h3>Support</h3>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Shipping Policy</a></li>
              <li><a href="#">Returns & Refunds</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-contact">
            <h3>Contact Us</h3>
            <div className="contact-item">
              <FiMail />
              <span>support@shopnex.com</span>
            </div>
            <div className="contact-item">
              <FiPhone />
              <span>+1 (555) 000-0000</span>
            </div>
            <div className="contact-item">
              <FiMapPin />
              <span>123 Digital Avenue, Tech City</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ShopNex. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
