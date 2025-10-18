import { PrismaClient } from "../generated/prisma/client.js";

const prisma = new PrismaClient();

// Middleware para remover senhaHash de qualquer resultado
prisma.$use(async (params, next) => {
  const result = await next(params);

  const removeSenha = (data) => {
    if (!data) return data;

    if (Array.isArray(data)) {
      return data.map(removeSenha);
    }

    if (typeof data === "object" && data !== null) {
      const { senhaHash, ...rest } = data;
      return Object.fromEntries(
        Object.entries(rest).map(([key, value]) => [key, removeSenha(value)])
      );
    }

    return data;
  };

  return removeSenha(result);
});

const prismaLogin = new PrismaClient();

export { prisma, prismaLogin };
