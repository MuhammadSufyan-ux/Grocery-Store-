import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "Product is required"],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false, // Allow anonymous reviews
        },
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: false,
            trim: true,
            lowercase: true,
        },
        rating: {
            type: Number,
            required: [true, "Rating is required"],
            min: 1,
            max: 5,
        },
        title: {
            type: String,
            required: [true, "Review title is required"],
            trim: true,
        },
        comment: {
            type: String,
            required: [true, "Review comment is required"],
            trim: true,
        },
        isApproved: {
            type: Boolean,
            default: true, // Auto-approve reviews, can be changed to false for moderation
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
reviewSchema.index({ product: 1, isApproved: 1 });
reviewSchema.index({ createdAt: -1 });

const Review = mongoose.model("Review", reviewSchema);

export default Review;

