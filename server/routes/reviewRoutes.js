import express from "express";
import {
    getProductReviews,
    createReview,
    getReview,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/product/:productId", getProductReviews);
router.get("/:id", getReview);
router.post("/", createReview); // Public for now, can add protect middleware if needed

export default router;

