import express from "express"
import { getAllHortas } from "../controllers/horta.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"


const router = express.Router()

router.get("/", protectRoute, getAllHortas)
//router.get("/:id", protectRoute, getHortaById)
//router.post("/", protectRoute, gerenteRoute || adminRoute, createHorta)


export default router