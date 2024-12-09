import { response } from "express";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order for frontend
const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173";
    try {
      const { userId, items, finalAnount ,discountAmount, deliveryFee, address,finalTotal} = req.body;
      // Save the order to the database
      const newOrder = new orderModel({
        userId,
        items,
        amount: finalTotal,
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
        cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
      });      
  
      res.json({ success: true, session_url: session.url });
    } catch (error) {
      console.error("Error placing order:", error);
      res.json({ success: false, message: "Error placing the order" });
    }
  };

  const verifyOrder = async(req,res) =>{
    const {orderId,success} = req.body;
    try {
      if (success == "true"){
          await orderModel.findByIdAndUpdate(orderId,{payment:"true"});
          res.json({success:true,message:"Paid"});
      }else{
        await orderModel.findByIdAndDelete(orderId);
        res.json({success:false,message:"Not Paid"});
      }
    } catch (error) {
      console.log(error);
      res.json({success:false,message:"Error"});
    }
  }

  const userOrders = async (req,res) =>{
    try {
      const orders = await orderModel.find({userId:req.body.userId});
      res.json({success:true,data:orders});
    } catch (error) {
      console.log(error);
      res.json({success:false,message:"Error"});
    }
  }

export {placeOrder,verifyOrder,userOrders};