import express from "express";
import {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, authorize } from "../middleware/auth.js";
import { optionalAuth } from "../middleware/optionalAuth.js";

const router = express.Router();

// Public route for creating orders (guests can place orders)
// optionalAuth allows both authenticated and unauthenticated requests
router.post("/", optionalAuth, createOrder);

// Protected routes
router.get("/", protect, getOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, authorize("admin"), updateOrderStatus);

export default router;
