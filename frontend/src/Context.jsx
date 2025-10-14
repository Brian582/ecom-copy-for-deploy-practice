// this file is needed to define useContext
import {createContext, useState, useEffect}  from 'react';

// defines the Context, the comment below removes IDE bug
// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext(null);

//defines Provider component
export const ThemeProvider = ({ children }) => {

  //gets priceTotal, intially starts with 0
  const [priceTotal, setPriceTotal] = useState(() => {
    try {
      const total = localStorage.getItem('total_price');
      return total ? Number(total) : 0;
    } 
    catch {
      return 0;
    }});
  
  //gets cart items, intially starts with empty array
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedItems = localStorage.getItem('cart-items');
      return savedItems ? JSON.parse(savedItems) : [];
    } 
    catch {
      return [];
    }
  });

  //stores the cart's data in Localstorage
  useEffect(() => {
    //to store objects/arrays, they need to be converted to JSON
    try {
      localStorage.setItem('cart-items', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error parsing data from localStorage:', error)
    }
  }, [cartItems]);

  //stores total price in Localstorage
  useEffect(() => {
    try {
      localStorage.setItem('total_price', priceTotal);
    } catch (error) {
      console.error('Error parsing data from localStorage:', error)
    }
  }, [priceTotal]);

  function addItem(item) {
    setCartItems(prev => [...prev, item]);
    setPriceTotal(priceTotal => priceTotal + Number(item.price.replace("$", "")));
  }

  //removes items from cart by using an item's index
  function removeItem(item, index) {
    setCartItems(prev => prev.filter(function(_, i){return i !== index}));
    // if(priceTotal !== 0){
    setPriceTotal(priceTotal => priceTotal - Number(item.price.replace("$", "")));
    // }
  }

  function clearCart(){
    setCartItems([]);
    setPriceTotal(0);
    // try {
    //   localStorage.setItem('cart-items', []);
    //   localStorage.setItem('total_price', '0');
    // } catch (error) {
    //   console.error('Error parsing data from localStorage:', error)
    // }
  }

  const ContextValues = { cartItems, priceTotal, cartItemcount: cartItems.length, addItem, removeItem, clearCart }

  return (
    <ThemeContext.Provider value={ContextValues}>
      {children}
    </ThemeContext.Provider>
  );
};
