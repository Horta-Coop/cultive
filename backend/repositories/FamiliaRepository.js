import { prisma } from "../config/prisma.js";

export const FamiliaRepository = {
  findById: async (id) => {
    return await prisma.familia.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        representante: true,
        gestorId: true,
        membros: { select: { id: true, nome: true, email: true, role: true } },
      },
    });
  },

  findFamilyByGestor: async (gestorId) => {
    return await prisma.familia.findMany({
      where: { gestorId },
      select: {
        id: true,
        nome: true,
        representante: true,
        membros: { select: { id: true, nome: true, email: true, role: true } },
      },
    });
  },

  createFamilia: async ({ nome, representante, gestorId, qtdMembros }) => {
    return await prisma.familia.create({
      data: { nome, representante, gestorId, qtdMembros },
    });
  },
};
