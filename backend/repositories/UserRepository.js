import prisma from "../config/prisma.js";

export const UserRepository = {
  findByEmail: async (email) => {
    return await prisma.usuario.findUnique({ where: { email } });
  },

  createUser: async ({ nome, username, email, senhaHash }) => {
    return await prisma.usuario.create({
      data: { nome, username, email, senhaHash },
    });
  },

  findById: async (id) => {
    return await prisma.usuario.findUnique({
      where: {
        id: id,
      },
    });
  },
  findByUsernameOrEmail: async ({ email, username }) => {
    return await prisma.usuario.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
  },
};
