import express from "express";
import adminsOnly from "../middleware/adminMiddleware.js";
import protectRoute from "../middleware/authMiddleware.js";
import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/adminController.js";
import {
  getAdminDashboard,
  getAllProducts,
  deleteProduct,
} from "../controllers/adminController.js";
import {
  getAllUsers,
  deleteUser,
  updateUserRole,
} from "../controllers/adminController.js";

const router = express.Router();
router.get("/dashboard", protectRoute, adminsOnly, getAdminDashboard);
router.get("/products", protectRoute, adminsOnly, getAllProducts);
router.delete("/products/:id", protectRoute, adminsOnly, deleteProduct);
router.get("/orders", protectRoute, adminsOnly, getAllOrders);
router.put("/orders/:id", protectRoute, adminsOnly, updateOrderStatus);
router.delete("/orders/:id", protectRoute, adminsOnly, deleteOrder);

router.get("/users", protectRoute, adminsOnly, getAllUsers);
router.delete("/users/:id", protectRoute, adminsOnly, deleteUser);
router.put("/users/:id", protectRoute, adminsOnly, updateUserRole);

export default router;
