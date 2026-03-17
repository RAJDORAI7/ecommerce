import { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CategoryBar from '../components/Home/CategoryBar.jsx';
import HeroCarousel from '../components/Home/HeroCarousel.jsx';
import { productAPI, categoryAPI } from '../api/index.js';
import ProductCard from '../components/ProductCard/ProductCard.jsx';
import './HomePage.css';
import '../components/Home/Home.css';

const HERO_BENEFITS = [
  { icon: '🚚', title: 'Free Shipping', desc: 'On orders over $50' },
  { icon: '🔄', title: 'Easy Returns', desc: '30 day return policy' },
  { icon: '🔒', title: 'Secure Payment', desc: 'SSL encrypted checkout' },
  { icon: '💬', title: '24/7 Support', desc: 'Chat & email support' },
];

const HomePage = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect admin to dashboard
  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes, featRes] = await Promise.all([
          productAPI.getAll(),
          categoryAPI.getAll(),
          productAPI.getFeatured(),
        ]);
        setProducts(prodRes.data.data || []);
        setCategories(catRes.data.data || []);
        setFeatured(featRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="home-page">
      <CategoryBar categories={categories} />
      
      <div className="container">
        <HeroCarousel />
      </div>

      {/* ── Benefits ─────────────────────────────────────────── */}
      <section className="benefits-section container">
        <div className="benefits-grid">
          {HERO_BENEFITS.map((b) => (
            <div key={b.title} className="benefit-card">
              <span className="benefit-icon">{b.icon}</span>
              <div>
                <p className="benefit-title">{b.title}</p>
                <p className="benefit-desc">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Top Deals Section (Horizontal Scroller) ─────────── */}
      {featured.length > 0 && (
        <section className="section container">
          <div className="section-header">
            <h2 className="section-title">Blockbuster Deals</h2>
            <Link to="/products" className="section-link">View All Deals</Link>
          </div>
          <div className="scroller-container">
            <div className="products-scroller">
              {featured.map((p) => <div key={p._id} className="scroller-item"><ProductCard product={p} /></div>)}
            </div>
          </div>
        </section>
      )}

      {/* ── All Products ─────────────────────────────────── */}
      <section className="section container">
        <div className="section-header">
          <h2 className="section-title">Suggested For You</h2>
          <p className="section-subtitle">Based on latest trends and stock availability</p>
        </div>

        {loading ? (
          <div className="products-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="products-grid">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        ) : (
          <div className="no-products">
            <p>No products available yet. Check back soon!</p>
            <Link to="/products" className="hero-btn primary">Browse All Products</Link>
          </div>
        )}
      </section>

      {/* ── Promo Banner ─────────────────────────────────────── */}
      <section className="promo-banner container">
        <div className="promo-content">
          <h2>🔥 Summer Sale — Up to <span>70% Off</span></h2>
          <p>Limited time deals on top-picked products. Don't miss out!</p>
          <Link to="/products" className="hero-btn primary">Shop the Sale</Link>
        </div>
        <div className="promo-orbs">
          <div className="promo-orb p1" />
          <div className="promo-orb p2" />
        </div>
      </section>
    </main>
  );
};

export default HomePage;
