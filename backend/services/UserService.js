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
    // allow admin to fetch any user
    if (requester.role === "admin") {
      usuario = await UserRepository.findById(userId);
      if (!usuario) throw new Error("Usuário não encontrado");
      const { password, ...safeUsuario } = usuario;
      return safeUsuario;
    }

    // allow user to fetch own profile
    if (userId === requester.id) {
      usuario = await UserRepository.findById(userId);
      if (!usuario) throw new Error("Usuário não encontrado");
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
      const { password, ...safeUsuario } = usuario;
      return safeUsuario;
    }

    // cultivador/voluntario: can only fetch users in their own family (or themselves which already handled)
    if (["cultivador", "voluntario"].includes(requester.role)) {
      if (!requester.familiaId) throw new Error("Acesso negado");
      const target = await UserRepository.findById(userId);
      if (!target) throw new Error("Usuário não encontrado");
      if (target.familiaId !== requester.familiaId)
        throw new Error("Acesso negado");
      const { password, ...safeUsuario } = target;
      return safeUsuario;
    }

    throw new Error("Acesso negado");
  },

  updateUserAdmin: async (userId, data) => {
    const userExist = await UserRepository.findById(userId);
    if (!userExist) {
      throw new Error("Usuário não encontrado");
    }

    return await UserRepository.updateUserAdmin(userId, data);
  },
};
