import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

// Import product images
import redish from "../assets/products/redish.png";
import onion from "../assets/products/onion.png";

function Checkout() {
    const { cartItems, getTotalPrice } = useCart();
    const [formData, setFormData] = useState({
        firstName: "",
        companyName: "",
        streetAddress: "",
        apartment: "",
        townCity: "",
        phoneNumber: "",
        emailAddress: "",
        saveInfo: false,
    });
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [couponCode, setCouponCode] = useState("");

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        // Handle order placement logic here
        console.log("Order placed:", { formData, paymentMethod, cartItems });
        alert("Order placed successfully!");
    };

    // Get product image based on name (fallback to default images)
    const getProductImage = (name) => {
        const nameLower = name.toLowerCase();
        if (nameLower.includes("radish") || nameLower.includes("redish")) return redish;
        if (nameLower.includes("onion")) return onion;
        return redish; // Default image
    };

    return (
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
                                    Company Name
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
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3B745B]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="emailAddress"
                                    value={formData.emailAddress}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3B745B]"
                                />
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
                                
                                <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
                                    <input
                                        type="radio"
                                        id="bank"
                                        name="paymentMethod"
                                        value="bank"
                                        checked={paymentMethod === "bank"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4 text-[#3B745B] border-gray-300 focus:ring-[#3B745B]"
                                    />
                                    <label htmlFor="bank" className="flex-1 flex items-center gap-3 cursor-pointer">
                                        <span className="font-semibold text-[#253D4E]">Bank</span>
                                        <div className="flex items-center gap-2 ml-auto">
                                            <div className="h-6 w-10 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
                                            <div className="h-6 w-10 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
                                            <div className="h-6 w-10 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">M</div>
                                        </div>
                                    </label>
                                </div>

                                <div className="flex items-center gap-3 p-4 border-2 border-[#3B745B] rounded-lg bg-[#DEF9EC]">
                                    <input
                                        type="radio"
                                        id="cash"
                                        name="paymentMethod"
                                        value="cash"
                                        checked={paymentMethod === "cash"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4 text-[#3B745B] border-gray-300 focus:ring-[#3B745B]"
                                    />
                                    <label htmlFor="cash" className="font-semibold text-[#253D4E] cursor-pointer">
                                        Cash on delivery
                                    </label>
                                </div>
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
                                disabled={cartItems.length === 0}
                                className="w-full mt-6 py-4 bg-[#3B745B] text-white font-bold rounded-lg hover:bg-[#2a5542] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                Place Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;

