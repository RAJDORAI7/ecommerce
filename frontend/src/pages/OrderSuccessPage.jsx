import { Link } from 'react-router-dom';
import { FiCheckCircle, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import './OrderSuccessPage.css';

const OrderSuccessPage = () => {
  return (
    <div className="order-success-container container section fade-in">
      <div className="success-content">
        <div className="success-icon">
          <FiCheckCircle />
        </div>
        <h1 className="success-title">Order Placed Successfully!</h1>
        <p className="success-message">
          Thank you for your purchase. Your order has been received and is being processed. 
          A confirmation email has been sent to your registered email address.
        </p>
        
        <div className="order-details-summary">
          <p>Order ID: <span>#ORD-{Math.floor(Math.random() * 1000000)}</span></p>
          <p>Estimated Delivery: <span>3-5 Business Days</span></p>
        </div>

        <div className="success-actions">
          <Link to="/orders" className="btn btn-primary">
            View My Orders <FiArrowRight />
          </Link>
          <Link to="/products" className="btn btn-ghost">
            <FiShoppingBag /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
