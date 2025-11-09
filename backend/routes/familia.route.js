import express from "express";
import { protectRoute, allowRoles } from "../middleware/auth.middleware.js";
import {
  createFamilia,
  getFamiliaById,
  updateFamilia,
  deleteFamilia,
  getAllFamilias,
} from "../controllers/familia.controller.js";

const router = express.Router();

// list / create
router.get("/", protectRoute, allowRoles("gestor", "admin"), getAllFamilias);
router.post("/", protectRoute, allowRoles("gestor", "admin"), createFamilia);

// single
router.get("/:id", protectRoute, allowRoles("gestor", "admin"), getFamiliaById);
router.put("/:id", protectRoute, allowRoles("gestor", "admin"), updateFamilia);
router.delete("/:id", protectRoute, allowRoles("admin"), deleteFamilia);

export default router;
