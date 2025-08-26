import { UserRepository } from "../repositories/UserRepository.js";

export const UserService = {
  getAllUsers: async (params = {}) => {
    const {
      page, // ex: 1
      limit, // ex: 20
      search, // ex: "joao"
      role, // ex: "gestor"
      orderBy, // ex: "name" ou "createdAt"
      sortDir, // ex: "asc" ou "desc"
      requester, // usuário que está pedindo a listagem (para controle de acesso)
    } = params;

    const filters = {};
    if (role) filters.role = role;

    if (search) {
      filters.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const take = limit ? parseInt(limit, 10) : undefined;
    const skip =
      page && limit
        ? (parseInt(page, 10) - 1) * parseInt(limit, 10)
        : undefined;

    // 5. Ordenação
    const order = {};
    if (orderBy) {
      order[orderBy] = sortDir || "asc";
    }

    let usuarios = [];
    if (requester.role === "gestor") {
      usuarios = await UserRepository.findAllByGestor(requester.id);
    }

    if (requester.role === "admin") {
      usuarios = await UserRepository.findAll({
        where: filters,
        take,
        skip,
        orderBy: Object.keys(order).length ? order : undefined,
      });
    }

    const safeUsuarios = usuarios.map((u) => {
      const { password, ...safeData } = u;
      return safeData;
    });

    return safeUsuarios;
  },

  getUserAdmin: async (id) => {
    const usuario = await UserRepository.findById(id);

    if (!usuario || !usuario.length) {
      throw new Error("Usuário não encontrado");
    }

    return usuario;
  },

  getUserGestor: async (id, gestorId) => {
    const usuario = await UserRepository.findByGestor(id, gestorId);

    if (!usuario || !usuario.length) {
      throw new Error(
        "Usuário não encontrado ou você não tem permissão para acessá-lo"
      );
    }

    return usuario;
  },

  updateUserAdmin: async (userId, data) => {
    const userExist = await UserRepository.findById(userId);

    if (userExist) {
      throw new Error("User already exists");
    }

    return await UserRepository.updateUserAdmin(id, data);
  },
};
