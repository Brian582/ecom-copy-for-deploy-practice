import "../styles/cartModal.css";
import { useContext } from 'react';
import { ThemeContext } from '../Context.jsx';

export default function CartModal({ isOpen, onClose, items }){
  const { priceTotal, removeItem, clearCart} = useContext(ThemeContext);

  return (
    <>
      {/* determines when modal is shown */}
      <div
        className={`cart-overlay ${isOpen ? "show" : ""}`}
        onClick={onClose}
      >   
      </div>

      {/* cartModal's features */}
      <div className={`cart-modal ${isOpen ? "open" : ""}`}>
        <div className="cart-header">
            <h3>Your Cart</h3>
            <button className="close-btn" onClick={onClose}>
              x
            </button>
        </div>

        <div>
          <h2 className="total-header">Total: ${priceTotal}</h2>
          { (items.length !== 0 ) && (
          <button className="remove-btn clear-btn" onClick={clearCart}>
              Clear Cart
          </button>)
          }
        </div>
        
        {/* displays cart items */}
        <div className="cart-items">
          { (items.length === 0 ) ? (
            <p>Your cart is empty.</p>
          ) : (
            items.map((item, index) => (
              <div key={index} className="cart-item">
                <button className="remove-btn" onClick={() => removeItem(item,index)}>
                  x
                </button>
                <span>{item.name}</span>
                <span> {item.price}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
