import Slide from "../models/Slide.js";

// @desc    Create a new slide
// @route   POST /api/slides
// @access  Private/Admin
export const createSlide = async (req, res) => {
    try {
        const { title, image, alt, link, order, isActive, responsiveSettings } = req.body;

        const slideData = {
            title: title || "",
            image,
            alt: alt || "",
            link: link || "",
            order: order || 0,
            isActive: isActive !== undefined ? isActive : true,
            responsiveSettings: responsiveSettings || {
                mobile: { height: "250px", padding: "0" },
                tablet: { height: "400px", padding: "16px" },
                desktop: { height: "700px", padding: "16px" },
            },
        };

        const slide = await Slide.create(slideData);

        res.status(201).json({
            success: true,
            message: "Slide created successfully",
            slide,
        });
    } catch (error) {
        console.error("Error creating slide:", error);

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
            message: "Error creating slide",
            error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
        });
    }
};

// @desc    Get all slides
// @route   GET /api/slides
// @access  Public
export const getSlides = async (req, res) => {
    try {
        const { activeOnly } = req.query;

        const query = {};
        if (activeOnly === "true") {
            query.isActive = true;
        }

        const slides = await Slide.find(query).sort({ order: 1, createdAt: -1 });

        res.status(200).json({
            success: true,
            count: slides.length,
            slides,
        });
    } catch (error) {
        console.error("Error fetching slides:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching slides",
            error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
        });
    }
};

// @desc    Get single slide
// @route   GET /api/slides/:id
// @access  Public
export const getSlide = async (req, res) => {
    try {
        const slide = await Slide.findById(req.params.id);

        if (!slide) {
            return res.status(404).json({
                success: false,
                message: "Slide not found",
            });
        }

        res.status(200).json({
            success: true,
            slide,
        });
    } catch (error) {
        console.error("Error fetching slide:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching slide",
            error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
        });
    }
};

// @desc    Update slide
// @route   PUT /api/slides/:id
// @access  Private/Admin
export const updateSlide = async (req, res) => {
    try {
        const slide = await Slide.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!slide) {
            return res.status(404).json({
                success: false,
                message: "Slide not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Slide updated successfully",
            slide,
        });
    } catch (error) {
        console.error("Error updating slide:", error);

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
            message: "Error updating slide",
            error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
        });
    }
};

// @desc    Delete slide
// @route   DELETE /api/slides/:id
// @access  Private/Admin
export const deleteSlide = async (req, res) => {
    try {
        const slide = await Slide.findByIdAndDelete(req.params.id);

        if (!slide) {
            return res.status(404).json({
                success: false,
                message: "Slide not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Slide deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting slide:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting slide",
            error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
        });
    }
};

