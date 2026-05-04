import express from "express";
console.log("userRoutes mounted");

import protectRoute from "../middleware/authMiddleware.js";
import {
  loginUser,
  logOutUser,
  registerUser,
} from "../controllers/userController.js";
import { getUserProfile } from "../controllers/userController.js";

const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logOutUser);
router.get("/profile", protectRoute, getUserProfile);
console.log("userRoutes mounted");
export default router;
