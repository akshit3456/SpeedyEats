import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order for frontend
const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173";
    try {
      const { userId, items, discountAmount, deliveryFee, totalAmount, address} = req.body;
      // Save the order to the database
      const newOrder = new orderModel({
        userId,
        items,
        amount: totalAmount,
        address,
      });
      await newOrder.save();
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
  
      // Map the items for Stripe's checkout session
      const line_Items = items.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: item.name,
          },
          unit_amount: (item.price*100)-(item.price*100*discountAmount)
        },
        quantity: item.quantity,
      }));
  
      // Add delivery fee as a line item
      if (deliveryFee > 0) {
        line_Items.push({
          price_data: {
            currency: "inr",
            product_data: {
              name: "Delivery Charges",
            },
            unit_amount: deliveryFee * 100,
          },
          quantity: 1,
        });
      }
  
      // Create Stripe session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: line_Items,
        mode: "payment",
        success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url: `${frontend_url}`,
      });
  
      res.json({ success: true, session_url: session.url });
    } catch (error) {
      console.error("Error placing order:", error);
      res.json({ success: false, message: "Error placing the order" });
    }
  };  

export {placeOrder};