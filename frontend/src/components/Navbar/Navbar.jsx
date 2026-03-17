import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch, FiLogOut } from 'react-icons/fi';
import { MdAdminPanelSettings } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { totalItems, toggleCart } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?keyword=${search.trim()}`);
      setSearch('');
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">ShopNex</span>
        </Link>

        {/* Search */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn" aria-label="Search">
            <FiSearch />
          </button>
        </form>

        {/* Desktop Nav */}
        <div className="navbar-links">
          <Link to="/products" className="nav-link">Products</Link>

          {/* Cart */}
          <button className="cart-btn icon-btn" onClick={toggleCart} aria-label="Cart">
            <FiShoppingCart size={22} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>

          {/* Auth */}
          {isAuthenticated ? (
            <div className="user-dropdown">
              <button
                className="user-btn icon-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="User menu"
              >
                <img
                  src={user?.avatar?.url}
                  alt={user?.name}
                  className="user-avatar"
                />
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <p className="dropdown-name">{user?.name}</p>
                    <p className="dropdown-email">{user?.email}</p>
                  </div>
                  <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <FiUser /> Profile
                  </Link>
                  <Link to="/orders" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    📦 My Orders
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="dropdown-item admin-link" onClick={() => setDropdownOpen(false)}>
                      <MdAdminPanelSettings /> Admin Panel
                    </Link>
                  )}
                  <button className="dropdown-item logout-item" onClick={handleLogout}>
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn-ghost">Login</Link>
              <Link to="/register" className="btn-primary">Sign Up</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="menu-toggle icon-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <form className="navbar-search mobile-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn"><FiSearch /></button>
          </form>
          <Link to="/products" className="mobile-link" onClick={() => setMenuOpen(false)}>Products</Link>
          <button className="mobile-link" onClick={() => { toggleCart(); setMenuOpen(false); }}>
            Cart ({totalItems})
          </button>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="mobile-link" onClick={() => setMenuOpen(false)}>Profile</Link>
              <Link to="/orders" className="mobile-link" onClick={() => setMenuOpen(false)}>My Orders</Link>
              {isAdmin && <Link to="/admin" className="mobile-link" onClick={() => setMenuOpen(false)}>Admin Panel</Link>}
              <button className="mobile-link" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-link" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="mobile-link" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
