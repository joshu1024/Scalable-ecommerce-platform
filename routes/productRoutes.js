import express from "express";
import {
  addProduct,
  getProducts,
  getProductById,
  searchProducts,
  updateProduct,
} from "../controllers/productController.js";
import { addToCart } from "../controllers/cartController.js";
import protectRoute from "../middleware/authMiddleware.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import prisma from "../config/prisma.js"; // Prisma client

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "mern-ecommerce",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });

router.post("/add", upload.array("images", 5), addProduct);
router.get("/", getProducts);
router.get("/search", searchProducts);
router.get("/:id", getProductById);
router.put("/:id", upload.array("images", 5), updateProduct);

// Prisma-based category filter
router.get("/category/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const products = await prisma.product.findMany({
      where: {
        category: { contains: category, mode: "insensitive" },
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Prisma-based brand filter
router.get("/brand/:brand", async (req, res) => {
  try {
    const brand = req.params.brand;
    const products = await prisma.product.findMany({
      where: {
        brand: { contains: brand, mode: "insensitive" },
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
