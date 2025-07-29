import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createUserProfile, updateUserProfile, deleteUserProfile, getUserProfile } from "../controllers/userProfile.controller.js";

const router = Router();

router.route("/create-profile")
  .post(authMiddleware, createUserProfile)
  .get(authMiddleware,getUserProfile)
  .patch(authMiddleware, updateUserProfile)
  .delete(authMiddleware, deleteUserProfile);

export default router;