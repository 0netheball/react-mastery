import axios from 'axios';
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router'
import { HomePage } from "./pages/home/HomePage";
import { CheckoutPage } from './pages/checkout/CheckoutPage';
import { OrdersPage } from './pages/orders/OrdersPage';
import { TrackingPage } from './pages/TrackingPage';
import { NotFoundPage } from './components/NotFoundPage';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './utils/AuthContext';
import './App.css'

export default function App() {
  const [cart, setCart] = useState([]);
  const { isAuthenticated } = useAuth();

  const loadCart = async () => {
    try {
      const response = await axios.get('/api/cart-items?expand=product');
      setCart(response.data);
    } catch (e: unknown) {
      const err = e as { response?: { status?: number }; message?: string };
      console.error('loadCart error:', err.message);
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      setCart([]);
    }
  }, [isAuthenticated]);

  return (
    <Routes>
      <Route path='/' element={<HomePage cart={cart} loadCart={loadCart} />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/checkout' element={
        <ProtectedRoute><CheckoutPage cart={cart} loadCart={loadCart}/></ProtectedRoute>
      } />
      <Route path='/orders' element={
        <ProtectedRoute><OrdersPage cart={cart} loadCart={loadCart}/></ProtectedRoute>
      } />
      <Route path='/tracking/:orderId/:productId' element={<TrackingPage cart={cart} />} />
      <Route path='*' element={<NotFoundPage cart={cart} />} />
    </Routes>
  );
}
