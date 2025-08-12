import express from "express"
import { login, logout, refreshToken, signup } from "../controllers/auth.controller.js"
import validate from "../middleware/validate.middleware.js"
import { signupSchema } from "../schemas/auth.schema.js"

const router = express.Router()

router.post("/signup", signup, validate(signupSchema))
router.post("/login", login)
router.post("/logout", logout)
router.post("/refresh-token", refreshToken)

export default router