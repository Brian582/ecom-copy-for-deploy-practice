import {Link} from 'react-router-dom';
import cart from './images/cart.png';
import './Navbar.css'

export default function NavBar() {
  const navItems = [
      { route: "/food", name: "Food"},
      { route: "/order", name: "Order"},
      { route: "/signin", name: "Sign in"},
      { route: "/about", name: "About"},
      { route: "/contact", name: "Contact Us"},
      { route: "/", name: "cart"},
    ]

  return (
    <nav>
        {navItems.map( (item, index) => {   
          if(item.name=="cart"){
            return (
              <button key={index}>
              <img src={cart} alt="Cart Icon" width="15" height="15" />
              </button>
            )
          }
          else { 
            return (         
            <Link key={index} to={item.route}>
            <button>{item.name}</button>
            </Link>  )  
            }
        })}
    </nav>
  )
}