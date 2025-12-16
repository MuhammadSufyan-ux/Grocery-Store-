import React from "react";
import { Link } from "react-router-dom";
import { X, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

function CartSidebar() {
    const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart();

    const handleQuantityChange = (item, change) => {
        const newQuantity = item.quantity + change;
        updateQuantity(item.id, item.weight, newQuantity);
    };

    return (
        <>
            {/* Backdrop */}
            {isCartOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                    onClick={() => setIsCartOpen(false)}
                />
            )}

            {/* Sidebar - Mobile First Responsive */}
            <div
                className={`fixed top-0 right-0 h-full w-full sm:max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
                    isCartOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-gray-200 flex-shrink-0">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-[#3B745B] flex-shrink-0" />
                            <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#253D4E] truncate">
                                Cart ({getTotalItems()})
                            </h2>
                        </div>
                        <button
                            onClick={() => setIsCartOpen(false)}
                            className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors flex-shrink-0 ml-2"
                            aria-label="Close cart"
                        >
                            <X className="h-5 w-5 sm:h-6 sm:w-6 text-[#253D4E]" />
                        </button>
                    </div>

                    {/* Cart Items - Scrollable */}
                    <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 scrollbar-hide">
                        {cartItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center px-4">
                                <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mb-3 sm:mb-4" />
                                <p className="text-base sm:text-lg font-semibold text-[#253D4E] mb-1 sm:mb-2">Your cart is empty</p>
                                <p className="text-xs sm:text-sm text-[#7E7E7E]">Add some products to get started!</p>
                            </div>
                        ) : (
                            <div className="space-y-2 sm:space-y-3 md:space-y-4">
                                {cartItems.map((item, index) => (
                                    <div
                                        key={`${item.id}-${item.weight}-${index}`}
                                        className="flex gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4 border border-gray-200 rounded-lg hover:shadow-md active:shadow-sm transition-shadow bg-white"
                                    >
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-20 md:h-20 flex-shrink-0 bg-white rounded-lg border border-gray-100 flex items-center justify-center overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-contain p-1 sm:p-2"
                                                onError={(e) => {
                                                    e.target.src = "https://via.placeholder.com/80?text=No+Image";
                                                }}
                                            />
                                        </div>
                                        
                                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-[#253D4E] mb-0.5 sm:mb-1 text-xs sm:text-sm truncate">{item.name}</h3>
                                                <p className="text-xs text-[#7E7E7E] mb-2">{item.weight}</p>
                                            </div>
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-1.5 sm:gap-2">
                                                    <button
                                                        onClick={() => handleQuantityChange(item, -1)}
                                                        className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#253D4E]" />
                                                    </button>
                                                    <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-semibold text-[#253D4E]">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item, 1)}
                                                        className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
                                                        aria-label="Increase quantity"
                                                    >
                                                        <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#253D4E]" />
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-2 sm:gap-3">
                                                    <span className="text-xs sm:text-sm font-bold text-[#3B745B] whitespace-nowrap">
                                                        {item.price}
                                                    </span>
                                                    <button
                                                        onClick={() => removeFromCart(item.id, item.weight)}
                                                        className="p-1 sm:p-1.5 rounded hover:bg-red-50 active:bg-red-100 transition-colors touch-manipulation"
                                                        aria-label="Remove item"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {cartItems.length > 0 && (
                        <div className="border-t border-gray-200 p-3 sm:p-4 md:p-6 space-y-2 sm:space-y-3 md:space-y-4 flex-shrink-0 bg-white">
                            <div className="flex items-center justify-between">
                                <span className="text-base sm:text-lg font-bold text-[#253D4E]">Total:</span>
                                <span className="text-lg sm:text-xl font-bold text-[#3B745B]">
                                    £{getTotalPrice().toFixed(2)}
                                </span>
                            </div>
                            <Link
                                to="/checkout"
                                onClick={() => setIsCartOpen(false)}
                                className="block w-full py-2.5 sm:py-3 bg-[#3B745B] text-white font-bold rounded-lg hover:bg-[#2a5542] active:bg-[#1e3d2e] transition-colors text-center text-sm sm:text-base touch-manipulation"
                            >
                                Checkout
                            </Link>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="w-full py-2.5 sm:py-3 border-2 border-gray-300 text-[#253D4E] font-bold rounded-lg hover:border-[#3B745B] hover:text-[#3B745B] active:bg-gray-50 transition-colors text-sm sm:text-base touch-manipulation"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default CartSidebar;

