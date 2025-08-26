import { prisma, prismaLogin } from "../config/prisma.js";
import { FamiliaRepository } from "./FamiliaRepository.js";

export const UserRepository = {
  findByEmail: async (email) => {
    return await prisma.usuario.findUnique({ where: { email } });
  },

  createUser: async ({ nome, username, email, senhaHash }) => {
    return await prisma.usuario.create({
      data: { nome, username, email, senhaHash },
    });
  },

  updateUserAdmin: async ({ nome, username, email, senhaHash }) => {
    return await prisma.usuario.update({
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

  findByUsernameOrEmailWithPassword: async ({ email, username }) => {
    return await prismaLogin.usuario.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
  },

  findAll: async (options = {}) => {
    return await prisma.usuario.findMany(options);
  },

  findAllUsersByGestor: async (gestorId) => {
    const familias = await FamiliaRepository.findFamilyByGestor(gestorId);
    const familiaIds = familias.map((f) => f.id);

    return await prisma.usuario.findMany({
      where: { familiaId: { in: familiaIds } },
    });
  },

};
