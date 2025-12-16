import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads/receipts");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Helper function to save receipt file
const saveReceiptFile = async (base64Data, orderNumber) => {
    try {
        // Extract data from base64 string (format: data:image/png;base64,xxxxx)
        const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            throw new Error("Invalid base64 data");
        }

        const mimeType = matches[1];
        const base64String = matches[2];
        
        // Determine file extension
        const extMap = {
            "image/jpeg": "jpg",
            "image/jpg": "jpg",
            "image/png": "png",
            "image/gif": "gif",
            "application/pdf": "pdf",
        };
        const extension = extMap[mimeType] || "jpg";

        // Generate filename
        const filename = `receipt-${orderNumber}-${Date.now()}.${extension}`;
        const filepath = path.join(uploadsDir, filename);

        // Convert base64 to buffer and save
        const buffer = Buffer.from(base64String, "base64");
        fs.writeFileSync(filepath, buffer);

        // Return relative path for URL
        return `/uploads/receipts/${filename}`;
    } catch (error) {
        console.error("Error saving receipt file:", error);
        throw error;
    }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (users and guests can create orders)
export const createOrder = async (req, res) => {
    try {
        const {
            customerInfo,
            billingAddress,
            shippingAddress,
            items,
            subtotal,
            shippingCost = 0,
            discount = 0,
            total,
            paymentMethod,
            couponCode,
            receiptFile, // Base64 encoded file or file data
        } = req.body;

        // Validation
        if (!customerInfo || !billingAddress || !shippingAddress || !items || !paymentMethod) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Order must contain at least one item",
            });
        }

        // Validate payment method
        if (paymentMethod === "bankTransfer" && !receiptFile) {
            return res.status(400).json({
                success: false,
                message: "Payment receipt is required for bank transfer",
            });
        }

        // Generate order number before creating order (for receipt filename if needed)
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000);
        const orderNumber = `ORD-${timestamp}-${random}`;

        // Handle receipt file upload if bank transfer
        let receiptUrl = null;
        if (paymentMethod === "bankTransfer" && receiptFile) {
            try {
                // If receiptFile is already a URL (from previous upload), use it
                if (typeof receiptFile === "string" && receiptFile.startsWith("/uploads/")) {
                    receiptUrl = receiptFile;
                } else if (typeof receiptFile === "object" && receiptFile.data) {
                    // Handle base64 file
                    receiptUrl = await saveReceiptFile(receiptFile.data, orderNumber);
                } else if (typeof receiptFile === "string" && receiptFile.includes("base64")) {
                    // Direct base64 string
                    receiptUrl = await saveReceiptFile(receiptFile, orderNumber);
                }
            } catch (error) {
                console.error("Error processing receipt:", error);
                return res.status(400).json({
                    success: false,
                    message: "Error processing payment receipt",
                });
            }
        }

        // Determine payment status
        let paymentStatus = "pending";
        if (paymentMethod === "cod") {
            paymentStatus = "pending"; // COD is paid on delivery
        } else if (paymentMethod === "bankTransfer" && receiptUrl) {
            paymentStatus = "pending"; // Bank transfer pending verification
        }

        // Create order with orderNumber
        const order = await Order.create({
            orderNumber, // Set orderNumber explicitly
            user: req.user?._id || null, // null for guest orders
            customerInfo,
            billingAddress,
            shippingAddress,
            items,
            subtotal,
            shippingCost,
            discount,
            total,
            paymentMethod,
            paymentStatus,
            receiptUrl,
            couponCode: couponCode || null,
        });

        // Clear user's cart if logged in
        if (req.user?._id) {
            await Cart.findOneAndUpdate(
                { user: req.user._id },
                { items: [] },
                { new: true }
            );
        }

        // Populate product details for response
        const populatedOrder = await Order.findById(order._id)
            .populate("items.product", "name image")
            .populate("user", "name email");

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order: populatedOrder,
        });
    } catch (error) {
        console.error("Create order error:", error);
        res.status(500).json({
            success: false,
            message: "Server error creating order",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};

// @desc    Get all orders (for admin) or user's orders
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req, res) => {
    try {
        let query = {};
        
        // If not admin, only show user's orders
        if (req.user.role !== "admin") {
            query.user = req.user._id;
        }

        const orders = await Order.find(query)
            .populate("items.product", "name image")
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        });
    } catch (error) {
        console.error("Get orders error:", error);
        res.status(500).json({
            success: false,
            message: "Server error fetching orders",
        });
    }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("items.product", "name image description")
            .populate("user", "name email");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        // Check if user has access to this order
        if (req.user.role !== "admin" && order.user?.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to access this order",
            });
        }

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error("Get order error:", error);
        res.status(500).json({
            success: false,
            message: "Server error fetching order",
        });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
    try {
        const { status, paymentStatus } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        if (status) {
            order.status = status;
        }
        if (paymentStatus) {
            order.paymentStatus = paymentStatus;
        }

        await order.save();

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order,
        });
    } catch (error) {
        console.error("Update order status error:", error);
        res.status(500).json({
            success: false,
            message: "Server error updating order status",
        });
    }
};
