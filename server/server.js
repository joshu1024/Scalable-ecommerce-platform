import "./config/env.js";
import express from "express";
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

console.log("DB URL:", process.env.DATABASE_URL);
const app = express();
const PORT = process.env.PORT || 5000;

const uploadDir = path.join(path.resolve(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("✅ Uploads directory created");
}

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") ?? [
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

/* ---------- Middleware ---------- */
app.use(express.json());
app.use(cookieParser());
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
