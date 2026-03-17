import { useState, useEffect } from 'react';
import { orderAPI } from '../api/index.js';
import { Link } from 'react-router-dom';
import { FiPackage, FiChevronRight } from 'react-icons/fi';
import './OrdersPage.css';

const STATUS_COLORS = {
  pending: '#fbbf24',
  processing: '#60a5fa',
  shipped: '#a78bfa',
  delivered: '#34d399',
  cancelled: '#f87171',
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getMyOrders()
      .then(({ data }) => setOrders(data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="orders-page">
      {Array.from({ length: 3 }).map((_, i) => <div key={i} className="order-skeleton" />)}
    </div>
  );

  return (
    <div className="orders-page">
      <h1 className="orders-title"><FiPackage /> My Orders</h1>

      {orders.length === 0 ? (
        <div className="no-orders">
          <div className="no-orders-icon">📦</div>
          <h3>No orders yet</h3>
          <p>Start shopping to see your orders here</p>
          <Link to="/products" className="shop-btn">Shop Now</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <Link key={order._id} to={`/orders/${order._id}`} className="order-card">
              <div className="order-header">
                <div>
                  <p className="order-id">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="order-date">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <span className="order-status" style={{ color: STATUS_COLORS[order.orderStatus] }}>
                  ● {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                </span>
              </div>

              <div className="order-items-preview">
                {order.orderItems.slice(0, 3).map((item, i) => (
                  <img key={i} src={item.image} alt={item.name} className="order-item-thumb" />
                ))}
                {order.orderItems.length > 3 && (
                  <span className="more-items">+{order.orderItems.length - 3}</span>
                )}
              </div>

              <div className="order-footer">
                <span className="order-total">${order.totalPrice?.toFixed(2)}</span>
                <span className="order-arrow"><FiChevronRight /></span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
