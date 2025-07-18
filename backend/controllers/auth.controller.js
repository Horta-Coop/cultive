import prisma from "../utils/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  ); //7 Days
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const signup = async (req, res) => {
  const { email, senha, tipo } = req.body;

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

export const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const userBase = await prisma.usuario.findUnique({
      where: {
        email: email,
      },
    });
    const isMatch = await bcrypt.compare(senha, userBase.senhaHash);

    if (!userBase) {
      return res.status(400).json({ message: "User not already" });
    }
    if (!isMatch) {
      return res.status(401).json({ messagem: "Invalid credentials" });
    }

    if (userBase && isMatch) {
      const { accessToken, refreshToken } = generateTokens(userBase.id);

      await storeRefreshToken(userBase.id, refreshToken);
      setCookies(res, accessToken, refreshToken);
    }
    let userComplete;
    switch (userBase.tipo) {
      case "ADMIN":
        userComplete = await prisma.usuario.findUnique({
          where: {
            email: email,
          },
          include: {
            admin: true,
          },
        });
        break;
      case "GERENTE":
        userComplete = await prisma.usuario.findUnique({
          where: {
            email: email,
          },
          include: {
            gerente: true,
          },
        });
        break;
      case "FAMILIA":
        userComplete = await prisma.usuario.findUnique({
          where: {
            email: email,
          },
          include: {
            familia: true,
          },
        });
        break;
    }

    //console.log(`User Complete: ${userComplete.gerente.cargo}`);
    //console.log(JSON.stringify(userComplete, null, 2));

    res.json({
      message: "Login sucess",
      user: {
        id: userComplete.id,
        email: userComplete.email,
        role: userComplete.tipo,
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
