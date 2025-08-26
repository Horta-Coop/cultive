import { prisma } from "../config/prisma.js";

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
          where: { familiaId: req.user.id },
        });

        break;
    }

    res.json({ hortas });
  } catch (error) {
    res.send(500).json({ message: error.message });
  }
};

export const getHortaById = async (req, res) => {
  try {
    const idHorta = req.params;

    const horta = await prisma.horta.findUnique({
      where: {
        hortaId: idHorta,
      },
    });

    if (!horta) {
      return res.status(401).json({ message: "Horta not existis" });
    }
  } catch (error) {
    console.log("Error in controller horta");
    res.status(500).json({ message: error.message });
  }
};

export const createHorta = async (req, res) => {
  try {
    const {nomeHorta, enderecoHorta, cordenadaHorta, areaCultivada, tpSolo, tpHorta, observacoes, familiaId} = req.body

    
  } catch (error) {
    
  }
};
