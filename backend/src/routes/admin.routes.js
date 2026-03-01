import express from "express";
const router = express.Router();
import {
    getAllUsers,
    blockUser,
    deleteUser,
    getAllProperties,
    deleteProperty,
    getAllInquiries,
    getDashboardStats,
} from "../controllers/admin.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";

router.use(protect, authorize("admin"));

router.get("/users", getAllUsers);
router.patch("/users/:id/block", blockUser);
router.delete("/users/:id", deleteUser);
router.get("/properties", getAllProperties);
router.delete("/properties/:id", deleteProperty);
router.get("/inquiries", getAllInquiries);
router.get("/stats", getDashboardStats);

export default router;
