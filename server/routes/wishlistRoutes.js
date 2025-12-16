import express from "express";
import { protect } from "../middleware/auth.js";
import {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
} from "../controllers/wishlistController.js";

const router = express.Router();

router.use(protect); // All routes require authentication

router.get("/", getWishlist);
router.post("/:productId", addToWishlist);
router.delete("/:productId", removeFromWishlist);
router.delete("/", clearWishlist);

export default router;

