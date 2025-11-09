import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/UserRepository.js";

export const protectRoute = async (req, res, next) => {
  try {
    const accessToken =
      req.cookies?.accessToken || req.headers["authorization"]?.split(" ")[1];

    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "Não autorizado - Nenhum token de acesso fornecido" });
    }

    let decoded;
    try {
      decoded = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Não autorizado - Token expirado" });
      }
      return res
        .status(401)
        .json({ message: "Não autorizado - Token inválido" });
    }

    const user = await UserRepository.findById(decoded.userId);

    if (!user) {
      return res
        .status(401)
        .json({ message: "Não autorizado - Usuário não encontrado" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Erro no middleware protectRoute:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};

// Middleware para verificar roles
export const allowRoles = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(403).json({ message: "Acesso negado - Role ausente" });
    }

    if (!roles.includes(userRole)) {
      return res
        .status(403)
        .json({ message: "Acesso negado - Permissões insuficientes" });
    }

    next();
  };
};
