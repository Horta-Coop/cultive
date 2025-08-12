import express from "express"
import { adminRoute, gerenteRoute, protectRoute } from "../middleware/auth.middleware.js"
import { deleteUser, getAllUsers, getUser, me, updateUser } from "../controllers/usuario.controller.js"

const router = express.Router()

router.get("/", protectRoute, adminRoute, getAllUsers)
router.get("/:id", protectRoute, gerenteRoute, adminRoute, getUser)
router.put("/:id", protectRoute, updateUser)
router.delete("/:id", protectRoute, deleteUser)

//TODO: Create Page Onboarding
//router.post("/onboarding", protectRoute, onboarding)

router.post("/me", protectRoute, me)

export default router