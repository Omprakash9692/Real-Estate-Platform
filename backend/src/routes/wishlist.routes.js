import express from "express";
const router = express.Router();
import {
  addWishlist,
  getWishlist,
  removeWishlist,
} from "../controllers/wishlist.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

router.post("/:propertyId", protect, addWishlist);
router.get("/", protect, getWishlist);
router.delete("/:propertyId", protect, removeWishlist);

export default router;