import {Router} from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createAdminProfile, deleteAdminProfile, updateAdminProfile } from "../controllers/adminProfile.controller.js";

const router = Router();

router.route("/admin-profile")
.post(authMiddleware,createAdminProfile)
.patch(authMiddleware,updateAdminProfile)
 .delete(authMiddleware,deleteAdminProfile);


export default router;