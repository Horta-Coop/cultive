import { PlantioService } from "../services/PlantioService.js";

const mapErrorStatus = (msg) => {
  if (!msg) return 500;
  if (msg.toLowerCase().includes("não encontrado") || msg.toLowerCase().includes("não existe")) return 404;
  if (msg.toLowerCase().includes("acesso negado") || msg.toLowerCase().includes("forbidden")) return 403;
  if (msg.toLowerCase().includes("obrigat")) return 400;
  return 500;
};

export const getAllPlantios = async (req, res) => {
  try {
    const requester = req.user;
    const params = { page: req.query.page, limit: req.query.limit, hortaId: req.query.hortaId };
    const plantios = await PlantioService.getAllPlantios({ requester, params });
    return res.json({ plantios });
  } catch (error) {
    console.error("getAllPlantios:", error);
    const status = mapErrorStatus(error.message);
    return res.status(status).json({ message: error.message || "Erro ao listar plantios" });
  }
};

export const getPlantioById = async (req, res) => {
  try {
    const { id } = req.params;
    const requester = req.user;
    const plantio = await PlantioService.getPlantioById({ id, requester });
    return res.json({ plantio });
  } catch (error) {
    console.error("getPlantioById:", error);
    const status = mapErrorStatus(error.message);
    return res.status(status).json({ message: error.message || "Erro ao obter plantio" });
  }
};

export const createPlantio = async (req, res) => {
  try {
    const requester = req.user;
    const data = req.body;
    const created = await PlantioService.createPlantio({ data, requester });
    return res.status(201).json({ plantio: created });
  } catch (error) {
    console.error("createPlantio:", error);
    const status = mapErrorStatus(error.message);
    return res.status(status).json({ message: error.message || "Erro ao criar plantio" });
  }
};

export const updatePlantio = async (req, res) => {
  try {
    const { id } = req.params;
    const requester = req.user;
    const data = req.body;
    const updated = await PlantioService.updatePlantio({ id, data, requester });
    return res.json({ plantio: updated });
  } catch (error) {
    console.error("updatePlantio:", error);
    const status = mapErrorStatus(error.message);
    return res.status(status).json({ message: error.message || "Erro ao atualizar plantio" });
  }
};

export const deletePlantio = async (req, res) => {
  try {
    const { id } = req.params;
    const requester = req.user;
    await PlantioService.deletePlantio({ id, requester });
    return res.json({ message: "Plantio removido" });
  } catch (error) {
    console.error("deletePlantio:", error);
    const status = mapErrorStatus(error.message);
    return res.status(status).json({ message: error.message || "Erro ao remover plantio" });
  }
};