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
  const cartLoaded = useRef(false);
  const priceLoaded = useRef(false);
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
        cartLoaded.current=true;

      } catch (error) {
        console.error('Failed to get Total Price: ', error)
      }
    }
    getTotalPrice()
  }, []); 

  //stores total price to Json file
  useEffect( () => {
    if (!cartLoaded.current) return; // prevents initial run from updating cart
    
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
        // normalize items to ensure quantity exists
        const normalized = response.data.map(i => ({ ...i, quantity: i.quantity ?? 1 }));
        setCartItems(normalized);
        priceLoaded.current=true;

      } catch (error) {
        console.error('Failed to get cart items: ', error)
      }
    }
    getCartItems()
  }, []);   

  //stores the cart's items to Json file
  useEffect(() => {
    if (!priceLoaded.current) return; // prevents initial run from updating cart

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

  //adds item to cart (increments quantity if meal already present)

  //check if user is loggedin. If they are, use their userId to get their items from Cart. Otherwise UserId == None
  function addItem(item, auth) {
    const price = Number(item.price.replace("$", ""));
    setCartItems(prev => {
      return prev.map(userItems => {
        if (userItems.userId === auth.user.Id) {
            const idx = userItems.meals.findIndex(ci => ci.meal_Id === item.meal_Id);            
            const updatedMeals = (idx !== -1)
                ? userItems.meals.map(ci => ci.meal_Id === item.meal_Id 
                    ? { ...ci, quantity: (ci.quantity ?? 1) + 1 } 
                    : ci
                  )
                : [...userItems.meals, { ...item, quantity: 1 }];       
            return { ...userItems, meals: updatedMeals };
        }
        return userItems;
      });
    });
    setPriceTotal(priceTotal => priceTotal + price);
  }

  //removes one quantity of an item from cart (decrements quantity or removes item)
  function removeItem(item, index, auth) {
    const price = Number(item.price.replace("$", ""));
    const targetId = item.meal_id ?? item.id ?? null;
    setCartItems(prev => {
      return prev.map(userItems => {
          if (userItems.userId === auth.user.id && targetId != null){
              return { ...userItems, 
                      meals: userItems.meals
                      .map(ci => ci.meal_Id == targetId ? { ...ci, quantity : ( ci.quantity ?? 1 ) - 1 } : ci )
                      .filter(ci => ( ci.quantity ?? 1 ) > 0 )
                    }}
          if ( typeof index === 'number') {
            return { ...userItems, meals: userItems.filter( (_,i) => i !== index ) }
          }
          return userItems
        });
        // const targetId = item.meal_id ?? item.id ?? null
        // if ( targetId != null ){
        //   return prev
        //       .map(ci => ci.meal_id === targetId ? {...ci, quantity : (ci.quantity ?? 1 ) - 1 } : ci )
        //       .filter(ci => (ci.quantity ?? 1 ) > 0 )
        // }
        // if ( typeof index === 'number') return prev.filter( (_,i) => i !== index )

      // console.log( "item meal id", item.meal_Id )
      // console.log( "item id", item.id )
      // const targetId = item.meal_Id ?? item.id ?? null;
      // if (targetId != null) {
      //   return prev
      //     .map(ci => ci.meal_Id === targetId ? { ...ci, quantity: (ci.quantity ?? 1) - 1 } : ci)
      //     .filter(ci => (ci.quantity ?? 1) > 0);
      // }
      // if (typeof index === 'number') return prev.filter((_, i) => i !== index);
      // return prev;
    });
    setPriceTotal(priceTotal => Math.max(0, priceTotal - price));
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

  const cartItemcount = cartItems.reduce((s, it) => s + (it.quantity ?? 1), 0);
  const ContextValues = { cartItems, priceTotal, cartItemcount, addItem, removeItem, clearCart }

  return (
    <ThemeContext.Provider value={ContextValues}>
      {children}
    </ThemeContext.Provider>
  );
};

//AuthContext provider component
export function AuthProvider({ children }) {
  const host = useRef(import.meta.env.VITE_HOST);

  const [auth, setAuth] = useState({
    user: {
          id: "",
          name: "",
          email: "",
          identity: "",
        },
    status: false
  })

  //create account
  async function createAccount(formdata){
    const response = await axios.post(`${host.current}/addUser`, formdata)
    console.log( "account creation status", response.data.added)  /////////////// debugging, delete later
  }

  //sign in user
  async function signIn(formdata){
    const response = await axios.post(`${host.current}/signIn`, formdata)
    if (response.data.authenticated === true){
      setAuth({  
        user : response.data.user, 
        status : response.data.authenticated
      })
    }
    
    /////////////// debugging, delete later
    console.log(" user", response.data.user )
    console.log(" status", response.data.authenticated )
  }
  
  //change user's status to log them out
  function logout(){
    setAuth( prevAuth =>({
      ...prevAuth, 
      status : false
    }));
  };

  const authContextValue = { auth, createAccount, signIn, logout };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );

};
