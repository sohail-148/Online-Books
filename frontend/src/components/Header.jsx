import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { itemContext } from '../context/itemContext';
import { useAuth } from '../context/authContext';

const Header = () => {
  const { itemsInCart, searchQuery, setSearchQuery } = useContext(itemContext);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
    setDarkMode((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="header">

      {/* ── Logo ── */}
      <Link to="/" className="bookheading-link">
        <span className="bookheading">Online Books</span>
      </Link>

      {/* ── Search — fills available space ── */}
      <div className="header-search">
        <svg className="search-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.8"/>
          <path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <input
          type="search"
          className="search-input"
          placeholder="Search books or authors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search books"
        />
      </div>

      {/* ── Dark mode toggle ── */}
      <button
        className="dark-mode-toggle"
        onClick={toggleDarkMode}
        aria-label="Toggle dark mode"
        title="Toggle dark mode"
      >
        {darkMode ? '☀️' : '🌙'}
      </button>

      {/* ── More dropdown (2nd from right) ── */}
      <div className="more-menu-wrapper" ref={dropdownRef}>
        <button
          className="more-btn"
          onClick={() => setDropdownOpen((p) => !p)}
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
        >
          {user ? (
            <>
              <span className="more-avatar">
                {user.name.charAt(0).toUpperCase()}
              </span>
              <span className="more-name">{user.name.split(' ')[0]}</span>
            </>
          ) : (
            <span className="more-name">Account</span>
          )}
          <svg className="chevron" viewBox="0 0 10 6" fill="none" aria-hidden="true">
            <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {dropdownOpen && (
          <div className="dropdown-menu">
            {user ? (
              <>
                <div className="dropdown-header">
                  <span className="dropdown-user-name">{user.name}</span>
                  <span className="dropdown-user-email">{user.email}</span>
                </div>
                <div className="dropdown-divider" />
                <Link
                  to="/orders"
                  className="dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  📦 My Orders
                </Link>
                <Link
                  to="/cart"
                  className="dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  🛒 My Cart {itemsInCart > 0 && <span className="dropdown-badge">{itemsInCart}</span>}
                </Link>
                <div className="dropdown-divider" />
                <button className="dropdown-item dropdown-logout" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  🔑 Login
                </Link>
                <Link
                  to="/register"
                  className="dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  ✏️ Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Cart icon — far right ── */}
      <Link to="/cart" className="cart-link" aria-label={`Cart, ${itemsInCart} items`}>
        <div className="cart-wrapper">
          <svg
            className="cart-icon-svg"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect x="8" y="12" width="38" height="30" rx="4" ry="4"
              fill="none" stroke="#a0a0c0" strokeWidth="3" />
            <line x1="21" y1="12" x2="21" y2="42" stroke="#a0a0c0" strokeWidth="2" />
            <line x1="33" y1="12" x2="33" y2="42" stroke="#a0a0c0" strokeWidth="2" />
            <line x1="8"  y1="22" x2="46" y2="22" stroke="#a0a0c0" strokeWidth="2" />
            <line x1="8"  y1="32" x2="46" y2="32" stroke="#a0a0c0" strokeWidth="2" />
            <path d="M46 18 L56 10" stroke="#7878b0" strokeWidth="3" strokeLinecap="round" />
            <rect x="52" y="6" width="10" height="7" rx="3.5" fill="#4477dd" />
            <path d="M6 42 Q8 52 18 52 L46 52 Q54 52 54 44"
              fill="none" stroke="#b0a0cc" strokeWidth="3" strokeLinecap="round" />
            <circle cx="18" cy="57" r="5" fill="#4477dd" />
            <circle cx="18" cy="57" r="2" fill="white" />
            <circle cx="46" cy="57" r="5" fill="#4477dd" />
            <circle cx="46" cy="57" r="2" fill="white" />
          </svg>
          {itemsInCart > 0 && (
            <span className="cart-badge">{itemsInCart}</span>
          )}
        </div>
      </Link>

    </header>
  );
};

export default Header;
