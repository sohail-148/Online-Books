import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemContext } from '../context/itemContext';
import { useAuth } from '../context/authContext';
import toast from 'react-hot-toast';
import './Checkout.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const EMPTY_FORM = {
  fullName: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  phone: '',
};

const Checkout = () => {
  useEffect(() => { document.title = 'Checkout \u2014 Online Books'; }, []);
  const { cart, totalPrice, clearCart } = useContext(itemContext);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [placing, setPlacing] = useState(false);

  // Group cart items for the order summary
  const cartCount = cart.reduce((acc, item) => {
    if (acc[item._id]) {
      acc[item._id] = { ...acc[item._id], count: acc[item._id].count + 1 };
    } else {
      acc[item._id] = { ...item, count: 1 };
    }
    return acc;
  }, {});
  const cartItems = Object.values(cartCount);

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  if (!user) {
    navigate('/login', { state: { from: '/checkout' } });
    return null;
  }

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic phone validation
    if (!/^\d{10}$/.test(form.phone)) {
      toast.error('Enter a valid 10-digit phone number');
      return;
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      toast.error('Enter a valid 6-digit pincode');
      return;
    }

    const orderItems = cartItems.map((item) => ({
      book: item._id,
      title: item.title,
      image: item.image,
      price: item.price,
      quantity: item.count,
    }));

    try {
      setPlacing(true);
      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          items: orderItems,
          shippingAddress: form,
          totalPrice,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order failed');

      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${data._id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      <div className="checkout-layout">
        {/* Shipping form */}
        <div className="checkout-form-section">
          <h3>Shipping Details</h3>
          <form onSubmit={handleSubmit} className="checkout-form">
            {[
              { name: 'fullName', label: 'Full Name', placeholder: 'John Doe', type: 'text' },
              { name: 'address', label: 'Address', placeholder: '123 Main St', type: 'text' },
              { name: 'city', label: 'City', placeholder: 'Mumbai', type: 'text' },
              { name: 'state', label: 'State', placeholder: 'Maharashtra', type: 'text' },
              { name: 'pincode', label: 'Pincode', placeholder: '400001', type: 'text', maxLength: 6 },
              { name: 'phone', label: 'Phone', placeholder: '9876543210', type: 'tel', maxLength: 10 },
            ].map(({ name, label, placeholder, type, maxLength }) => (
              <label key={name}>
                {label}
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  maxLength={maxLength}
                  required
                />
              </label>
            ))}

            <button type="submit" className="place-order-btn" disabled={placing}>
              {placing ? 'Placing Order...' : `Place Order — ₹${totalPrice}`}
            </button>
          </form>
        </div>

        {/* Order summary */}
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          <ul>
            {cartItems.map((item) => (
              <li key={item._id} className="summary-item">
                <img src={item.image} alt={item.title} />
                <div className="summary-item-info">
                  <p className="summary-title">{item.title}</p>
                  <p>Qty: {item.count}</p>
                  <p>₹{item.price * item.count}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="summary-total">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
