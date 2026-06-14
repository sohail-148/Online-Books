import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { itemContext } from '../context/itemContext';
import { useAuth } from '../context/authContext';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import './cart.css';

const Cart = () => {
  useEffect(() => { document.title = 'Your Cart \u2014 Online Books'; }, []);
  const { cart, addToCart, removeFromCart, totalPrice } = useContext(itemContext);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Group duplicate entries by _id and count them
  const cartCount = cart.reduce((acc, item) => {
    if (acc[item._id]) {
      acc[item._id] = { ...acc[item._id], count: acc[item._id].count + 1 };
    } else {
      acc[item._id] = { ...item, count: 1 };
    }
    return acc;
  }, {});

  const cartItems = Object.values(cartCount);

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to proceed to checkout');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>

      {cartItems.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="empty-svg" aria-hidden="true">
            <rect x="40" y="50" width="120" height="80" rx="10" fill="#f0ebfc" stroke="#6a11cb" strokeWidth="2"/>
            <path d="M60 50 Q70 20 100 18 Q130 20 140 50" stroke="#6a11cb" strokeWidth="2" fill="none"/>
            <circle cx="68" cy="138" r="10" fill="#6a11cb"/>
            <circle cx="68" cy="138" r="4" fill="white"/>
            <circle cx="132" cy="138" r="10" fill="#6a11cb"/>
            <circle cx="132" cy="138" r="4" fill="white"/>
            <line x1="75" y1="88" x2="125" y2="88" stroke="#c4b0e8" strokeWidth="2" strokeLinecap="round"/>
            <line x1="85" y1="100" x2="115" y2="100" stroke="#c4b0e8" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <p className="empty-title">Your cart is empty</p>
          <p className="empty-subtitle">Looks like you haven't added anything yet.</p>
          <Link to="/">
            <button type="button" className="checkout-btn">Browse Books</button>
          </Link>
        </div>
      ) : (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item._id} className="cart-item">
                <img src={item.image} alt={item.title} />
                <div className="cart-item-info">
                  <h4>{item.title}</h4>
                  <p>Price: ₹{item.price}</p>
                  <p>Subtotal: ₹{item.price * item.count}</p>
                  <div className="quantity-controls">
                    <button
                      type="button"
                      onClick={() => removeFromCart(item)}
                      aria-label={`Remove one ${item.title}`}
                    >
                      −
                    </button>
                    <span className="quantity">{item.count}</span>
                    <button
                      type="button"
                      onClick={() => addToCart(item)}
                      aria-label={`Add one ${item.title}`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <h3 className="total-price">Total: ₹{totalPrice}</h3>
          <button type="button" className="checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
