import React, { useContext, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount } =
    useContext(StoreContext);
  const navigate = useNavigate();

  // State for promo code and applied discount
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(40); // Default delivery fee
  const [errorMessage, setErrorMessage] = useState(""); // Error message state

  // Minimum amount for 'flat50%' promo code
  const MIN_AMOUNT_FOR_FLAT50 = 350;

  // Function to handle promo code submission
  const handlePromoCodeSubmit = () => {
    const totalAmount = getTotalCartAmount();

    // Mock promo code validation
    const validPromoCodes = {
      "DISCOUNT10": 0.1,  // 10% discount
      "DISCOUNT20": 0.2,  // 20% discount
      "flat50%": 0.5,     // 50% discount
    };

    // Check if promo code is valid
    if (validPromoCodes[promoCode]) {
      setErrorMessage(""); // Clear error message if the code is valid

      if (promoCode === "flat50%") {
        // Check if total amount meets the minimum requirement for 'flat50%'
        if (totalAmount < MIN_AMOUNT_FOR_FLAT50) {
          setErrorMessage(`The cart total must be at least ₹${MIN_AMOUNT_FOR_FLAT50} to apply this promo code.`);
          setDiscount(0); // Do not apply discount
          setDeliveryFee(40); // Keep the original delivery fee
        } else {
          setDiscount(validPromoCodes[promoCode]);
          setDeliveryFee(0);  // Remove delivery fee for 'flat50%' code
          alert("Promo code applied successfully!");
        }
      } else {
        // Apply discount for other valid codes
        setDiscount(validPromoCodes[promoCode]);
        setDeliveryFee(40); // Keep the original delivery fee
        alert("Promo code applied successfully!");
      }
    } else {
      setErrorMessage("Invalid promo code!"); // Show error if the code is invalid
      setDiscount(0); // Reset discount
      setDeliveryFee(40); // Keep original delivery fee
    }
  };

  const totalAmount = getTotalCartAmount();
  const discountAmount = totalAmount * discount;
  const finalTotal = totalAmount > 0 ? totalAmount - discountAmount + deliveryFee : 0;

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={index}>
                <div className="cart-items-title cart-items-item">
                  <img src={item.image} alt={item.name} />
                  <p>{item.name}</p>
                  <p>₹{item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>₹{item.price * cartItems[item._id]}</p>
                  <p onClick={() => removeFromCart(item._id)} className="cross">
                    x
                  </p>
                </div>
                <hr />
              </div>
            );
          }
        })}
      </div>
      <div className="cart-bottom">
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
              <p>₹{totalAmount === 0 ? 0 : deliveryFee}</p>
            </div>
            <hr />
            {/* Discount Section */}
            <div className="cart-total-details">
              <p>Discount</p>
              <p>₹{discountAmount}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <p>₹{finalTotal === 0 ? 0 : finalTotal}</p>
            </div>
          </div>
          <button onClick={() => navigate("/order")}>
            PROCEED TO CHECKOUT
          </button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it here</p>
            <div className="cart-promocode-input">
              <input
                type="text"
                placeholder="Promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button onClick={handlePromoCodeSubmit}>Submit</button>
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
