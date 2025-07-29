import { Router } from "express";
import { deleteJob, getAllPostedJobs, getCompanyPostedJobs, postJobs, updateJob } from "../controllers/postJobs.controllers.js";
import {authMiddleware} from "../middlewares/auth.middleware.js";


const router=Router();

router.route("/postJob").post(authMiddleware, postJobs);
router.route("/getAllJobs").get( getAllPostedJobs);
router.route("/getAllJob").get(authMiddleware, getCompanyPostedJobs);
router.route("/updateJob/:id").put(authMiddleware, updateJob);
router.route("/JobDelete/:id").delete(authMiddleware,deleteJob);

export default router;