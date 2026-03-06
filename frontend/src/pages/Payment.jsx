import axios from "axios";
import { PayPalButtons } from "@paypal/react-paypal-js";
import "../styles/payment.css";
import { useContext } from "react";
import { ThemeContext, AuthContext } from "../Context";

export default function YourCheckoutPage() {
  const { clearCart, activeMeals } = useContext(ThemeContext);
  const { auth } = useContext(AuthContext);
  const host = import.meta.env.VITE_HOST;
  
  // Calls backend to create a PayPal order 
  const handleCreateOrder = async () => {
    try {
      const result = await axios.post(`${host}/create-order`);
      return result.data.id; // order_id returned from Flask

    } catch (error) {
      console.error('Order Error :', error);
    }
  }

  const handleAddOrder = async () => {
    const userId = auth?.user?.userId || auth?.user?.id || null;
    const name = auth?.user?.name || 'Guest';

    const meals = (activeMeals || []).map((item) => {
      const quantity = item.quantity || item.size || 1;
      const mealPrice = typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : item.price;
      return {
        mealId: item.mealId ?? item.id ?? item.meal_Id,
        name: item.name,
        quantity: String(quantity),
        price: mealPrice
      };
    });

    if (!meals.length) {
      return { added: false, error: 'Cart is empty' };
    }

    const payload = { userId, name, meals };

    try {
      const response = await axios.post(`${host}/addOrder`, payload);
      return response?.data;
    } catch (error) {
      console.error('Add Order Error :', error);
      return { added: false, error: error?.message || 'addOrder request failed' };
    }
  };

  // Captures the PayPal order and handles successful payment
  const handleOnApprove = async (data) => {
    try {
      const result = await axios.post(`${host}/capture-order/${data.orderID}`);
      if (result.data.status === "COMPLETED") {
        const addOrderResult = await handleAddOrder();
        if (addOrderResult?.added) {
          clearCart();
          alert("Payment successful and order created");
          return;
        }

        console.warn("Order saved failed", addOrderResult);
        alert("Payment succeeded, but saving order failed. Your cart was NOT cleared.");
        return;
      }

      alert("Payment not completed. Please try again.");
    } catch (error) {
      console.error('Approve Error :', error);
      alert("Payment error");
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