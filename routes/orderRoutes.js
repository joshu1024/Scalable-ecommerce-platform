// server/routes/orderRoutes.js
import express from "express";
import { createOrder, getUserOrders } from "../controllers/orderController.js";
import protectRoute from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protectRoute, createOrder);
router.get("/my-orders", protectRoute, getUserOrders);

export default router;
