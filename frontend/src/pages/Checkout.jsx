import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import '../styles/Checkout.css';
import Payment from './Payment.jsx';

import { useContext } from 'react';
import { ThemeContext } from '../Context.jsx';
import { dumplings, kungpaochicken, sweetsourchicken, chowmein, lomein, generaltsochicken,
eggrolls, wontonsoup, chickenwithbroccoli } from '../images/food/foodimages.js';

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
export default function Checkout() {
  const { priceTotal, removeItem, activeMeals } = useContext(ThemeContext);
  const [CheckoutCartItems, setCheckoutCartItems] = useState([]);
  
  useEffect(() => {

    const images = {
      'dumplings': dumplings,
      'kung pao chicken': kungpaochicken,
      'sweet and sour chicken': sweetsourchicken,
      'chow mein': chowmein,
      'lo mein': lomein,
      'general tso chicken': generaltsochicken,
      'egg rolls': eggrolls,
      'wonton soup': wontonsoup,
      'chicken with broccoli': chickenwithbroccoli,
    };
    
    const combined = (activeMeals || []).map((menuItem) => {
      const name = (menuItem.name || '').toString();
      const key = name.toLowerCase().trim();
      const img = images[key] || menuItem.image || null;
      const mealId = menuItem.mealId ?? menuItem.meal_Id ?? menuItem.id ?? null;
      const priceRaw = menuItem.price ?? menuItem.priceString ?? menuItem.amount ?? 0;
      const price = typeof priceRaw === 'string' ? priceRaw : Number(priceRaw) || 0;
      return { mealId, image: img, name: name, price: price, size : menuItem.quantity ?? 1 };
    });

    setCheckoutCartItems(combined);
  }, [activeMeals]);

  const subtotal = priceTotal
  const shipping = subtotal > 0 ? 5.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <>
      <div className="checkout-page">
        <main className="checkout-main">
          <div className="container">
            <h1 className="checkout-title animate-fade-in">Checkout</h1>

            <div className="checkout-grid">
              {/* Cart Items Section */}
              <div className="cart-items animate-fade-in">
                {CheckoutCartItems.length === 0 ? (
                  <div className="cart-empty">
                    <p className="cart-empty-text">Your cart is empty.</p>
                  </div>
                ) : (
                  CheckoutCartItems.map((item,index) => (
                    <div key={index} className="cart-item">
                      {/* Product Image */}
                      <div className="cart-item-image-wrapper">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="cart-item-image"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="cart-item-details">
                        <div className="cart-item-header">
                          <div>
                            <h3 className="cart-item-name">{item.name}</h3>
                            <p className="cart-item-size">Quantity: {item.size}</p>
                          </div>
                          <button
                            className="cart-item-remove"
                            onClick={() => removeItem(item)}
                          >
                            <X />
                          </button>
                        </div>

                        <div className="cart-item-footer">
                          <p className="cart-item-price">{item.price}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Order Summary Section */}
              <div className="animate-fade-in">
                <div className="order-summary">
                  <h2 className="order-summary-title">Order Summary</h2>

                  <div className="order-summary-rows">
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>

                    <div className="summary-divider" />

                    <div className="summary-row">
                      <span>Estimated Shipping</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>

                    <div className="summary-divider" />

                    <div className="summary-row">
                      <span>Estimated Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>

                    <div className="summary-divider" />

                    <div className="summary-total">
                      <span>Order Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="order-summary-footer">
                    <PayPalScriptProvider options={{ clientId: import.meta.env.VITE_PAYPAL_SANDBOX_CLIENT_ID}}>
                      <Payment/>
                    </PayPalScriptProvider>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
