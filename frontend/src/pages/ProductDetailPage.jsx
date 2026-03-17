import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productAPI } from '../api/index.js';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiStar, FiShoppingCart, FiHeart, FiShare2, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await productAPI.getById(id);
        setProduct(data.data);
      } catch {
        toast.error('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
    addToCart({
      product: product._id,
      name: product.name,
      image: product.images?.[0]?.url || '',
      price: displayPrice,
      quantity: qty,
    });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please login to review'); return; }
    setSubmittingReview(true);
    try {
      await productAPI.addReview(id, { rating: reviewRating, comment: reviewComment });
      toast.success('Review submitted!');
      setReviewComment('');
      // Re-fetch product to show new review
      const { data } = await productAPI.getById(id);
      setProduct(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return (
    <div className="detail-loading">
      <div className="detail-img-skeleton" />
      <div className="detail-info-skeleton">
        <div className="sk-line lg" /><div className="sk-line md" /><div className="sk-line sm" />
      </div>
    </div>
  );

  if (!product) return <div className="not-found">Product not found</div>;

  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const discount = product.discountPrice > 0 ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  return (
    <div className="detail-page">
      <Link to="/products" className="back-link"><FiArrowLeft /> Back to Products</Link>

      <div className="detail-grid">
        {/* ── Images ─────────────────────────────────────────── */}
        <div className="detail-images">
          <div className="main-image-wrap">
            <img
              src={product.images?.[activeImage]?.url || 'https://via.placeholder.com/500'}
              alt={product.name}
              className="main-image"
            />
            {discount > 0 && <span className="detail-badge">-{discount}% OFF</span>}
          </div>
          {product.images?.length > 1 && (
            <div className="thumb-row">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt={`View ${i + 1}`}
                  className={`thumb ${i === activeImage ? 'active' : ''}`}
                  onClick={() => setActiveImage(i)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Info ───────────────────────────────────────────── */}
        <div className="detail-info">
          {product.category && <span className="detail-category">{product.category.name}</span>}
          <h1 className="detail-name">{product.name}</h1>

          <div className="detail-rating">
            {[1,2,3,4,5].map((s) => (
              <FiStar key={s} className={`star ${s <= Math.round(product.rating) ? 'filled' : ''}`} />
            ))}
            <span className="rating-text">{product.rating?.toFixed(1)} ({product.numReviews} reviews)</span>
          </div>

          <div className="detail-price-row">
            <span className="detail-price">${displayPrice?.toFixed(2)}</span>
            {discount > 0 && <span className="detail-original">${product.price?.toFixed(2)}</span>}
          </div>

          <p className="detail-desc">{product.description}</p>

          <div className="detail-meta">
            {product.brand && <div className="meta-item"><span>Brand:</span> <strong>{product.brand}</strong></div>}
            <div className="meta-item">
              <span>Stock:</span>
              <strong className={product.stock > 0 ? 'in-stock' : 'out-stock'}>
                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </strong>
            </div>
          </div>

          {product.stock > 0 && (
            <div className="qty-row">
              <div className="qty-selector">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="qty-ctrl">−</button>
                <span className="qty-val">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="qty-ctrl">+</button>
              </div>
              <button className="add-to-cart-big" onClick={handleAddToCart}>
                <FiShoppingCart /> Add to Cart
              </button>
            </div>
          )}

          <div className="detail-actions">
            <button className="action-btn"><FiHeart /> Wishlist</button>
            <button className="action-btn" onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}>
              <FiShare2 /> Share
            </button>
          </div>
        </div>
      </div>

      {/* ── Reviews ─────────────────────────────────────────── */}
      <section className="reviews-section">
        <h2 className="reviews-title">Customer Reviews</h2>

        {/* Write Review */}
        <div className="write-review">
          <h3>Write a Review</h3>
          {isAuthenticated ? (
            <form onSubmit={handleReviewSubmit} className="review-form">
              <div className="star-picker">
                {[1,2,3,4,5].map((s) => (
                  <button key={s} type="button" onClick={() => setReviewRating(s)} className={`star-pick ${s <= reviewRating ? 'active' : ''}`}>★</button>
                ))}
              </div>
              <textarea
                placeholder="Share your experience..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                required
                className="review-textarea"
                rows={3}
              />
              <button type="submit" className="review-submit" disabled={submittingReview}>
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <p className="login-to-review">
              <Link to="/login">Login</Link> to write a review
            </p>
          )}
        </div>

        {/* Reviews List */}
        <div className="reviews-list">
          {product.reviews?.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first!</p>
          ) : (
            product.reviews?.map((r) => (
              <div key={r._id} className="review-card">
                <div className="review-header">
                  <div className="reviewer-avatar">{r.name?.[0]}</div>
                  <div>
                    <p className="reviewer-name">{r.name}</p>
                    <div className="review-stars">
                      {[1,2,3,4,5].map((s) => (
                        <span key={s} className={`rs ${s <= r.rating ? 'filled' : ''}`}>★</span>
                      ))}
                    </div>
                  </div>
                  <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="review-comment">{r.comment}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage;
