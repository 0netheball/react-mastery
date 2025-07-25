import axios from 'axios';
import dayjs from 'dayjs';
import { Link, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import './TrackingPage.css';

export function TrackingPage({ cart }) {
  const { orderId, productId } = useParams();
  // 27cba69d-4c3d-4098-b42d-ac7fa62b7664
  // e43638ce-6aa0-4b85-b27f-e1d07eb678c6

  const [order, setOrder] = useState(null);

  useEffect(() => {
    axios.get(`/api/orders/${orderId}?expand=products`).then((response) => {
      setOrder(response.data);
    });
  }, [orderId]);

  if (!order) {
    return null;
  }

  const orderProduct = order.products.find((orderProduct) => {
    return orderProduct.productId === productId;
  });
  const totalDeliveryTimeMs = orderProduct.estimatedDeliveryTimeMs - order.orderTimeMs;
  const timePassedMs = dayjs().valueOf() - order.orderTimeMs;
 
  let deliveryProgressPercent = (timePassedMs / totalDeliveryTimeMs) * 100;
  if (deliveryProgressPercent > 100) {
    deliveryProgressPercent = 100;
  }

  const isPreparing = deliveryProgressPercent < 33;
  const isShipping = deliveryProgressPercent >= 33 && deliveryProgressPercent < 100; 
  const isDelivered = deliveryProgressPercent === 100; 

  return (
    <>
      <title>Tracking</title>
      <link rel="icon" type="image/svg+xml" href="/tracking-favicon.png" />

      <Header cart={cart} />

      <div className="tracking-page">
        <div className="order-tracking">
          <Link className="back-to-orders-link link-primary" to="orders">
            View all orders
          </Link>

          <div className="delivery-date">
            { deliveryProgressPercent >= 100 ? 'Arriving on ' : 'Delivered on '} 
            {dayjs(orderProduct.estimatedDeliveryTimeMs).format('dddd, MMMM D')}
          </div>

          <div className="product-info">
            {orderProduct.product.name}
          </div>

          <div className="product-info">
            Quantity: {orderProduct.quantity}
          </div>

          <img className="product-image" src={orderProduct.product.image} />

          <div className="progress-labels-container">
            <div className={`progress-label ${isPreparing && 'current-status'}`}>
              Preparing
            </div>
            <div className={`progress-label ${isShipping && 'current-status'}`}>
              Shipped
            </div>
            <div className={`progress-label ${isDelivered && 'current-status'}`}>
              Delivered
            </div>
          </div>

          <div className="progress-bar-container">
            <div className="progress-bar" style={{width: `${deliveryProgressPercent}%`}}></div>
          </div>
        </div>
      </div>
    </>
  );
}