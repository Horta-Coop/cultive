import { FamiliaRepository } from "../repositories/FamiliaRepository.js";
import { UserRepository } from "../repositories/UserRepository.js";

export const FamiliaService = {
  getAllFamiliasByGestor: async (gestorId) => {
    return await FamiliaRepository.findFamilyByGestor(gestorId);
  },

  getAllFamilias: async ({ requester, page, limit } = {}) => {
    // Admin: list all
    if (requester?.role === "admin") {
      const take = limit ? parseInt(limit, 10) : undefined;
      const skip =
        page && limit
          ? (parseInt(page, 10) - 1) * parseInt(limit, 10)
          : undefined;
      return await FamiliaRepository.findAll({ take, skip });
    }

    // Gestor: families he manages
    if (requester?.role === "gestor") {
      return await FamiliaRepository.findFamilyByGestor(requester.id);
    }

    // Cultivador/voluntario: only own family
    if (["cultivador", "voluntario"].includes(requester?.role)) {
      if (!requester.familiaId) return [];
      const f = await FamiliaRepository.findById(requester.familiaId);
      return f ? [f] : [];
    }

    return [];
  },

  getFamiliaById: async (id, requester) => {
    const familia = await FamiliaRepository.findById(id);
    if (!familia) throw new Error("Família não encontrada");

    // admin can always access
    if (requester.role === "admin") return familia;

    // gestor can access if he is gestor
    if (requester.role === "gestor") {
      if (familia.gestorId === requester.id) return familia;
      throw new Error("Acesso negado");
    }

    // cultivador/voluntario can access only if belongs to family
    if (["cultivador", "voluntario"].includes(requester.role)) {
      if (requester.familiaId && requester.familiaId === familia.id)
        return familia;
      throw new Error("Acesso negado");
    }

    throw new Error("Acesso negado");
  },

  createFamilia: async ({ data, requester }) => {
    // only admin or gestor can create
    if (!["admin", "gestor"].includes(requester.role))
      throw new Error("Acesso negado");

    // if gestor, ensure gestorId is requester
    if (requester.role === "gestor") data.gestorId = requester.id;

    if (!data.nome || !data.representante)
      throw new Error("nome e representante são obrigatórios");

    const created = await FamiliaRepository.createFamilia({
      nome: data.nome,
      representante: data.representante,
      gestorId: data.gestorId || requester.id,
      qtdMembros: data.qtdMembros || 0,
    });

    return created;
  },

  updateFamilia: async ({ id, data, requester }) => {
    const familia = await FamiliaRepository.findById(id);
    if (!familia) throw new Error("Família não encontrada");

    if (requester.role === "admin")
      return await FamiliaRepository.updateFamilia(id, data);

    if (requester.role === "gestor") {
      if (familia.gestorId !== requester.id) throw new Error("Acesso negado");
      return await FamiliaRepository.updateFamilia(id, data);
    }

    throw new Error("Acesso negado");
  },

  deleteFamilia: async ({ id, requester }) => {
    const familia = await FamiliaRepository.findById(id);
    if (!familia) throw new Error("Família não encontrada");

    // only admin can delete
    if (requester.role !== "admin") throw new Error("Acesso negado");

    return await FamiliaRepository.deleteFamilia(id);
  },
};
