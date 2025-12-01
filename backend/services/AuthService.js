import bcrypt from "bcryptjs";
import { Jwt } from "../utils/jwt.js";
import { UserRepository } from "../repositories/UserRepository.js";
import {
  isLockedOut,
  recordFailedLogin,
  resetFailedLogin,
} from "../utils/lockout.js";
import crypto from "crypto";
import { sendResetEmail } from "../utils/email.js";

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || "12", 10);
const PEPPER = process.env.PEPPER || "";

const DUMMY_HASH = bcrypt.hashSync("invalid-password", BCRYPT_ROUNDS);

export const AuthService = {
  signup: async ({ nome, username, email, senha }) => {
    const userExist = await UserRepository.findByEmail(email);
    if (userExist) {
      throw new Error("Email invalido.");
    }
    const senhaHash = await bcrypt.hash(senha + PEPPER, BCRYPT_ROUNDS);
    const user = await UserRepository.createUser({
      nome,
      username,
      email,
      senhaHash,
    });

    const { accessToken, refreshToken } = Jwt.generateTokens(user.id);
    await Jwt.storeRefreshToken(user.id, refreshToken);

    return { user, accessToken, refreshToken };
  },

  login: async ({ username, email, senha, ip }) => {
    const identifier = email ?? username ?? `ip:${ip ?? "unknown"}`;

    //Verificar o lock
    if (await isLockedOut(identifier)) {
      throw new Error(
        "Conta temporariamente bloqueada. Tente novamente mais tarde."
      );
    }

    // Buscar com senha (deve retornar senhaHash)
    const user = await UserRepository.findByUsernameOrEmailWithPassword({
      email,
      username,
    });

    // Se não existir, comparar com DUMMY_HASH (mitiga timing attack)
    if (!user) {
      await bcrypt.compare(senha + PEPPER, DUMMY_HASH);
      await recordFailedLogin(identifier);
      throw new Error("Credenciais inválidas."); // mensagem genérica
    }

    // Verifica senha (com pepper)
    const isMatch = await bcrypt.compare(senha + PEPPER, user.senhaHash);

    if (!isMatch) {
      const attempts = await recordFailedLogin(identifier);
      console.warn(
        `Falha de login para ${identifier}. Tentativas: ${attempts}`
      );
      throw new Error("Credenciais inválidas.");
    }

    // Sucesso: resetar contadores
    await resetFailedLogin(identifier);

    // Gerar tokens e armazenar refresh
    const { accessToken, refreshToken } = Jwt.generateTokens(user.id);
    await Jwt.storeRefreshToken(user.id, refreshToken);

    return { user, accessToken, refreshToken };
  },

  forgotPassword: async ({ email }) => {
    if (!email) throw new Error("Email é obrigatório");

    const user = await UserRepository.findByEmail(email);
    if (!user) return;

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1h

    await UserRepository.updateUser(user.id, {
      resetToken: token,
      resetTokenExpiry: expiry,
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await sendResetEmail(email, resetLink);
  },

  resetPassword: async ({ token, newPassword }) => {
    if (!token || !newPassword) throw new Error("Token e senha obrigatórios");

    const user = await UserRepository.findByResetToken(token);
    if (!user || user.resetTokenExpiry < new Date())
      throw new Error("Token inválido ou expirado");

    const senhaHash = await bcrypt.hash(newPassword + PEPPER, BCRYPT_ROUNDS);

    await UserRepository.updateUser(user.id, {
      senhaHash,
      resetToken: null,
      resetTokenExpiry: null,
    });
  },
};
