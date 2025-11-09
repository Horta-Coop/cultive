import prisma  from "../config/prisma.js";

export const ColheitaRepository = {
  findAll: async (options = {}) => {
    return await prisma.colheita.findMany({
      where: options.where ?? {},
      take: options.take,
      skip: options.skip,
      orderBy: options.orderBy,
      include: options.include ?? { plantio: true },
    });
  },

  findById: async (id) => {
    return await prisma.colheita.findUnique({
      where: { id },
      include: { plantio: true },
    });
  },

  findByPlantioId: async (plantioId) => {
    return await prisma.colheita.findMany({ where: { plantioId } });
  },

  create: async (data) => {
    return await prisma.colheita.create({ data, include: { plantio: true } });
  },

  update: async (id, data) => {
    return await prisma.colheita.update({
      where: { id },
      data,
      include: { plantio: true },
    });
  },

  delete: async (id) => {
    return await prisma.colheita.delete({ where: { id } });
  },
};
