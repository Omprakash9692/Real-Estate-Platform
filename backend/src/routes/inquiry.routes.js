import express from "express";
const router = express.Router();
import {
    sendInquiry,
    getSellerInquiries,
    getBuyerInquiries,
    markAsRead,
} from "../controllers/inquiry.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";

router.post("/", protect, authorize("buyer"), sendInquiry);
router.get("/seller", protect, authorize("seller"), getSellerInquiries);
router.get("/buyer", protect, authorize("buyer"), getBuyerInquiries);
router.patch("/:id/read", protect, markAsRead);

export default router;