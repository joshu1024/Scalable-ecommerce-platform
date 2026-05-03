import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import prisma from "./config/prisma.js";

import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paypalRoutes from "./routes/paypalRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ---------- Ensure uploads folder exists ---------- */
const uploadDir = path.join(path.resolve(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("✅ Uploads directory created");
}

/* ---------- Middleware ---------- */
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "https://mern-ecommerce-26w1-git-main-joes-projects-50075601.vercel.app",
        "https://mern-ecommerce-26w1.vercel.app",
      ];
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
      callback(new Error("CORS not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

/* ---------- Request Logger ---------- */
app.use((req, res, next) => {
  console.log("➡️ Incoming:", req.method, req.originalUrl);
  next();
});

/* ---------- API Routes ---------- */
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/paypal", paypalRoutes);
app.use("/api/admin", adminRoutes);

/* ---------- Static Uploads ---------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ---------- Health Route ---------- */
app.get("/", (req, res) => {
  res.send("✅ MERN E-Commerce API is running successfully!");
});

/* ---------- Utility Route (Prisma version) ---------- */
app.get("/cleanup-carts", async (req, res) => {
  try {
    await prisma.cart.deleteMany();
    res.send("✅ All carts cleared");
  } catch (error) {
    console.error(error);
    res.status(500).send("❌ Failed to clear carts");
  }
});

/* ---------- 404 Handler ---------- */
app.use((req, res) => {
  console.log("❌ No route matched:", req.originalUrl);
  res.status(404).json({ message: "Route not found" });
});

/* ---------- Start Server ---------- */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
