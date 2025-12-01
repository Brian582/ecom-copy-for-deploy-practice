import {Link} from 'react-router-dom';
import '../styles/Navbar.css';
import { useContext } from "react";
import { ThemeContext, AuthContext } from "../Context.jsx";
import { FaShoppingCart } from 'react-icons/fa'; // provides cart icon

import { useState, useRef } from 'react';
import CartModal from "./Cartmodal.jsx";
import ProfileMenu from './ProfileMenu.jsx';

export default function NavBar() {
  const { cartItemcount, cartItems } = useContext(ThemeContext);
  const { user, authenticated} = useContext(AuthContext);

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
        <Link to="/order">
          <button>Order</button>
        </Link>
        <Link to="/signin">
          <button>Sign in</button>
        </Link>
        <Link to="/about">
          <button>About</button>
        </Link>
        <Link to="/contact">
          <button>Contact Us</button>
        </Link>
        <Link to="/checkout">
          <button>Checkout </button>
        </Link>
        <button aria-label="cart" onClick={() => setIsCartOpen(true)}>
          <FaShoppingCart className='icon-size' />
          
          {/* only displays counter when its greater than 0 */}
          {cartItemcount > 0 && (<span className='cart-icon'>
            {cartItemcount}</span>)} 
        </button>
        {authenticated && (
          <>
            <button ref={profileButtonRef} 
            onClick={() => setIsProfileOpen(prev => !prev)} 
            aria-haspopup="true" 
            aria-expanded={isProfileOpen}>
              {"Hi, " + user }
            </button>
            <ProfileMenu isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} onLogout={() => console.log('logout')} triggerRef={profileButtonRef} />
          </>
        )}
      </nav>
      
      {/* controls the modal appearing */}
      <CartModal
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      items={cartItems}
      />
    </>
  )
}