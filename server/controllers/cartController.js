import prisma from "../config/prisma.js";

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be greater than 0" });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await prisma.cart.findFirst({
      where: { userId },
    });
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });
    if (existingItem) {
      // 3️⃣ Update quantity if already exists
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      });
    } else {
      // 4️⃣ Create new cart item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    // 5️⃣ Return updated cart with product details
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                newPrice: true,
                oldPrice: true,
                images: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({ cart: updatedCart });
  } catch (error) {
    console.error("❌ addToCart error:", error);
    res.status(500).json({ message: "Failed to add product to cart" });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                newPrice: true,
                oldPrice: true,
                images: true,
              },
            },
          },
        },
      },
    });

    if (!cart) return res.status(200).json({ cart: { items: [] } });

    res.status(200).json({ cart });
  } catch (error) {
    console.error("❌ getCart error:", error);
    res.status(500).json({ message: error.message });
  }
};

// --- Clear Cart ---
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: true },
    });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    res.json({
      message: "Cart cleared successfully",
      cart: { items: [], totalPrice: 0 },
    });
  } catch (error) {
    console.error("❌ clearCart error:", error);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};
