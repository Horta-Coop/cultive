import prisma from "../utils/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";
import {
  generateTokens,
  setCookies,
  storeRefreshToken,
} from "../utils/auth.js";

/*
export const signup = async (req, res) => {
  const { name, email, senha, tipo } = req.body;

  try {
    const has_senha = await bcrypt.hash(senha, 10);

    const userExist = await prisma.usuario.findUnique({
      where: {
        email: email,
      },
    });

    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await prisma.usuario.create({
      data: {
        nomeCompleto: name,
        email: email,
        senhaHash: has_senha,
        tipo: tipo,
      },
    });

    //Autenticate
    const { accessToken, refreshToken } = generateTokens(user.id);
    await storeRefreshToken(user.id, refreshToken);

    setCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        role: user.tipo,
      },
      message: "Create User",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
*/

export const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const userBase = await prisma.usuario.findUnique({
      where: {
        email: email,
      },
    });

    if (!userBase) {
      return res.status(400).json({ message: "User not already" });
    }

    const isMatch = await bcrypt.compare(senha, userBase.senhaHash);

    if (!isMatch) {
      return res.status(401).json({ messagem: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = generateTokens(userBase.id);
    await storeRefreshToken(userBase.id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    // Busca dados completos
    let userDetails;
    if (userBase.tipo === "ADMIN") {
      userDetails = await prisma.admin.findUnique({
        where: { adminId: userBase.id },
      });
    } else if (userBase.tipo === "GERENTE") {
      userDetails = await prisma.gerente.findUnique({
        where: { gerenteId: userBase.id },
      });
    } else if (userBase.tipo === "FAMILIA") {
      userDetails = await prisma.familia.findUnique({
        where: { familiaId: userBase.id },
      });
    }

    return res.json({
      message: "Login bem-sucedido",
      user: {
        id: userBase.id,
        email: userBase.email,
        tipo: userBase.tipo,
        dados: userDetails,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      await redis.del(`refresh_token:${decoded.userId}`);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provider" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storeRefreshToken = await redis.get(
      `refresh_token:${decoded.userId}`
    );

    if (storeRefreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TODO:
//export const getProfile = async (req, res) => {};
