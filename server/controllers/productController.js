import prisma from "../config/prisma.js";
import { embedProduct } from "../services/embedding.service.js";

export const addProduct = async (req, res) => {
  console.log("🔥 HIT addProduct controller");
  console.log("req.body:", req.body);
  console.log("req.files:", req.files);
  try {
    const { name, oldPrice, newPrice, brand, category, stock } = req.body;

    if (!name || !brand || !category || !newPrice) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const images = req.files ? req.files.map((file) => file.path) : [];

    const product = await prisma.product.create({
      data: {
        name,
        oldPrice: parseFloat(oldPrice) || 0,
        newPrice: parseFloat(newPrice) || 0,
        brand,
        category,
        images,
        stock: parseInt(stock) || 0,
      },
    });
    embedProduct(product.id).catch((err) =>
      console.error("Auto-embed failed:", err),
    );
    res.status(201).json(product);
  } catch (error) {
    console.log("🔥 CAUGHT ERROR:", error);
    console.log("🔥 ERROR STRING:", String(error));
    res
      .status(500)
      .json({ message: "Failed to add product", detail: String(error) });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getProductById = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const query = req.query.q?.trim();

    if (!query) {
      return res.status(400).json({ message: "Search query missing" });
    }

    console.log("🔍 Searching for:", query);

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { brand: { contains: query, mode: "insensitive" } },
          { category: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
    });
    console.log("✅ Found:", products.length, "products");
    res.status(200).json(products);
  } catch (error) {
    console.error("❌ Search error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, oldPrice, newPrice, brand, category, stock } = req.body;

    // new image URLs from Cloudinary (if any)
    const imageUrls = req.files ? req.files.map((file) => file.path) : [];

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: name || undefined,
        oldPrice: oldPrice !== undefined ? parseFloat(oldPrice) : undefined,
        newPrice: newPrice !== undefined ? parseFloat(newPrice) : undefined,
        brand: brand || undefined,
        category: category || undefined,
        stock: stock !== undefined ? parseInt(stock) : undefined,
        images: imageUrls.length > 0 ? imageUrls : undefined,
      },
    });
    embedProduct(product.id).catch((err) =>
      console.error("Auto-embe failed", err),
    );
    res.json({ message: "✅ Product updated successfully", product });
  } catch (error) {
    console.error("❌ Update product error:", error);
    res.status(500).json({ message: error.message });
  }
};
