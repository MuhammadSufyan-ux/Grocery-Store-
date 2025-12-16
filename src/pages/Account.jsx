import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Upload, Save, Loader, User, MapPin, Phone, Mail, Lock, Truck } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { countries } from "../utils/countries";

// Function to get user initials for placeholder
const getUserInitials = (firstName, lastName, name, email) => {
    if (firstName && lastName) {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (name) {
        const parts = name.trim().split(" ");
        if (parts.length >= 2) {
            return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
        }
        return name.charAt(0).toUpperCase();
    }
    if (email) {
        return email.charAt(0).toUpperCase();
    }
    return "U";
};

// Generate placeholder image as SVG data URL
const getPlaceholderImage = (initials) => {
    const svg = `
        <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
            <rect width="128" height="128" fill="#3B745B"/>
            <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">${initials}</text>
        </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
};

function Account() {
    const navigate = useNavigate();
    const { user, isAuthenticated, updateProfile, loading: authLoading } = useAuth();
    const { success, error } = useToast();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("profile"); // 'profile', 'billing', or 'shipping'
    const [sameAsBilling, setSameAsBilling] = useState(false);
    const [sameAsShipping, setSameAsShipping] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        profileImage: null,
        billingAddress: {
            streetAddress: "",
            apartment: "",
            townCity: "",
            state: "",
            zipCode: "",
            country: "",
            phoneNumber: "",
        },
        shippingAddress: {
            streetAddress: "",
            apartment: "",
            townCity: "",
            state: "",
            zipCode: "",
            country: "",
            phoneNumber: "",
        },
    });

    const [imagePreview, setImagePreview] = useState(null);

    // Load user data when component mounts or user changes
    useEffect(() => {
        if (!authLoading && !isAuthenticated()) {
            navigate("/login");
            return;
        }

        if (user) {
            // Split name into firstName and lastName if they don't exist
            const nameParts = user.name ? user.name.split(" ") : [];
            const billingAddr = user.billingAddress || {
                streetAddress: "",
                apartment: "",
                townCity: "",
                state: "",
                zipCode: "",
                country: "",
                phoneNumber: "",
            };
            const shippingAddr = user.shippingAddress || {
                streetAddress: "",
                apartment: "",
                townCity: "",
                state: "",
                zipCode: "",
                country: "",
                phoneNumber: "",
            };
            
            setFormData({
                firstName: user.firstName || (nameParts[0] || ""),
                lastName: user.lastName || (nameParts.slice(1).join(" ") || ""),
                email: user.email || "",
                profileImage: user.profileImage || null,
                billingAddress: billingAddr,
                shippingAddress: shippingAddr,
            });
            
            // Check if shipping address is same as billing
            setSameAsBilling(
                JSON.stringify(billingAddr) === JSON.stringify(shippingAddr) &&
                Object.values(billingAddr).some(val => val !== "")
            );
            // Check if billing address is same as shipping
            setSameAsShipping(
                JSON.stringify(billingAddr) === JSON.stringify(shippingAddr) &&
                Object.values(shippingAddr).some(val => val !== "")
            );
            
            // Set image preview
            if (user.profileImage) {
                setImagePreview(user.profileImage);
            } else {
                const initials = getUserInitials(
                    user.firstName,
                    user.lastName,
                    user.name,
                    user.email
                );
                setImagePreview(getPlaceholderImage(initials));
            }
        }
    }, [user, authLoading, isAuthenticated, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name.startsWith("billingAddress.")) {
            const field = name.split(".")[1];
            setFormData((prev) => {
                const updatedBilling = {
                    ...prev.billingAddress,
                    [field]: value,
                };
                // If same as billing is checked, update shipping too
                if (sameAsBilling) {
                    return {
                        ...prev,
                        billingAddress: updatedBilling,
                        shippingAddress: { ...updatedBilling },
                    };
                }
                return {
                    ...prev,
                    billingAddress: updatedBilling,
                };
            });
        } else if (name.startsWith("shippingAddress.")) {
            const field = name.split(".")[1];
            setFormData((prev) => {
                const updatedShipping = {
                    ...prev.shippingAddress,
                    [field]: value,
                };
                // If same as shipping is checked, update billing too
                if (sameAsShipping) {
                    return {
                        ...prev,
                        shippingAddress: updatedShipping,
                        billingAddress: { ...updatedShipping },
                    };
                }
                return {
                    ...prev,
                    shippingAddress: updatedShipping,
                };
            });
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSameAsBillingChange = (e) => {
        const checked = e.target.checked;
        setSameAsBilling(checked);
        if (checked) {
            setSameAsShipping(false); // Uncheck the other option
        }
        
        if (checked) {
            // Copy billing address to shipping address
            setFormData((prev) => ({
                ...prev,
                shippingAddress: { ...prev.billingAddress },
            }));
        }
    };

    const handleSameAsShippingChange = (e) => {
        const checked = e.target.checked;
        setSameAsShipping(checked);
        if (checked) {
            setSameAsBilling(false); // Uncheck the other option
        }
        
        if (checked) {
            // Copy shipping address to billing address
            setFormData((prev) => ({
                ...prev,
                billingAddress: { ...prev.shippingAddress },
            }));
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                error("Image size should be less than 5MB");
                return;
            }

            // Check file type
            if (!file.type.startsWith("image/")) {
                error("Please select an image file");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({
                    ...prev,
                    profileImage: reader.result, // Base64 string
                }));
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const updateData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                profileImage: formData.profileImage,
                billingAddress: formData.billingAddress,
                shippingAddress: formData.shippingAddress,
            };

            const result = await updateProfile(updateData);

            if (result.success) {
                success("Profile updated successfully!");
            } else {
                error(result.message || "Failed to update profile");
            }
        } catch (err) {
            console.error("Error updating profile:", err);
            error("An error occurred while updating your profile");
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader className="h-8 w-8 animate-spin text-[#3B745B]" />
            </div>
        );
    }

    if (!isAuthenticated()) {
        return null; // Will redirect
    }

    return (
        <div className="w-full bg-gray-50 min-h-screen py-4 sm:py-6 md:py-8 lg:py-12">
            <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-4 md:px-6 lg:px-8">
                {/* Breadcrumb */}
                <div className="mb-4 sm:mb-6 md:mb-8">
                    <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[#7E7E7E]">
                        <Link to="/" className="hover:text-[#3B745B] transition-colors">
                            Home
                        </Link>
                        <span>/</span>
                        <span className="text-[#253D4E] font-semibold">My Account</span>
                    </nav>
                </div>

                {/* Page Header */}
                <div className="mb-4 sm:mb-6 md:mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#253D4E] mb-1.5 sm:mb-2">
                        My Account
                    </h1>
                    <p className="text-[#7E7E7E] text-xs sm:text-sm md:text-base">
                        Manage your account information and billing address
                    </p>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <div className="flex overflow-x-auto scrollbar-hide -mx-4 sm:mx-0">
                            <div className="flex min-w-full sm:min-w-0 px-4 sm:px-0">
                                <button
                                    onClick={() => setActiveTab("profile")}
                                    className={`flex-1 sm:flex-none px-3 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm md:text-base transition-colors whitespace-nowrap ${
                                        activeTab === "profile"
                                            ? "text-[#3B745B] border-b-2 border-[#3B745B]"
                                            : "text-[#7E7E7E] hover:text-[#253D4E]"
                                    }`}
                                >
                                    <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
                                        <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                                        <span>Profile</span>
                                        <span className="hidden sm:inline"> Information</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab("billing")}
                                    className={`flex-1 sm:flex-none px-3 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm md:text-base transition-colors whitespace-nowrap ${
                                        activeTab === "billing"
                                            ? "text-[#3B745B] border-b-2 border-[#3B745B]"
                                            : "text-[#7E7E7E] hover:text-[#253D4E]"
                                    }`}
                                >
                                    <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
                                        <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                                        <span>Billing</span>
                                        <span className="hidden sm:inline"> Address</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab("shipping")}
                                    className={`flex-1 sm:flex-none px-3 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm md:text-base transition-colors whitespace-nowrap ${
                                        activeTab === "shipping"
                                            ? "text-[#3B745B] border-b-2 border-[#3B745B]"
                                            : "text-[#7E7E7E] hover:text-[#253D4E]"
                                    }`}
                                >
                                    <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
                                        <Truck className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                                        <span>Shipping</span>
                                        <span className="hidden sm:inline"> Address</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8">
                        {/* Profile Tab */}
                        {activeTab === "profile" && (
                            <div className="space-y-4 sm:space-y-6">
                                {/* Profile Image */}
                                <div className="flex flex-col items-center sm:items-start">
                                    <label className="block text-sm font-semibold text-[#253D4E] mb-3 sm:mb-4">
                                        Profile Image
                                    </label>
                                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
                                        <div className="relative">
                                            <img
                                                src={imagePreview || getPlaceholderImage(getUserInitials(formData.firstName, formData.lastName, user?.name, formData.email))}
                                                alt="Profile"
                                                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-gray-200"
                                            />
                                        </div>
                                        <div className="w-full sm:w-auto">
                                            <label className="cursor-pointer block">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                />
                                                <div className="w-full sm:w-auto px-4 py-2 bg-[#3B745B] text-white rounded-lg hover:bg-[#2d5a47] transition-colors flex items-center justify-center gap-2 font-semibold text-sm sm:text-base">
                                                    <Upload className="h-4 w-4" />
                                                    Upload Photo
                                                </div>
                                            </label>
                                            <p className="text-xs text-[#7E7E7E] mt-2 text-center sm:text-left">
                                                JPG, PNG or GIF. Max size 5MB
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Name Fields */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                            First Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] focus:border-transparent"
                                            placeholder="First Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                            Last Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] focus:border-transparent"
                                            placeholder="Last Name"
                                        />
                                    </div>
                                </div>

                                {/* Email (Read-only) */}
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={formData.email}
                                            disabled
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                                        />
                                        <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                    </div>
                                    <p className="text-xs text-[#7E7E7E] mt-1">
                                        Email cannot be changed
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Billing Address Tab */}
                        {activeTab === "billing" && (
                            <div className="space-y-3 sm:space-y-4 md:space-y-6">
                                {/* Same as Shipping Checkbox */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={sameAsShipping}
                                            onChange={handleSameAsShippingChange}
                                            className="w-5 h-5 text-[#3B745B] border-gray-300 rounded focus:ring-[#3B745B]"
                                        />
                                        <span className="text-sm font-semibold text-[#253D4E]">
                                            Use the same address for billing and shipping
                                        </span>
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                        Street Address <span className="text-red-500">*</span>
                                    </label>
                                        <input
                                            type="text"
                                            name="billingAddress.streetAddress"
                                            value={formData.billingAddress.streetAddress}
                                            onChange={handleChange}
                                            disabled={sameAsShipping}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            placeholder="Street Address"
                                        />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                        Apartment, floor, etc. (optional)
                                    </label>
                                        <input
                                            type="text"
                                            name="billingAddress.apartment"
                                            value={formData.billingAddress.apartment}
                                            onChange={handleChange}
                                            disabled={sameAsShipping}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            placeholder="Apartment, suite, floor, etc."
                                        />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                            Town / City <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="billingAddress.townCity"
                                            value={formData.billingAddress.townCity}
                                            onChange={handleChange}
                                            disabled={sameAsShipping}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            placeholder="Town or City"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                            State / Province
                                        </label>
                                        <input
                                            type="text"
                                            name="billingAddress.state"
                                            value={formData.billingAddress.state}
                                            onChange={handleChange}
                                            disabled={sameAsShipping}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            placeholder="State or Province"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                            ZIP / Postal Code
                                        </label>
                                        <input
                                            type="text"
                                            name="billingAddress.zipCode"
                                            value={formData.billingAddress.zipCode}
                                            onChange={handleChange}
                                            disabled={sameAsShipping}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            placeholder="ZIP or Postal Code"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                            Country
                                        </label>
                                        <select
                                            name="billingAddress.country"
                                            value={formData.billingAddress.country}
                                            onChange={handleChange}
                                            disabled={sameAsShipping}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        >
                                            <option value="">Select Country</option>
                                            {countries.map((country) => (
                                                <option key={country.code} value={country.name}>
                                                    {country.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            name="billingAddress.phoneNumber"
                                            value={formData.billingAddress.phoneNumber}
                                            onChange={handleChange}
                                            disabled={sameAsShipping}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-10 sm:pl-12 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            placeholder="Phone Number"
                                        />
                                        <Phone className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Shipping Address Tab */}
                        {activeTab === "shipping" && (
                            <div className="space-y-3 sm:space-y-4 md:space-y-6">
                                {/* Same as Billing Checkbox */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={sameAsBilling}
                                            onChange={handleSameAsBillingChange}
                                            className="w-5 h-5 text-[#3B745B] border-gray-300 rounded focus:ring-[#3B745B]"
                                        />
                                        <span className="text-sm font-semibold text-[#253D4E]">
                                            Use the same address for billing and shipping
                                        </span>
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                        Street Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="shippingAddress.streetAddress"
                                        value={formData.shippingAddress.streetAddress}
                                        onChange={handleChange}
                                        disabled={sameAsBilling}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        placeholder="Street Address"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                        Apartment, floor, etc. (optional)
                                    </label>
                                    <input
                                        type="text"
                                        name="shippingAddress.apartment"
                                        value={formData.shippingAddress.apartment}
                                        onChange={handleChange}
                                        disabled={sameAsBilling}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        placeholder="Apartment, suite, floor, etc."
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                            Town / City <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="shippingAddress.townCity"
                                            value={formData.shippingAddress.townCity}
                                            onChange={handleChange}
                                            disabled={sameAsBilling}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            placeholder="Town or City"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                            State / Province
                                        </label>
                                        <input
                                            type="text"
                                            name="shippingAddress.state"
                                            value={formData.shippingAddress.state}
                                            onChange={handleChange}
                                            disabled={sameAsBilling}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            placeholder="State or Province"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                            ZIP / Postal Code
                                        </label>
                                        <input
                                            type="text"
                                            name="shippingAddress.zipCode"
                                            value={formData.shippingAddress.zipCode}
                                            onChange={handleChange}
                                            disabled={sameAsBilling}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            placeholder="ZIP or Postal Code"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                            Country
                                        </label>
                                        <select
                                            name="shippingAddress.country"
                                            value={formData.shippingAddress.country}
                                            onChange={handleChange}
                                            disabled={sameAsBilling}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        >
                                            <option value="">Select Country</option>
                                            {countries.map((country) => (
                                                <option key={country.code} value={country.name}>
                                                    {country.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            name="shippingAddress.phoneNumber"
                                            value={formData.shippingAddress.phoneNumber}
                                            onChange={handleChange}
                                            disabled={sameAsBilling}
                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-10 sm:pl-12 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            placeholder="Phone Number"
                                        />
                                        <Phone className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-[#3B745B] text-white font-semibold rounded-lg hover:bg-[#2d5a47] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="h-5 w-5 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-5 w-5" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Additional Info for Admin */}
                {user?.role === "admin" && (
                    <div className="mt-4 sm:mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                        <p className="text-xs sm:text-sm text-blue-800">
                            <strong>Admin Account:</strong> You can access the{" "}
                            <Link
                                to="/admin/dashboard"
                                className="text-blue-600 hover:text-blue-800 underline font-semibold break-words"
                            >
                                Admin Dashboard
                            </Link>{" "}
                            to manage the store.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Account;

