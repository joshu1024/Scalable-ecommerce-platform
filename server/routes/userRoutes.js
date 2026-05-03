import express from "express";
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

export default router;
