import bcrypt from "bcryptjs";
import { Jwt } from "../utils/jwt.js";
import { UserRepository } from "../repositories/UserRepository.js";

export const AuthService = {
  signup: async ({ nome, username, email, senha }) => {
    const userExist = await UserRepository.findByEmail(email);

    if (userExist) {
      throw new Error("User already exists");
    }

    const senhaHash = await bcrypt.hash(senha, 10);
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
  login: async ({ username, email, senha }) => {
    const user = await UserRepository.findByUsernameOrEmailWithPassword({
      email,
      username,
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(senha, user.senhaHash);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const { accessToken, refreshToken } = Jwt.generateTokens(user.id);
    await Jwt.storeRefreshToken(user.id, refreshToken);

    return { user, accessToken, refreshToken };
  },
};
