import { useState, useEffect } from 'react';
import { orderAPI } from '../api/index.js';
import { toast } from 'react-toastify';
import { FiEye, FiTruck, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import './AdminDashboard.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await orderAPI.getAll();
      setOrders(data.data || []);
    } catch (err) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await orderAPI.updateStatus(id, status);
      toast.success(`Order status updated to ${status}`);
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="admin-view">
      <div className="view-header">
        <h2 className="view-title">Orders Management</h2>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="font-mono text-sm">{order._id.substring(0, 8)}...</td>
                <td>{order.user?.name || 'Guest'}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>${order.totalPrice.toFixed(2)}</td>
                <td>
                  <span className={`status-badge ${order.orderStatus}`}>
                    {order.orderStatus}
                  </span>
                </td>
                <td className="actions-cell">
                  {order.orderStatus === 'pending' && (
                    <button className="icon-btn" title="Process" onClick={() => handleStatusUpdate(order._id, 'processing')}><FiTruck /></button>
                  )}
                  {order.orderStatus === 'processing' && (
                    <button className="icon-btn edit" title="Ship" onClick={() => handleStatusUpdate(order._id, 'shipped')}><FiTruck /></button>
                  )}
                  {order.orderStatus === 'shipped' && (
                    <button className="icon-btn" title="Deliver" onClick={() => handleStatusUpdate(order._id, 'delivered')}><FiCheckCircle /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
