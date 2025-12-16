import express from "express";
import {
    createSlide,
    getSlides,
    getSlide,
    updateSlide,
    deleteSlide,
} from "../controllers/slideController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getSlides);
router.get("/:id", getSlide);
router.post("/", protect, authorize("admin"), createSlide);
router.put("/:id", protect, authorize("admin"), updateSlide);
router.delete("/:id", protect, authorize("admin"), deleteSlide);

export default router;

