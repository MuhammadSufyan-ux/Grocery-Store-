import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import { getSettings, updateSettings } from "../controllers/settingsController.js";

const router = express.Router();

// Public route for getting settings (needed for checkout page)
router.get("/", getSettings);

// Protected admin route for updating settings
router.put("/", protect, authorize("admin"), updateSettings);

export default router;

