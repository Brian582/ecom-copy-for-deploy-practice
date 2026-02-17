// this file is needed to define useContext
import {createContext, useState, useEffect, useRef, useContext}  from 'react';
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
  const { auth } = useContext(AuthContext);
  const lastMergedUser = useRef(null);

  //get total price from Json file
  useEffect( () => {
    const getTotalPrice = async () => {
      try {
        const response = await axios.get(`${host.current}/getTotalPrice`);
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
    
    const updateTotalPrice = setTimeout(async () => {
      try {
        await axios.put(`${host.current}/updateTotalPrice`, {totalPrice : priceTotal});   
      } catch (error) {
        console.error('Failed to update Total Price: ', error)
      }
    }, 500); // Wait 500ms after the last price change before updating

    return () => clearTimeout(updateTotalPrice) // Clear the timer if price changes again before 500ms
  }, [priceTotal]); 

  //gets the cart's items from Json file 
  useEffect(() => {
    const getCartItems = async () => {
      try {
        const response = await axios.get(`${host.current}/getCartItems`);
        // normalize response shape: accept either an array or an object with a `cart` array
        const payload = response.data;
        // let carts = [];
        // // if (Array.isArray(payload)) carts = payload;
        // // else if (payload && Array.isArray(payload.cart)) carts = payload.cart;
        // // else carts = [];
        ///////////////// if this ternary operator for "carts" doesnt cause an error, then keep it and delete the if else statments for "carts" above
        let carts = Array.isArray(payload) ? payload
        : (payload && Array.isArray(payload?.cart)) ? payload.cart
        : [];
        setCartItems(carts);
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

    const updateCartItems = setTimeout(async () => {
      try {
        await axios.put(`${host.current}/updateCartItems`, { updateItems: cartItems});
      } catch (error) {
        console.error('Failed to update cart items: ', error)
      }
    }, 500); // Wait 500ms after the last cart change before updating

    return () => clearTimeout(updateCartItems); // Clear the timer if updatecartItems changes again before 500ms
  }, [cartItems]);


  // when a user logs in, merge guest cart into their cart on the server
  useEffect(() => {
    const tryMerge = async () => {
      try {
        const user = auth?.user || {};
        const userId = user?.userId || user?.id || null;
        // only merge for logged-in customers (not workers)
        if (!auth?.isLoggedIn || !userId) return;
        if (user.role && String(user.role).toLowerCase() !== 'customer') return;
        if (lastMergedUser.current === String(userId)) return;

        await axios.post(`${host.current}/mergeGuestToUser`, { userId });
        // refresh carts from server
        const resp = await axios.get(`${host.current}/getCartItems`);
        const payload = resp.data;
        // let carts = [];
        // if (Array.isArray(payload)) {
        //   carts = payload;
        // } else if (payload && Array.isArray(payload.cart)) {
        //   carts = payload.cart;
        // } else {
        //   carts = [];
        // }
        ///////////////// if this ternary operator for "carts" doesnt cause an error, then keep it and delete the if else statments for "carts" above
        let carts = Array.isArray(payload) ? payload
        : (payload && Array.isArray(payload?.cart)) ? payload.cart
        : [];
        setCartItems(carts);
        lastMergedUser.current = String(userId);
      } catch (err) {
        console.error('Failed to merge guest cart to user cart:', err);
      }
    }
    tryMerge();
  }, [auth?.isLoggedIn, auth?.user, auth?.user?.id, auth?.user?.userId, auth?.user?.role]);

  //adds item to cart (increments quantity if meal already present)
  function addItem(item, providedAuth) {
    const usedAuth = providedAuth ?? auth;
    const targetUserId = usedAuth?.isLoggedIn ? String(usedAuth.user?.userId || usedAuth.user?.id || '') : null;

    setCartItems(prev => {
      const list = Array.isArray(prev) ? [...prev] : [];

      // find or create target cart
      let cartIndex = list.findIndex(c => (c.userId == null && targetUserId == null) || (c.userId != null && String(c.userId) === String(targetUserId)));
      if (cartIndex === -1) {
        const newCart = { cartId: targetUserId ? `cart_${Math.random().toString(36).slice(2,10)}` : 'guest', userId: targetUserId, meals: [] };
        list.push(newCart);
        cartIndex = list.length - 1;
      }

      const cart = { ...list[cartIndex] };
      const mealId = item.mealId ?? item.meal_Id ?? item.id;
      const idx = (cart.meals || []).findIndex(m => String(m.mealId ?? m.meal_Id ?? m.id) === String(mealId));
      if (idx !== -1) {
        cart.meals = (cart.meals || []).map((m, i) => i === idx ? { ...m, quantity: (Number(m.quantity) || 0) + 1 } : m);
      } else {
        cart.meals = [...(cart.meals || []), { mealId: mealId, name: item.name, price: item.price, quantity: 1 }];
      }

      list[cartIndex] = cart;
      return list;
    });
  }

  //removes one quantity of an item from cart (decrements quantity or removes item)
  function removeItem(item, index, providedAuth) {
    const targetId = item.mealId ?? item.meal_Id ?? item.id ?? null;
    const usedAuth = providedAuth ?? auth;
    const targetUserId = usedAuth?.isLoggedIn ? String(usedAuth.user?.userId || usedAuth.user?.id || '') : null;

    setCartItems(prev => {
      const list = Array.isArray(prev) ? [...prev] : [];
      const cartIdx = list.findIndex(c => (c.userId == null && targetUserId == null) || (c.userId != null && String(c.userId) === String(targetUserId)));
      if (cartIdx === -1) return list;

      const cart = { ...list[cartIdx] };
      if (typeof index === 'number') {
        cart.meals = (cart.meals || []).filter((_, i) => i !== index);
      } else if (targetId != null) {
        cart.meals = (cart.meals || [])
          .map(m => String(m.mealId ?? m.meal_Id ?? m.id) === String(targetId) ? { ...m, quantity: (m.quantity ?? 1) - 1 } : m)
          .filter(m => (m.quantity ?? 1) > 0);
      }

      list[cartIdx] = cart;
      return list;
    });

    // priceTotal is derived from cart contents; recomputed in effect below
  }

  //removes all items
  function clearCart(){
    // clear guest cart only if not logged in, otherwise clear current user's cart
    setCartItems(prev => {
      if (!auth?.isLoggedIn) return (prev || []).map(c => ({ ...c, 
        meals: String(c.cartId) === "guest" && c.userId === null ? [] : c.meals }));
      // [{ cartId: 'guest', userId: null, meals: [],  }, ...prev];
      return (prev || []).map(c => ({ ...c, 
              meals: auth?.isLoggedIn && String(c.userId) === String(auth.user?.userId) ? [] : c.meals }));
    });
    setPriceTotal(0);
    // try {
    //   localStorage.setItem('cart-items', []);
    //   localStorage.setItem('total_price', '0');
    // } catch (error) {
    //   console.error('Error parsing data from localStorage:', error)
    // }
  }

  // compute item count for active cart (guest or logged-in user's cart)
  const activeCart = (() => {
    try {
      const userId = auth?.isLoggedIn ? String(auth.user?.userId || auth.user?.id || '') : null;
      if (!Array.isArray(cartItems)) return null;
      return cartItems.find(c => (c.userId == null && userId == null) || (c.userId != null && String(c.userId) === String(userId))) || null;
    } catch (e) { return null }
  })();

  // expose active cart meals for consumers
  const activeMeals = (activeCart && Array.isArray(activeCart.meals)) ? activeCart.meals : [];

  // derive total price from active cart so it's always consistent with quantities
  useEffect(() => {
    try {
      const userId = auth?.isLoggedIn ? String(auth.user?.userId || auth.user?.id || '') : null;
      if (!Array.isArray(cartItems)) {
        setPriceTotal(0);
        return;
      }
      const active = cartItems.find(c => (c.userId == null && userId == null) || (c.userId != null && String(c.userId) === String(userId)));
      const sum = (active && Array.isArray(active.meals))
        ? active.meals.reduce((s, m) => {
            const price = Number(String(m.price || '').replace('$', '')) || 0;
            const qty = Number(m.quantity) || 1;
            return s + price * qty;
          }, 0)
        : 0;
      setPriceTotal(Number(sum.toFixed(2)));
    } catch (err) {
      console.error('Failed to recompute priceTotal:', err);
    }
  }, [cartItems, auth?.isLoggedIn, auth?.user?.id, auth?.user?.userId]);

  const cartItemcount = (activeCart && Array.isArray(activeCart.meals)) ? activeCart.meals.reduce((s, it) => s + (Number(it.quantity) || 1), 0) : 0;
  const ContextValues = { cartItems, priceTotal, cartItemcount, addItem, removeItem, clearCart, activeMeals }

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
          id: null,
          name: null,
          email: null,
          identity: null,
        },
    isLoggedIn: false
  })

  // restore auth from localStorage on mount so refresh doesn't log user out
  useEffect(() => {
    try {
      const raw = localStorage.getItem('auth');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.isLoggedIn && parsed.user) {
        setAuth({ user: parsed.user, isLoggedIn: true });
      }
    } catch (err) {
      console.error('Failed to restore auth from localStorage:', err);
    }
  }, []);

  async function createAccount(formdata){
    const response = await axios.post(`${host.current}/addUser`, formdata)
    // account creation status handled by caller
  }

  //sign in user
  async function signIn(formdata){
    try {
      const response = await axios.post(`${host.current}/signIn`, formdata);
      if (response?.data?.authenticated === true) {
        const newAuth = { user: response.data.user, isLoggedIn: true };
        setAuth(newAuth);
        try { localStorage.setItem('auth', JSON.stringify(newAuth)); } catch (e) { /* ignore */ }
      } else {
        setAuth({ user: null, isLoggedIn: false });
        try { localStorage.removeItem('auth'); } catch (e) { /* ignore */ }
      }
      return response.data;
    } catch (err) {
      // axios throws for non-2xx responses (e.g. 401). Handle 401 as authentication failure.
      if (err.response && err.response.status === 401) {
        setAuth({ user: null, isLoggedIn: false });
        try { localStorage.removeItem('auth'); } catch (e) { /* ignore */ }
        return err.response.data || { authenticated: false };
      }
      console.error('Sign in failed:', err);
      throw err;
    }
    
    // sign-in status handled by caller
  }
  
  //change user's status to log them out
  function logout(){
    // clear auth state and persisted auth
    setAuth({ user: null, isLoggedIn: false });
    try { localStorage.removeItem('auth'); } catch (e) { /* ignore */ }
  };

  const authContextValue = { auth, createAccount, signIn, logout };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );

};
