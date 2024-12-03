import React, { useContext, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import ToastNotification from "../../components/ToastNotification/ToastNotification";

const Cart = () => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    getTotalCartAmount,
    discount,
    setDiscount,
    promoCode,
    setPromoCode,
    deliveryFee,
    setDeliveryFee,
    url,
  } = useContext(StoreContext);
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  
  const MIN_AMOUNT_FOR_FLAT50 = 350;

  const handlePromoCodeSubmit = () => {
    const totalAmount = getTotalCartAmount();
    const validPromoCodes = {
      DISCOUNT10: 0.1,
      DISCOUNT20: 0.2,
      flat50: 0.5,
    };

    if (totalAmount === 0) {
      // Display a message if the cart is empty
      setErrorMessage("Cart is empty. Add items before applying a promo code.");
      setDiscount(0);
      setDeliveryFee(40);
      return;
    }

    if (validPromoCodes[promoCode]) {
      setErrorMessage("");

      if (promoCode === "flat50") {
        if (totalAmount < MIN_AMOUNT_FOR_FLAT50) {
          setErrorMessage(
            `The cart total must be at least ₹${MIN_AMOUNT_FOR_FLAT50} to apply this promo code.`
          );
          setDiscount(0);
          setDeliveryFee(40);
        } else {
          setDiscount(validPromoCodes[promoCode]);
          setDeliveryFee(0);
          showToastNotification("🎉 Promo code applied successfully! 🎉");
        }
      } else {
        setDiscount(validPromoCodes[promoCode]);
        setDeliveryFee(40);
        showToastNotification("🎉 Promo code applied successfully! 🎉");
      }
    } else {
      showToastNotification("Invalid promo code!");
      setDiscount(0);
      setDeliveryFee(40);
    }
  };

  const showToastNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const totalAmount = getTotalCartAmount();
  const discountAmount = totalAmount * discount;
  const finalTotal = totalAmount > 0 ? totalAmount - discountAmount + deliveryFee : 0;

  return (
    <div className="cart">
      {/* Toast Notification */}
      <ToastNotification message={toastMessage} isVisible={showToast} />

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
                  <img src={url+"/images/"+item.image} alt={item.name} />
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
          <button onClick={() => navigate("/order")}>PROCEED TO CHECKOUT</button>
        </div>

        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, enter it here</p>
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