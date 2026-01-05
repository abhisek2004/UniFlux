import express from "express";
import { authUser, registerUser, getUserProfile, updateUserProfile, superAdminLogin } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/login").post(authUser);
router.route("/register").post(registerUser);
router.route("/superadmin-login").post(superAdminLogin);
router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile);

export default router;