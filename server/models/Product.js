import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
        },
        category: {
            type: String,
            required: [true, "Product category is required"],
            trim: true,
        },
        salePrice: {
            type: Number,
            required: [true, "Sale price is required"],
            min: [0, "Sale price must be positive"],
        },
        regularPrice: {
            type: Number,
            required: [true, "Regular price is required"],
            min: [0, "Regular price must be positive"],
        },
        image: {
            type: String, // URL or path to image
            required: [true, "Product image is required"],
        },
        gallery: {
            type: [String], // Array of image URLs
            default: [],
        },
        description: {
            type: String,
            required: [true, "Product description is required"],
        },
        about: {
            type: String, // About this product section
            default: "",
        },
        size: {
            value: {
                type: Number,
                required: true,
            },
            unit: {
                type: String,
                enum: ["kg", "g", "gms", "oz", "lb", "ml", "l", "piece", "pack"],
                required: true,
            },
        },
        sizes: {
            // Multiple size options (e.g., 500g, 1kg, 2kg)
            type: [
                {
                    value: Number,
                    unit: {
                        type: String,
                        enum: ["kg", "g", "gms", "oz", "lb", "ml", "l", "piece", "pack"],
                    },
                    price: Number, // Optional: different price for different sizes
                },
            ],
            default: [],
        },
        stock: {
            trackQuantity: {
                type: Boolean,
                default: false, // If false, just use inStock status
            },
            quantity: {
                type: Number,
                default: 0,
                min: [0, "Quantity cannot be negative"],
            },
            inStock: {
                type: Boolean,
                default: true,
            },
            lowStockThreshold: {
                type: Number,
                default: 10, // Alert when stock goes below this
            },
        },
        isDeliveryFree: {
            type: Boolean,
            default: false,
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        reviewsCount: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ["active", "inactive", "out_of_stock"],
            default: "active",
        },
        tags: {
            type: [String],
            default: [],
        },
        featured: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Index for search
productSchema.index({ name: "text", description: "text", category: "text" });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ featured: 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;

