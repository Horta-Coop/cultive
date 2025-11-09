import prisma from "../config/prisma.js";
import { FamiliaRepository } from "./FamiliaRepository.js";

export const UserRepository = {
  findByEmail: async (email) => {
    return await prisma.usuario.findUnique({ where: { email } });
  },

  createUser: async ({ nome, username, email, senhaHash, role, familiaId }) => {
    return await prisma.usuario.create({
      data: { nome, username, email, senhaHash, role, familiaId },
    });
  },
  updateUserAdmin: async (id, data) => {
    return await prisma.usuario.update({
      where: { id },
      data,
    });
  },
  findById: async (id) => {
    return await prisma.usuario.findUnique({
      where: { id },
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
    return await prisma.usuario.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
      showPassword: true,
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

  findByResetToken: async (token) => {
    return await prisma.usuario.findFirst({
      where: { resetToken: token },
    });
  },

  updateUser: async (id, data) => {
    return await prisma.usuario.update({
      where: { id },
      data,
    });
  },
};
