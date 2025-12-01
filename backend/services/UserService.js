import { FamiliaRepository } from "../repositories/FamiliaRepository.js";
import { UserRepository } from "../repositories/UserRepository.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { completeUserOnboarding } from "../controllers/usuario.controller.js";
import {
  baseSchema,
  profileAdminSchema,
  profileCultivadorSchema,
  profileGestorSchema,
  profileVoluntarioSchema,
} from "../schemas/user.schema.js";
import { LogRepository } from "../repositories/LogRepository.js";

export const UserService = {
  getAllUsers: async (params = {}) => {
    const { page, limit, search, role, orderBy, sortDir, requester } = params;

    const take = limit ? parseInt(limit, 10) : undefined;
    const skip =
      page && limit
        ? (parseInt(page, 10) - 1) * parseInt(limit, 10)
        : undefined;

    const order = {};
    if (orderBy) {
      order[orderBy] = sortDir || "asc";
    }

    let usuarios = [];

    if (requester.role === "admin") {
      // Admin pode filtrar por role
      const filters = {};
      if (role) filters.role = role;

      if (search) {
        filters.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ];
      }

      usuarios = await UserRepository.findAll({
        where: filters,
        take,
        skip,
        orderBy: Object.keys(order).length ? order : undefined,
      });
    } else if (requester.role === "gestor") {
      // Gestor só vê usuários das famílias que ele gerencia
      usuarios = await UserRepository.findAllUsersByGestor(requester.id);

      // Aplicar filtro de busca, se houver
      if (search) {
        const searchLower = search.toLowerCase();
        usuarios = usuarios.filter(
          (u) =>
            u.name.toLowerCase().includes(searchLower) ||
            u.email.toLowerCase().includes(searchLower)
        );
      }

      // Paginação manual para arrays
      if (page && limit) {
        const start = (parseInt(page, 10) - 1) * parseInt(limit, 10);
        const end = start + parseInt(limit, 10);
        usuarios = usuarios.slice(start, end);
      }

      if (orderBy) {
        usuarios.sort((a, b) => {
          if (a[orderBy] < b[orderBy]) return sortDir === "desc" ? 1 : -1;
          if (a[orderBy] > b[orderBy]) return sortDir === "desc" ? -1 : 1;
          return 0;
        });
      }
    } else {
      return [];
    }
    const safeUsuarios = usuarios.map((u) => {
      const { password, ...safeData } = u;
      return safeData;
    });

    // Log da consulta de usuários
    await LogRepository.create({
      usuarioId: requester.id,
      acao: "Consultou lista de usuários",
      contexto: `Filtros: ${JSON.stringify({ search, role, page, limit })}`,
    });

    return safeUsuarios;
  },

  getUser: async (params = {}) => {
    const {
      userId,
      requester, // usuário que está pedindo a listagem (para controle de acesso)
    } = params;

    let usuario;
    // allow admin to fetch any user
    if (requester.role === "admin") {
      usuario = await UserRepository.findById(userId);
      if (!usuario) throw new Error("Usuário não encontrado");
      await LogRepository.create({
        usuarioId: requester.id,
        acao: "Consultou usuário",
        contexto: `UsuárioID: ${userId}`,
      });
      const { password, ...safeUsuario } = usuario;
      return safeUsuario;
    }

    // allow user to fetch own profile
    if (userId === requester.id) {
      usuario = await UserRepository.findById(userId);
      if (!usuario) throw new Error("Usuário não encontrado");
      await LogRepository.create({
        usuarioId: requester.id,
        acao: "Consultou próprio perfil",
        contexto: null,
      });
      const { password, ...safeUsuario } = usuario;
      return safeUsuario;
    }

    // gestor can fetch users that belong to families he manages
    if (requester.role === "gestor") {
      const familias = await FamiliaRepository.findFamilyByGestor(requester.id);
      const members = familias.map((f) => f.membros).flat();
      const belongs = members.some((m) => m.id === userId);
      if (!belongs) throw new Error("Usuário não pertence ao gestor");

      usuario = await UserRepository.findById(userId);
      if (!usuario) throw new Error("Usuário não encontrado");
      await LogRepository.create({
        usuarioId: requester.id,
        acao: "Consultou usuário sob sua gestão",
        contexto: `UsuárioID: ${userId}`,
      });
      const { password, ...safeUsuario } = usuario;
      return safeUsuario;
    }

    if (["cultivador", "voluntario"].includes(requester.role)) {
      if (!requester.familiaId) throw new Error("Acesso negado");
      const target = await UserRepository.findById(userId);
      if (!target) throw new Error("Usuário não encontrado");
      if (target.familiaId !== requester.familiaId)
        throw new Error("Acesso negado");

      await LogRepository.create({
        usuarioId: requester.id,
        acao: "Consultou usuário da própria família",
        contexto: `UsuárioID: ${userId}`,
      });

      const { password, ...safeUsuario } = target;
      return safeUsuario;
    }

    throw new Error("Acesso negado");
  },

  updateUserAdmin: async (userId, data, requester) => {
    const userExist = await UserRepository.findById(userId);
    if (!userExist) {
      throw new Error("Usuário não encontrado");
    }

    const user = await UserRepository.updateUserAdmin(userId, data);

    await LogRepository.create({
      usuarioId: requester.id,
      acao: "Atualizou usuário",
      contexto: `UsuárioID: ${userId}, Dados: ${JSON.stringify(data)}`,
    });

    return user;
  },

  generateTempPassword: (length = 12) => {
    return crypto.randomBytes(length).toString("base64").slice(0, length);
  },

  createUserAdmin: async (
    { nome, username, email, senha, role, familiaId },
    requester
  ) => {
    const senhaHash = await bcrypt.hash(senha, 12);
    const user = await UserRepository.createUser({
      nome,
      username,
      email,
      senhaHash,
      role,
      familiaId,
    });

    await LogRepository.create({
      usuarioId: requester.id,
      acao: "Criou usuário admin",
      contexto: `UsuárioID: ${user.id}, Nome: ${user.nome}, Role: ${role}`,
    });

    return user;
  },

  createResetToken: async (userId) => {
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
    await UserRepository.updateUser(userId, {
      resetToken: token,
      resetTokenExpiry: expires,
    });
    await LogRepository.create({
      usuarioId: requester.id,
      acao: "Gerou token de reset de senha",
      contexto: `UsuárioID: ${userId}`,
    });
    return token;
  },

  completeOnboarding: async (userId, data) => {
    const user = await UserRepository.findById(userId);
    if (!user) throw new Error("Usuário não encontrado");

    if (user.onBoarding) throw new Error("Onboarding já foi concluído");

    // Define schema específico conforme o tipo de usuário
    let specificSchema;
    switch (user.role) {
      case "gestor":
        specificSchema = profileGestorSchema;
        break;

      case "cultivador":
        specificSchema = profileCultivadorSchema;
        break;

      case "voluntario":
        specificSchema = profileVoluntarioSchema;
        break;

      case "admin":
        specificSchema = profileAdminSchema;
        break;

      default:
        throw new Error("Tipo de usuário inválido para onboarding");
    }

    // Faz merge dos schemas
    const fullSchema = baseSchema.merge(specificSchema);
    const result = fullSchema.safeParse(data);

    if (!result.success) {
      throw new Error(
        "Erro de validação: " + JSON.stringify(result.error.format())
      );
    }

    const parsed = result.data;

    // Atualiza campos básicos
    await UserRepository.updateUser(userId, {
      telefone: parsed.telefone,
      endereco: parsed.endereco,
      pictureUrl: parsed.pictureUrl,
      onBoarding: true,
    });

    // Cria o perfil específico
    await UserRepository.createProfileByRole(user.role, userId, parsed);

    await LogRepository.create({
      usuarioId: requester.id,
      acao: "Concluiu onboarding",
      contexto: `UsuárioID: ${userId}, Role: ${user.role}`,
    });

    // Retorna usuário atualizado
    const updated = await UserRepository.findById(userId);
    return updated;
  },
};
