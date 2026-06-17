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
          {isAuthenticated ? (
            <div ref={tooltipRef} className="user-info" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                {user?.picture ? (
                  <img
                    src={user.picture}
                    alt="avatar"
                    onClick={() => setShowTooltip(prev => !prev)}
                    style={{ width: 32, height: 32, borderRadius: '50%', cursor: 'pointer' }}
                  />
                ) : (
                  <div
                    onClick={() => setShowTooltip(prev => !prev)}
                    style={{
                      width: 32, height: 32, borderRadius: '50%', cursor: 'pointer',
                      background: '#555', color: '#fff', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 'bold'
                    }}
                  >
                    {user?.email?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
                {showTooltip && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: 8,
                      background: '#333',
                      color: '#fff',
                      padding: '8px 12px',
                      borderRadius: 6,
                      fontSize: 13,
                      whiteSpace: 'nowrap',
                      zIndex: 100,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                    }}
                  >
                    <div style={{ marginBottom: 4 }}>{user?.email}</div>
                    <button
                      onClick={logout}
                      style={{
                        background: 'none', border: '1px solid #fff', color: '#fff',
                        padding: '4px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 12, width: '100%'
                      }}
                    >Выйти</button>
                  </div>
                )}
            </div>
          ) : (
            <NavLink className="orders-link header-link" to="/login" style={{ textDecoration: 'none' }}>
              <span className="orders-text">Войти</span>
            </NavLink>
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