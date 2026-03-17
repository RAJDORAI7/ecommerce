import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './AuthPages.css';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await register(name, email, password);
      toast.success('Account created! Welcome 🎉');
      navigate('/');
    } catch {}
  };

  return (
    <div className="auth-page split-layout">
      {/* Left side: Visual/Hero */}
      <div className="auth-hero-side">
        <div className="hero-overlay" />
        <div className="hero-text-content">
          <div className="auth-logo">
            <span>⚡</span>
            <span className="auth-brand">ShopNex</span>
          </div>
          <h2 className="hero-tagline">Start Your Journey <br/><span className="highlight">Today</span></h2>
          <p className="hero-desc">Create an account to access exclusive collections, track your orders, and enjoy personalized shopping.</p>
          <div className="hero-features">
            <div className="feat-item"><span>🎁</span> Exclusive Member Deals</div>
            <div className="feat-item"><span>📦</span> Easy Order Tracking</div>
            <div className="feat-item"><span>⭐</span> Personalized Feed</div>
          </div>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="auth-form-side">
        <div className="form-container fade-in">
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Join thousands of happy shoppers</p>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="reg-name">Full Name</label>
              <div className="input-group">
                <FiUser className="input-icon" />
                <input
                  id="reg-name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="auth-input"
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-email">Email Address</label>
              <div className="input-group">
                <FiMail className="input-icon" />
                <input
                  id="reg-email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="auth-input"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-password">Password</label>
              <div className="input-group">
                <FiLock className="input-icon" />
                <input
                  id="reg-password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="auth-input"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="show-pass-btn"
                  onClick={() => setShowPass(!showPass)}
                  aria-label="Toggle password"
                >
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-confirm">Confirm Password</label>
              <div className="input-group">
                <FiLock className="input-icon" />
                <input
                  id="reg-confirm"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  className="auth-input"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Create Account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
