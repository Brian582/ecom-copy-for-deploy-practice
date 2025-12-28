import axios from "axios";
import { PayPalButtons } from "@paypal/react-paypal-js";
import "../styles/payment.css";
import { useContext } from "react";
import { ThemeContext } from "../Context";

export default function YourCheckoutPage() {
  const { clearCart } = useContext(ThemeContext);
  const host = import.meta.env.VITE_HOST;
 
  const handleCreateOrder = async () => {
    try {
      const result = await axios.post(`${host}/create-order`);
      return result.data.id; // order_id returned from Flask

    } catch (error) {
      console.error('Order Error :', error);
    }
  }

  const handleOnApprove = async (data) => {
    try {
      const result = await axios.post(`${host}/capture-order/${data.orderID}`);
      if(result.data.status === "COMPLETED") {
        clearCart()
      }
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
        <PayPalButtons
          style={{
            shape: "rect",
            layout: "vertical",
            // disableMaxWidth: true,
            // width: "300px",
          }}

          createOrder={handleCreateOrder}   
          onApprove={handleOnApprove}
          onError={handleOnError}
        />
      </div>
    </div>
  );
}