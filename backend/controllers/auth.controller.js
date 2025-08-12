import { redis } from "../lib/redis.js";
import { loginSchema, signupSchema } from "../schemas/auth.schema.js";

import { AuthService } from "../services/AuthService.js";
import { Jwt } from "../utils/jwt.js";

export const signup = async (req, res) => {
  const body = req.body;
  const result = signupSchema.safeParse(body);

  if (!result.success) {
    const errors = result.error.format();
    return res.status(422).json({ message: "Erro de validação", errors });
  }

  const { nome, username, email, senha } = result.data;

  try {
    const { user, accessToken, refreshToken } = await AuthService.signup({
      nome,
      username,
      email,
      senha,
    });

    Jwt.setCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        role: user.tipo,
      },
      message: "Create User",
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const body = req.body;
  const result = loginSchema.safeParse(body);

  if (!result.success) {
    const errors = result.error.format();
    return res.status(422).json({ message: "Erro de validação", errors });
  }

  const { username, email, senha } = result.data;

  try {
    const { user, accessToken, refreshToken } = await AuthService.login({
      username,
      email,
      senha,
    });

    Jwt.setCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      message: "Login bem-sucedido",
      user: {
        id: user.id,
        email: user.email,
        role: user.tipo,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
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
