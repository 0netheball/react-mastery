import { useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router';
import LogoWhite from '../assets/images/logo-white.png'
import MobileLogo from '../assets/images/mobile-logo-white.png'
import './Header.css';

// Type Alias = works like a variable, but for types
type HeaderProps = {
  cart: {
    productId: string;
    quantity: number; 
    deliveryOptionId: string; 
  }[];
}

// TypeScript does not have enough info to figure out the type
export function Header({ cart }: HeaderProps) {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const debounceTimeout = useRef(null);

  const handleSearchInput = (event: {
    target: {
      value: string;
    }
  }) => {
    const value = event.target.value;
    setSearch(value);

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      if (value) {
        navigate(`/?search=${value}`);
      } else {
        navigate('/');
      }
    }, 300);
  }

  const handleKeyDown = (event: {
    key: string;
  }) => {
    if (event.key === 'Enter') {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

      if (search) {
        navigate(`/?search=${search}`);
      } else {
        navigate('/');
      }
    }
  }

  // Accumulation Pattern
  let totalQuantity = 0; 

  cart.forEach((cartItem) => {
    totalQuantity += cartItem.quantity; 
  });

  return (
    <>
      <div className="header">
        <div className="left-section">
          <NavLink to="/" className="header-link">
            <img className="logo"
              src={LogoWhite} />
            <img className="mobile-logo"
              src={MobileLogo} />
          </NavLink>
        </div>

        <div className="middle-section">
          <input className="search-bar" type="text" placeholder="Поиск" onChange={handleSearchInput} onKeyDown={handleKeyDown} value={search}/>
        </div>

        <div className="right-section">
          <NavLink className="orders-link header-link" to="/orders">

            <span className="orders-text">Заказы</span>
          </NavLink>

          <NavLink className="cart-link header-link" to="/checkout">
            <img className="cart-icon" src="images/icons/cart-icon.png" />
            <div className="cart-quantity">{totalQuantity}</div>
            <div className="cart-text">Корзина</div>
          </NavLink>
        </div>
      </div>
    </>
  );
}