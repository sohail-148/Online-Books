import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { itemContext } from '../context/itemContext';
import toast from 'react-hot-toast';

const ProductItem = ({ product }) => {
  const { addToCart, removeFromCart, cart } = useContext(itemContext);

  const quantityInCart = cart.filter((item) => item._id === product._id).length;

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`Added "${product.title}" to cart`);
  };

  const handleRemoveFromCart = () => {
    removeFromCart(product);
    toast.success(`Removed one "${product.title}" from cart`);
  };

  // Truncate description to ~120 chars
  const shortDesc =
    product.description.length > 120
      ? product.description.slice(0, 120).trimEnd() + '…'
      : product.description;

  // Mock star rating derived from price (just for display polish)
  const stars = Math.min(5, Math.max(3, Math.round(product.price / 400)));

  return (
    <li className="product-card">
      {/* Clickable image */}
      <Link to={`/books/${product._id}`} className="product-img-link">
        <img className="product-img" src={product.image} alt={product.title} />
      </Link>

      <div className="product-detail">
        {/* Title */}
        <Link to={`/books/${product._id}`} className="product-title-link">
          <h3 className="product-title">{product.title}</h3>
        </Link>

        <p className="product-author">{product.author}</p>

        {/* Star rating */}
        <div className="product-stars" aria-label={`${stars} out of 5 stars`}>
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < stars ? 'star filled' : 'star'}>★</span>
          ))}
        </div>

        {/* Truncated description */}
        <p className="product-desc">{shortDesc}</p>

        <div className="product-meta">
          <span>📅 {product.PublishedYear}</span>
          <span className="product-edition">{product.edition}</span>
        </div>

        <div className="product-footer">
          <span className="product-price">₹{product.price}</span>

          {quantityInCart > 0 && (
            <span className="cart-qty-badge">🛒 {quantityInCart} in cart</span>
          )}
        </div>

        <div className="product-actions">
          <button type="button" className="btn-add" onClick={handleAddToCart}>
            Add to Cart
          </button>
          <button
            type="button"
            className="btn-remove"
            onClick={handleRemoveFromCart}
            disabled={quantityInCart === 0}
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
};

export default ProductItem;
