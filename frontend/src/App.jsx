import { Routes, Route } from 'react-router-dom';
import Index from './index.jsx'
import Food from './Food.jsx'
import Order from './Order.jsx'
import Signin from './Signin.jsx'
import Contact from './Contact.jsx'
import About from './About.jsx'
import Layout from './Layout.jsx'
import NotFound from './Notfound.jsx'

export default function App() {
  return (
    <>
      <Layout>
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
        </Routes> 
      </Layout>  
    </>
  )
}


