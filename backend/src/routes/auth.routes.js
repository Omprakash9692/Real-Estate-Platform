import express from "express";
const router = express.Router();
import {
    register,
    login,
    logout,
    getMe,
    verifyEmail,
    forgotPassword,
    resetPassword,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
