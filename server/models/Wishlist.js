import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
wishlistSchema.index({ user: 1 });

// Prevent duplicate products in wishlist
wishlistSchema.index({ user: 1, products: 1 }, { unique: false });

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

export default Wishlist;

