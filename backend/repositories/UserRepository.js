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
    const familias = await FamiliaRepository.findByGestorId(gestorId);
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

  createProfileByRole: async (role, usuarioId, data) => {
    switch (role) {
      case "gestor":
        return await prisma.perfilGestor.create({
          data: {
            usuarioId,
            cargo: data.cargo,
            organizacaoVinculada: data.organizacaoVinculada,
            recebeAlertas: data.recebeAlertas ?? true,
            observacoes: data.observacoes,
          },
        });

      case "cultivador":
        return await prisma.perfilCultivador.create({
          data: {
            usuarioId,
            tipoExperiencia: data.tipoExperiencia,
            habilidades: data.habilidades,
            plantasFavoritas: data.plantasFavoritas,
            observacoes: data.observacoes,
          },
        });

      case "voluntario":
        return await prisma.perfilVoluntario.create({
          data: {
            usuarioId,
            interesse: data.interesse,
            disponivel: data.disponivel ?? true,
            observacoes: data.observacoes,
          },
        });

      case "admin":
        return await prisma.perfilAdmin.create({
          data: {
            usuarioId,
            cargo: data.cargo,
            ativo: data.ativo ?? true,
            observacoes: data.observacoes,
          },
        });

      default:
        throw new Error(
          `Role "${role}" não reconhecida para criação de perfil`
        );
    }
  },
};
