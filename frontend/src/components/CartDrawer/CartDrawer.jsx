import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';
import './CartDrawer.css';

const CartDrawer = () => {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  return (
    <>
      {/* Overlay */}
      <div className={`cart-overlay ${isOpen ? 'active' : ''}`} onClick={closeCart} />

      {/* Drawer */}
      <aside className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2 className="cart-title">
            <FiShoppingBag /> Shopping Cart
          </h2>
          <button className="cart-close" onClick={closeCart} aria-label="Close cart">
            <FiX size={22} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <div className="empty-icon">🛒</div>
            <p>Your cart is empty</p>
            <Link to="/products" className="continue-shopping" onClick={closeCart}>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.product} className="cart-item">
                  <img src={item.image} alt={item.name} className="item-image" />
                  <div className="item-details">
                    <p className="item-name">{item.name}</p>
                    <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
                    <div className="qty-controls">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.product, item.quantity - 1)}
                        aria-label="Decrease"
                      >
                        <FiMinus />
                      </button>
                      <span className="qty-num">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.product, item.quantity + 1)}
                        aria-label="Increase"
                      >
                        <FiPlus />
                      </button>
                    </div>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.product)}
                    aria-label="Remove item"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Total</span>
                <span className="total-amount">${totalPrice.toFixed(2)}</span>
              </div>
              <Link to="/checkout" className="checkout-btn" onClick={closeCart}>
                Proceed to Checkout
              </Link>
              <button className="clear-btn" onClick={clearCart}>
                Clear Cart
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
