// this file is needed to define useContext
import {createContext, useState, useEffect}  from 'react';
import axios from 'axios';

// defines the Context, the comment below removes IDE bug
// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

//defines ThemeContext Provider component
export function ThemeProvider({ children }) {
  
  const [priceTotal, setPriceTotal] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [auth, setAuth] = useState(false);
  const [clear,setClear] = useState(false);

  //get total price from Json file
  useEffect( () => {
    const getTotalPrice = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getTotalPrice/'); 
        console.log(`Price response ${response.data}`);
        setPriceTotal(Number(response.data))
      } catch (error) {
        console.error('Error to get Total Price:', error)
      }
    }
    getTotalPrice()
  }, []); 

  //stores total price to Json file
  useEffect( () => {
    const updateTotalPrice = async () => {
      try {
        // if (auth === true){
        if (clear === false){
          const response = await axios.put('http://localhost:5000/updateTotalPrice/',{totalPrice : priceTotal});
          console.log("update total price response:", response.data);
          console.log(response.data);
          console.log("clear", clear);
        }
        else{
          const response = await axios.put('http://localhost:5000/resetTotalPrice/',{cleartotalPrice: priceTotal});
          console.log(response.data);
          console.log("clear", clear);
        }
      } catch (error) {
        console.error('Error updating data to Json file:', error)
      }
    }
    updateTotalPrice()
  }, [priceTotal,auth,clear]); 

  //gets the cart's items from Json file 
  useEffect(() => {
    const getCartItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getCartItems/'); 
        console.log(`Cart items response ${response.data}`);
        console.log("Cart items response:", response.data);
        setCartItems(response.data)
      } catch (error) {
        console.error('Error to get Total Price:', error)
      }
    }
    getCartItems()
  }, []);   

  //stores the cart's items to Json file
  useEffect(() => {
    //to store objects/arrays, they need to be converted to JSON
    const updateCartItems = async () => {
      try {
        if (clear === false){
          const response = await axios.put("http://localhost:5000/updateCartItems/",{ updateItems: cartItems});
          console.log("add Cart item response:", response.data);
          console.log(response.data);
          console.log("clear", clear);
        }
        else{
          const response = await axios.put("http://localhost:5000/clearCartItems/",{ clearItems: cartItems});
          console.log(response.data);
          setClear(false)
          console.log("clear", clear);
        }
      } catch (error) {
        console.error('Error updating data to Json file:', error)
      }
    }
    updateCartItems()
  }, [cartItems,auth,clear]);

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
    setClear(true)
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
