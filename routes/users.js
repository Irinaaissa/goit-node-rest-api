import express from "express";

import UserController from "../controllers/user.js";
import AuthController from "../controllers/auth.js";

import uploadMiddleware from "../middleware/upload.js";

const router = express.Router();
router.get("/verify/:verificationToken", UserController.verify);
router.post("/verify", AuthController.resendVerificationEmail);
router.patch(
  "/avatars",
  uploadMiddleware.single("avatar"),
  UserController.uploadAvatar
);
router.get("/avatars", UserController.getAvatar);

export default router;
