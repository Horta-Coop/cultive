import  prisma  from "../config/prisma.js";

export const FamiliaRepository = {
  findById: async (id) => {
    return await prisma.familia.findUnique({
      where: { id },
      include: {
        membros: { select: { id: true, nome: true, email: true, role: true } },
        gestor: { select: { id: true, nome: true, email: true } },
      },
    });
  },

  findAll: async ({ take, skip } = {}) => {
    return await prisma.familia.findMany({
      take,
      skip,
      orderBy: { nome: "asc" },
      include: {
        membros: { select: { id: true, nome: true, email: true, role: true } },
        gestor: { select: { id: true, nome: true, email: true } },
      },
    });
  },

  findByGestorId: async (gestorId, { take, skip } = {}) => {
    return await prisma.familia.findMany({
      where: { gestorId },
      take,
      skip,
      orderBy: { nome: "asc" },
      include: {
        membros: { select: { id: true, nome: true, email: true, role: true } },
        gestor: { select: { id: true, nome: true, email: true } },
      },
    });
  },

  createFamilia: async (data) => {
    return await prisma.familia.create({ data });
  },

  updateFamilia: async (id, data) => {
    return await prisma.familia.update({
      where: { id },
      data,
      include: {
        membros: { select: { id: true, nome: true, email: true, role: true } },
        gestor: { select: { id: true, nome: true, email: true } },
      },
    });
  },

  deleteFamilia: async (id) => {
    return await prisma.familia.delete({ where: { id } });
  },
};
