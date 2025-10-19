import { prisma } from "../config/prisma.js";

export const PlantioRepository = {
  findAll: async (options = {}) => {
    return await prisma.plantio.findMany({
      where: options.where ?? {},
      take: options.take,
      skip: options.skip,
      orderBy: options.orderBy,
      include: options.include ?? {
        horta: true,
        usuario: true,
      },
    });
  },

  findById: async (id) => {
    return await prisma.plantio.findUnique({
      where: { id },
      include: {
        horta: true,
        usuario: true,
      },
    });
  },

  findByHortaId: async (hortaId) => {
    return await prisma.plantio.findMany({
      where: { hortaId },
      include: { horta: true, usuario: true },
    });
  },

  create: async (data) => {
    // data should be prisma-compatible (uses schema fields like dataInicio, previsaoColheita, etc.)
    return await prisma.plantio.create({
      data,
      include: { horta: true, usuario: true },
    });
  },

  update: async (id, data) => {
    return await prisma.plantio.update({
      where: { id },
      data,
      include: { horta: true, usuario: true },
    });
  },

  delete: async (id) => {
    return await prisma.plantio.delete({
      where: { id },
    });
  },
};