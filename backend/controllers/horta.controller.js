import prisma from "../utils/prisma.js";

export const getAllHortas = async (req, res) => {
  try {
    let hortas;

    switch (req.user.tipo) {
      case "ADMIN":
        hortas = await prisma.horta.findMany({
          include: {
            familia: true,
          },
        });
        break;
      case "GERENTE":
        hortas = await prisma.horta.findMany({
          where: {
            familia: {
              gerenteId: req.user.id,
            },
          },
        });

        break;
      case "FAMILIA":
        hortas = await prisma.horta.findMany({
          where: { familiaId: req.user.id }
        });

        break;
    }

    res.json({ hortas });
  } catch (error) {
    res.send(500).json({ message: error.message });
  }
};
