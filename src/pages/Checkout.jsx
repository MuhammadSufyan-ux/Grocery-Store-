import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { countries } from "../utils/countries";
import { Phone, Mail, Upload, X, FileText, Loader } from "lucide-react";
import OrderSuccessModal from "../components/OrderSuccessModal";

// Import product images
import redish from "../assets/products/redish.png";
import onion from "../assets/products/onion.png";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Checkout() {
    const { cartItems, getTotalPrice, clearCart } = useCart();
    const { user, isAuthenticated, token } = useAuth();
    const { success, error: showError } = useToast();
    const navigate = useNavigate();
    const [loadingSettings, setLoadingSettings] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(null);
    const [paymentMethods, setPaymentMethods] = useState({
        bankTransfer: { enabled: false, label: "Bank Local Transfer" },
        cod: { enabled: true, label: "Cash on Delivery" },
    });
    
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        companyName: "",
        streetAddress: "",
        apartment: "",
        townCity: "",
        state: "",
        zipCode: "",
        country: "",
        phoneNumber: "",
        emailAddress: "",
        saveInfo: false,
    });
    const [paymentMethod, setPaymentMethod] = useState("");
    const [couponCode, setCouponCode] = useState("");
    const [receiptFile, setReceiptFile] = useState(null);
    const [receiptFileName, setReceiptFileName] = useState("");

    // Fetch payment methods from settings
    useEffect(() => {
        fetchPaymentMethods();
    }, []);

    // Load user address if logged in
    useEffect(() => {
        if (isAuthenticated() && user) {
            loadUserAddress();
        }
    }, [user, isAuthenticated]);

    const fetchPaymentMethods = async () => {
        try {
            setLoadingSettings(true);
            const response = await fetch(`${API_URL}/api/settings`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setPaymentMethods(data.settings.paymentMethods);
                // Set default payment method to the first enabled one
                if (data.settings.paymentMethods.cod.enabled) {
                    setPaymentMethod("cod");
                } else if (data.settings.paymentMethods.bankTransfer.enabled) {
                    setPaymentMethod("bankTransfer");
                }
            }
        } catch (error) {
            console.error("Error fetching payment methods:", error);
        } finally {
            setLoadingSettings(false);
        }
    };

    const loadUserAddress = () => {
        if (user?.billingAddress) {
            const billing = user.billingAddress;
            setFormData((prev) => ({
                ...prev,
                firstName: user.firstName || user.name?.split(" ")[0] || "",
                lastName: user.lastName || user.name?.split(" ").slice(1).join(" ") || "",
                streetAddress: billing.streetAddress || "",
                apartment: billing.apartment || "",
                townCity: billing.townCity || "",
                state: billing.state || "",
                zipCode: billing.zipCode || "",
                country: billing.country || "",
                phoneNumber: billing.phoneNumber || "",
                emailAddress: user.email || "",
            }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("File size must be less than 5MB");
                return;
            }
            // Check file type (images and PDFs)
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
            if (!validTypes.includes(file.type)) {
                alert("Please upload an image (JPG, PNG, GIF) or PDF file");
                return;
            }
            setReceiptFile(file);
            setReceiptFileName(file.name);
        }
    };

    const handleRemoveReceipt = () => {
        setReceiptFile(null);
        setReceiptFileName("");
        // Reset the file input
        const fileInput = document.getElementById('receiptFile');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handlePaymentMethodChange = (value) => {
        setPaymentMethod(value);
        // Clear receipt if switching away from bank transfer
        if (value !== "bankTransfer" && receiptFile) {
            handleRemoveReceipt();
        }
    };

    // Convert file to base64
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (!formData.firstName || !formData.lastName || !formData.emailAddress || !formData.phoneNumber) {
            showError("Please fill in all required fields");
            return;
        }

        if (!formData.streetAddress || !formData.townCity) {
            showError("Please provide complete address information");
            return;
        }

        if (paymentMethod === "bankTransfer" && !receiptFile) {
            showError("Please upload a payment receipt before placing your order.");
            return;
        }

        if (cartItems.length === 0) {
            showError("Your cart is empty");
            return;
        }

        setPlacingOrder(true);

        try {
            // Convert receipt file to base64 if bank transfer
            let receiptBase64 = null;
            if (paymentMethod === "bankTransfer" && receiptFile) {
                receiptBase64 = await fileToBase64(receiptFile);
            }

            // Prepare order items
            const orderItems = cartItems.map((item) => ({
                product: item.id,
                name: item.name,
                quantity: item.quantity,
                weight: item.weight || "",
                price: parseFloat(item.price.replace("£", "").replace(",", "")),
                image: item.image || "",
            }));

            // Prepare order data
            const orderData = {
                customerInfo: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.emailAddress,
                    phone: formData.phoneNumber,
                    companyName: formData.companyName || "",
                },
                billingAddress: {
                    streetAddress: formData.streetAddress,
                    apartment: formData.apartment || "",
                    townCity: formData.townCity,
                    state: formData.state || "",
                    zipCode: formData.zipCode || "",
                    country: formData.country || "",
                },
                shippingAddress: {
                    streetAddress: formData.streetAddress,
                    apartment: formData.apartment || "",
                    townCity: formData.townCity,
                    state: formData.state || "",
                    zipCode: formData.zipCode || "",
                    country: formData.country || "",
                    phoneNumber: formData.phoneNumber,
                },
                items: orderItems,
                subtotal: getTotalPrice(),
                shippingCost: 0,
                discount: 0,
                total: getTotalPrice(),
                paymentMethod: paymentMethod,
                couponCode: couponCode || null,
                receiptFile: receiptBase64,
            };

            // Submit order
            const response = await fetch(`${API_URL}/api/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify(orderData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Clear cart
                clearCart();
                
                // Show success modal
                setOrderSuccess(data.order);
                success("Order placed successfully!");
            } else {
                showError(data.message || "Failed to place order. Please try again.");
            }
        } catch (err) {
            console.error("Error placing order:", err);
            showError("An error occurred while placing your order. Please try again.");
        } finally {
            setPlacingOrder(false);
        }
    };

    // Get product image based on name (fallback to default images)
    const getProductImage = (name) => {
        const nameLower = name.toLowerCase();
        if (nameLower.includes("radish") || nameLower.includes("redish")) return redish;
        if (nameLower.includes("onion")) return onion;
        return redish; // Default image
    };

    return (
        <>
            {orderSuccess && (
                <OrderSuccessModal
                    order={orderSuccess}
                    onClose={() => {
                        setOrderSuccess(null);
                        navigate("/");
                    }}
                />
            )}
            <div className="w-full bg-white min-h-screen py-12">
            <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
                
                {/* Breadcrumb */}
                <div className="mb-8">
                    <nav className="flex items-center gap-2 text-sm text-[#7E7E7E]">
                        <Link to="/" className="hover:text-[#3B745B] transition-colors">Account</Link>
                        <span>/</span>
                        <Link to="/" className="hover:text-[#3B745B] transition-colors">My Account</Link>
                        <span>/</span>
                        <Link to="/" className="hover:text-[#3B745B] transition-colors">Product</Link>
                        <span>/</span>
                        <Link to="/cart" className="hover:text-[#3B745B] transition-colors">View Cart</Link>
                        <span>/</span>
                        <span className="text-[#253D4E] font-semibold">Checkout</span>
                    </nav>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* Left Column - Billing Details */}
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-[#253D4E] mb-4 sm:mb-6">Billing Details</h2>
                        
                        <form onSubmit={handlePlaceOrder} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                        First Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3B745B]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3B745B]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                    Company Name (optional)
                                </label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3B745B]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                    Street Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="streetAddress"
                                    value={formData.streetAddress}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3B745B]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                    Apartment, floor, etc. (optional)
                                </label>
                                <input
                                    type="text"
                                    name="apartment"
                                    value={formData.apartment}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3B745B]"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                        Town/City <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="townCity"
                                        value={formData.townCity}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3B745B]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                        State / Province
                                    </label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3B745B]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                        ZIP / Postal Code
                                    </label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3B745B]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                        Country
                                    </label>
                                    <select
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3B745B]"
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
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3B745B]"
                                        placeholder="Phone Number"
                                    />
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        name="emailAddress"
                                        value={formData.emailAddress}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3B745B]"
                                        placeholder="Email Address"
                                    />
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="saveInfo"
                                    id="saveInfo"
                                    checked={formData.saveInfo}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-[#3B745B] border-gray-300 rounded focus:ring-[#3B745B]"
                                />
                                <label htmlFor="saveInfo" className="text-sm text-[#253D4E]">
                                    Save this information for faster check-out next time
                                </label>
                            </div>
                        </form>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-[#253D4E] mb-4 sm:mb-6">Your Order</h2>
                        
                        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 space-y-4 sm:space-y-6">
                            {/* Order Items */}
                            <div className="space-y-4 pb-4 border-b border-gray-200">
                                {cartItems.length === 0 ? (
                                    <p className="text-[#7E7E7E] text-sm">Your cart is empty</p>
                                ) : (
                                    cartItems.map((item, index) => (
                                        <div
                                            key={`${item.id}-${item.weight}-${index}`}
                                            className="flex items-center gap-4"
                                        >
                                            <div className="w-16 h-16 flex-shrink-0 bg-white rounded-lg border border-gray-100 flex items-center justify-center overflow-hidden">
                                                <img
                                                    src={item.image || getProductImage(item.name)}
                                                    alt={item.name}
                                                    className="w-full h-full object-contain p-2"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-[#253D4E] text-sm mb-1">{item.name}</h3>
                                                <p className="text-xs text-[#7E7E7E]">{item.weight} x {item.quantity}</p>
                                            </div>
                                            <div className="font-bold text-[#3B745B]">
                                                £{(parseFloat(item.price.replace("£", "").replace(",", "")) * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Summary */}
                            <div className="space-y-3 pb-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-[#253D4E] font-semibold">Subtotal:</span>
                                    <span className="text-[#253D4E] font-bold">£{getTotalPrice().toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[#253D4E] font-semibold">Shipping:</span>
                                    <span className="text-[#3B745B] font-bold">Free</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 pb-4 border-b border-gray-200">
                                <span className="text-lg font-bold text-[#253D4E]">Total:</span>
                                <span className="text-lg font-bold text-[#3B745B]">£{getTotalPrice().toFixed(2)}</span>
                            </div>

                            {/* Payment Methods */}
                            <div className="space-y-3">
                                <h3 className="font-bold text-[#253D4E] mb-3">Payment Method</h3>
                                
                                {paymentMethods.bankTransfer.enabled && (
                                    <div className={`flex items-start gap-3 p-4 border rounded-lg ${paymentMethod === "bankTransfer" ? "border-2 border-[#3B745B] bg-[#DEF9EC]" : "border-gray-200"}`}>
                                        <input
                                            type="radio"
                                            id="bankTransfer"
                                            name="paymentMethod"
                                            value="bankTransfer"
                                            checked={paymentMethod === "bankTransfer"}
                                            onChange={(e) => handlePaymentMethodChange(e.target.value)}
                                            className="w-4 h-4 mt-0.5 text-[#3B745B] border-gray-300 focus:ring-[#3B745B]"
                                        />
                                        <label htmlFor="bankTransfer" className="flex-1 cursor-pointer">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="font-semibold text-[#253D4E]">{paymentMethods.bankTransfer.label}</span>
                                                <div className="flex items-center gap-2 ml-auto">
                                                    <div className="h-6 w-10 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
                                                    <div className="h-6 w-10 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
                                                    <div className="h-6 w-10 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">M</div>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                )}

                                {paymentMethods.cod.enabled && (
                                    <div className={`flex items-start gap-3 p-4 border rounded-lg ${paymentMethod === "cod" ? "border-2 border-[#3B745B] bg-[#DEF9EC]" : "border-gray-200"}`}>
                                        <input
                                            type="radio"
                                            id="cod"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={paymentMethod === "cod"}
                                            onChange={(e) => handlePaymentMethodChange(e.target.value)}
                                            className="w-4 h-4 mt-0.5 text-[#3B745B] border-gray-300 focus:ring-[#3B745B]"
                                        />
                                        <label htmlFor="cod" className="flex-1 cursor-pointer">
                                            <span className="font-semibold text-[#253D4E]">{paymentMethods.cod.label}</span>
                                        </label>
                                    </div>
                                )}

                                {!paymentMethods.bankTransfer.enabled && !paymentMethods.cod.enabled && (
                                    <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                                        <p className="text-sm text-red-600">
                                            No payment methods are currently available. Please contact support.
                                        </p>
                                    </div>
                                )}

                                {/* Bank Details Display */}
                                {paymentMethod === "bankTransfer" && paymentMethods.bankTransfer?.bankDetails && (
                                    <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                        <h4 className="font-semibold text-[#253D4E] mb-3">Bank Transfer Details</h4>
                                        <div className="space-y-2 text-sm">
                                            {paymentMethods.bankTransfer.bankDetails?.accountName && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Account Name:</span>
                                                    <span className="font-medium text-[#253D4E]">{paymentMethods.bankTransfer.bankDetails.accountName}</span>
                                                </div>
                                            )}
                                            {paymentMethods.bankTransfer.bankDetails?.accountNumber && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Account Number:</span>
                                                    <span className="font-medium text-[#253D4E]">{paymentMethods.bankTransfer.bankDetails.accountNumber}</span>
                                                </div>
                                            )}
                                            {paymentMethods.bankTransfer.bankDetails?.bankName && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Bank Name:</span>
                                                    <span className="font-medium text-[#253D4E]">{paymentMethods.bankTransfer.bankDetails.bankName}</span>
                                                </div>
                                            )}
                                            {paymentMethods.bankTransfer.bankDetails?.iban && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">IBAN:</span>
                                                    <span className="font-medium text-[#253D4E]">{paymentMethods.bankTransfer.bankDetails.iban}</span>
                                                </div>
                                            )}
                                            {paymentMethods.bankTransfer.bankDetails?.swiftCode && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">SWIFT Code:</span>
                                                    <span className="font-medium text-[#253D4E]">{paymentMethods.bankTransfer.bankDetails.swiftCode}</span>
                                                </div>
                                            )}
                                            {paymentMethods.bankTransfer.bankDetails?.branchName && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Branch Name:</span>
                                                    <span className="font-medium text-[#253D4E]">{paymentMethods.bankTransfer.bankDetails.branchName}</span>
                                                </div>
                                            )}
                                            {paymentMethods.bankTransfer.bankDetails?.routingNumber && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Routing Number:</span>
                                                    <span className="font-medium text-[#253D4E]">{paymentMethods.bankTransfer.bankDetails.routingNumber}</span>
                                                </div>
                                            )}
                                            {paymentMethods.bankTransfer.bankDetails?.additionalInfo && (
                                                <div className="mt-3 pt-3 border-t border-gray-200">
                                                    <p className="text-gray-600 mb-1">Additional Information:</p>
                                                    <p className="text-[#253D4E] whitespace-pre-line">{paymentMethods.bankTransfer.bankDetails.additionalInfo}</p>
                                                </div>
                                            )}
                                        </div>
                                        <p className="mt-3 text-xs text-gray-500 italic">
                                            Please complete the bank transfer using the details above and keep the receipt for your records.
                                        </p>
                                    </div>
                                )}

                                {/* Receipt Upload Section - Only show for Bank Transfer */}
                                {paymentMethod === "bankTransfer" && (
                                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <h4 className="font-semibold text-[#253D4E] mb-3 flex items-center gap-2">
                                            <Upload className="h-5 w-5 text-[#3B745B]" />
                                            Payment Receipt Upload
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-3">
                                            Please upload a photo or PDF of your bank transfer receipt as proof of payment. 
                                            <span className="text-red-500"> *</span>
                                        </p>
                                        
                                        {!receiptFile ? (
                                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                                                    <p className="mb-2 text-sm text-gray-500">
                                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                                    </p>
                                                    <p className="text-xs text-gray-500">PNG, JPG, GIF or PDF (MAX. 5MB)</p>
                                                </div>
                                                <input
                                                    id="receiptFile"
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*,.pdf"
                                                    onChange={handleFileChange}
                                                />
                                            </label>
                                        ) : (
                                            <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <FileText className="h-8 w-8 text-[#3B745B]" />
                                                    <div>
                                                        <p className="text-sm font-medium text-[#253D4E]">{receiptFileName}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {(receiptFile.size / 1024).toFixed(2)} KB
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveReceipt}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Remove file"
                                                >
                                                    <X className="h-5 w-5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* COD Instructions Display */}
                                {paymentMethod === "cod" && paymentMethods.cod?.instructions && (
                                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <h4 className="font-semibold text-[#253D4E] mb-2 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Payment Instructions
                                        </h4>
                                        <p className="text-sm text-[#253D4E] whitespace-pre-line">{paymentMethods.cod.instructions}</p>
                                    </div>
                                )}
                            </div>

                            {/* Coupon Section */}
                            <div className="pt-4 border-t border-gray-200">
                                <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                    Coupon Code
                                </label>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        placeholder="Enter coupon code"
                                        className="flex-1 px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3B745B] text-sm sm:text-base"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            // Handle coupon application
                                            console.log("Apply coupon:", couponCode);
                                        }}
                                        className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#3B745B] text-white font-bold rounded-lg hover:bg-[#2a5542] transition-colors whitespace-nowrap text-sm sm:text-base"
                                    >
                                        Apply Coupon
                                    </button>
                                </div>
                            </div>

                            {/* Place Order Button */}
                            <button
                                type="submit"
                                onClick={handlePlaceOrder}
                                disabled={
                                    cartItems.length === 0 ||
                                    !paymentMethod ||
                                    loadingSettings ||
                                    placingOrder ||
                                    (!paymentMethods.bankTransfer.enabled && !paymentMethods.cod.enabled) ||
                                    (paymentMethod === "bankTransfer" && !receiptFile)
                                }
                                className="w-full mt-6 py-4 bg-[#3B745B] text-white font-bold rounded-lg hover:bg-[#2a5542] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {placingOrder ? (
                                    <>
                                        <Loader className="h-5 w-5 animate-spin" />
                                        Placing Order...
                                    </>
                                ) : (
                                    "Place Order"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default Checkout;

