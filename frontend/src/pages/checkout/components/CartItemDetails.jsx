import axios from 'axios';
import { useState } from 'react';
import { formatCurrency } from '../../../utils/money';

export function CartItemDetails({ cartItem, loadCart }) {
  const [textbox, setTextbox] = useState(false);
  const [quantity, setQuantity] = useState(cartItem.quantity);

  const getQuantity = (event) => {
    setQuantity(Number(event.target.value));
  }

  const updateCartQuantity = async () => {
    if (textbox) {
      setTextbox(false);
    } else {
      setTextbox(true);
    }

    await axios.put(`/api/cart-items/${cartItem.productId}`, {
      quantity: quantity
    });
    await loadCart();
  }

  const deleteCartItem = async () => {
    await axios.delete(`/api/cart-items/${cartItem.productId}`)
    await loadCart();
  }

  const onKeyDownHandler = (event) => {
    if (event.key === 'Enter') {
      updateCartQuantity();
    } else if (event.key === 'Escape') {
      setQuantity(cartItem.quantity);
      setTextbox(false);
    }
  }

  return (
    <>
      <img className="product-image"
        src={cartItem.product.image}
      />

      <div className="cart-item-details">
        <div className="product-name">
          {cartItem.product.name}
        </div>
        <div className="product-price">
          {formatCurrency(cartItem.product.priceCents)}
        </div>
        <div className="product-quantity">
          <span>
            Кол-во:
            {textbox && (<input type="text" className='quantity-input' value={quantity} onChange={getQuantity} onKeyDown={onKeyDownHandler}/>)}
            <span className="quantity-label">{cartItem.quantity}</span>
          </span>

          <span className="update-quantity-link link-primary" onClick={updateCartQuantity}>
            {textbox ? 'Сохранить' : 'Изменить'}
          </span>
          <span className="delete-quantity-link link-primary" onClick={deleteCartItem}>
            Удалить
          </span>
        </div>
      </div>
    </>
  );
}