import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { itemContext } from '../context/itemContext';
import toast from 'react-hot-toast';
import usePageTitle from '../hooks/usePageTitle';
import './ProductDetail.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useContext(itemContext);

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const quantityInCart = cart.filter((item) => item._id === id).length;

  // Dynamic title — updates once book loads
  usePageTitle(book ? book.title : 'Book Details');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/books/${id}`);
        if (!res.ok) throw new Error('Book not found');
        const data = await res.json();
        setBook(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(book);
    toast.success(`"${book.title}" added to cart!`);
  };

  const handleBuyNow = () => {
    addToCart(book);
    navigate('/checkout');
  };

  if (loading) return <div className="status-msg">Loading book details...</div>;
  if (error) return <div className="status-msg error-msg">{error}</div>;
  if (!book) return null;

  return (
    <div className="detail-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="detail-card">
        <img className="detail-img" src={book.image} alt={book.title} />

        <div className="detail-info">
          <h1 className="detail-title">{book.title}</h1>
          <p className="detail-author">by {book.author}</p>

          <div className="detail-meta">
            <span>📅 {book.PublishedYear}</span>
            <span>📖 {book.edition}</span>
          </div>

          <p className="detail-description">{book.description}</p>

          <div className="detail-price">₹{book.price}</div>

          {quantityInCart > 0 && (
            <p className="in-cart-note">✅ {quantityInCart} in your cart</p>
          )}

          <div className="detail-actions">
            <button
              type="button"
              className="detail-add-btn"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <button
              type="button"
              className="detail-buy-btn"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
            <button
              type="button"
              className="detail-cart-btn"
              onClick={() => navigate('/cart')}
            >
              Go to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
