import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [location, setLocation] = useState(""); // State for location
  const url = "http://localhost:4000";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  // New states for discount, promo code, and delivery fee
  const [promoCode, setPromoCode] = useState(localStorage.getItem("promoCode") || "");
  const [discount, setDiscount] = useState(parseFloat(localStorage.getItem("discount")) || 0);
  const [deliveryFee, setDeliveryFee] = useState(40);

  useEffect(() => {
    localStorage.setItem("promoCode", promoCode);
    localStorage.setItem("discount", discount.toString());
  }, [promoCode, discount]);

  const addToCart = async(itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }

    if (token){
      await axios.post(url+"/api/cart/add",{itemId},{headers:{token}});
    }
  };

  const removeFromCart = async(itemId) => {
    if (cartItems[itemId] > 1) {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    } else {
      const updatedCart = { ...cartItems };
      delete updatedCart[itemId];
      setCartItems(updatedCart);
    }
    if (token){
      await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}});
    }
  };

  const loadCartTotal = async(token) =>{
    const response = await axios.post(url+"/api/cart/get",{},{headers:{token}});
    setCartItems(response.data.cartData);
  }

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  // Calculate final total including discount and delivery fee
  const getFinalTotalAmount = () => {
    const subtotal = getTotalCartAmount();
    const discountAmount = subtotal * discount;
    return subtotal - discountAmount + (subtotal > 0 ? deliveryFee : 0);
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`, {
        params: { location }, // Send location as a query parameter
      });
      setFoodList(response.data.data);
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCartTotal(localStorage.getItem("token"));
      }
    }
    loadData();
  }, [location]); // Re-fetch food list when location changes

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getFinalTotalAmount, // Expose the final total calculation
    url,
    token,
    setToken,
    location,
    setLocation, // Expose location setter
    discount,
    setDiscount, // Expose discount setter
    promoCode,
    setPromoCode, // Expose promo code setter
    deliveryFee,
    setDeliveryFee, // Expose delivery fee setter
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;