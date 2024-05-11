import AuthController from "../controllers/auth.js";
import authMiddleware from "../middleware/auth.js";
import express from "express";

import validateBody from "../helpers/validateBody.js";
import { registerSchema } from "../schemas/registerSchema";


const router = express.Router();
const jsonParser = express.json();


router.post("/register", jsonParser, AuthController.register);

router.post("/login", jsonParser, AuthController.login);

router.get("/logout", authMiddleware, AuthController.logout);
router.get("/logout", authMiddleware,validateBody(registerSchema));
router.get("/current", authMiddleware, AuthController.current);


export default router;