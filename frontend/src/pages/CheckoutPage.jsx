import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../api/index.js';
import { toast } from 'react-toastify';
import { FiTruck, FiCreditCard, FiPackage, FiChevronRight, FiMapPin, FiPhone, FiUser } from 'react-icons/fi';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
  });

  const [paymentMethod, setPaymentMethod] = useState('stripe');

  const handleInputChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    if (step === 1) {
      const { fullName, phone, street, city, state, zipCode } = shippingAddress;
      if (!fullName || !phone || !street || !city || !state || !zipCode) {
        return toast.error('Please fill in all shipping details');
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        orderItems: items,
        shippingAddress,
        paymentMethod,
        itemsPrice: totalPrice,
        shippingPrice: totalPrice > 100 ? 0 : 10,
        taxPrice: totalPrice * 0.1, // 10% tax for demo
        totalPrice: totalPrice + (totalPrice > 100 ? 0 : 10) + (totalPrice * 0.1),
      };

      const { data } = await orderAPI.create(orderData);
      toast.success('Order placed successfully!');
      clearCart();
      navigate('/order/success');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/products');
    return null;
  }

  return (
    <div className="checkout-container container section fade-in">
      <div className="checkout-layout">
        <div className="checkout-main">
          {/* Progress Bar */}
          <div className="checkout-steps">
            <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
              <span className="step-num">1</span>
              <span className="step-label">Shipping</span>
            </div>
            <div className="step-line" />
            <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
              <span className="step-num">2</span>
              <span className="step-label">Payment</span>
            </div>
          </div>

          {step === 1 ? (
            <div className="step-content">
              <h2 className="step-title"><FiTruck /> Shipping Information</h2>
              <div className="form-grid">
                <div className="form-group full">
                  <label><FiUser /> Full Name</label>
                  <input type="text" name="fullName" value={shippingAddress.fullName} onChange={handleInputChange} placeholder="John Doe" />
                </div>
                <div className="form-group">
                  <label><FiPhone /> Phone Number</label>
                  <input type="text" name="phone" value={shippingAddress.phone} onChange={handleInputChange} placeholder="+1 234 567 890" />
                </div>
                <div className="form-group">
                  <label><FiMapPin /> Street Address</label>
                  <input type="text" name="street" value={shippingAddress.street} onChange={handleInputChange} placeholder="123 Main St" />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input type="text" name="city" value={shippingAddress.city} onChange={handleInputChange} placeholder="New York" />
                </div>
                <div className="form-group">
                  <label>State / Province</label>
                  <input type="text" name="state" value={shippingAddress.state} onChange={handleInputChange} placeholder="NY" />
                </div>
                <div className="form-group">
                  <label>Zip / Postal Code</label>
                  <input type="text" name="zipCode" value={shippingAddress.zipCode} onChange={handleInputChange} placeholder="10001" />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input type="text" name="country" value={shippingAddress.country} onChange={handleInputChange} placeholder="USA" />
                </div>
              </div>
              <button className="btn btn-primary next-btn" onClick={nextStep}>
                Continue to Payment <FiChevronRight />
              </button>
            </div>
          ) : (
            <div className="step-content">
              <h2 className="step-title"><FiCreditCard /> Payment Method</h2>
              <div className="payment-options">
                <label className={`payment-card ${paymentMethod === 'stripe' ? 'selected' : ''}`}>
                  <input type="radio" value="stripe" checked={paymentMethod === 'stripe'} onChange={() => setPaymentMethod('stripe')} />
                  <div className="payment-icon">💳</div>
                  <div className="payment-info">
                    <p className="name">Credit / Debit Card</p>
                    <p className="desc">Secure payment with Stripe</p>
                  </div>
                </label>
                <label className={`payment-card ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                  <input type="radio" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                  <div className="payment-icon">🏠</div>
                  <div className="payment-info">
                    <p className="name">Cash on Delivery</p>
                    <p className="desc">Pay when you receive the order</p>
                  </div>
                </label>
              </div>

              <div className="checkout-actions">
                <button className="btn btn-ghost" onClick={prevStep}>Back</button>
                <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Processing...' : 'Place Order Now'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <aside className="checkout-sidebar">
          <div className="summary-card">
            <h3 className="summary-title"><FiPackage /> Order Summary</h3>
            <div className="summary-items">
              {items.map((item) => (
                <div key={item.product} className="summary-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-info">
                    <p className="name">{item.name}</p>
                    <p className="qty-price">{item.quantity} x ${item.price}</p>
                  </div>
                  <p className="total">${(item.quantity * item.price).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="total-row">
                <span>Subtotal ({totalItems} items)</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping</span>
                <span>{totalPrice > 100 ? 'FREE' : '$10.00'}</span>
              </div>
              <div className="total-row">
                <span>Estimated Tax (10%)</span>
                <span>${(totalPrice * 0.1).toFixed(2)}</span>
              </div>
              <div className="total-row final">
                <span>Total</span>
                <span>${(totalPrice + (totalPrice > 100 ? 0 : 10) + (totalPrice * 0.1)).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;
