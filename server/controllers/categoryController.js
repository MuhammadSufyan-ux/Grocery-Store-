import Category from "../models/Category.js";

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res) => {
    try {
        const { name, description, image, parentCategory, order } = req.body;

        // If parentCategory is provided, verify it exists
        if (parentCategory) {
            const parent = await Category.findById(parentCategory);
            if (!parent) {
                return res.status(400).json({
                    success: false,
                    message: "Parent category not found",
                });
            }
            if (parent.parentCategory) {
                return res.status(400).json({
                    success: false,
                    message: "Cannot create sub-category of a sub-category",
                });
            }
        }

        const categoryData = {
            name,
            description: description || "",
            image,
            parentCategory: parentCategory || null,
            order: order || 0,
        };

        const category = await Category.create(categoryData);

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category,
        });
    } catch (error) {
        console.error("Error creating category:", error);

        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Category name already exists",
            });
        }

        // Handle validation errors
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
            message: "Error creating category",
            error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
        });
    }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
    try {
        const { includeSubCategories = "true", parentCategory } = req.query;

        // Build query
        const query = {};
        if (parentCategory === "null" || parentCategory === null) {
            query.parentCategory = null;
        } else if (parentCategory) {
            query.parentCategory = parentCategory;
        } else if (includeSubCategories === "false") {
            query.parentCategory = null;
        }

        const categories = await Category.find(query)
            .populate("parentCategory", "name slug")
            .sort({ order: 1, createdAt: -1 });

        res.status(200).json({
            success: true,
            count: categories.length,
            categories,
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching categories",
            error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
        });
    }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
export const getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id).populate("parentCategory", "name slug");

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        res.status(200).json({
            success: true,
            category,
        });
    } catch (error) {
        console.error("Error fetching category:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching category",
            error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
        });
    }
};

// @desc    Get sub-categories of a category
// @route   GET /api/categories/:id/subcategories
// @access  Public
export const getSubCategories = async (req, res) => {
    try {
        const subCategories = await Category.find({ parentCategory: req.params.id }).sort({
            order: 1,
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            count: subCategories.length,
            subCategories,
        });
    } catch (error) {
        console.error("Error fetching sub-categories:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching sub-categories",
            error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
        });
    }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res) => {
    try {
        const { parentCategory } = req.body;

        // If parentCategory is being set, verify it exists
        if (parentCategory) {
            const parent = await Category.findById(parentCategory);
            if (!parent) {
                return res.status(400).json({
                    success: false,
                    message: "Parent category not found",
                });
            }
        }

        const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).populate("parentCategory", "name slug");

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category,
        });
    } catch (error) {
        console.error("Error updating category:", error);

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Category name already exists",
            });
        }

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
            message: "Error updating category",
            error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
        });
    }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res) => {
    try {
        // Check if category has sub-categories
        const subCategories = await Category.find({ parentCategory: req.params.id });
        if (subCategories.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete category with sub-categories. Please delete sub-categories first.",
            });
        }

        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting category",
            error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
        });
    }
};

