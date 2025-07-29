import { Router } from "express";
import { applyToJob, getUserApplications, getCompanyApplications, updateApplicationStatus } from "../controllers/jobApplication.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/apply").post(authMiddleware, applyToJob);
router.route("/my-applications").get(authMiddleware, getUserApplications);
router.route("/company-applications").get(authMiddleware, getCompanyApplications);
router.route("/update-status").post(authMiddleware, updateApplicationStatus);

export default router;