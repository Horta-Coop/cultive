import express from "express"
import { login, logout, me, refreshToken, signup } from "../controllers/auth.controller.js"
import validate from "../middleware/validate.middleware.js"
import { signupSchema } from "../schemas/auth.schema.js"
import { protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/signup", signup, validate(signupSchema))
router.post("/login", login)
router.get("/logout", logout)
router.post("/refresh-token", refreshToken)
router.get("/me", protectRoute, me)
export default router