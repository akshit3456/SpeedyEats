import authMiddleware from "../middleware/auth.js";
<<<<<<< HEAD
import {placeOrder,userOrders,verifyOrder} from "../controllers/orderController.js";
=======
import {placeOrder,verifyOrder} from "../controllers/orderController.js";
>>>>>>> origin/main
import express from "express";

const orderRouter = express.Router();

orderRouter.post("/place",authMiddleware,placeOrder);
<<<<<<< HEAD
orderRouter.post("/verify",verifyOrder);
orderRouter.post("/userorders",authMiddleware,userOrders);
=======
orderRouter.post("/verify",authMiddleware,verifyOrder);
>>>>>>> origin/main


export default orderRouter;