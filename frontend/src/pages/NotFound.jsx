import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  useEffect(() => { document.title = 'Page Not Found \u2014 Online Books'; }, []);
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
