import "../styles/cartModal.css";
import { useContext } from 'react';
import { ThemeContext } from '../Context.jsx';
import { AuthContext } from "../Context.jsx";

export default function CartModal({ isOpen, onClose, items }){
  const { priceTotal, removeItem, addItem, clearCart} = useContext(ThemeContext);
  const { auth } = useContext(AuthContext);

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
          <h2 className="total-header">Total: ${Number(priceTotal).toFixed(2)}</h2>
          
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
                <div className="button-group">
                  <button className="remove-btn" onClick={() => removeItem(item, auth)}> - </button>
                  <button className="add-btn" onClick={() => addItem(item, auth)}> + </button>
                </div>
                <span className="cart-item-name">{item.name}</span>
                <div className="cart-item-qty-price">
                  <span className="cart-item-price">{item.price}</span>
                  <span className="cart-item-qty">Qty: {item.quantity ?? 1}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
