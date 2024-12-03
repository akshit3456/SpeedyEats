import authMiddleware from "../middleware/auth.js";
import {placeOrder} from "../controllers/orderController.js";
import express from "express";

const orderRouter = express.Router();

orderRouter.post("/place",authMiddleware,placeOrder);


export default orderRouter;