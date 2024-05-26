import express from "express";

import UserController, { repeatVerify } from "../controllers/user.js";
import AuthController from "../controllers/auth.js";

import uploadMiddleware from "../middleware/upload.js";
import { emailSchema } from "../schemas/registerSchema.js";
import validateBody from "../helpers/validateBody.js";

const router = express.Router();
router.get("/verify/:verificationToken", UserController.verify);
router.post("/verify", AuthController.resendVerificationEmail);
router.post("/verify", validateBody(emailSchema), repeatVerify);
router.patch(
  "/avatars",
  uploadMiddleware.single("avatar"),
  UserController.uploadAvatar
);
router.get("/avatars", UserController.getAvatar);

export default router;
