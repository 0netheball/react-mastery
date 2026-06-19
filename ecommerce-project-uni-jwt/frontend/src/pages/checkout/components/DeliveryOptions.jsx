import dayjs from 'dayjs';
import axios from 'axios';
import { formatCurrency } from '../../../utils/money';

export function DeliveryOptions({ deliveryOptions, cartItem, loadCart }) {
  return (
    <div className="delivery-options">
      <div className="delivery-options-title">
        Выберите способ доставки:
      </div>
      {deliveryOptions.map((deliveryOption) => {
        let priceString = 'Бесплатно';

        if (deliveryOption.priceCents > 0) {
          priceString = `${formatCurrency(deliveryOption.priceCents)} — доставка`;
        }
        // 2. Create function inside loop to get access to deliveryOption
        const updateDeliveryOption = async () => {
          await axios.put(`/api/cart-items/${cartItem.productId}`, {
            deliveryOptionId: deliveryOption.id, 
          });
          await loadCart();
        };

        return (
          // 1. add onClick attribute to the whole component instead of input only
          <div key={deliveryOption.id} className="delivery-option" onClick={updateDeliveryOption}>
            <input type="radio"
              checked={deliveryOption.id === cartItem.deliveryOptionId}
              onChange={() => {}}
              className="delivery-option-input"
              name={`delivery-option-${cartItem.productId}`} />
            <div>
              <div className="delivery-option-date">
                {dayjs(deliveryOption.estimatedDeliveryTimeMs).format('dddd, MMMM D')}
              </div>
              <div className="delivery-option-price">
                {priceString}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}