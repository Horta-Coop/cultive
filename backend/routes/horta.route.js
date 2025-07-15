import express from "express"
import { getAllHortas } from "../controllers/horta.controller.js"


const router = express.Router()

router.post("/", protectRoute, adminRouter, getAllHortas)


export default router