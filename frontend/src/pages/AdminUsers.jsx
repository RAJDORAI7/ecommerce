import { useState, useEffect } from 'react';
import { authAPI } from '../api/index.js';
import { toast } from 'react-toastify';
import { FiTrash2, FiUser, FiShield, FiMail } from 'react-icons/fi';
import './AdminDashboard.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await authAPI.getAllUsers();
      setUsers(data.data || []);
    } catch (err) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this user?')) {
      try {
        await authAPI.deleteUser(id);
        toast.success('User deleted');
        fetchUsers();
      } catch (err) {
        toast.error('Failed to delete user');
      }
    }
  };

  return (
    <div className="admin-view">
      <div className="view-header">
        <h2 className="view-title">Users Management</h2>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td><img src={u.avatar?.url || 'https://via.placeholder.com/40'} alt="" className="table-img sm" /></td>
                <td className="font-bold">{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`role-badge ${u.role}`}>
                    {u.role === 'admin' ? <><FiShield /> Admin</> : <><FiUser /> User</>}
                  </span>
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="actions-cell">
                  <button className="icon-btn delete" onClick={() => handleDelete(u._id)} disabled={u.role === 'admin'}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
