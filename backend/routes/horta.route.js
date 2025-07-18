import express from "express"
import { getAllHortas } from "../controllers/horta.controller.js"
import { adminRoute, gerenteRoute, protectRoute } from "../middleware/auth.middleware.js"


const router = express.Router()

router.get("/", protectRoute, getAllHortas)


export default router