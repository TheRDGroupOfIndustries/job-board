import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createCompanyProfile, updateCompanyProfile, deleteCompanyProfile, getCompanyProfile } from "../controllers/companyProfile.controller.js";

const router = Router();

router.route("/company-profile")
  .post(authMiddleware, createCompanyProfile)
  .patch(authMiddleware, updateCompanyProfile)
  .delete(authMiddleware, deleteCompanyProfile)
  .get(authMiddleware, getCompanyProfile);


export default router;