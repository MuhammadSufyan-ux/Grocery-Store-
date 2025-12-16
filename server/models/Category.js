import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            trim: true,
            unique: true,
        },
        slug: {
            type: String,
            lowercase: true,
        },
        description: {
            type: String,
            default: "",
        },
        image: {
            type: String, // URL or path to image
            required: function() {
                // Required only for main categories (when parentCategory is null)
                return !this.parentCategory;
            },
        },
        parentCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            default: null, // null means it's a main category
        },
        isMainCategory: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0, // For sorting
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        productCount: {
            type: Number,
            default: 0, // Will be updated when products are added/removed
        },
    },
    {
        timestamps: true,
    }
);

// Generate slug from name before saving
categorySchema.pre("save", function (next) {
    if (this.isModified("name")) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    }
    next();
});

// Set isMainCategory based on parentCategory
categorySchema.pre("save", function (next) {
    this.isMainCategory = !this.parentCategory;
    next();
});

// Indexes
categorySchema.index({ slug: 1 }, { unique: true, sparse: true });
categorySchema.index({ parentCategory: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ order: 1 });

const Category = mongoose.model("Category", categorySchema);

export default Category;

