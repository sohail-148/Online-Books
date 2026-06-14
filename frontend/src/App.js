import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/authContext';
import CustomItemContext from './context/itemContext';
import ProtectedRoute from './components/ProtectedRoute';

import Header from './components/Header';
import ProductList from './components/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

import OrderHistory from './pages/OrderHistory';

function App() {
  return (
    <AuthProvider>
      <CustomItemContext>
        <Router>
          <Header />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 2500,
              style: { borderRadius: '10px', fontWeight: '500' },
            }}
          />
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/books/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-confirmation/:id"
              element={
                <ProtectedRoute>
                  <OrderConfirmation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrderHistory />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </CustomItemContext>
    </AuthProvider>
  );
}

export default App;
