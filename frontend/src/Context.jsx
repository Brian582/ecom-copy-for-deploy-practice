// this file is needed to define useContext
import {createContext, useState, useEffect}  from 'react';

// defines the Context, the comment below removes IDE bug
// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

//defines ThemeContext Provider component
export function ThemeProvider({ children }) {

  //gets priceTotal, intially starts with 0
  const [priceTotal, setPriceTotal] = useState(() => {
    try {
      const total = localStorage.getItem('total_price');
      return total ? Number(total) : 0;
    } 
    catch (error) {
      console.error('Error parsing data from localStorage:', error)
      return 0;
    }});
  
  //gets cart items, intially starts with empty array
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedItems = localStorage.getItem('cart-items');
      return savedItems ? JSON.parse(savedItems) : [];
    } 
    catch (error) {
      console.error('Error parsing data from localStorage:', error)
      return [];
    }
  });

  //stores total price in Localstorage
  useEffect(() => {
    try {
      localStorage.setItem('total_price', priceTotal);
    } catch (error) {
      console.error('Error parsing data from localStorage:', error)
    }
  }, [priceTotal]);

  //stores the cart's items in Localstorage
  useEffect(() => {
    //to store objects/arrays, they need to be converted to JSON
    try {
      localStorage.setItem('cart-items', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error parsing data from localStorage:', error)
    }
  }, [cartItems]);

  //adds item to cart
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

  //removes all items
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

//AuthContext provider component
export function AuthProvider({ children }) {
  
  //authenticates that user exists
  const [authenticated, setAuthenticated] = useState(() => {
    try {
      const status = localStorage.getItem('authenticated');
      return status ? JSON.parse(status) : "";
    } 
    catch (error) {
      console.error('Error parsing data from localStorage:', error)
      return false;
    }
  })

  //shows user that's loggedin
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? savedUser : "";
    } 
    catch (error) {
      console.error('Error parsing data from localStorage:', error)
      return ""
    }
  });

  //stores authentication status in Localstorage
  useEffect(() => {
    try {
      localStorage.setItem('authenticated', authenticated);
    } catch (error) {
      console.error('Error parsing data from localStorage:', error)
    }
  }, [authenticated]);

  //stores user's name in Localstorage
  useEffect(() => {
    try {
      localStorage.setItem('user', user);
    } catch (error) {
      console.error('Error parsing data from localStorage:', error)
    }
  }, [user]);

  //holds username and authentication
  function login(userData, authenication){
    setUser(userData);
    setAuthenticated(authenication);
  };
  
  //removes username and authentication
  function logout(){
    setUser("");
    setAuthenticated(false);
  };

  const authContextValue = { user, authenticated, login, logout };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );

};
