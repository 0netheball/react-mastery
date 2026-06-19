import { it, expect, describe, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { Product } from './Product';


vi.mock('axios');

describe('test suite: Product component:', () => {
    let product;
    let loadCart;

    beforeEach(() => {
      product = {
        id: "a1b2c3d4-0001-4000-a000-000000000001",
        image: "images/products/cpu-intel-01.jpg",
        name: "Процессор Intel Core i5-14600KF (14 ядер, до 5.3 ГГц)",
        rating: {
          stars: 4.5,
          count: 234
        },
        priceCents: 15000,
        keywords: ["cpu", "intel", "processor"]
      }; 

      loadCart = vi.fn();
    });

  it('displays the product details correctly', () => {

    render(<Product product={product} loadCart={loadCart}/>);

    expect(
      screen.getByText('Процессор Intel Core i5-14600KF (14 ядер, до 5.3 ГГц)')
    ).toBeInTheDocument();

    expect(
      screen.getByText('15 000 ₽')
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('product-image')
    ).toHaveAttribute('src', 'images/products/cpu-intel-01.jpg');

    expect(
      screen.getByTestId('product-rating-stars')
    ).toHaveAttribute('src', `images/ratings/rating-${product.rating.stars * 10}.png`);

    expect(
      screen.getByText('234')
    ).toBeInTheDocument();
  });

  it('adds a product to the cart', async () => {

    render(<Product product={product} loadCart={loadCart}/>);

    const addToCartButton = screen.getByTestId('add-to-cart-button');

    const user = userEvent.setup(); // Set up user event
    await user.click(addToCartButton);

    expect(axios.post).toHaveBeenCalledWith('/api/cart-items', {
      productId: 'a1b2c3d4-0001-4000-a000-000000000001',
      quantity: 1
    });
    expect(loadCart).toHaveBeenCalled();
  });
});