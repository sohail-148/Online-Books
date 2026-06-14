import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import './OrderConfirmation.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const OrderConfirmation = () => {
  useEffect(() => { document.title = 'Order Confirmed \u2014 Online Books'; }, []);
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API_URL}/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        if (!res.ok) throw new Error('Could not load order');
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrder();
  }, [id, user]);

  if (loading) return <div className="status-msg">Loading order...</div>;
  if (error) return <div className="status-msg error-msg">{error}</div>;
  if (!order) return null;

  const { shippingAddress: addr, items, totalPrice, createdAt } = order;

  return (
    <div className="confirm-container">
      <div className="confirm-card">
        <div className="confirm-icon">✅</div>
        <h2>Order Confirmed!</h2>
        <p className="confirm-subtitle">
          Thank you for your order. Here's your summary.
        </p>
        <p className="confirm-date">
          Placed on {new Date(createdAt).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'long', year: 'numeric',
          })}
        </p>

        <div className="confirm-section">
          <h3>Items Ordered</h3>
          <ul className="confirm-items">
            {items.map((item, i) => (
              <li key={i} className="confirm-item">
                <img src={item.image} alt={item.title} />
                <div>
                  <p className="confirm-item-title">{item.title}</p>
                  <p>Qty: {item.quantity} × ₹{item.price} = ₹{item.price * item.quantity}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="confirm-total">Total Paid: ₹{totalPrice}</div>
        </div>

        <div className="confirm-section">
          <h3>Shipping To</h3>
          <div className="confirm-address">
            <p>{addr.fullName}</p>
            <p>{addr.address}, {addr.city}</p>
            <p>{addr.state} — {addr.pincode}</p>
            <p>📞 {addr.phone}</p>
          </div>
        </div>

        <Link to="/">
          <button type="button" className="confirm-home-btn">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
