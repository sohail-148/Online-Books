import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import usePageTitle from '../hooks/usePageTitle';
import './OrderHistory.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const OrderHistory = () => {
  usePageTitle('My Orders');
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_URL}/api/orders/myorders`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        if (!res.ok) throw new Error('Could not fetch orders');
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  if (loading) return <div className="status-msg">Loading orders...</div>;
  if (error) return <div className="status-msg error-msg">{error}</div>;

  return (
    <div className="history-container">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <div className="history-empty">
          <p>You haven't placed any orders yet.</p>
          <Link to="/">
            <button type="button" className="history-browse-btn">Browse Books</button>
          </Link>
        </div>
      ) : (
        <ul className="history-list">
          {orders.map((order) => (
            <li key={order._id} className="history-item">
              <div className="history-header">
                <div>
                  <p className="history-date">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </p>
                  <span className={`history-status status-${order.status}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="history-total">₹{order.totalPrice}</div>
              </div>

              <ul className="history-books">
                {order.items.map((item, i) => (
                  <li key={i} className="history-book">
                    <img src={item.image} alt={item.title} />
                    <div>
                      <p className="history-book-title">{item.title}</p>
                      <p>Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <Link to={`/order-confirmation/${order._id}`} className="history-view-link">
                View Details →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderHistory;
