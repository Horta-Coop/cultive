import { ColheitaRepository } from "../repositories/ColheitaRepository.js";
import { PlantioRepository } from "../repositories/PlantioRepository.js";
import { HortaRepository } from "../repositories/HortaRepository.js";

const mapColheita = (c) => {
  if (!c) return null;
  return {
    id: c.id,
    cultura: c.cultura,
    dataColheita: c.dataColheita,
    quantidadeColhida: c.quantidadeColhida,
    unidadeMedida: c.unidadeMedida,
    destinoColheita: c.destinoColheita,
    observacoes: c.observacoes,
    plantioId: c.plantioId,
    plantio: c.plantio ?? null,
    createdAt: c.createdAt ?? null,
    updatedAt: c.updatedAt ?? null,
  };
};

export const ColheitaService = {
  getAllColheitas: async ({ requester, params = {} } = {}) => {
    const { page, limit, plantioId } = params;
    const take = limit ? parseInt(limit, 10) : undefined;
    const skip =
      page && limit
        ? (parseInt(page, 10) - 1) * parseInt(limit, 10)
        : undefined;

    // admin sees all
    if (requester.role === "admin") {
      const raw = await ColheitaRepository.findAll({
        take,
        skip,
        where: plantioId ? { plantioId } : undefined,
      });
      return raw.map(mapColheita);
    }

    // gestor: must ensure the plantio/horta is under his management
    if (requester.role === "gestor") {
      const where = {};
      if (plantioId) where.plantioId = plantioId;

      const raw = await ColheitaRepository.findAll({ take, skip, where });

      // filter locally to keep simple: include only those where plantio.horta.gestorId === requester.id
      const filtered = [];
      for (const c of raw) {
        const plantio =
          c.plantio ||
          (c.plantioId ? await PlantioRepository.findById(c.plantioId) : null);
        if (!plantio) continue;
        const horta =
          plantio.horta ??
          (plantio.hortaId
            ? await HortaRepository.findById(plantio.hortaId)
            : null);
        if (horta?.gestorId === requester.id) filtered.push(c);
      }
      return filtered.map(mapColheita);
    }

    // cultivador/voluntario: show colheitas only for plantios in their family hortas
    if (["cultivador", "voluntario"].includes(requester.role)) {
      if (!requester.familiaId) return [];
      const raw = await ColheitaRepository.findAll({
        take,
        skip,
        where: plantioId ? { plantioId } : undefined,
      });
      const filtered = [];
      for (const c of raw) {
        const plantio =
          c.plantio ||
          (c.plantioId ? await PlantioRepository.findById(c.plantioId) : null);
        if (!plantio) continue;
        const horta =
          plantio.horta ??
          (plantio.hortaId
            ? await HortaRepository.findById(plantio.hortaId)
            : null);
        if (horta?.familiaId === requester.familiaId) filtered.push(c);
      }
      return filtered.map(mapColheita);
    }

    return [];
  },

  getColheitaById: async ({ id, requester }) => {
    const c = await ColheitaRepository.findById(id);
    if (!c) throw new Error("Colheita não encontrada");

    if (requester.role === "admin") return mapColheita(c);

    const plantio =
      c.plantio ??
      (c.plantioId ? await PlantioRepository.findById(c.plantioId) : null);
    const horta =
      plantio?.horta ??
      (plantio?.hortaId
        ? await HortaRepository.findById(plantio.hortaId)
        : null);

    if (requester.role === "gestor") {
      if (horta?.gestorId === requester.id) return mapColheita(c);
      throw new Error("Acesso negado");
    }

    if (["cultivador", "voluntario"].includes(requester.role)) {
      if (horta?.familiaId === requester.familiaId) return mapColheita(c);
      throw new Error("Acesso negado");
    }

    throw new Error("Acesso negado");
  },

  createColheita: async ({ data, requester }) => {
    // only gestor or admin can create colheitas
    if (!["admin", "gestor"].includes(requester.role))
      throw new Error("Acesso negado");

    // must reference an existing plantio
    const plantioId = data.plantioId ?? data.plantio;
    if (!plantioId) throw new Error("plantioId é obrigatório");

    const plantio = await PlantioRepository.findById(plantioId);
    if (!plantio) throw new Error("Plantio não encontrado");

    // if gestor, ensure horta belongs to gestor
    if (requester.role === "gestor") {
      const horta =
        plantio.horta ??
        (plantio.hortaId
          ? await HortaRepository.findById(plantio.hortaId)
          : null);
      if (!horta || horta.gestorId !== requester.id)
        throw new Error("Acesso negado para criar colheita nesse plantio");
    }

    const createData = {
      plantioId,
      cultura: data.cultura ?? plantio.cultura ?? null,
      dataColheita: data.dataColheita
        ? new Date(data.dataColheita)
        : new Date(),
      quantidadeColhida: data.quantidadeColhida ?? 0,
      unidadeMedida: data.unidadeMedida ?? "un",
      destinoColheita: data.destinoColheita ?? "consumo",
      observacoes: data.observacoes ?? null,
    };

    const created = await ColheitaRepository.create(createData);
    return mapColheita(created);
  },

  updateColheita: async ({ id, data, requester }) => {
    const c = await ColheitaRepository.findById(id);
    if (!c) throw new Error("Colheita não encontrada");

    if (requester.role === "admin") {
      // allowed
    } else if (requester.role === "gestor") {
      const plantio =
        c.plantio ??
        (c.plantioId ? await PlantioRepository.findById(c.plantioId) : null);
      const horta =
        plantio?.horta ??
        (plantio?.hortaId
          ? await HortaRepository.findById(plantio.hortaId)
          : null);
      if (horta?.gestorId !== requester.id) throw new Error("Acesso negado");
    } else {
      throw new Error("Acesso negado");
    }

    const updateData = {};
    if (data.cultura) updateData.cultura = data.cultura;
    if (data.dataColheita)
      updateData.dataColheita = new Date(data.dataColheita);
    if (data.quantidadeColhida)
      updateData.quantidadeColhida = data.quantidadeColhida;
    if (data.unidadeMedida) updateData.unidadeMedida = data.unidadeMedida;
    if (data.destinoColheita) updateData.destinoColheita = data.destinoColheita;
    if (data.observacoes) updateData.observacoes = data.observacoes;

    const updated = await ColheitaRepository.update(id, updateData);
    return mapColheita(updated);
  },

  deleteColheita: async ({ id, requester }) => {
    const c = await ColheitaRepository.findById(id);
    if (!c) throw new Error("Colheita não encontrada");

    if (requester.role === "admin") return await ColheitaRepository.delete(id);

    if (requester.role === "gestor") {
      const plantio =
        c.plantio ??
        (c.plantioId ? await PlantioRepository.findById(c.plantioId) : null);
      const horta =
        plantio?.horta ??
        (plantio?.hortaId
          ? await HortaRepository.findById(plantio.hortaId)
          : null);
      if (horta?.gestorId !== requester.id) throw new Error("Acesso negado");
      return await ColheitaRepository.delete(id);
    }

    throw new Error("Acesso negado");
  },
};
