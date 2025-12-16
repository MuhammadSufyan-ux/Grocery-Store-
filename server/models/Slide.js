import mongoose from "mongoose";

const slideSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
        },
        image: {
            type: String,
            required: [true, "Slide image is required"],
        },
        alt: {
            type: String,
            default: "",
        },
        link: {
            type: String,
            default: "",
        },
        order: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        // Responsive height settings
        responsiveSettings: {
            mobile: {
                height: {
                    type: String,
                    default: "250px",
                },
                padding: {
                    type: String,
                    default: "0",
                },
            },
            tablet: {
                height: {
                    type: String,
                    default: "400px",
                },
                padding: {
                    type: String,
                    default: "16px",
                },
            },
            desktop: {
                height: {
                    type: String,
                    default: "700px",
                },
                padding: {
                    type: String,
                    default: "16px",
                },
            },
        },
    },
    {
        timestamps: true,
    }
);

// Index for sorting
slideSchema.index({ order: 1, createdAt: -1 });

export default mongoose.model("Slide", slideSchema);

