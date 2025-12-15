import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, ArrowLeft, Star } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

// Import product images
import strawberry from "../assets/products/strawberry.png";
import apple from "../assets/products/apple.png";
import orange from "../assets/products/orange.png";
import potato from "../assets/products/potato.png";
import carrot from "../assets/products/carrot.png";
import redish from "../assets/products/redish.png";
import tomato from "../assets/products/tomato.png";
import broccoli from "../assets/products/broccoli.png";
import greenbean from "../assets/products/greenbean.png";

function Wishlist() {
    const { wishlistItems, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    // Get product image based on name
    const getProductImage = (name) => {
        const nameLower = name.toLowerCase();
        if (nameLower.includes("strawberry")) return strawberry;
        if (nameLower.includes("apple")) return apple;
        if (nameLower.includes("orange")) return orange;
        if (nameLower.includes("potato") || nameLower.includes("potatos")) return potato;
        if (nameLower.includes("carrot")) return carrot;
        if (nameLower.includes("radish") || nameLower.includes("redish")) return redish;
        if (nameLower.includes("tomato") || nameLower.includes("tomatos")) return tomato;
        if (nameLower.includes("broccoli")) return broccoli;
        if (nameLower.includes("bean") || nameLower.includes("green bean")) return greenbean;
        return strawberry; // Default image
    };

    const handleAddToCart = (product) => {
        addToCart({ ...product, quantity: 1, weight: product.weight || "800g" });
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <div className="flex items-center gap-0.5">
                {[...Array(fullStars)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#FDC040] text-[#FDC040]" />
                ))}
                {hasHalfStar && (
                    <div className="relative h-4 w-4">
                        <Star className="h-4 w-4 text-gray-300" />
                        <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                            <Star className="h-4 w-4 fill-[#FDC040] text-[#FDC040]" />
                        </div>
                    </div>
                )}
                {[...Array(emptyStars)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-gray-300" />
                ))}
            </div>
        );
    };

    return (
        <div className="w-full bg-white min-h-screen py-12">
            <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
                
                {/* Breadcrumb */}
                <div className="mb-8">
                    <nav className="flex items-center gap-2 text-sm text-[#7E7E7E]">
                        <Link to="/" className="hover:text-[#3B745B] transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-[#253D4E] font-semibold">Wishlist</span>
                    </nav>
                </div>

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#253D4E] mb-2">My Wishlist</h1>
                    <p className="text-[#7E7E7E] text-sm sm:text-base">
                        {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
                    </p>
                </div>

                {/* Wishlist Items */}
                {wishlistItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Heart className="h-20 w-20 text-gray-300 mb-4" />
                        <h2 className="text-2xl font-bold text-[#253D4E] mb-2">Your wishlist is empty</h2>
                        <p className="text-[#7E7E7E] mb-6">Start adding products you love to your wishlist!</p>
                        <Link
                            to="/shop"
                            className="bg-[#3B745B] text-white px-6 py-3 rounded-lg hover:bg-[#2d5a47] transition-colors font-semibold"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {wishlistItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
                            >
                                {/* Product Image */}
                                <div className="relative bg-gray-50 p-4 sm:p-6 h-48 sm:h-56 flex items-center justify-center">
                                    <img
                                        src={item.image || getProductImage(item.name)}
                                        alt={item.name}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                    {/* Remove from Wishlist Button */}
                                    <button
                                        onClick={() => removeFromWishlist(item.id)}
                                        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                        aria-label="Remove from wishlist"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Product Info */}
                                <div className="p-4">
                                    <div className="mb-2">
                                        <p className="text-xs text-[#ADADAD] mb-1">{item.category || item.brand || "Product"}</p>
                                        <h3 className="text-sm sm:text-base font-semibold text-[#253D4E] line-clamp-2 min-h-[2.5rem]">
                                            {item.name}
                                        </h3>
                                    </div>

                                    {/* Rating */}
                                    {item.rating && (
                                        <div className="flex items-center gap-2 mb-3">
                                            {renderStars(item.rating)}
                                            <span className="text-xs text-[#ADADAD]">({item.reviewsCount || 0})</span>
                                        </div>
                                    )}

                                    {/* Price */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-lg sm:text-xl font-bold text-[#3B745B]">
                                            {item.price}
                                        </span>
                                        {item.oldPrice && (
                                            <span className="text-sm text-[#ADADAD] line-through">
                                                {item.oldPrice}
                                            </span>
                                        )}
                                    </div>

                                    {/* Add to Cart Button */}
                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        className="w-full bg-[#3B745B] text-white py-2.5 px-4 rounded-lg hover:bg-[#2d5a47] transition-colors font-semibold text-sm sm:text-base flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart className="h-4 w-4" />
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Return to Shop Button */}
                {wishlistItems.length > 0 && (
                    <div className="mt-8 flex justify-center">
                        <Link
                            to="/shop"
                            className="flex items-center gap-2 text-[#3B745B] hover:text-[#2d5a47] font-semibold transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Continue Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Wishlist;

