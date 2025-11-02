import { FamiliaService } from "../services/FamiliaService.js";

export const getFamilias = async (req, res) => {
  try {
    const requester = req.user;
    const familias = await FamiliaService.getAllFamilias({
      requester,
      page: req.query.page,
      limit: req.query.limit,
    });
    return res.json({ familias });
  } catch (error) {
    console.error("getFamilias:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getFamiliaById = async (req, res) => {
  try {
    const { id } = req.params;
    const requester = req.user;
    const familia = await FamiliaService.getFamiliaById(id, requester);
    return res.json({ familia });
  } catch (error) {
    console.error("getFamiliaById:", error);
    const status = error.message === "Família não encontrada" ? 404 : 403;
    return res.status(status).json({ message: error.message });
  }
};

export const createFamilia = async (req, res) => {
  try {
    const requester = req.user;
    const data = req.body;
    const created = await FamiliaService.createFamilia({ data, requester });
    return res.status(201).json({ familia: created });
  } catch (error) {
    console.error("createFamilia:", error);
    return res.status(400).json({ message: error.message });
  }
};

export const updateFamilia = async (req, res) => {
  try {
    const { id } = req.params;
    const requester = req.user;
    const data = req.body;
    const updated = await FamiliaService.updateFamilia({ id, data, requester });
    return res.json({ familia: updated });
  } catch (error) {
    console.error("updateFamilia:", error);
    const status = error.message === "Família não encontrada" ? 404 : 403;
    return res.status(status).json({ message: error.message });
  }
};

export const deleteFamilia = async (req, res) => {
  try {
    const { id } = req.params;
    const requester = req.user;
    await FamiliaService.deleteFamilia({ id, requester });
    return res.json({ message: "Família removida" });
  } catch (error) {
    console.error("deleteFamilia:", error);
    const status = error.message === "Família não encontrada" ? 404 : 403;
    return res.status(status).json({ message: error.message });
  }
};
