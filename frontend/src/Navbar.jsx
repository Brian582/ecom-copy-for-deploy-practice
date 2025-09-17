import {Link} from 'react-router-dom';
import './Navbar.css';
import { useContext } from "react";
import { ThemeContext } from "./Context";
import { FaShoppingCart } from 'react-icons/fa'; // provides cart icon

export default function NavBar() {
  const { cartItemcount } = useContext(ThemeContext);
  
  return (
      <nav className='navbar'> 
        <Link to="/">
          <button>Home</button>
        </Link>
        <Link to="/food">
          <button>Food</button>
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
        <Link to="/">
          <button aria-label="cart">
            <FaShoppingCart size={17} />
            {/* only displays counter when its grater than 0 */}
            {cartItemcount > 0 && (<span className='cart-counter'>
              {cartItemcount}</span>)}
          </button>
        </Link>
      </nav>
  )
}