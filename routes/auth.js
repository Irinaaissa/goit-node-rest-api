import AuthController from "../controllers/auth.js";
import authMiddleware from "../middleware/auth.js";
import express from "express";

import validateBody from "../helpers/validateBody.js";
import { registerSchema } from "../schemas/registerSchema.js";

// import UserController from "../controllers/user.js";

const router = express.Router();
const jsonParser = express.json();


router.post("/register", jsonParser, AuthController.register);

router.post("/login", jsonParser, AuthController.login);

router.get("/logout", authMiddleware, AuthController.logout);
router.post("/logout", authMiddleware,validateBody(registerSchema));
router.get("/current", authMiddleware, AuthController.current);
// router.get("/verify/:verificationToken", UserController.verify);

export default router;