import { PlantioRepository } from "../repositories/PlantioRepository.js";
import { HortaRepository } from "../repositories/HortaRepository.js";
import { FamiliaRepository } from "../repositories/FamiliaRepository.js"; // optional

// Helper to normalize prisma model -> API shape expected by frontend
const mapPlantioToApi = (p) => {
  if (!p) return null;
  return {
    // keep original prisma fields too, but expose frontend-friendly aliases
    id: p.id,
    // prefer existing prisma fields: cultura, dataInicio, previsaoColheita, etc.
    cultura: p.cultura ?? p.nome ?? null,
    crop: p.cultura ?? p.nome ?? null,

    // prisma uses dataInicio / previsaoColheita per schema -> map to dataPlantio / estimativaColheita
    dataPlantio: p.dataInicio ?? p.dataPlantio ?? null,
    dataInicio: p.dataInicio ?? p.dataPlantio ?? null,

    estimativaColheita: p.previsaoColheita ?? p.estimativaColheita ?? null,
    previsaoColheita: p.previsaoColheita ?? p.estimativaColheita ?? null,

    dataColheita: p.dataColheita ?? null,
    quantidadePlantada: p.quantidadePlantada ?? null,
    unidadeMedida: p.unidadeMedida ?? null,
    observacoes: p.observacoes ?? null,

    // optional fields that frontend/service expect
    usuarioId: p.usuarioId ?? null,
    usuario: p.usuario ?? null,

    progresso: p.progresso ?? p.percentual ?? 0,
    progress: p.progresso ?? p.percentual ?? 0,
    status: p.status ?? p.estado ?? null,

    cuidados: p.cuidados ?? p.careInstructions ?? null,

    // relations
    hortaId: p.hortaId ?? (p.horta ? p.horta.id : null),
    horta: p.horta ?? null,

    createdAt: p.createdAt ?? null,
    updatedAt: p.updatedAt ?? null,
  };
};

