import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs"; // make sure bcrypt is imported
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        userName,
        email,
        password: hashedPassword,
        role: "user",
      },
      select: { id: true, userName: true, email: true },
    });

    return res.status(201).json({
      success: true,
      user,
      message: "User saved to database successfully",
    });
  } catch (error) {
    console.error("❌ Register user error:", error);
    res.status(500).json({ error: error.message });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    const token = generateTokenAndSetCookie(user.id, user.role, res);

    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
        role: user.role,
      },
      success: true,
      token,
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ error: error.message });
  }
};
export const logOutUser = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res
      .status(200)
      .json({ message: "User logged out succesfully", success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // set by auth middleware

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, userName: true, email: true, role: true },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: { select: { name: true, newPrice: true, images: true } },
          },
        },
      },
    });

    res.json({ user, orders });
  } catch (error) {
    console.error("❌ Error fetching user profile:", error);
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};
