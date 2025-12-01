import { Routes, Route } from 'react-router-dom';
import Index from './pages/index.jsx'
import Food from './pages/Food.jsx'
import Order from './pages/Order.jsx'
import Signin from './pages/Signin.jsx'
import Contact from './pages/Contact.jsx'
import About from './pages/About.jsx'
import Layout from './pages/Layout.jsx'
import NotFound from './pages/Notfound.jsx'
import { ThemeProvider, AuthProvider } from "./Context";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import CheckoutPage from './pages/Payment.jsx';

export default function App() {
  return (
    <>
      <AuthProvider>
      <ThemeProvider>
      <Layout>
        <PayPalScriptProvider options={{ clientId: import.meta.env.VITE_PAYPAL_SANDBOX_CLIENT_ID}}>
          <Routes>
            <Route exact path="/" element={<Index />} />
            <Route exact path="/food" element={<Food />} />
            <Route exact path="/order" element={<Order />} />
            <Route exact path="/signin" element={<Signin />} />
            <Route exact path="/contact" element={<Contact />} />
            <Route exact path="/about" element={<About />} />
            
            {/* Wildcard route for 404 Not Found */}
            <Route path="*" element={<NotFound />} />
            <Route path="/NotFound" element={<NotFound />} /> 

            {/* Paypal portion */}
            <Route exact path="/checkout" element={<CheckoutPage />} />
          </Routes> 
        </PayPalScriptProvider>
      </Layout> 
      </ThemeProvider> 
      </AuthProvider>
    </>
  )
}


