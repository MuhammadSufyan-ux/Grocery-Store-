import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

        if (!cart) {
            // Create empty cart if doesn't exist
            cart = await Cart.create({ user: req.user.id, items: [] });
        }

        // Format cart items for frontend
        const formattedItems = cart.items.map((item) => {
            const product = item.product;
            return {
                id: product._id.toString(),
                _id: product._id.toString(),
                name: product.name,
                image: product.image,
                price: `£${item.price.toFixed(2)}`,
                quantity: item.quantity,
                weight: item.weight || product.size ? `${product.size.value}${product.size.unit}` : null,
                category: product.category,
            };
        });

        res.status(200).json({
            success: true,
            cart: formattedItems,
        });
    } catch (error) {
        console.error("Get cart error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1, weight, price } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        }

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID format",
            });
        }

        // Verify product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = await Cart.create({ user: req.user.id, items: [] });
        }

        // Parse price from string if needed (e.g., "£10.99" -> 10.99)
        const itemPrice = typeof price === "string" 
            ? parseFloat(price.replace("£", "").replace(",", ""))
            : price || product.salePrice || product.regularPrice;

        // Check if item already exists with same weight
        const existingItemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId && item.weight === weight
        );

        if (existingItemIndex !== -1) {
            // Update quantity
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            cart.items.push({
                product: productId,
                quantity,
                weight: weight || null,
                price: itemPrice,
            });
        }

        await cart.save();

        // Populate and return updated cart
        await cart.populate("items.product");

        const formattedItems = cart.items.map((item) => {
            const product = item.product;
            return {
                id: product._id.toString(),
                _id: product._id.toString(),
                name: product.name,
                image: product.image,
                price: `£${item.price.toFixed(2)}`,
                quantity: item.quantity,
                weight: item.weight || product.size ? `${product.size.value}${product.size.unit}` : null,
                category: product.category,
            };
        });

        res.status(200).json({
            success: true,
            cart: formattedItems,
            message: "Item added to cart",
        });
    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
export const updateCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity, weight } = req.body;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID format",
            });
        }

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1",
            });
        }

        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId && item.weight === weight
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart",
            });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();

        await cart.populate("items.product");

        const formattedItems = cart.items.map((item) => {
            const product = item.product;
            return {
                id: product._id.toString(),
                _id: product._id.toString(),
                name: product.name,
                image: product.image,
                price: `£${item.price.toFixed(2)}`,
                quantity: item.quantity,
                weight: item.weight || product.size ? `${product.size.value}${product.size.unit}` : null,
                category: product.category,
            };
        });

        res.status(200).json({
            success: true,
            cart: formattedItems,
        });
    } catch (error) {
        console.error("Update cart item error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const { weight } = req.query;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID format",
            });
        }

        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        cart.items = cart.items.filter(
            (item) => !(item.product.toString() === productId && item.weight === weight)
        );

        await cart.save();
        await cart.populate("items.product");

        const formattedItems = cart.items.map((item) => {
            const product = item.product;
            return {
                id: product._id.toString(),
                _id: product._id.toString(),
                name: product.name,
                image: product.image,
                price: `£${item.price.toFixed(2)}`,
                quantity: item.quantity,
                weight: item.weight || product.size ? `${product.size.value}${product.size.unit}` : null,
                category: product.category,
            };
        });

        res.status(200).json({
            success: true,
            cart: formattedItems,
        });
    } catch (error) {
        console.error("Remove from cart error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        cart.items = [];
        await cart.save();

        res.status(200).json({
            success: true,
            cart: [],
            message: "Cart cleared",
        });
    } catch (error) {
        console.error("Clear cart error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

