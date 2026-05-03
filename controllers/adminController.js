import prisma from "../config/prisma.js";

export const getAdminDashboard = async (req, res) => {
  try {
    const [usersCount, productsCount, ordersCount, revenueData] =
      await Promise.all([
        prisma.user.count(),
        prisma.product.count(),
        prisma.order.count(),
        prisma.order.aggregate({
          _sum: { total: true },
        }),
      ]);

    const revenue = revenueData._sum.total ? Number(revenueData._sum.total) : 0;

    res.json({
      users: usersCount,
      products: productsCount,
      orders: ordersCount,
      revenue,
    });
  } catch (err) {
    console.error("❌ getAdminDashboard error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { category, search } = req.query;

    const where = {};
    if (category) where.category = category;
    if (search) where.name = { contains: search, mode: "insensitive" };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: { orderItems: true, cartItems: true },
      }),
      prisma.product.count({ where }),
    ]);

    if (!req.query.page && !req.query.limit) return res.json(products);

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
    });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res
      .status(500)
      .json({ message: "Server error. Unable to fetch products." });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const trimmedId = id.trim();

    const product = await prisma.product.delete({
      where: { id: trimmedId },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.status(500).json({ message: "Server error while deleting product" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [orders, totalOrders] = await Promise.all([
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              userName: true,
              email: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true,
                },
              },
            },
          },
        },
      }),
      prisma.order.count(),
    ]);

    if (!req.query.page && !req.query.limit) {
      return res.status(200).json(orders);
    }
    res.status(200).json({
      orders,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
    });
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ message: "Server error while fetching orders" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const allowedStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status value. Allowed: ${allowedStatuses.join(", ")}`,
      });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: { user: { select: { id: true, userName: true, email: true } } },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ Return updated order
    res.status(200).json({
      message: `Order status updated to "${status}"`,
      order,
    });
  } catch (error) {
    console.error("❌ Error updating order:", error);
    res
      .status(500)
      .json({ message: "Server error while updating order status" });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (req.user.role !== "admin" && order.userId !== req.user.id)
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this order" });

    await prisma.order.delete({ where: { id } });
    res.json({ message: "Order deleted successfully", order });
  } catch (error) {
    console.error("❌ Error deleting order:", error);
    res.status(500).json({ message: "Failed to delete order" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        userName: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    if (req.user.id === id) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own account" });
    }

    const user = await prisma.user.delete({
      where: { id },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully", user });
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const { id } = req.params;
    if (req.user.id === id) {
      return res
        .status(400)
        .json({ message: "You cannot change your own role" });
    }

    const validRoles = ["user", "admin"];
    const { role } = req.body;
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        userName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User role updated successfully", user });
  } catch (err) {
    console.error("❌ Error updating user role:", err);
    res.status(500).json({ message: "Failed to update user role" });
  }
};
