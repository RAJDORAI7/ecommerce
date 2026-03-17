import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { FiBox, FiShoppingBag, FiUsers, FiPieChart, FiTrendingUp, FiActivity, FiArrowRight } from 'react-icons/fi';
import { dashboardAPI } from '../api/index.js';
import './AdminDashboard.css';

// Admin Sub-pages
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';

const AdminDashboard = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: 'Overview', icon: <FiPieChart /> },
    { path: '/admin/products', label: 'Products', icon: <FiBox /> },
    { path: '/admin/orders', label: 'Orders', icon: <FiShoppingBag /> },
    { path: '/admin/users', label: 'Users', icon: <FiUsers /> },
  ];

  return (
    <div className="admin-container container section fade-in">
      <div className="admin-sidebar glass-panel">
        <div className="sidebar-header">
          <div className="admin-badge">Admin</div>
          <h2 className="sidebar-title">Control Center</h2>
        </div>
        <nav className="admin-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {location.pathname === item.path && <FiActivity className="active-indicator" />}
            </Link>
          ))}
        </nav>
      </div>

      <div className="admin-content glass-panel">
        <Routes>
          <Route path="/" element={<AdminOverview />} />
          <Route path="/products" element={<AdminProducts />} />
          <Route path="/orders" element={<AdminOrders />} />
          <Route path="/users" element={<AdminUsers />} />
        </Routes>
      </div>
    </div>
  );
};

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await dashboardAPI.getStats();
        setStats(data.data);
      } catch (err) {
        console.error('Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="admin-loading">Loading stats...</div>;

  return (
    <div className="admin-view">
      <div className="view-header-alt">
        <h2 className="view-title">Dashboard Overview</h2>
        <p className="view-subtitle">Real-time business performance metrics</p>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card premium-card card-purple">
          <div className="stat-visual">
            <div className="stat-icon-wrapper"><FiTrendingUp /></div>
            <div className="stat-trend">+12.5%</div>
          </div>
          <div className="stat-main">
            <h3>${stats?.totalSales?.toLocaleString()}</h3>
            <p>Total Revenue</p>
          </div>
          <div className="card-decoration" />
        </div>

        <div className="admin-stat-card premium-card card-blue">
          <div className="stat-visual">
            <div className="stat-icon-wrapper"><FiShoppingBag /></div>
            <div className="stat-trend text-blue">Active</div>
          </div>
          <div className="stat-main">
            <h3>{stats?.pendingOrders}</h3>
            <p>Pending Orders</p>
          </div>
          <div className="card-decoration" />
        </div>

        <div className="admin-stat-card premium-card card-green">
          <div className="stat-visual">
            <div className="stat-icon-wrapper"><FiBox /></div>
            <div className="stat-trend text-green">{stats?.productCount} Items</div>
          </div>
          <div className="stat-main">
            <h3>In Inventory</h3>
            <p>Product Count</p>
          </div>
          <div className="card-decoration" />
        </div>

        <div className="admin-stat-card premium-card card-orange">
          <div className="stat-visual">
            <div className="stat-icon-wrapper"><FiUsers /></div>
            <div className="stat-trend text-orange">Growth</div>
          </div>
          <div className="stat-main">
            <h3>{stats?.userCount}</h3>
            <p>Registered Users</p>
          </div>
          <div className="card-decoration" />
        </div>
      </div>

      <div className="recent-activity-section">
        <div className="section-header">
          <h3>Quick Actions</h3>
        </div>
        <div className="quick-actions-grid">
          <Link to="/admin/products" className="quick-action-card">
            <FiBox /> Manage Inventory <FiArrowRight />
          </Link>
          <Link to="/admin/orders" className="quick-action-card">
            <FiShoppingBag /> Process Orders <FiArrowRight />
          </Link>
          <Link to="/admin/users" className="quick-action-card">
            <FiUsers /> Review Customers <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
