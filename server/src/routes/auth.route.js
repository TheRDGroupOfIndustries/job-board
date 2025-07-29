import { Router } from "express";
import { registerUser, loginUser, sendOtp, loginWithOtp, getCurrentUser, getAllUsers, changePassword, updateAuthProfile, logoutUser} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();


router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/send-otp").post(sendOtp)
router.route("/login-otp").post(loginWithOtp)
router.route("/logout").post(authMiddleware, logoutUser)
router.route("/current-user").get(authMiddleware, getCurrentUser)
router.route("/get-allUser").get(authMiddleware, getAllUsers)
router.route("/update-auth-profile").patch(authMiddleware, updateAuthProfile)
router.route("/change-password").put(authMiddleware,changePassword)





export default router;
