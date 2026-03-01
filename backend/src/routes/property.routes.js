import express from "express";
const router = express.Router();
import upload from "../middlewares/upload.middleware.js";
import {
  addProperty,
  getMyProperties,
  updateProperty,
  deleteProperty,
  updatePropertyStatus,
  getPropertyDetails,
  getSellerDashboard,
  getAllProperties,
} from "../controllers/property.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";

// PUBLIC ROUTE
router.get("/", getAllProperties);

// Only Seller can add property
router.post("/", protect, authorize("seller"), upload.array("images", 10), addProperty);
router.get("/my", protect, authorize("seller"), getMyProperties);
router.put("/:id", protect, authorize("seller"), upload.array("images", 10), updateProperty);
router.delete("/:id", protect, authorize("seller"), deleteProperty);
router.patch("/:id/status", protect, authorize("seller"), updatePropertyStatus);
router.get("/:id", getPropertyDetails);
router.get("/seller/dashboard", protect, authorize("seller"), getSellerDashboard);

export default router;