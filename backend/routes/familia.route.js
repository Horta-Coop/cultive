import express from "express"
import { adminRoute, gerenteRoute, protectRoute } from "../middleware/auth.middleware"


const router = express.Router()
router.post("/", protectRoute, gerenteRoute || adminRoute, createFamilia)
router.put("/:userId", protectRoute, updateFamilia)
router.delete("/:userId", deleteFalimia)

export default router