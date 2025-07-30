import bcrypt from "bcrypt";
import { generateTokens, setCookies, storeRefreshToken } from "./auth.js";

export const createUserWithTokens = async (req, res, userData) => {
  const { nomeCompleto, email, senha, tipo } = userData;

  try {
    const userExist = await prisma.usuario.findUnique({
      where: {
        email: email,
      },
    });

    if (userExist) {
      throw new Error("Email já cadastrado.");
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const user = await prisma.usuario.create({
      data: {
        nomeCompleto,
        email,
        senhaHash,
        tipo,
      },
    });

    //Autenticate
    const { accessToken, refreshToken } = generateTokens(user.id);
    await storeRefreshToken(user.id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    return user;

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

};
