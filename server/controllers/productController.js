import prisma from "../config/prisma.js";

// ✅ Add product (Cloudinary-ready)
export const addProduct = async (req, res) => {
  try {
    const { name, oldPrice, newPrice, brand, category, stock } = req.body;

    // req.files[].path are already Cloudinary URLs
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
    res.status(201).json(product);
  } catch (error) {
    console.error("❌ Add product error:", error);
    res.status(500).json({ message: "Failed to add product" });
  }
};

// ✅ Get all products
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

// ✅ Get single product by ID
export const getProductById = async (req, res) => {
  const userId = req.params.id;
  try {
    const product = await prisma.product.findUnique({
      where: { id: userId },
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// ✅ Search products
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

// ✅ Update product (Cloudinary-ready)
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

    res.json({ message: "✅ Product updated successfully", product });
  } catch (error) {
    console.error("❌ Update product error:", error);
    res.status(500).json({ message: error.message });
  }
};
