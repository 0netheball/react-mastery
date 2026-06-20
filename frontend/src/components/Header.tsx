import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useAuth } from '../utils/AuthContext';
import LogoWhite from '../assets/images/logo-white.png'
import MobileLogo from '../assets/images/mobile-logo-white.png'
import './Header.css';

type HeaderProps = {
  cart: {
    productId: string;
    quantity: number;
    deliveryOptionId: string;
  }[];
}

const googleIcon = (
  <svg className="login-btn-icon" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.54 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.99 23.99 0 0 0 0 24c0 3.83.87 7.44 2.56 10.78l7.98-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

export function Header({ cart }: HeaderProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setShowTooltip(false);
      }
    }
    if (showTooltip) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showTooltip]);

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
          <input className="search-bar" type="text" placeholder="Поиск" onChange={handleSearchInput} onKeyDown={handleKeyDown} value={search} />
        </div>

        <div className="right-section">
          {isAuthenticated ? (
            <div ref={tooltipRef} className="user-info">
              {user?.picture ? (
                <img
                  className="user-avatar"
                  src={user.picture}
                  alt="avatar"
                  onClick={() => setShowTooltip(prev => !prev)}
                />
              ) : (
                <div
                  className="user-avatar-placeholder"
                  onClick={() => setShowTooltip(prev => !prev)}
                >
                  {user?.email?.[0]?.toUpperCase() || '?'}
                </div>
              )}
              {showTooltip && (
                <div className="user-tooltip">
                  <div className="user-tooltip-email">{user?.email}</div>
                  <button className="user-tooltip-logout" onClick={logout}>
                    Выйти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink className="login-btn" to="/login">
              {googleIcon}
              <span className="login-btn-text">Войти</span>
            </NavLink>
          )}

          {isAuthenticated && (
            <>
              <NavLink className="seller-link header-link" to="/seller">
                <span className="seller-text">Мои товары</span>
              </NavLink>
              <span className="header-divider">|</span>
            </>
          )}

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
