import { DeliveryDate } from './components/DeliveryDate';
import { CartItemDetails } from './components/CartItemDetails';
import { DeliveryOptions } from './components/DeliveryOptions';

export function OrderSummary({cart, deliveryOptions}) {
  return (
    <div className="order-summary">
      {deliveryOptions.length > 0 && cart.map((cartItem) => {
        const selectedDeliveryOption = deliveryOptions
          .find((deliveryOption) => {
            return deliveryOption.id === cartItem.deliveryOptionId;
          });
        return (
          <div key={cartItem.productId} className="cart-item-container">
            <DeliveryDate selectedDeliveryOption={selectedDeliveryOption}/>

            <div className="cart-item-details-grid">
              <CartItemDetails cartItem={cartItem}/>

              <DeliveryOptions deliveryOptions={deliveryOptions} cartItem={cartItem}/>
            </div>
          </div>
        );
      })}
    </div>
  );
}