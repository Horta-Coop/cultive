import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/UserRepository.js";

export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res
        .status(401)
        .json({ messgae: "Unauthorized - No accesstoken provider" });
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

      const user = await UserRepository.findById(decoded.userId);

      if (!user) {
        return res.status(401).json({ messgae: "User not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ messgae: "Unauthorized - Access token expired" });
      }

      throw error;
    }
  } catch (error) {
    console.log("Error in middleware auth");
    res.status(401).json({ messgae: "Unauthorized - Invalid access token" });
  }
};

// Middleware genérico para permitir múltiplos roles
export const allowRoles = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
