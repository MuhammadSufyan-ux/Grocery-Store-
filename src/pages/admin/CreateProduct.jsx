import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Save,
    X,
    Upload,
    Plus,
    Trash2,
    Image as ImageIcon,
    AlertCircle,
    Loader,
} from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

const CreateProduct = () => {
    const navigate = useNavigate();
    const { success, error } = useToast();
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fetchingCategories, setFetchingCategories] = useState(true);
    const [errors, setErrors] = useState({});
    const [categories, setCategories] = useState([]);
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        salePrice: "",
        regularPrice: "",
        image: null,
        gallery: [],
        description: "",
        about: "",
        sizeValue: "",
        sizeUnit: "kg",
        sizes: [],
        trackQuantity: false,
        quantity: "",
        inStock: true,
        lowStockThreshold: 10,
        isDeliveryFree: false,
        status: "active",
        tags: "",
        featured: false,
    });

    // Fetch categories from API
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setFetchingCategories(true);
            const response = await fetch(`${API_URL}/api/categories?includeSubCategories=true`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Sort categories: main categories first, then sub-categories grouped by parent
                const mainCategories = data.categories.filter((cat) => !cat.parentCategory);
                const subCategories = data.categories.filter((cat) => cat.parentCategory);

                // Group sub-categories by parent
                const groupedSubs = {};
                subCategories.forEach((sub) => {
                    const parentId = sub.parentCategory._id || sub.parentCategory;
                    if (!groupedSubs[parentId]) {
                        groupedSubs[parentId] = [];
                    }
                    groupedSubs[parentId].push(sub);
                });

                // Combine: main category followed by its sub-categories
                const sortedCategories = [];
                mainCategories.forEach((main) => {
                    sortedCategories.push(main);
                    const parentId = main._id.toString();
                    if (groupedSubs[parentId]) {
                        sortedCategories.push(...groupedSubs[parentId]);
                    }
                });

                setCategories(sortedCategories);
            }
        } catch (err) {
            console.error("Error fetching categories:", err);
        } finally {
            setFetchingCategories(false);
        }
    };

    const sizeUnits = ["kg", "g", "gms", "oz", "lb", "ml", "l", "piece", "pack"];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrors((prev) => ({
                    ...prev,
                    image: "Image size should be less than 5MB",
                }));
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({
                    ...prev,
                    image: reader.result, // Base64 string for now
                }));
                setErrors((prev) => ({ ...prev, image: "" }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGalleryUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + formData.gallery.length > 5) {
            setErrors((prev) => ({
                ...prev,
                gallery: "Maximum 5 gallery images allowed",
            }));
            return;
        }

        files.forEach((file) => {
            if (file.size > 5 * 1024 * 1024) {
                setErrors((prev) => ({
                    ...prev,
                    gallery: "Image size should be less than 5MB",
                }));
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({
                    ...prev,
                    gallery: [...prev.gallery, reader.result],
                }));
            };
            reader.readAsDataURL(file);
        });
    };

    const removeGalleryImage = (index) => {
        setFormData((prev) => ({
            ...prev,
            gallery: prev.gallery.filter((_, i) => i !== index),
        }));
    };

    const addSizeOption = () => {
        if (!formData.sizeValue || !formData.sizeUnit) {
            setErrors((prev) => ({
                ...prev,
                sizes: "Please fill size value and unit",
            }));
            return;
        }

        const newSize = {
            value: parseFloat(formData.sizeValue),
            unit: formData.sizeUnit,
            price: formData.salePrice || 0,
        };

        setFormData((prev) => ({
            ...prev,
            sizes: [...prev.sizes, newSize],
            sizeValue: "",
            sizeUnit: "kg",
        }));
        setErrors((prev) => ({ ...prev, sizes: "" }));
    };

    const removeSizeOption = (index) => {
        setFormData((prev) => ({
            ...prev,
            sizes: prev.sizes.filter((_, i) => i !== index),
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = "Product name is required";
        if (!formData.category) newErrors.category = "Category is required";
        if (!formData.salePrice || formData.salePrice <= 0)
            newErrors.salePrice = "Valid sale price is required";
        if (!formData.regularPrice || formData.regularPrice <= 0)
            newErrors.regularPrice = "Valid regular price is required";
        if (!formData.image) newErrors.image = "Product image is required";
        if (!formData.description.trim())
            newErrors.description = "Description is required";
        // Size validation: either default size or at least one size option required
        if (!formData.sizeValue && formData.sizes.length === 0) {
            newErrors.sizeValue = "Size is required (either add default size or add size options)";
        }
        if (formData.trackQuantity && (!formData.quantity || formData.quantity < 0))
            newErrors.quantity = "Valid quantity is required when tracking";

        if (parseFloat(formData.salePrice) > parseFloat(formData.regularPrice)) {
            newErrors.salePrice = "Sale price cannot be greater than regular price";
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
            // Prepare data for API
            const productData = {
                name: formData.name.trim(),
                category: formData.category,
                salePrice: parseFloat(formData.salePrice),
                regularPrice: parseFloat(formData.regularPrice),
                image: formData.image,
                gallery: formData.gallery,
                description: formData.description.trim(),
                about: formData.about.trim(),
                size: formData.sizeValue
                    ? {
                          value: parseFloat(formData.sizeValue),
                          unit: formData.sizeUnit,
                      }
                    : formData.sizes.length > 0
                      ? {
                            value: formData.sizes[0].value,
                            unit: formData.sizes[0].unit,
                        }
                      : { value: 1, unit: "kg" },
                sizes: formData.sizes,
                stock: {
                    trackQuantity: formData.trackQuantity,
                    quantity: formData.trackQuantity ? parseFloat(formData.quantity) : 0,
                    inStock: formData.inStock,
                    lowStockThreshold: parseFloat(formData.lowStockThreshold),
                },
                isDeliveryFree: formData.isDeliveryFree,
                status: formData.status,
                tags: formData.tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter((tag) => tag),
                featured: formData.featured,
            };

            // API call
            const response = await fetch(`${API_URL}/api/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(productData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                success("Product created successfully!");
                // Navigate back to products list after a short delay
                setTimeout(() => {
                    navigate("/admin/products");
                }, 1000);
            } else {
                const errorMessage = data.message || data.errors?.join(", ") || "Failed to create product";
                error(errorMessage);
                setErrors({ submit: errorMessage });
            }
        } catch (err) {
            console.error("Error creating product:", err);
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
                    <h1 className="text-3xl font-bold text-[#253D4E]">Create Product</h1>
                    <p className="text-gray-600 mt-1">Add a new product to your store</p>
                </div>
                <button
                    onClick={() => navigate("/admin/products")}
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
                        {/* Product Name */}
                        <div>
                            <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                Product Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] ${
                                    errors.name ? "border-red-500" : "border-gray-300"
                                }`}
                                placeholder="e.g., Fresh Strawberries"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                            )}
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                disabled={fetchingCategories}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] ${
                                    errors.category ? "border-red-500" : "border-gray-300"
                                } ${fetchingCategories ? "bg-gray-100 cursor-not-allowed" : ""}`}
                            >
                                <option value="">
                                    {fetchingCategories ? "Loading categories..." : "Select Category"}
                                </option>
                                {categories.map((cat) => {
                                    const isSubCategory = cat.parentCategory;
                                    const displayName = isSubCategory
                                        ? `  └ ${cat.name} (${cat.parentCategory?.name || ""})`
                                        : cat.name;
                                    return (
                                        <option key={cat._id || cat.id} value={cat.name}>
                                            {displayName}
                                        </option>
                                    );
                                })}
                            </select>
                            {errors.category && (
                                <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                            )}
                        </div>

                        {/* Prices */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                    Sale Price (£) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="salePrice"
                                    value={formData.salePrice}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] ${
                                        errors.salePrice ? "border-red-500" : "border-gray-300"
                                    }`}
                                    placeholder="0.00"
                                />
                                {errors.salePrice && (
                                    <p className="mt-1 text-sm text-red-500">{errors.salePrice}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                    Regular Price (£) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="regularPrice"
                                    value={formData.regularPrice}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] ${
                                        errors.regularPrice ? "border-red-500" : "border-gray-300"
                                    }`}
                                    placeholder="0.00"
                                />
                                {errors.regularPrice && (
                                    <p className="mt-1 text-sm text-red-500">{errors.regularPrice}</p>
                                )}
                            </div>
                        </div>

                        {/* Size Options */}
                        <div>
                            <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                Default Size
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    name="sizeValue"
                                    value={formData.sizeValue}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0"
                                    className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] ${
                                        errors.sizeValue ? "border-red-500" : "border-gray-300"
                                    }`}
                                    placeholder="Value"
                                />
                                <select
                                    name="sizeUnit"
                                    value={formData.sizeUnit}
                                    onChange={handleChange}
                                    className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B]"
                                >
                                    {sizeUnits.map((unit) => (
                                        <option key={unit} value={unit}>
                                            {unit}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={addSizeOption}
                                    className="px-4 py-2 bg-[#3B745B] text-white rounded-lg hover:bg-[#2a5542] transition-colors"
                                >
                                    <Plus className="h-5 w-5" />
                                </button>
                            </div>
                            {errors.sizeValue && (
                                <p className="mt-1 text-sm text-red-500">{errors.sizeValue}</p>
                            )}

                            {/* Size Options List */}
                            {formData.sizes.length > 0 && (
                                <div className="mt-3 space-y-2">
                                    {formData.sizes.map((size, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                                        >
                                            <span className="text-sm">
                                                {size.value} {size.unit}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => removeSizeOption(index)}
                                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Stock Management */}
                        <div className="border-t pt-6 space-y-4">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="trackQuantity"
                                    checked={formData.trackQuantity}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-[#3B745B] border-gray-300 rounded focus:ring-[#3B745B]"
                                />
                                <label className="text-sm font-semibold text-[#253D4E]">
                                    Track Quantity
                                </label>
                            </div>

                            {formData.trackQuantity ? (
                                <div>
                                    <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                        Quantity <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        min="0"
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] ${
                                            errors.quantity ? "border-red-500" : "border-gray-300"
                                        }`}
                                        placeholder="0"
                                    />
                                    {errors.quantity && (
                                        <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="inStock"
                                        checked={formData.inStock}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-[#3B745B] border-gray-300 rounded focus:ring-[#3B745B]"
                                    />
                                    <label className="text-sm font-semibold text-[#253D4E]">
                                        In Stock
                                    </label>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                    Low Stock Threshold
                                </label>
                                <input
                                    type="number"
                                    name="lowStockThreshold"
                                    value={formData.lowStockThreshold}
                                    onChange={handleChange}
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B]"
                                />
                            </div>
                        </div>

                        {/* Additional Options */}
                        <div className="border-t pt-6 space-y-4">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="isDeliveryFree"
                                    checked={formData.isDeliveryFree}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-[#3B745B] border-gray-300 rounded focus:ring-[#3B745B]"
                                />
                                <label className="text-sm font-semibold text-[#253D4E]">
                                    Free Delivery
                                </label>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={formData.featured}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-[#3B745B] border-gray-300 rounded focus:ring-[#3B745B]"
                                />
                                <label className="text-sm font-semibold text-[#253D4E]">
                                    Featured Product
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B]"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="out_of_stock">Out of Stock</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Product Image */}
                        <div>
                            <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                Product Image <span className="text-red-500">*</span>
                            </label>
                            {formData.image ? (
                                <div className="relative">
                                    <img
                                        src={formData.image}
                                        alt="Product"
                                        className="w-full h-64 object-contain bg-gray-50 border border-gray-300 rounded-lg p-4"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFormData((prev) => ({ ...prev, image: null }))}
                                        className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="h-12 w-12 text-gray-400 mb-4" />
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 5MB)</p>
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

                        {/* Gallery Images */}
                        <div>
                            <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                Gallery Images (Max 5)
                            </label>
                            <div className="grid grid-cols-3 gap-3 mb-3">
                                {formData.gallery.map((img, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={img}
                                            alt={`Gallery ${index + 1}`}
                                            className="w-full h-24 object-cover bg-gray-50 border border-gray-300 rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeGalleryImage(index)}
                                            className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                                {formData.gallery.length < 5 && (
                                    <label className="flex items-center justify-center h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                                        <Plus className="h-6 w-6 text-gray-400" />
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            multiple
                                            onChange={handleGalleryUpload}
                                        />
                                    </label>
                                )}
                            </div>
                            {errors.gallery && (
                                <p className="mt-1 text-sm text-red-500">{errors.gallery}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="6"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] ${
                                    errors.description ? "border-red-500" : "border-gray-300"
                                }`}
                                placeholder="Product description..."
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                            )}
                        </div>

                        {/* About Product */}
                        <div>
                            <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                About This Product
                            </label>
                            <textarea
                                name="about"
                                value={formData.about}
                                onChange={handleChange}
                                rows="6"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B]"
                                placeholder="Detailed information about the product..."
                            />
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                Tags (comma separated)
                            </label>
                            <input
                                type="text"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B]"
                                placeholder="organic, fresh, local"
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex justify-end gap-4 border-t pt-6">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/products")}
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
                                Create Product
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateProduct;

