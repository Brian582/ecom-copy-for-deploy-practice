// this file is needed to define useContext
import {createContext, useState}  from 'react';

// defines the Context
// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext(null);

// defines Provider component
export const ThemeProvider = ({ children }) => {
  const [cartItemcount, setcartItemcount] = useState(0);

  /* updates cart counter */
  function updatecartItemcount(){
    setcartItemcount( cartItemcount +1 )
  }

  return (
    <ThemeContext.Provider value={{ cartItemcount, updatecartItemcount }}>
      {children}
    </ThemeContext.Provider>
  );
};
