import React from "react";
import { Link } from "react-router-dom";
import { Plus, Minus, Trash2, ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";

// Import product images
import redish from "../assets/products/redish.png";
import onion from "../assets/products/onion.png";

function Cart() {
    const { cartItems, updateQuantity, removeFromCart, getTotalPrice } = useCart();

    const handleQuantityChange = (item, change) => {
        const newQuantity = item.quantity + change;
        updateQuantity(item.id, item.weight, newQuantity);
    };

    // Get product image based on name (fallback to default images)
    const getProductImage = (name) => {
        const nameLower = name.toLowerCase();
        if (nameLower.includes("radish") || nameLower.includes("redish")) return redish;
        if (nameLower.includes("onion")) return onion;
        // Add more mappings as needed
        return redish; // Default image
    };

    return (
        <div className="w-full bg-white min-h-screen py-12">
            <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
                
                {/* Breadcrumb */}
                <div className="mb-8">
                    <nav className="flex items-center gap-2 text-sm text-[#7E7E7E]">
                        <Link to="/" className="hover:text-[#3B745B] transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-[#253D4E] font-semibold">Cart</span>
                    </nav>
                </div>

                {/* Cart Table */}
                <div className="mb-8">
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        {/* Table Header */}
                        <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-bold text-[#253D4E] text-sm">
                            <div className="col-span-5">Product</div>
                            <div className="col-span-2 text-center">Price</div>
                            <div className="col-span-2 text-center">Quantity</div>
                            <div className="col-span-2 text-center">Subtotal</div>
                            <div className="col-span-1"></div>
                        </div>

                        {/* Cart Items */}
                        {cartItems.length === 0 ? (
                            <div className="p-12 text-center">
                                <p className="text-lg font-semibold text-[#253D4E] mb-2">Your cart is empty</p>
                                <Link
                                    to="/"
                                    className="inline-block mt-4 px-6 py-3 bg-[#3B745B] text-white font-bold rounded-lg hover:bg-[#2a5542] transition-colors"
                                >
                                    Return To Shop
                                </Link>
                            </div>
                        ) : (
                            <>
                                {cartItems.map((item, index) => (
                                    <div
                                        key={`${item.id}-${item.weight}-${index}`}
                                        className="grid grid-cols-12 gap-3 md:gap-4 p-3 md:p-4 border-b border-gray-200 items-center hover:bg-gray-50 transition-colors"
                                    >
                                        {/* Product Info - Mobile: Full width, Desktop: 5 columns */}
                                        <div className="col-span-12 md:col-span-5 flex items-center gap-3 md:gap-4">
                                            <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 bg-white rounded-lg border border-gray-100 flex items-center justify-center overflow-hidden">
                                                <img
                                                    src={item.image || getProductImage(item.name)}
                                                    alt={item.name}
                                                    className="w-full h-full object-contain p-2"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-[#253D4E] mb-1 text-sm md:text-base truncate">{item.name}</h3>
                                                <p className="text-xs md:text-sm text-[#7E7E7E]">{item.weight}</p>
                                                {/* Mobile: Show price and subtotal */}
                                                <div className="md:hidden mt-2 flex items-center justify-between">
                                                    <div>
                                                        <span className="text-xs text-[#7E7E7E]">Price: </span>
                                                        <span className="text-sm font-bold text-[#253D4E]">{item.price}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-[#7E7E7E]">Subtotal: </span>
                                                        <span className="text-sm font-bold text-[#3B745B]">
                                                            £{(parseFloat(item.price.replace("£", "").replace(",", "")) * item.quantity).toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price - Desktop only */}
                                        <div className="hidden md:block col-span-2 text-center">
                                            <span className="font-bold text-[#253D4E] text-sm">{item.price}</span>
                                        </div>

                                        {/* Quantity */}
                                        <div className="col-span-12 md:col-span-2 flex items-center gap-2 md:justify-center mt-2 md:mt-0">
                                            <span className="md:hidden text-xs text-[#7E7E7E] font-semibold whitespace-nowrap">Quantity:</span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleQuantityChange(item, -1)}
                                                    className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                                >
                                                    <Minus className="h-4 w-4 text-[#253D4E]" />
                                                </button>
                                                <span className="w-12 text-center font-semibold text-[#253D4E] text-sm md:text-base">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleQuantityChange(item, 1)}
                                                    className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                                >
                                                    <Plus className="h-4 w-4 text-[#253D4E]" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Subtotal - Desktop only */}
                                        <div className="hidden md:block col-span-2 text-center">
                                            <span className="font-bold text-[#3B745B] text-sm">
                                                £{(parseFloat(item.price.replace("£", "").replace(",", "")) * item.quantity).toFixed(2)}
                                            </span>
                                        </div>

                                        {/* Remove Button */}
                                        <div className="col-span-12 md:col-span-1 flex justify-end md:justify-end mt-2 md:mt-0">
                                            <button
                                                onClick={() => removeFromCart(item.id, item.weight)}
                                                className="p-2 rounded hover:bg-red-50 transition-colors"
                                            >
                                                <Trash2 className="h-5 w-5 text-red-500" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:justify-between sm:gap-4 mb-6 sm:mb-8">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-300 text-[#253D4E] font-bold rounded-lg hover:border-[#3B745B] hover:text-[#3B745B] transition-colors text-sm sm:text-base"
                    >
                        <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="hidden sm:inline">Return To Shop</span>
                        <span className="sm:hidden">Return</span>
                    </Link>
                    {cartItems.length > 0 && (
                        <button className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#3B745B] text-white font-bold rounded-lg hover:bg-[#2a5542] transition-colors text-sm sm:text-base">
                            <span className="hidden sm:inline">Update Cart</span>
                            <span className="sm:hidden">Update</span>
                        </button>
                    )}
                </div>

                {/* Coupon and Cart Total Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    {/* Coupon Section */}
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold text-[#253D4E] mb-3 sm:mb-4">Apply Coupon</h3>
                        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                            <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                Coupon Code
                            </label>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="text"
                                    placeholder="Enter coupon code"
                                    className="flex-1 px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3B745B] text-sm sm:text-base"
                                />
                                <button className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#3B745B] text-white font-bold rounded-lg hover:bg-[#2a5542] transition-colors text-sm sm:text-base whitespace-nowrap">
                                    Apply Coupon
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Cart Total */}
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold text-[#253D4E] mb-3 sm:mb-4">Cart Total</h3>
                        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4">
                            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-gray-200">
                                <span className="text-sm sm:text-base text-[#253D4E] font-semibold">Subtotal:</span>
                                <span className="text-sm sm:text-base text-[#253D4E] font-bold">£{getTotalPrice().toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-gray-200">
                                <span className="text-sm sm:text-base text-[#253D4E] font-semibold">Shipping:</span>
                                <span className="text-sm sm:text-base text-[#3B745B] font-bold">Free</span>
                            </div>
                            <div className="flex items-center justify-between pt-2">
                                <span className="text-base sm:text-lg font-bold text-[#253D4E]">Total:</span>
                                <span className="text-base sm:text-lg font-bold text-[#3B745B]">£{getTotalPrice().toFixed(2)}</span>
                            </div>
                            <Link
                                to="/checkout"
                                className="block w-full mt-4 sm:mt-6 py-3 sm:py-4 bg-[#3B745B] text-white font-bold rounded-lg hover:bg-[#2a5542] transition-colors text-center text-sm sm:text-base"
                            >
                                Proceed to checkout
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;

