import { Link } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { _id, name, images, price, discountPrice, rating, numReviews, stock, category } = product;

  const displayPrice = discountPrice > 0 ? discountPrice : price;
  const discount = discountPrice > 0 ? Math.round(((price - discountPrice) / price) * 100) : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      product: _id,
      name,
      image: images?.[0]?.url || 'https://via.placeholder.com/300',
      price: displayPrice,
      quantity: 1,
    });
  };

  return (
    <Link to={`/products/${_id}`} className="product-card">
      <div className="card-image-wrap">
        <img
          src={images?.[0]?.url || 'https://via.placeholder.com/300'}
          alt={name}
          className="card-image"
          loading="lazy"
        />
        {discount > 0 && <span className="discount-badge">-{discount}%</span>}
        {stock === 0 && <div className="out-of-stock-overlay">Out of Stock</div>}
      </div>

      <div className="card-body">
        {category && <span className="card-category">{category.name}</span>}

        <h3 className="card-name">{name}</h3>

        <div className="card-rating">
          <FiStar className="star-icon" />
          <span>{rating?.toFixed(1) || '0.0'}</span>
          <span className="review-count">({numReviews || 0})</span>
        </div>

        <div className="card-footer">
          <div className="card-price">
            <span className="price-current">${displayPrice?.toFixed(2)}</span>
            {discount > 0 && <span className="price-original">${price?.toFixed(2)}</span>}
          </div>
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={stock === 0}
            aria-label={`Add ${name} to cart`}
          >
            {stock === 0 ? 'Sold Out' : '+ Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
