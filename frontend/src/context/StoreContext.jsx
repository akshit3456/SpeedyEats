import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:4000";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  // Function to deduplicate food items based on their _id
const deduplicateFoodList = (data) => {
    console.log("Before deduplication:", data);  // Log before deduplication
    const uniqueItems = Array.from(new Set(data.map(item => item._id)))
      .map(id => data.find(item => item._id === id));
    console.log("After deduplication:", uniqueItems); // Log after deduplication
    return uniqueItems;
  };
  

  // Add item to cart
  const addToCart = (itemId) => {
    setCartItems((prev) => {
      const newCount = prev[itemId] ? prev[itemId] + 1 : 1;
      return { ...prev, [itemId]: newCount };
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const newCount = prev[itemId] > 1 ? prev[itemId] - 1 : 0;
      const updatedCart = { ...prev, [itemId]: newCount };
      if (updatedCart[itemId] <= 0) delete updatedCart[itemId];
      return updatedCart;
    });
  };

  // Get the total amount of cart items
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        const itemInfo = food_list.find((product) => product._id === itemId);
        if (itemInfo) totalAmount += itemInfo.price * cartItems[itemId];
      }
    }
    return totalAmount;
  };

  // Fetch food list only once and store it
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        const uniqueFoodItems = deduplicateFoodList(response.data.data);
        console.log(uniqueFoodItems);  // Log to verify no duplicates
        setFoodList(uniqueFoodItems);
      } else {
        console.error('Error fetching food list');
      }
    } catch (error) {
      console.error('An error occurred while fetching the food list');
    }
  };

  // Load data on initial render
  useEffect(() => {
    const loadData = async () => {
      await fetchFoodList();
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }
    };
    loadData();
  }, []); // Empty dependency array ensures it runs only once on mount

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return <StoreContext.Provider value={contextValue}>{props.children}</StoreContext.Provider>;
};

export default StoreContextProvider;
