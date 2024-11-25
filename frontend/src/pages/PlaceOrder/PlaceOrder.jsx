import React, { useContext } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";

const PlaceOrder = () => {
  const {
    getTotalCartAmount,
    deliveryFee,
    discount,
    location,
    setLocation,
  } = useContext(StoreContext);

  const totalAmount = getTotalCartAmount();
  const discountAmount = totalAmount * discount;

  const finalTotal = totalAmount > 0 ? totalAmount - discountAmount + deliveryFee : 0;
  const displayDeliveryFee = totalAmount > 0 ? deliveryFee : 0;

  return (
    <form className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information.</p>
        <div className="multi-field">
          <input type="text" placeholder="First name" required/>
          <input type="text" placeholder="Last name" />
        </div>
        <input type="email" placeholder="Email address" required/>
        <input type="text" placeholder="Street" required/>
        <div className="multi-field">
          <input type="text" placeholder="City" required/>
          <input type="text" placeholder="State" required/>
        </div>
        <div className="multi-field">
          <input type="number" placeholder="Zip code" className="num" required/>
          <input type="text" placeholder="Country" required/>
        </div>
        <input type="number" placeholder="Phone" className="num" required/>
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{totalAmount}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{displayDeliveryFee}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Discount</p>
              <p>₹{discountAmount}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <p>₹{finalTotal}</p>
            </div>
          </div>
          <button onClick={() => navigate("/order")}>
            PROCEED TO PAYMENT
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
