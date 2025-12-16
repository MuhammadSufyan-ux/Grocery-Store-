import mongoose from "mongoose";
import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user.id }).populate("products");

        if (!wishlist) {
            // Create empty wishlist if doesn't exist
            wishlist = await Wishlist.create({ user: req.user.id, products: [] });
        }

        // Format wishlist items for frontend
        const formattedProducts = wishlist.products.map((product) => {
            const price = product.salePrice || product.regularPrice;
            return {
                id: product._id.toString(),
                _id: product._id.toString(),
                name: product.name,
                image: product.image,
                price: `£${price.toFixed(2)}`,
                oldPrice: product.salePrice && product.regularPrice > product.salePrice
                    ? `£${product.regularPrice.toFixed(2)}`
                    : null,
                category: product.category,
                rating: product.rating || 0,
                reviewsCount: product.reviewsCount || 0,
            };
        });

        res.status(200).json({
            success: true,
            wishlist: formattedProducts,
        });
    } catch (error) {
        console.error("Get wishlist error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

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

        let wishlist = await Wishlist.findOne({ user: req.user.id });

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: req.user.id, products: [] });
        }

        // Check if product already in wishlist
        if (wishlist.products.includes(productId)) {
            return res.status(400).json({
                success: false,
                message: "Product already in wishlist",
            });
        }

        // Ensure productId is not already in the array (convert to string for comparison)
        const productIdStr = productId.toString();
        if (!wishlist.products.some(id => id.toString() === productIdStr)) {
            wishlist.products.push(productId);
            await wishlist.save();
        }
        await wishlist.populate("products");

        const formattedProducts = wishlist.products.map((product) => {
            const price = product.salePrice || product.regularPrice;
            return {
                id: product._id.toString(),
                _id: product._id.toString(),
                name: product.name,
                image: product.image,
                price: `£${price.toFixed(2)}`,
                oldPrice: product.salePrice && product.regularPrice > product.salePrice
                    ? `£${product.regularPrice.toFixed(2)}`
                    : null,
                category: product.category,
                rating: product.rating || 0,
                reviewsCount: product.reviewsCount || 0,
            };
        });

        res.status(200).json({
            success: true,
            wishlist: formattedProducts,
            message: "Product added to wishlist",
        });
    } catch (error) {
        console.error("Add to wishlist error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID format",
            });
        }

        const wishlist = await Wishlist.findOne({ user: req.user.id });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Wishlist not found",
            });
        }

        wishlist.products = wishlist.products.filter(
            (id) => id.toString() !== productId
        );

        await wishlist.save();
        await wishlist.populate("products");

        const formattedProducts = wishlist.products.map((product) => {
            const price = product.salePrice || product.regularPrice;
            return {
                id: product._id.toString(),
                _id: product._id.toString(),
                name: product.name,
                image: product.image,
                price: `£${price.toFixed(2)}`,
                oldPrice: product.salePrice && product.regularPrice > product.salePrice
                    ? `£${product.regularPrice.toFixed(2)}`
                    : null,
                category: product.category,
                rating: product.rating || 0,
                reviewsCount: product.reviewsCount || 0,
            };
        });

        res.status(200).json({
            success: true,
            wishlist: formattedProducts,
        });
    } catch (error) {
        console.error("Remove from wishlist error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// @desc    Clear wishlist
// @route   DELETE /api/wishlist
// @access  Private
export const clearWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user.id });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Wishlist not found",
            });
        }

        wishlist.products = [];
        await wishlist.save();

        res.status(200).json({
            success: true,
            wishlist: [],
            message: "Wishlist cleared",
        });
    } catch (error) {
        console.error("Clear wishlist error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

