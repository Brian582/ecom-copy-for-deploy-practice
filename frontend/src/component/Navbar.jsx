import {Link} from 'react-router-dom';
import '../styles/Navbar.css';
import { useContext } from "react";
import { ThemeContext } from "../Context.jsx";
import { FaShoppingCart } from 'react-icons/fa'; // provides cart icon


import { useState } from 'react';
import CartModal from "./Cartmodal.jsx";

export default function NavBar() {
  const { cartItemcount, cartItems } = useContext(ThemeContext);

  //used to control when the modal appears
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <nav className='navbar'> 
        <Link to="/">
          <button>Home</button>
        </Link>
        <Link to="/food">
          <button>Menu</button>
        </Link>
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
        <button aria-label="cart" onClick={() => setIsCartOpen(true)}>
          <FaShoppingCart className='icon-size' />
          
          {/* only displays counter when its greater than 0 */}
          {cartItemcount > 0 && (<span className='cart-icon'>
            {cartItemcount}</span>)} 
        </button>
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