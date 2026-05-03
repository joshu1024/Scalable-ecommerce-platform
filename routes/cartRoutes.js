import express from "express";
import {
  addToCart,
  getCart,
  clearCart,
} from "../controllers/cartController.js";
import protectRoute from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/addToCart", protectRoute, addToCart);
router.get("/getCart", protectRoute, getCart);
router.delete("/clearCart", protectRoute, clearCart);

export default router;
