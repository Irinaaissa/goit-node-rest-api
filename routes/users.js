import express from "express";

import UserController from "../controllers/user.js";

import uploadMiddleware from "../middleware/upload.js";

const router = express.Router();


router.patch(
  "/avatars",
  uploadMiddleware.single("avatar"),
  UserController.uploadAvatar
);
router.get("/avatars", UserController.getAvatar);

export default router;
