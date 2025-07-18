import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";

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

      const user = await prisma.usuario.findUnique({
        where: {
          id: decoded.userId,
        },
        select: {
          id: true,
          email: true,
          tipo: true,
        },
      });

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

export const adminRoute = async (req, res, next) => {
  if (req.user && req.user.tipo === "ADMIN") {
    next();
  } else {
    return res.status(401).json({ message: "Access denied - Admin only" });
  }
};

export const gerenteRoute = async (req, res, next) => {
  if (req.user && req.user.tipo === "GERENTE") {
    next();
  } else {
    return res.status(401).json({ message: "Access denied - Manager only" });
  }
};
