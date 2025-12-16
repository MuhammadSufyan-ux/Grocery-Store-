import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Save,
    X,
    Upload,
    AlertCircle,
    Loader,
    Image as ImageIcon,
    Folder,
    FolderOpen,
} from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

const CreateCategory = () => {
    const navigate = useNavigate();
    const { success, error } = useToast();
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fetchingParents, setFetchingParents] = useState(false);
    const [errors, setErrors] = useState({});
    const [parentCategories, setParentCategories] = useState([]);
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image: null,
        parentCategory: "",
        order: 0,
        isMainCategory: true,
    });

    // Fetch parent categories on mount
    useEffect(() => {
        fetchParentCategories();
    }, []);

    // Update isMainCategory based on parentCategory
    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            isMainCategory: !prev.parentCategory,
        }));
    }, [formData.parentCategory]);

    const fetchParentCategories = async () => {
        try {
            setFetchingParents(true);
            const response = await fetch(`${API_URL}/api/categories?includeSubCategories=false`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setParentCategories(data.categories);
            }
        } catch (err) {
            console.error("Error fetching parent categories:", err);
        } finally {
            setFetchingParents(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size
            if (file.size > 5 * 1024 * 1024) {
                setErrors((prev) => ({
                    ...prev,
                    image: "Image size should be less than 5MB",
                }));
                return;
            }

            // For main categories, check if image is square
            if (!formData.parentCategory) {
                const img = new Image();
                img.onload = () => {
                    const isSquare = Math.abs(img.width - img.height) < 10; // Allow 10px tolerance
                    if (!isSquare) {
                        setErrors((prev) => ({
                            ...prev,
                            image: "Main category image must be square (same width and height)",
                        }));
                        return;
                    }
                    // Image is square, proceed
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setFormData((prev) => ({
                            ...prev,
                            image: reader.result,
                        }));
                        setErrors((prev) => ({ ...prev, image: "" }));
                    };
                    reader.readAsDataURL(file);
                };
                img.onerror = () => {
                    setErrors((prev) => ({
                        ...prev,
                        image: "Invalid image file",
                    }));
                };
                img.src = URL.createObjectURL(file);
            } else {
                // Sub-category - no square requirement
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
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Category name is required";
        }

        // Main category requires image
        if (!formData.parentCategory && !formData.image) {
            newErrors.image = "Main category image is required";
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
            const categoryData = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                image: formData.image || "",
                parentCategory: formData.parentCategory || null,
                order: parseInt(formData.order) || 0,
            };

            const response = await fetch(`${API_URL}/api/categories`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(categoryData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                success("Category created successfully!");
                setTimeout(() => {
                    navigate("/admin/categories");
                }, 1000);
            } else {
                const errorMessage = data.message || data.errors?.join(", ") || "Failed to create category";
                error(errorMessage);
                setErrors({ submit: errorMessage });
            }
        } catch (err) {
            console.error("Error creating category:", err);
            const errorMessage = err.message || "Network error. Please try again.";
            error(errorMessage);
            setErrors({ submit: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#253D4E]">Create Category</h1>
                    <p className="text-gray-600 mt-1">
                        {formData.isMainCategory ? "Add a new main category" : "Add a new sub-category"}
                    </p>
                </div>
                <button
                    onClick={() => navigate("/admin/categories")}
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
                        {/* Category Type Indicator */}
                        <div className={`p-4 rounded-lg border-2 ${formData.isMainCategory ? "border-purple-200 bg-purple-50" : "border-blue-200 bg-blue-50"}`}>
                            <div className="flex items-center gap-3">
                                {formData.isMainCategory ? (
                                    <Folder className="h-6 w-6 text-purple-600" />
                                ) : (
                                    <FolderOpen className="h-6 w-6 text-blue-600" />
                                )}
                                <div>
                                    <p className="font-semibold text-[#253D4E]">
                                        {formData.isMainCategory ? "Main Category" : "Sub-Category"}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {formData.isMainCategory
                                            ? "This will be a top-level category"
                                            : "This will be a sub-category"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Category Name */}
                        <div>
                            <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                Category Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] ${
                                    errors.name ? "border-red-500" : "border-gray-300"
                                }`}
                                placeholder="e.g., Vegetables, Fruits"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                        </div>

                        {/* Parent Category (only show if creating sub-category) */}
                        <div>
                            <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                Parent Category (Optional)
                            </label>
                            <select
                                name="parentCategory"
                                value={formData.parentCategory}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B]"
                            >
                                <option value="">None (Main Category)</option>
                                {fetchingParents ? (
                                    <option disabled>Loading categories...</option>
                                ) : (
                                    parentCategories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </option>
                                    ))
                                )}
                            </select>
                            <p className="mt-1 text-xs text-gray-500">
                                Select a parent category to make this a sub-category
                            </p>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B]"
                                placeholder="Category description..."
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
                                placeholder="0"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Lower numbers appear first in lists
                            </p>
                        </div>
                    </div>

                    {/* Right Column - Image Upload */}
                    <div className="space-y-6">
                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                Category Image{" "}
                                {formData.isMainCategory && <span className="text-red-500">*</span>}
                                {formData.isMainCategory && (
                                    <span className="text-xs text-gray-500 font-normal">
                                        {" "}
                                        (Must be square)
                                    </span>
                                )}
                            </label>
                            {formData.image ? (
                                <div className="space-y-3">
                                    <div className="relative">
                                        <img
                                            src={formData.image}
                                            alt="Category"
                                            className={`w-full border border-gray-300 rounded-lg object-cover ${
                                                formData.isMainCategory ? "aspect-square" : "aspect-video"
                                            }`}
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
                                    {formData.isMainCategory && (
                                        <p className="text-xs text-gray-500">
                                            ✓ Square image detected (required for main categories)
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <label
                                    className={`flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                                        formData.isMainCategory ? "aspect-square" : "h-64"
                                    }`}
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="h-12 w-12 text-gray-400 mb-4" />
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">Click to upload</span> or drag and
                                            drop
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            PNG, JPG, GIF (MAX. 5MB)
                                            {formData.isMainCategory && (
                                                <span className="block text-red-500 mt-1">
                                                    Must be square ratio
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                </label>
                            )}
                            {errors.image && (
                                <p className="mt-1 text-sm text-red-500">{errors.image}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex justify-end gap-4 border-t pt-6">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/categories")}
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
                                Creating...
                            </>
                        ) : (
                            <>
                                <Save className="h-5 w-5" />
                                Create Category
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateCategory;

