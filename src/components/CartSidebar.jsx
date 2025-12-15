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

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
                    isCartOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <ShoppingCart className="h-6 w-6 text-[#3B745B]" />
                            <h2 className="text-xl font-bold text-[#253D4E]">
                                Shopping Cart ({getTotalItems()})
                            </h2>
                        </div>
                        <button
                            onClick={() => setIsCartOpen(false)}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X className="h-6 w-6 text-[#253D4E]" />
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {cartItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
                                <p className="text-lg font-semibold text-[#253D4E] mb-2">Your cart is empty</p>
                                <p className="text-sm text-[#7E7E7E]">Add some products to get started!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cartItems.map((item, index) => (
                                    <div
                                        key={`${item.id}-${item.weight}-${index}`}
                                        className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                                    >
                                        <div className="w-20 h-20 flex-shrink-0 bg-white rounded-lg border border-gray-100 flex items-center justify-center overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-contain p-2"
                                            />
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-[#253D4E] mb-1 text-sm">{item.name}</h3>
                                            <p className="text-xs text-[#7E7E7E] mb-2">{item.weight}</p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleQuantityChange(item, -1)}
                                                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                                    >
                                                        <Minus className="h-4 w-4 text-[#253D4E]" />
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-semibold text-[#253D4E]">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item, 1)}
                                                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                                    >
                                                        <Plus className="h-4 w-4 text-[#253D4E]" />
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-bold text-[#3B745B]">
                                                        {item.price}
                                                    </span>
                                                    <button
                                                        onClick={() => removeFromCart(item.id, item.weight)}
                                                        className="p-1 rounded hover:bg-red-50 transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-500" />
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
                        <div className="border-t border-gray-200 p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-[#253D4E]">Total:</span>
                                <span className="text-xl font-bold text-[#3B745B]">
                                    £{getTotalPrice().toFixed(2)}
                                </span>
                            </div>
                            <Link
                                to="/checkout"
                                onClick={() => setIsCartOpen(false)}
                                className="block w-full py-3 bg-[#3B745B] text-white font-bold rounded-lg hover:bg-[#2a5542] transition-colors text-center"
                            >
                                Checkout
                            </Link>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="w-full py-3 border-2 border-gray-300 text-[#253D4E] font-bold rounded-lg hover:border-[#3B745B] hover:text-[#3B745B] transition-colors"
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

