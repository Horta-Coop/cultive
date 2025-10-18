import express from "express"
import { allowRoles, protectRoute } from "../middleware/auth.middleware.js"
import { getAllUsers, getUser, updateUser} from "../controllers/usuario.controller.js"

const router = express.Router()

router.get("/", protectRoute, allowRoles("gestor", "admin"), getAllUsers)
router.get("/:id", protectRoute, allowRoles("gestor", "admin"), getUser)
router.put("/:id", protectRoute, allowRoles("gestor", "admin"), updateUser)
/*
router.put("/:id", protectRoute, allowRoles("gestor", "admin"), updateUser)
router.delete("/:id", protectRoute, deleteUser)
*/
//TODO: Create Page Onboarding
//router.post("/onboarding", protectRoute, onboarding)


export default router