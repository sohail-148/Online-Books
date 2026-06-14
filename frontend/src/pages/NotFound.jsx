import React from 'react';
import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';
import './NotFound.css';

const NotFound = () => {
  usePageTitle('Page Not Found');
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist.</p>
        <Link to="/">
          <button type="button" className="notfound-btn">Back to Home</button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
