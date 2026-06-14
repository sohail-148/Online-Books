import React, { useContext, useState, useEffect } from 'react';
import ProductItem from './ProductItem';
import { itemContext } from '../context/itemContext';
import usePageTitle from '../hooks/usePageTitle';

// Skeleton card shown while loading
const SkeletonCard = () => (
  <li className="skeleton-card">
    <div className="skeleton-img" />
    <div className="skeleton-body">
      <div className="skeleton-line title" />
      <div className="skeleton-line short" />
      <div className="skeleton-line medium" />
      <div className="skeleton-line long" />
      <div className="skeleton-line long" />
      <div className="skeleton-line medium" />
    </div>
  </li>
);

const ProductList = () => {
  usePageTitle(null); // Home page — just "Online Books"
  const { products, loading, error } = useContext(itemContext);

  const [minPrice, setMinPrice]           = useState(0);
  const [maxPrice, setMaxPrice]           = useState(3000);
  const [selectedEdition, setSelectedEdition] = useState('All');
  const [sortAsc, setSortAsc]             = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    let result = [...products];

    result = result.filter((p) => p.price >= minPrice && p.price <= maxPrice);

    if (selectedEdition !== 'All') {
      result = result.filter((p) => p.edition === selectedEdition);
    }

    if (sortAsc) {
      result.sort((a, b) => a.price - b.price);
    }

    setFilteredProducts(result);
  }, [products, minPrice, maxPrice, selectedEdition, sortAsc]);

  const handleReset = () => {
    setMinPrice(0);
    setMaxPrice(3000);
    setSelectedEdition('All');
    setSortAsc(false);
  };

  if (error) return <div className="status-msg error-msg">{error}</div>;

  return (
    <div className="prdt-list">
      <h2>Book List</h2>

      <div className="filter-btn">
        <button onClick={() => setSortAsc((p) => !p)}>
          {sortAsc ? 'Price ↑ (reset)' : 'Sort By Price'}
        </button>

        <label>
          Min Price:
          <input
            type="number"
            value={minPrice}
            min={0}
            onChange={(e) => setMinPrice(Number(e.target.value))}
          />
        </label>

        <label>
          Max Price:
          <input
            type="number"
            value={maxPrice}
            min={0}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </label>

        <label>
          Edition:
          <select value={selectedEdition} onChange={(e) => setSelectedEdition(e.target.value)}>
            <option value="All">All</option>
            <option value="1st edition">1st Edition</option>
            <option value="2nd edition">2nd Edition</option>
            <option value="2023 updated edition">2023 Updated</option>
          </select>
        </label>

        <button onClick={handleReset}>Reset Filters</button>
      </div>

      {loading ? (
        <ul className="item-cart skeleton-list">
          {Array.from({ length: 4 }, (_, i) => <SkeletonCard key={i} />)}
        </ul>
      ) : filteredProducts.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="empty-svg" aria-hidden="true">
            <rect x="30" y="40" width="80" height="100" rx="6" fill="#e8e0f8" stroke="#6a11cb" strokeWidth="2"/>
            <rect x="50" y="30" width="80" height="100" rx="6" fill="#f0ebfc" stroke="#6a11cb" strokeWidth="2"/>
            <rect x="70" y="20" width="80" height="100" rx="6" fill="#fff" stroke="#6a11cb" strokeWidth="2"/>
            <line x1="82" y1="45" x2="138" y2="45" stroke="#c4b0e8" strokeWidth="2" strokeLinecap="round"/>
            <line x1="82" y1="58" x2="138" y2="58" stroke="#c4b0e8" strokeWidth="2" strokeLinecap="round"/>
            <line x1="82" y1="71" x2="120" y2="71" stroke="#c4b0e8" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="155" cy="125" r="22" fill="#fdecea" stroke="#e74c3c" strokeWidth="2"/>
            <line x1="148" y1="118" x2="162" y2="132" stroke="#e74c3c" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="162" y1="118" x2="148" y2="132" stroke="#e74c3c" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <p className="empty-title">No books found</p>
          <p className="empty-subtitle">Try adjusting your filters or search term.</p>
          <button type="button" className="filter-btn-reset" onClick={handleReset}>Clear Filters</button>
        </div>
      ) : (
        <ul className="item-cart">
          {filteredProducts.map((product) => (
            <ProductItem key={product._id} product={product} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductList;
