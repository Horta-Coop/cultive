import { createUserWithTokens } from "../utils/createUserWithTokens";

export const createFamilia = async (req, res) => {
  const {
    nomeGrupo,
    representante,
    email,
    senha,
    habilidades,
    qtdMembros,
    observacoes,
  } = req.body;
  const currentUser = req.user;

  try {
    // 1. Cria o usuário com token
    const user = await createUserWithTokens(req, res, {
      nomeCompleto: representante,
      email,
      senha,
      tipo: "FAMILIA",
    });

    // 2. Cria a família usando o id do usuário criado
    const familia = await prisma.familia.create({
      data: {
        familiaId: user.id,
        nomeGrupo,
        representante,
        habilidades,
        qtdMembros,
        observacoes,
        gerenteId: currentUser.id,
      },
    });

    return res.status(201).json({
      message: "Família criada e autenticada",
      user: {
        id: user.id,
        email: user.email,
        tipo: user.tipo,
      },
      familia,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
