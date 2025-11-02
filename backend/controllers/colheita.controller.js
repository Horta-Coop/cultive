import { ColheitaService } from "../services/ColheitaService.js";

const mapErrorStatus = (msg) => {
  if (!msg) return 500;
  if (
    msg.toLowerCase().includes("não encontrado") ||
    msg.toLowerCase().includes("não existe")
  )
    return 404;
  if (
    msg.toLowerCase().includes("acesso negado") ||
    msg.toLowerCase().includes("forbidden")
  )
    return 403;
  if (msg.toLowerCase().includes("obrigat")) return 400;
  return 500;
};

export const getAllColheitas = async (req, res) => {
  try {
    const requester = req.user;
    const params = {
      page: req.query.page,
      limit: req.query.limit,
      plantioId: req.query.plantioId,
    };
    const colheitas = await ColheitaService.getAllColheitas({
      requester,
      params,
    });
    return res.json({ colheitas });
  } catch (error) {
    console.error("getAllColheitas:", error);
    const status = mapErrorStatus(error.message);
    return res
      .status(status)
      .json({ message: error.message || "Erro ao listar colheitas" });
  }
};

export const getColheitaById = async (req, res) => {
  try {
    const { id } = req.params;
    const requester = req.user;
    const colheita = await ColheitaService.getColheitaById({ id, requester });
    return res.json({ colheita });
  } catch (error) {
    console.error("getColheitaById:", error);
    const status = mapErrorStatus(error.message);
    return res
      .status(status)
      .json({ message: error.message || "Erro ao obter colheita" });
  }
};

export const createColheita = async (req, res) => {
  try {
    const requester = req.user;
    const data = req.body;
    const created = await ColheitaService.createColheita({ data, requester });
    return res.status(201).json({ colheita: created });
  } catch (error) {
    console.error("createColheita:", error);
    const status = mapErrorStatus(error.message);
    return res
      .status(status)
      .json({ message: error.message || "Erro ao criar colheita" });
  }
};

export const updateColheita = async (req, res) => {
  try {
    const { id } = req.params;
    const requester = req.user;
    const data = req.body;
    const updated = await ColheitaService.updateColheita({
      id,
      data,
      requester,
    });
    return res.json({ colheita: updated });
  } catch (error) {
    console.error("updateColheita:", error);
    const status = mapErrorStatus(error.message);
    return res
      .status(status)
      .json({ message: error.message || "Erro ao atualizar colheita" });
  }
};

export const deleteColheita = async (req, res) => {
  try {
    const { id } = req.params;
    const requester = req.user;
    await ColheitaService.deleteColheita({ id, requester });
    return res.json({ message: "Colheita removida" });
  } catch (error) {
    console.error("deleteColheita:", error);
    const status = mapErrorStatus(error.message);
    return res
      .status(status)
      .json({ message: error.message || "Erro ao remover colheita" });
  }
};
