import Review from "../models/Review.js";
import Product from "../models/Product.js";

// @desc    Get all reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const { limit = 50, page = 1 } = req.query;

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get approved reviews
        const reviews = await Review.find({
            product: productId,
            isApproved: true,
        })
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(skip)
            .populate("user", "name email")
            .select("-__v");

        const total = await Review.countDocuments({
            product: productId,
            isApproved: true,
        });

        res.status(200).json({
            success: true,
            count: reviews.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            reviews,
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching reviews",
            error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
        });
    }
};

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Public (can be changed to Private if you want authenticated reviews only)
export const createReview = async (req, res) => {
    try {
        const { product, name, email, rating, title, comment, user } = req.body;

        // Check if product exists
        const productExists = await Product.findById(product);
        if (!productExists) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // Create review
        const review = await Review.create({
            product,
            user: user || undefined,
            name,
            email: email || undefined,
            rating,
            title,
            comment,
        });

        // Calculate average rating and update product
        const reviews = await Review.find({
            product,
            isApproved: true,
        });
        const averageRating =
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        const reviewsCount = reviews.length;

        await Product.findByIdAndUpdate(product, {
            rating: averageRating.toFixed(1),
            reviewsCount,
        });

        res.status(201).json({
            success: true,
            message: "Review submitted successfully",
            review,
        });
    } catch (error) {
        console.error("Error creating review:", error);
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors,
            });
        }
        res.status(500).json({
            success: false,
            message: "Error creating review",
            error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
        });
    }
};

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
export const getReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id)
            .populate("product", "name")
            .populate("user", "name email");

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found",
            });
        }

        res.status(200).json({
            success: true,
            review,
        });
    } catch (error) {
        console.error("Error fetching review:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching review",
            error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
        });
    }
};

