import axios from 'axios';
import { useNavigate } from 'react-router';
import {formatCurrency} from '../../utils/money';

export function PaymentSummary({paymentSummary, loadCart}) {
  const navigate = useNavigate();
  const createOrder = async () => {
    /*
    Remember the cart is already saved in the backend
    so the backend can take that cart and create an order for us
    */
    await axios.post('/api/orders');
    // after create an order, backend will remove cartItem in the cart, we need to reload the cart
    await loadCart();
    navigate('/orders');
  }

  return (
    <div className="payment-summary">
      <div className="payment-summary-title">
        Сумма заказа
      </div>

      {paymentSummary && (
        <>
          <div className="payment-summary-row">
            <div>Товары ({paymentSummary.totalItems}):</div>
            <div className="payment-summary-money">
              {formatCurrency(paymentSummary.productCostCents)}
            </div>
          </div>

          <div className="payment-summary-row">
            <div>Доставка:</div>
            <div className="payment-summary-money">
              {formatCurrency(paymentSummary.shippingCostCents)}
            </div>
          </div>

          <div className="payment-summary-row total-row">
            <div>Итого к оплате:</div>
            <div className="payment-summary-money">
              {formatCurrency(paymentSummary.totalCostCents)}
            </div>
          </div>

          <button className="place-order-button button-primary" onClick={createOrder}>
            Оформить заказ
          </button>
        </>
      )}

    </div>
  );
}