import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Save,
    X,
    Upload,
    AlertCircle,
    Loader,
    Monitor,
    Tablet,
    Smartphone,
} from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

const CreateSlide = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { success, error } = useToast();
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!!id);
    const [errors, setErrors] = useState({});
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    const [formData, setFormData] = useState({
        title: "",
        image: null,
        alt: "",
        link: "",
        order: 0,
        isActive: true,
        responsiveSettings: {
            mobile: {
                height: "250px",
                padding: "0",
            },
            tablet: {
                height: "400px",
                padding: "16px",
            },
            desktop: {
                height: "700px",
                padding: "16px",
            },
        },
    });

    useEffect(() => {
        if (id) {
            fetchSlide();
        }
    }, [id]);

    const fetchSlide = async () => {
        try {
            setFetching(true);
            const response = await fetch(`${API_URL}/api/slides/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                const slide = data.slide;
                setFormData({
                    title: slide.title || "",
                    image: slide.image || null,
                    alt: slide.alt || "",
                    link: slide.link || "",
                    order: slide.order || 0,
                    isActive: slide.isActive !== false,
                    responsiveSettings: slide.responsiveSettings || {
                        mobile: { height: "250px", padding: "0" },
                        tablet: { height: "400px", padding: "16px" },
                        desktop: { height: "700px", padding: "16px" },
                    },
                });
            } else {
                error("Failed to load slide");
                navigate("/admin/slides");
            }
        } catch (err) {
            console.error("Error fetching slide:", err);
            error("Error loading slide");
            navigate("/admin/slides");
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleResponsiveChange = (device, field, value) => {
        setFormData((prev) => ({
            ...prev,
            responsiveSettings: {
                ...prev.responsiveSettings,
                [device]: {
                    ...prev.responsiveSettings[device],
                    [field]: value,
                },
            },
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 15 * 1024 * 1024) {
                setErrors((prev) => ({
                    ...prev,
                    image: "Image size should be less than 15MB",
                }));
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({
                    ...prev,
                    image: reader.result,
                }));
                setErrors((prev) => ({ ...prev, image: "" }));
            };
            reader.readAsDataURL(file);
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.image) {
            newErrors.image = "Slide image is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setLoading(true);

        try {
            const slideData = {
                title: formData.title.trim(),
                image: formData.image || "",
                alt: formData.alt.trim(),
                link: formData.link.trim(),
                order: parseInt(formData.order) || 0,
                isActive: formData.isActive,
                responsiveSettings: formData.responsiveSettings,
            };

            const url = id ? `${API_URL}/api/slides/${id}` : `${API_URL}/api/slides`;
            const method = id ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(slideData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                success(id ? "Slide updated successfully!" : "Slide created successfully!");
                setTimeout(() => {
                    navigate("/admin/slides");
                }, 1000);
            } else {
                const errorMessage = data.message || data.errors?.join(", ") || `Failed to ${id ? "update" : "create"} slide`;
                error(errorMessage);
                setErrors({ submit: errorMessage });
            }
        } catch (err) {
            console.error(`Error ${id ? "updating" : "creating"} slide:`, err);
            const errorMessage = err.message || "Network error. Please try again.";
            error(errorMessage);
            setErrors({ submit: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader className="h-8 w-8 animate-spin text-[#3B745B] mx-auto mb-4" />
                    <p className="text-gray-600">Loading slide...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#253D4E]">
                        {id ? "Edit Slide" : "Create New Slide"}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {id ? "Update slide details and responsive settings" : "Add a new slide to the home page"}
                    </p>
                </div>
                <button
                    onClick={() => navigate("/admin/slides")}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <X className="h-5 w-5" />
                    Cancel
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {errors.submit && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <span>{errors.submit}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Slide Image */}
                        <div>
                            <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                Slide Image <span className="text-red-500">*</span>
                            </label>
                            {formData.image ? (
                                <div className="space-y-3">
                                    <div className="relative">
                                        <img
                                            src={formData.image}
                                            alt="Slide preview"
                                            className="w-full h-64 border border-gray-300 rounded-lg object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFormData((prev) => ({ ...prev, image: null }))
                                            }
                                            className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors h-64">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="h-12 w-12 text-gray-400 mb-4" />
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 15MB)</p>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                </label>
                            )}
                            {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                Title (Optional)
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B]"
                                placeholder="e.g., Summer Sale 2024"
                            />
                        </div>

                        {/* Alt Text */}
                        <div>
                            <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                Alt Text
                            </label>
                            <input
                                type="text"
                                name="alt"
                                value={formData.alt}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B]"
                                placeholder="Alternative text for image"
                            />
                        </div>

                        {/* Link */}
                        <div>
                            <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                Link URL (Optional)
                            </label>
                            <input
                                type="url"
                                name="link"
                                value={formData.link}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B]"
                                placeholder="https://example.com"
                            />
                        </div>

                        {/* Order */}
                        <div>
                            <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                Display Order
                            </label>
                            <input
                                type="number"
                                name="order"
                                value={formData.order}
                                onChange={handleChange}
                                min="0"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B]"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Lower numbers appear first
                            </p>
                        </div>

                        {/* Active Status */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="w-4 h-4 text-[#3B745B] border-gray-300 rounded focus:ring-[#3B745B]"
                            />
                            <label className="text-sm font-semibold text-[#253D4E]">
                                Active Slide
                            </label>
                        </div>
                    </div>

                    {/* Right Column - Responsive Settings */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-[#253D4E] mb-4">
                                Responsive Settings
                            </h3>
                            <p className="text-sm text-gray-600 mb-6">
                                Configure how the slide appears on different screen sizes
                            </p>

                            {/* Mobile Settings */}
                            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <div className="flex items-center gap-2 mb-4">
                                    <Smartphone className="h-5 w-5 text-[#3B745B]" />
                                    <h4 className="font-semibold text-[#253D4E]">Mobile</h4>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Height
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.responsiveSettings.mobile.height}
                                            onChange={(e) =>
                                                handleResponsiveChange("mobile", "height", e.target.value)
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B]"
                                            placeholder="250px"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Padding
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.responsiveSettings.mobile.padding}
                                            onChange={(e) =>
                                                handleResponsiveChange("mobile", "padding", e.target.value)
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B]"
                                            placeholder="0 or 16px"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Tablet Settings */}
                            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-blue-50">
                                <div className="flex items-center gap-2 mb-4">
                                    <Tablet className="h-5 w-5 text-[#3B745B]" />
                                    <h4 className="font-semibold text-[#253D4E]">Tablet</h4>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Height
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.responsiveSettings.tablet.height}
                                            onChange={(e) =>
                                                handleResponsiveChange("tablet", "height", e.target.value)
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B]"
                                            placeholder="400px"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Padding
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.responsiveSettings.tablet.padding}
                                            onChange={(e) =>
                                                handleResponsiveChange("tablet", "padding", e.target.value)
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B]"
                                            placeholder="16px"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Desktop Settings */}
                            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-green-50">
                                <div className="flex items-center gap-2 mb-4">
                                    <Monitor className="h-5 w-5 text-[#3B745B]" />
                                    <h4 className="font-semibold text-[#253D4E]">Desktop</h4>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Height
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.responsiveSettings.desktop.height}
                                            onChange={(e) =>
                                                handleResponsiveChange("desktop", "height", e.target.value)
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B]"
                                            placeholder="700px"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Padding
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.responsiveSettings.desktop.padding}
                                            onChange={(e) =>
                                                handleResponsiveChange("desktop", "padding", e.target.value)
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B]"
                                            placeholder="16px"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex justify-end gap-4 border-t pt-6">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/slides")}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-[#3B745B] text-white rounded-lg hover:bg-[#2a5542] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader className="h-5 w-5 animate-spin" />
                                {id ? "Updating..." : "Creating..."}
                            </>
                        ) : (
                            <>
                                <Save className="h-5 w-5" />
                                {id ? "Update Slide" : "Create Slide"}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateSlide;

