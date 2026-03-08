import express from "express";
import { createContact, getAllContacts, replyToContact } from "../controllers/contact.controller.js";

import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", createContact);
router.get("/", protect, authorize('admin'), getAllContacts);
router.post("/reply", protect, authorize('admin'), replyToContact);

export default router;