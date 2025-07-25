import axios from 'axios';
import {useState, useEffect} from 'react';
import { Routes, Route } from 'react-router'
import {HomePage} from "./pages/home/HomePage";
import {CheckoutPage} from './pages/checkout/CheckoutPage';
import {OrdersPage} from './pages/orders/OrdersPage';
import {TrackingPage} from './pages/TrackingPage';
import { NotFoundPage } from './components/NotFoundPage';
import './App.css'

export default function App() {
  const [cart, setCart] = useState([]);

  const getCartData = async () => {
    const response = await axios.get('/api/cart-items?expand=product');
    setCart(response.data);
  }

  useEffect(() => {
    getCartData();
  }, []);
  return (
    <>
      <Routes> 
        <Route path='/' element={<HomePage cart={cart} getCartData={getCartData}/>}></Route>
        <Route path='/checkout' element={<CheckoutPage cart={cart}/>} />
        <Route path='/orders' element={<OrdersPage cart={cart}/>}/>
        <Route path='/tracking/:orderId/:productId' element={<TrackingPage cart={cart}/>}/>
        <Route path='*' element={<NotFoundPage cart={cart}/>}/>
      </Routes>
    </>
  );
}
