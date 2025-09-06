import {Link} from 'react-router-dom';
import cart from './images/cart.png';
import './Navbar.css'

export default function NavBar() {
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
        <button>
          <img src={cart} alt="Cart Icon" width="15" height="15" />
        </button>
      </Link>
    </nav>
  )
}