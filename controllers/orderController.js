import prisma from "../config/prisma.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.user;
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // Validate and fetch product data
    const populatedItems = await Promise.all(
      items.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
        if (!product) throw new Error(`Product not found: ${item.productId}`);

        return {
          productId: product.id,
          name: product.name,
          price: product.newPrice ?? product.price,
          quantity: item.quantity,
          image: product.images?.[0] || null,
        };
      }),
    );

    // Calculate total
    const total = populatedItems.reduce(
      (acc, item) => acc + (item.price || 0) * item.quantity,
      0,
    );

    // Create order and related items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          userId: userId,
          total: total,
          status: "Pending",
          items: {
            create: populatedItems.map((item) => ({
              productId: item.productId,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),
          },
        },
        include: { items: true },
      });

      return createdOrder;
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("❌ Order creation error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                newPrice: true,
                images: true,
              },
            },
          },
        },
      },
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching user orders:", error);
    res.status(500).json({ message: "Failed to fetch user orders" });
  }
};
