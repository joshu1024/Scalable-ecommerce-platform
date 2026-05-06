import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;

    console.log("AUTH HEADER:", req.cookies.jwt);
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        userName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ error: "Authorization failed" });
  }
};

export default protectRoute;
