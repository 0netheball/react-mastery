import axios from 'axios';
import dayjs from 'dayjs';
import { Link, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import './TrackingPage.css';

export function TrackingPage({ cart }) {
  const { orderId, productId } = useParams();

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
      <title>Отслеживание</title>
      <link rel="icon" type="image/svg+xml" href="/tracking-favicon.png" />

      <Header cart={cart} />

      <div className="tracking-page">
        <div className="order-tracking">
          <Link className="back-to-orders-link link-primary" to="/orders">
            Все заказы
          </Link>

          <div className="delivery-date">
            { deliveryProgressPercent >= 100 ? 'Доставлен' : 'Прибывает '} 
            {dayjs(orderProduct.estimatedDeliveryTimeMs).format('dddd, MMMM D')}
          </div>

          <div className="product-info">
            {orderProduct.product.name}
          </div>

          <div className="product-info">
            Количество: {orderProduct.quantity}
          </div>

          <img className="product-image" src={orderProduct.product.image} />

          <div className="progress-labels-container">
            <div className={`progress-label ${isPreparing && 'current-status'}`}>
              Готовится
            </div>
            <div className={`progress-label ${isShipping && 'current-status'}`}>
              Отправлен
            </div>
            <div className={`progress-label ${isDelivered && 'current-status'}`}>
              Доставлен
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