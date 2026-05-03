import { json } from "express";

const adminsOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403), json({ error: "Unauthorised - admins only" });
  }
};

export default adminsOnly;
