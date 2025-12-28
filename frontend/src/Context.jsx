// this file is needed to define useContext
import {createContext, useState, useEffect, useRef}  from 'react';
import axios from 'axios';

// defines the Context, the comment below removes IDE bug
// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

//defines ThemeContext Provider component
export function ThemeProvider({ children }) {
  const loaded = useRef(false);
  const loaded2 = useRef(false);
  const host = useRef(import.meta.env.VITE_HOST);
  const [priceTotal, setPriceTotal] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  //get total price from Json file
  useEffect( () => {
    const getTotalPrice = async () => {
      try {
        const response = await axios.get(`${host.current}/getTotalPrice`); 
        console.log(`Price response ${response.data}`);
        setPriceTotal(Number(response.data))
        loaded.current=true;

      } catch (error) {
        console.error('Failed to get Total Price: ', error)
      }
    }
    getTotalPrice()
  }, []); 

  //stores total price to Json file
  useEffect( () => {
    if (!loaded.current) return; // prevents initial run from updating cart
    
    const updateTotalPrice = async () => {
      try {
          const response = await axios.put(`${host.current}/updateTotalPrice`, {totalPrice : priceTotal});
          console.log("update total price response:", response.data);
          console.log(response.data);
        
      } catch (error) {
        console.error('Failed to update Total Price: ', error)
      }
    }
    updateTotalPrice()
  }, [priceTotal]); 

  //gets the cart's items from Json file 
  useEffect(() => {
    const getCartItems = async () => {
      try {
        const response = await axios.get(`${host.current}/getCartItems`); 
        console.log(`Cart items response ${response.data}`);
        console.log("Cart items response:", response.data);
        setCartItems(response.data);
        loaded2.current=true;

      } catch (error) {
        console.error('Failed to get cart items: ', error)
      }
    }
    getCartItems()
  }, []);   

  //stores the cart's items to Json file
  useEffect(() => {
    if (!loaded2.current) return; // prevents initial run from updating cart

    const updateCartItems = async () => {
      try {
          const response = await axios.put(`${host.current}/updateCartItems`,{ updateItems: cartItems});
          console.log("add Cart item response:", response.data);
          console.log(response.data);
      } catch (error) {
        console.error('Failed to update cart items: ', error)
      }
    }
    updateCartItems()
  }, [cartItems]);

  //adds item to cart
  function addItem(item) {
    setCartItems(prev => [...prev, item]);
    setPriceTotal(priceTotal => priceTotal + Number(item.price.replace("$", "")));
    // setPriceTotal(priceTotal => {
    //   const value = priceTotal + Number(item.price.replace("$", ""));
    //   console.log("new price 1", value);
    //   return value
    // });
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

/////////////////////////////////////////// DELETE this if Auth or any of the functions below are no longer needed
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