export const PlantioService = {
  getAllPlantios: async ({ requester, params = {} } = {}) => {
    const { page, limit, hortaId } = params;
    const take = limit ? parseInt(limit, 10) : undefined;
    const skip = page && limit ? (parseInt(page, 10) - 1) * parseInt(limit, 10) : undefined;

    // Admin sees all
    if (requester.role === "admin") {
      const raw = await PlantioRepository.findAll({ take, skip, where: hortaId ? { hortaId } : undefined });
      return raw.map(mapPlantioToApi);
    }

    // Gestor: plantios das hortas que ele gerencia OR das famílias que ele gerencia
    if (requester.role === "gestor") {
      const hortasDoGestor = await HortaRepository.findByGestorId(requester.id);
      const hortaIds = hortasDoGestor.map((h) => h.id);

      let familiaIds = [];
      if (typeof FamiliaRepository?.findFamilyByGestor === "function") {
        const familias = await FamiliaRepository.findFamilyByGestor(requester.id);
        familiaIds = familias.map((f) => f.id);
      }

      const where = {
        OR: [
          { hortaId: { in: hortaIds.length ? hortaIds : ["-"] } },
          { horta: { familiaId: { in: familiaIds.length ? familiaIds : ["-"] } } },
        ],
      };

      const raw = await PlantioRepository.findAll({ take, skip, where });
      return raw.map(mapPlantioToApi);
    }

    // Cultivador/voluntário: plantios na horta da família (se familiaId)
    if (["cultivador", "voluntario"].includes(requester.role)) {
      if (!requester.familiaId) return [];
      const hortas = await HortaRepository.findByFamiliaIds([requester.familiaId]);
      const ids = hortas.map((h) => h.id);
      const raw = await PlantioRepository.findAll({ where: { hortaId: { in: ids } } });
      return raw.map(mapPlantioToApi);
    }

    return [];
  },

  getPlantioById: async ({ id, requester }) => {
    const plantio = await PlantioRepository.findById(id);
    if (!plantio) throw new Error("Plantio não encontrado");

    if (requester.role === "admin") return mapPlantioToApi(plantio);

    if (requester.role === "gestor") {
      if (plantio.horta?.gestorId === requester.id) return mapPlantioToApi(plantio);
      if (typeof FamiliaRepository?.findFamilyByGestor === "function") {
        const familias = await FamiliaRepository.findFamilyByGestor(requester.id);
        const familiaIds = familias.map((f) => f.id);
        if (plantio.horta?.familiaId && familiaIds.includes(plantio.horta.familiaId)) return mapPlantioToApi(plantio);
      }
      throw new Error("Acesso negado ao plantio");
    }

    if (["cultivador", "voluntario"].includes(requester.role)) {
      if (requester.familiaId && plantio.horta?.familiaId === requester.familiaId) return mapPlantioToApi(plantio);
      throw new Error("Acesso negado ao plantio");
    }

    throw new Error("Acesso negado");
  },

  createPlantio: async ({ data, requester }) => {
    // only gestor/admin can create
    if (!["admin", "gestor"].includes(requester.role)) throw new Error("Acesso negado");

    // if gestor, ensure horta belongs to gestor
    if (requester.role === "gestor") {
      const horta = await HortaRepository.findById(data.hortaId || data.horta);
      if (!horta) throw new Error("Horta não encontrada");
      if (horta.gestorId !== requester.id) throw new Error("Acesso negado para criar plantio nessa horta");
    }

    // minimal required: hortaId and cultura (or crop)
    const hortaId = data.hortaId ?? data.horta ?? null;
    const cultura = data.cultura ?? data.crop ?? null;
    if (!hortaId || !cultura) throw new Error("hortaId e cultura são obrigatórios");

    // build prisma-compatible payload using existing schema names (dataInicio, previsaoColheita, etc.)
    const createData = {
      hortaId,
      cultura,
      // map dates
      dataInicio: data.dataPlantio ? new Date(data.dataPlantio) : data.dataInicio ? new Date(data.dataInicio) : undefined,
      previsaoColheita: data.estimativaColheita ? new Date(data.estimativaColheita) : data.previsaoColheita ? new Date(data.previsaoColheita) : undefined,
      dataColheita: data.dataColheita ? new Date(data.dataColheita) : undefined,

      // numeric / progress
      progresso: data.progresso ?? data.progress ?? undefined,
      status: data.status ?? undefined,

      // cuidados may be stored in a Json column named cuidados or cuidadosJson; try both alternatives
      cuidados: data.cuidados ?? data.careInstructions ?? data.cuidadosJson ?? undefined,

      // optional metadata
      quantidadePlantada: data.quantidadePlantada ?? undefined,
      unidadeMedida: data.unidadeMedida ?? undefined,
      observacoes: data.observacoes ?? data.observacao ?? undefined,

      // link creator if provided or use requester
      usuarioId: data.usuarioId ?? data.userId ?? requester.id,
    };

    // remove undefined fields (Prisma doesn't like undefined when sending)
    Object.keys(createData).forEach((k) => createData[k] === undefined && delete createData[k]);

    const created = await PlantioRepository.create(createData);
    return mapPlantioToApi(created);
  },

  updatePlantio: async ({ id, data, requester }) => {
    const plantio = await PlantioRepository.findById(id);
    if (!plantio) throw new Error("Plantio não encontrado");

    if (requester.role === "admin") {
      // proceed
    } else if (requester.role === "gestor") {
      const horta = await HortaRepository.findById(plantio.hortaId);
      if (horta?.gestorId !== requester.id) throw new Error("Acesso negado");
    } else {
      throw new Error("Acesso negado");
    }

    // map incoming fields to prisma names
    const updateData = {};
    if (data.cultura ?? data.crop) updateData.cultura = data.cultura ?? data.crop;
    if (data.dataPlantio ?? data.dataInicio) updateData.dataInicio = data.dataPlantio ? new Date(data.dataPlantio) : new Date(data.dataInicio);
    if (data.estimativaColheita ?? data.previsaoColheita) updateData.previsaoColheita = data.estimativaColheita ? new Date(data.estimativaColheita) : new Date(data.previsaoColheita);
    if (data.dataColheita) updateData.dataColheita = new Date(data.dataColheita);
    if (data.progresso ?? data.progress) updateData.progresso = data.progresso ?? data.progress;
    if (data.status) updateData.status = data.status;
    if (data.cuidados ?? data.careInstructions) updateData.cuidados = data.cuidados ?? data.careInstructions;
    if (data.quantidadePlantada) updateData.quantidadePlantada = data.quantidadePlantada;
    if (data.unidadeMedida) updateData.unidadeMedida = data.unidadeMedida;
    if (data.observacoes) updateData.observacoes = data.observacoes;
    if (data.usuarioId) updateData.usuarioId = data.usuarioId;

    Object.keys(updateData).forEach((k) => updateData[k] === undefined && delete updateData[k]);

    const updated = await PlantioRepository.update(id, updateData);
    return mapPlantioToApi(updated);
  },

  deletePlantio: async ({ id, requester }) => {
    const plantio = await PlantioRepository.findById(id);
    if (!plantio) throw new Error("Plantio não encontrado");

    if (requester.role === "admin") return await PlantioRepository.delete(id);

    if (requester.role === "gestor") {
      const horta = await HortaRepository.findById(plantio.hortaId);
      if (horta?.gestorId !== requester.id) throw new Error("Acesso negado");
      return await PlantioRepository.delete(id);
    }

    throw new Error("Acesso negado");
  },
};