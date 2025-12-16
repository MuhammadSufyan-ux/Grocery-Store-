import express from "express";
import {
    createCategory,
    getCategories,
    getCategory,
    getSubCategories,
    updateCategory,
    deleteCategory,
} from "../controllers/categoryController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getCategories);
router.get("/:id", getCategory);
router.get("/:id/subcategories", getSubCategories);
router.post("/", protect, authorize("admin"), createCategory);
router.put("/:id", protect, authorize("admin"), updateCategory);
router.delete("/:id", protect, authorize("admin"), deleteCategory);

export default router;

