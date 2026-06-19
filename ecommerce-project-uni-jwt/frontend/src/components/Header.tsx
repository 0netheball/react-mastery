import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
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
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const debounceTimeout = useRef(null);
  const { user, isDemo, googleLogin, logout } = useAuth();
  const googleButtonRef = useRef(null);
  const googleLoginRef = useRef(googleLogin);
  googleLoginRef.current = googleLogin;

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

  useEffect(() => {
    if (!user?.isDemo || !googleButtonRef.current) return;
    if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) return;

    const id = setInterval(() => {
      if (window.google?.accounts?.id && googleButtonRef.current) {
        clearInterval(id);

        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: (response) => {
            googleLoginRef.current(response.credential);
          }
        });

        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          { theme: 'outline', size: 'small', text: 'signin_with', shape: 'pill' }
        );
      }
    }, 300);

    return () => clearInterval(id);
  }, [user?.isDemo]);

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
          <div className="auth-section">
            {isDemo ? (
              <div ref={googleButtonRef} className="google-button-container" />
            ) : (
              <>
                {user?.avatar && (
                  <img className="user-avatar" src={user.avatar} alt="" />
                )}
                <span className="user-name">{user?.name}</span>
                <button className="logout-button" onClick={logout}>Выйти</button>
              </>
            )}
          </div>

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
