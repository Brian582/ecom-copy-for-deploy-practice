import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import { useContext } from "react";
import { ThemeContext, AuthContext } from "../Context.jsx";
import { FaShoppingCart } from 'react-icons/fa'; // provides cart icon

import { useState, useRef } from 'react';
import CartModal from "./Cartmodal.jsx";
import ProfileMenu from './ProfileMenu.jsx';

export default function NavBar() {
  const { cartItemcount, cartItems } = useContext(ThemeContext);
  const { auth, logout } = useContext(AuthContext);
  const userRole = auth?.user?.role || auth?.user?.identity || null;

  //used to control when the modal appears
  const [isCartOpen, setIsCartOpen] = useState(false);
  // control profile menu visibility
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileButtonRef = useRef(null);

  return (
    <>
      <nav className='navbar'> 
        <Link to="/">
          <button>Home</button>
        </Link>
        {/* Food page no longer needed? */}
        {/* <Link to="/food">
          <button>Menu</button>
        </Link> */}
        { userRole !== "worker" && (
          <Link to="/order">
            <button>Order</button>
          </Link>
          )
        }
        {/* <Link to="/signin">
          <button>Sign in</button>
        </Link> */}
        <Link to="/SignUpOrSignIn">
          <button>Sign In</button>
        </Link>
        <Link to="/about">
          <button>About</button>
        </Link>
        <Link to="/contact">
          <button>Contact Us</button>
        </Link>
        {auth?.isLoggedIn && ( 
        <>
          { userRole !== "worker" && (
            <Link to="/checkout">
              <button>Checkout </button>
            </Link>
          )}
          <Link to="/manage-orders">
            <button className="nav-button">{userRole === 'worker' ? 'Manage Orders' : 'View Orders'}</button>
          </Link>
        </>
        )}
        { userRole !== "worker" && (
        <>
          <button aria-label="cart" onClick={() => setIsCartOpen(true)}>
            <FaShoppingCart className='cart-icon-size' />
            
            {/* only displays counter when its greater than 0 */}
            {cartItemcount > 0 && (<span className='cart-icon-counter'>
              {cartItemcount}</span>)} 
          </button>
        </>
        )}
        {auth?.isLoggedIn && (
          <>
            <button ref={profileButtonRef} 
            className="username"
            onClick={() => setIsProfileOpen(prev => !prev)} 
            aria-haspopup="true" 
            aria-expanded={isProfileOpen}>{/* when clicked profile menu will open using a function setProfileMenuOpen(true) */}
              {"Hi, " + (auth.user?.name || '') }
            </button>
            <ProfileMenu isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} onLogout={() => { logout(); }} triggerRef={profileButtonRef} />
          </>
        )}
      </nav>
      
      {/* controls the modal appearing */}
      { userRole !== "worker" && (
      <>
        <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={(function(){
          try {
            const userId = auth?.isLoggedIn ? String(auth.user?.userId || auth.user?.id || '') : null;
            if (!Array.isArray(cartItems)) return [];
            const activeCart = cartItems.find(c => (c.userId === null && userId === null) || (c.userId != null && String(c.userId) === String(userId)));
            return (activeCart && Array.isArray(activeCart.meals)) ? activeCart.meals : [];
          } catch (_) { 
            return [] 
          }
        })()}
        /> 
      </>
      )}
    </>
  )
}