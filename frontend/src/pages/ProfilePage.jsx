import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiLock, FiCamera, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import './AuthPages.css';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, updateProfile, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    try {
      const updateData = { name: formData.name, email: formData.email };
      if (formData.password) updateData.password = formData.password;
      
      await updateProfile(updateData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
      setFormData({ ...formData, password: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="profile-container container section fade-in">
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar-container">
            <img 
              src={user?.avatar?.url || 'https://via.placeholder.com/150'} 
              alt={user?.name} 
              className="profile-avatar"
            />
            {isEditing && (
              <label className="avatar-edit-overlay">
                <FiCamera />
                <input type="file" hidden />
              </label>
            )}
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{user?.name}</h1>
            <p className="profile-role">{user?.role?.toUpperCase()}</p>
          </div>
          {!isEditing && (
            <button className="btn btn-ghost edit-toggle" onClick={() => setIsEditing(true)}>
              <FiEdit2 /> Edit Profile
            </button>
          )}
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label><FiUser /> Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Your Name"
              />
            </div>
            <div className="form-group">
              <label><FiMail /> Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Email"
              />
            </div>
            {isEditing && (
              <>
                <div className="form-group">
                  <label><FiLock /> New Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Leave blank to keep current"
                  />
                </div>
                <div className="form-group">
                  <label><FiLock /> Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                  />
                </div>
              </>
            )}
          </div>

          {isEditing && (
            <div className="profile-actions">
              <button 
                type="button" 
                className="btn btn-ghost" 
                onClick={() => setIsEditing(false)}
                disabled={loading}
              >
                <FiX /> Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={loading}
              >
                {loading ? 'Saving...' : <><FiSave /> Save Changes</>}
              </button>
            </div>
          )}
        </form>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <h3>Member Since</h3>
          <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
        </div>
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>0</p>
        </div>
        <div className="stat-card">
          <h3>Last Login</h3>
          <p>Today</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
