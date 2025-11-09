import express from "express";
import { allowRoles, protectRoute } from "../middleware/auth.middleware.js";
import {
  getAllUsers,
  getUser,
  updateUser,
  createUserByAdmin,
} from "../controllers/usuario.controller.js";

const router = express.Router();

// Listar usuários
router.get("/", protectRoute, allowRoles("gestor", "admin"), getAllUsers);

// Obter usuário específico
router.get("/:id", protectRoute, allowRoles("gestor", "admin"), getUser);

// Atualizar usuário
router.put("/:id", protectRoute, allowRoles("gestor", "admin"), updateUser);

// Criar usuário pelo admin
router.post("/", protectRoute, allowRoles("admin"), createUserByAdmin);

// Deletar usuário
//router.delete("/:id", protectRoute, allowRoles("admin"), deleteUser);

// TODO: Create Page Onboarding
// router.post("/onboarding", protectRoute, onboarding);

export default router;
