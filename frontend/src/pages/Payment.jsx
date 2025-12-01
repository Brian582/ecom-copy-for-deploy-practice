import axios from "axios";
import { PayPalButtons } from "@paypal/react-paypal-js";
import "../styles/payment.css";

export default function YourCheckoutPage() {

  // const host = import.meta.env.HOST
  const host = 'http://localhost:5000'

  const handleCreateOrder = async () => {
    try {
      // const res = await axios.post(`${host}/create-order`);
      const res = await axios.post('http://localhost:5000/create-order');
      console.log(res.data.id)
      return res.data.id; // order_id returned from Flask

    } catch (error) {
      console.error('Order Error :', error);
    }
  }

  const handleOnApprove = async (data) => {
    try {
      const res = await axios.post(`${host}/capture-order/${data.orderID}`);
      console.log("Payment completed:", res.data);
      alert("Payment successful");

    } catch (error) {
      console.error('Approve Error :', error);
    }
  }

  const handleOnError = (err) => {
    console.error("PayPal checkout error", err);
    alert("Payment error");
  }

  return (
    <div className="centered-div">
      <div className="payment_portion">
        <h2>Pay with PayPal</h2>
        
        <PayPalButtons
          style={{
            shape: "rect",
            layout: "vertical",
          }}

          createOrder={handleCreateOrder}
          
          onApprove={handleOnApprove}

          onError={handleOnError}
        />
      </div>
    </div>
  );
}