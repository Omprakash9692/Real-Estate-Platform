import express from "express";
const router = express.Router();
import * as reviewController from "../controllers/review.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

router.post("/", protect, reviewController.addReview);
router.get("/:sellerId", reviewController.getSellerReviews);

export default router;
