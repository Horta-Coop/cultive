import { FamiliaRepository } from "../repositories/FamiliaRepository.js";
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
      usuarios = await UserRepository.findAllUsersByGestor(requester.id);
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

  getUser: async (params = {}) => {
    const {
      userId,
      requester, // usuário que está pedindo a listagem (para controle de acesso)
    } = params;

    let usuario;
    if(userId === requester.id) {
      throw new Error("Usuário nao pode ver o proprio perfil");
    }

    if (requester.role === "gestor") {
      const familias = await FamiliaRepository.findFamilyByGestor(requester.id);
      const users = familias.map((f) => f.membros).flat();

      if (!userId in users) {
        throw new Error("Usuário não pertence ao gestor");
      }

      usuario = await UserRepository.findById(userId);
    }

    if (requester.role === "admin") {
      usuario = await UserRepository.findById(userId);
    }

    const { password, ...safeUsuario } = usuario;

    return safeUsuario;
  },

  updateUserAdmin: async (userId, data) => {
    const userExist = await UserRepository.findById(userId);

    if (userExist) {
      throw new Error("User already exists");
    }

    return await UserRepository.updateUserAdmin(id, data);
  },
};
