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

    // 1. Controle de acesso (exemplo futuro)
    // if (requester.role !== "admin") {
    //   throw new Error("Acesso negado");
    // }

    // 2. Filtros iniciais
    const filters = {};
    if (role) filters.role = role;
    // if (requester.role === "gestor") filters.hortaId = requester.hortaId;

    // 3. Busca por nome/email (like)
    if (search) {
      filters.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    // 4. Paginação
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

    // 6. Chamar repository
    const usuarios = await UserRepository.findAll({
      where: filters,
      take,
      skip,
      orderBy: Object.keys(order).length ? order : undefined,
    });

    // 7. Ocultar campos sensíveis
    const safeUsuarios = usuarios.map((u) => {
      const { password, ...safeData } = u;
      return safeData;
    });

    // 8. (Futuro) Cache
    // await cache.set("usuarios", safeUsuarios);

    // 9. (Futuro) Auditoria
    // await auditoriaService.registrar(requester.id, "LIST_USERS");

    return safeUsuarios;
  },
};
