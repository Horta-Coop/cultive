import { PlantioRepository } from "../repositories/PlantioRepository.js";
import { HortaRepository } from "../repositories/HortaRepository.js";

export const PlantioService = {
  getAllPlantios: async ({ requester }) => {
    if (requester.role === "admin") {
      return await PlantioRepository.findAll();
    }

    if (requester.role === "gestor") {
      const plantiosGestor = await PlantioRepository.findByHortaIds(
        (await HortaRepository.findByGestorId(requester.id)).map((h) => h.id)
      );
      return plantiosGestor;
    }

    if (
      (requester.role === "cultivador" || requester.role === "voluntario") &&
      requester.familiaId
    ) {
      const hortasFamilia = await HortaRepository.findAll({
        where: { familiaId: requester.familiaId },
      });
      const hortaIds = hortasFamilia.map((h) => h.id);
      return await PlantioRepository.findByHortaIds(hortaIds);
    }

    return [];
  },

  getPlantioById: async ({ id, requester }) => {
    const plantio = await PlantioRepository.findById(id);
    if (!plantio) throw new Error("Plantio não encontrado");

    if (requester.role === "admin") return plantio;

    if (requester.role === "gestor") {
      if (plantio.horta.gestorId === requester.id) return plantio;
      throw new Error("Acesso negado");
    }

    if (
      (requester.role === "cultivador" || requester.role === "voluntario") &&
      requester.familiaId
    ) {
      if (plantio.horta.familiaId === requester.familiaId) return plantio;
      throw new Error("Acesso negado");
    }

    throw new Error("Acesso negado");
  },

  createPlantio: async ({ data, requester }) => {
    const { dataInicio, previsaoColheita, ...rest } = data;

    if (!["admin", "gestor"].includes(requester.role))
      throw new Error("Acesso negado");

    if (requester.role === "gestor") {
      const horta = await HortaRepository.findById(data.hortaId);
      if (!horta || horta.gestorId !== requester.id)
        throw new Error("Acesso negado");
    }

    // Converte strings de data para Date antes de criar
    const plantioData = {
      ...rest,
      dataInicio: new Date(dataInicio),
      previsaoColheita: new Date(previsaoColheita),
    };

    return await PlantioRepository.create(plantioData);
  },

  updatePlantio: async ({ id, data, requester }) => {
    const plantio = await PlantioRepository.findById(id);
    if (!plantio) throw new Error("Plantio não encontrado");

    let updateData = { ...data };

    if (data.dataInicio) updateData.dataInicio = new Date(data.dataInicio);
    if (data.previsaoColheita)
      updateData.previsaoColheita = new Date(data.previsaoColheita);

    if (requester.role === "admin")
      return await PlantioRepository.update(id, updateData);

    if (requester.role === "gestor") {
      if (plantio.horta.gestorId !== requester.id)
        throw new Error("Acesso negado");
      return await PlantioRepository.update(id, updateData);
    }

    throw new Error("Acesso negado");
  },

  deletePlantio: async ({ id, requester }) => {
    const plantio = await PlantioRepository.findById(id);
    if (!plantio) throw new Error("Plantio não encontrado");

    if (!["admin", "gestor"].includes(requester.role))
      throw new Error("Acesso negado");

    if (requester.role === "gestor" && plantio.horta.gestorId !== requester.id)
      throw new Error("Acesso negado");

    return await PlantioRepository.delete(id);
  },
};
