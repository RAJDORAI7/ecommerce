import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './AuthPages.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login(email, password);
      toast.success('Welcome back! 👋');
      if (data?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
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
          <h2 className="hero-tagline">Experience the Future of <br/><span className="highlight">Modern Commerce</span></h2>
          <p className="hero-desc">Join millions of shoppers discovering premium products and exclusive deals every day.</p>
          <div className="hero-features">
            <div className="feat-item"><span>🚀</span> High-speed Delivery</div>
            <div className="feat-item"><span>🛡️</span> Secure Payments</div>
            <div className="feat-item"><span>💎</span> Premium Curation</div>
          </div>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="auth-form-side">
        <div className="form-container fade-in">
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to your account to continue</p>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <div className="input-group">
                <FiMail className="input-icon" />
                <input
                  id="login-email"
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
              <label htmlFor="login-password">Password</label>
              <div className="input-group">
                <FiLock className="input-icon" />
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="auth-input"
                  autoComplete="current-password"
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

            <div className="form-extras">
              <label className="remember-me">
                <input type="checkbox" /> <span>Remember me</span>
              </label>
              <Link to="/forgot-password" disabled className="forgot-link">Forgot password?</Link>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Sign In'}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
