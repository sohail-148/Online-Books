import React, { useEffect, useState, createContext } from 'react';

const itemContext = createContext();

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Load cart from localStorage
const loadCart = () => {
  try {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const CustomItemContext = ({ children }) => {
  // allProducts = full unfiltered list from server (fetched once)
  const [allProducts, setAllProducts] = useState([]);
  const [cart, setCart] = useState(loadCart);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Persist cart
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Fetch ALL products once on mount — no server-side filtering
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_URL}/api/books`);
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        const data = await response.json();
        setAllProducts(data);
      } catch (err) {
        setError(err.message || 'Failed to load books. Is the server running?');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Client-side search filter — applied on top of allProducts
  // ProductList applies additional price/edition filters on top of this
  const products = searchQuery.trim()
    ? allProducts.filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q)
        );
      })
    : allProducts;

  // Derived cart values
  const itemsInCart = cart.length;
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  const removeFromCart = (product) => {
    setCart((prev) => {
      const index = prev.findIndex((item) => item._id === product._id);
      if (index === -1) return prev;
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  return (
    <itemContext.Provider
      value={{
        products,      // filtered by search (price/edition filtering done in ProductList)
        allProducts,   // full list — useful if needed elsewhere
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        itemsInCart,
        totalPrice,
        loading,
        error,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </itemContext.Provider>
  );
};

export { itemContext };
export default CustomItemContext;
