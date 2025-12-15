import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Star, Flame, Clock, Filter, Grid, List } from "lucide-react";
import { useCart } from "../context/CartContext";

// Import product images
import redish from "../assets/products/redish.png";
import potato from "../assets/products/potato.png";
import tomato from "../assets/products/tomato.png";
import broccoli from "../assets/products/broccoli.png";
import greenbean from "../assets/products/greenbean.png";
import coffe from "../assets/products/coffe.png";
import greentea from "../assets/products/greentea.png";
import halalsausage from "../assets/products/halalsausage.png";
import onion from "../assets/products/onion.png";

function HotDeals() {
    const { addToCart } = useCart();
    const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
    const [selectedCategory, setSelectedCategory] = useState("All");

    const hotDealsProducts = [
        {
            id: 1,
            badge: { text: "Save 25%", color: "bg-[#E74C3C]", textColor: "text-white" },
            category: "Vegetables",
            name: "Redish 500g",
            image: redish,
            rating: 4,
            price: "£2",
            oldPrice: "£3.99",
            discount: 25,
            timeLeft: "2h 30m",
        },
        {
            id: 2,
            badge: { text: "Best deal", color: "bg-[#DEF9EC]", textColor: "text-[#3B745B]" },
            category: "Vegetables",
            name: "Potatos 1kg",
            image: potato,
            rating: 4,
            price: "£1",
            oldPrice: "£1.99",
            discount: 50,
            timeLeft: "5h 15m",
        },
        {
            id: 3,
            badge: { text: "Save 40%", color: "bg-[#E74C3C]", textColor: "text-white" },
            category: "Fruits",
            name: "Tomatos 200g",
            image: tomato,
            rating: 4,
            price: "£0.30",
            oldPrice: "£0.99",
            discount: 40,
            timeLeft: "1h 45m",
        },
        {
            id: 4,
            badge: { text: "Save 15%", color: "bg-[#FDC040]", textColor: "text-[#253D4E]" },
            category: "Vegetables",
            name: "Broccoli 1kg",
            image: broccoli,
            rating: 4,
            price: "£1.50",
            oldPrice: "£2.99",
            discount: 15,
            timeLeft: "3h 20m",
        },
        {
            id: 5,
            badge: { text: "Save 30%", color: "bg-[#E74C3C]", textColor: "text-white" },
            category: "Vegetables",
            name: "Green Beans 250g",
            image: greenbean,
            rating: 4,
            price: "£1",
            oldPrice: "£1.99",
            discount: 30,
            timeLeft: "4h 10m",
        },
        {
            id: 6,
            badge: { text: "Save 20%", color: "bg-[#FDC040]", textColor: "text-[#253D4E]" },
            category: "Coffee & Teas",
            name: "Coffee 1kg",
            image: coffe,
            rating: 4,
            price: "£20",
            oldPrice: "£25",
            discount: 20,
            timeLeft: "6h 30m",
        },
        {
            id: 7,
            badge: { text: "Save 35%", color: "bg-[#E74C3C]", textColor: "text-white" },
            category: "Coffee & Teas",
            name: "Green Tea 250g",
            image: greentea,
            rating: 4,
            price: "£3",
            oldPrice: "£7",
            discount: 35,
            timeLeft: "2h 50m",
        },
        {
            id: 8,
            badge: { text: "Save 50%", color: "bg-[#E74C3C]", textColor: "text-white" },
            category: "Meat",
            name: "Halal Sausage 350g",
            image: halalsausage,
            rating: 4,
            price: "£4",
            oldPrice: "£10",
            discount: 50,
            timeLeft: "1h 20m",
        },
        {
            id: 9,
            badge: { text: "Save 60%", color: "bg-[#E74C3C]", textColor: "text-white" },
            category: "Vegetables",
            name: "Onion 1kg",
            image: onion,
            rating: 4,
            price: "£0.50",
            oldPrice: "£2",
            discount: 60,
            timeLeft: "45m",
        },
    ];

    const categories = ["All", "Vegetables", "Fruits", "Coffee & Teas", "Meat"];

    const filteredProducts = selectedCategory === "All" 
        ? hotDealsProducts 
        : hotDealsProducts.filter(p => p.category === selectedCategory);

    return (
        <div className="w-full bg-white min-h-screen py-6 sm:py-8 md:py-12">
            <div className="mx-auto w-full max-w-[1600px] px-2 sm:px-4 md:px-6 lg:px-8">
                
                {/* Breadcrumb */}
                <div className="mb-6 sm:mb-8">
                    <nav className="flex items-center gap-2 text-xs sm:text-sm text-[#7E7E7E]">
                        <Link to="/" className="hover:text-[#3B745B] transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-[#253D4E] font-semibold">Hot Deals</span>
                    </nav>
                </div>

                {/* Header Section */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#DEF9EC] flex items-center justify-center">
                                <Flame className="h-6 w-6 sm:h-7 sm:w-7 text-[#3B745B]" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#253D4E]">Hot Deals</h1>
                                <p className="text-sm sm:text-base text-[#7E7E7E]">Limited time offers - Don't miss out!</p>
                            </div>
                        </div>
                    </div>

                    {/* Filters and View Toggle */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6 bg-gray-50 rounded-xl">
                        {/* Category Filters */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-[#253D4E] hidden sm:block" />
                            <span className="text-xs sm:text-sm font-semibold text-[#253D4E] hidden sm:inline">Filter:</span>
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                                        selectedCategory === category
                                            ? "bg-[#3B745B] text-white"
                                            : "bg-white text-[#253D4E] hover:bg-[#DEF9EC] hover:text-[#3B745B]"
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex items-center gap-2 bg-white rounded-lg p-1">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded transition-colors ${
                                    viewMode === "grid"
                                        ? "bg-[#3B745B] text-white"
                                        : "text-[#253D4E] hover:bg-gray-100"
                                }`}
                            >
                                <Grid className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded transition-colors ${
                                    viewMode === "list"
                                        ? "bg-[#3B745B] text-white"
                                        : "text-[#253D4E] hover:bg-gray-100"
                                }`}
                            >
                                <List className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Products Grid/List */}
                {viewMode === "grid" ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="group relative rounded-xl sm:rounded-2xl border border-gray-100 bg-white p-3 sm:p-4 md:p-5 transition-all duration-300 hover:border-[#3B745B]/50 hover:shadow-lg"
                            >
                                {/* Badge */}
                                <span className={`absolute left-0 top-0 rounded-br-xl sm:rounded-br-2xl rounded-tl-xl sm:rounded-tl-2xl px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold z-10 ${product.badge.color} ${product.badge.textColor}`}>
                                    {product.badge.text}
                                </span>

                                {/* Timer Badge */}
                                <div className="absolute right-0 top-0 rounded-bl-xl sm:rounded-bl-2xl rounded-tr-xl sm:rounded-tr-2xl bg-[#E74C3C] px-2 sm:px-3 py-1 sm:py-1.5 flex items-center gap-1 z-10">
                                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                                    <span className="text-[10px] sm:text-xs font-bold text-white">{product.timeLeft}</span>
                                </div>

                                {/* Product Image */}
                                <div className="mb-3 sm:mb-4 flex h-40 sm:h-48 md:h-56 items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                                    />
                                </div>

                                {/* Category */}
                                <div className="mb-1 text-[10px] sm:text-xs text-[#ADADAD] truncate">{product.category}</div>

                                {/* Title */}
                                <h3 className="mb-2 text-sm sm:text-base font-bold text-[#253D4E] line-clamp-2 min-h-[2.5rem]">{product.name}</h3>

                                {/* Rating Stars */}
                                <div className="mb-2 flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-3 w-3 sm:h-4 sm:w-4 ${i < product.rating ? "fill-[#FDC040] text-[#FDC040]" : "fill-gray-200 text-gray-200"}`}
                                        />
                                    ))}
                                    <span className="ml-1 text-xs text-[#ADADAD]">({product.rating})</span>
                                </div>

                                {/* Price */}
                                <div className="mb-4 flex items-center gap-2">
                                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-[#3B745B]">{product.price}</span>
                                    <span className="text-sm sm:text-base text-[#ADADAD] line-through">{product.oldPrice}</span>
                                    <span className="ml-auto text-xs sm:text-sm font-bold text-[#E74C3C]">-{product.discount}%</span>
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={() => {
                                        addToCart({
                                            id: product.id,
                                            name: product.name,
                                            image: product.image,
                                            price: product.price,
                                            weight: product.name.split(' ').pop() || '1kg',
                                            quantity: 1,
                                        });
                                    }}
                                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#3B745B] py-2.5 sm:py-3 text-sm sm:text-base font-bold text-white transition-colors hover:bg-[#2a5542]"
                                >
                                    <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                                    Add to cart
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 sm:gap-6">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="group flex flex-col sm:flex-row gap-4 sm:gap-6 rounded-xl sm:rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 transition-all duration-300 hover:border-[#3B745B]/50 hover:shadow-lg"
                            >
                                {/* Image */}
                                <div className="w-full sm:w-48 md:w-64 flex-shrink-0 h-48 sm:h-48 md:h-56 rounded-lg overflow-hidden bg-gray-50">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1 flex flex-col">
                                    {/* Badges */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`rounded-lg px-2 sm:px-3 py-1 text-xs font-bold ${product.badge.color} ${product.badge.textColor}`}>
                                            {product.badge.text}
                                        </span>
                                        <div className="flex items-center gap-1 rounded-lg bg-[#E74C3C] px-2 sm:px-3 py-1">
                                            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                                            <span className="text-xs font-bold text-white">{product.timeLeft}</span>
                                        </div>
                                    </div>

                                    {/* Category */}
                                    <div className="mb-1 text-xs text-[#ADADAD]">{product.category}</div>

                                    {/* Title */}
                                    <h3 className="mb-2 text-lg sm:text-xl font-bold text-[#253D4E]">{product.name}</h3>

                                    {/* Rating */}
                                    <div className="mb-3 flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < product.rating ? "fill-[#FDC040] text-[#FDC040]" : "fill-gray-200 text-gray-200"}`}
                                            />
                                        ))}
                                        <span className="ml-1 text-sm text-[#ADADAD]">({product.rating})</span>
                                    </div>

                                    {/* Price and Button */}
                                    <div className="mt-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl sm:text-3xl font-bold text-[#3B745B]">{product.price}</span>
                                            <span className="text-lg text-[#ADADAD] line-through">{product.oldPrice}</span>
                                            <span className="text-sm font-bold text-[#E74C3C]">-{product.discount}%</span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                addToCart({
                                                    id: product.id,
                                                    name: product.name,
                                                    image: product.image,
                                                    price: product.price,
                                                    weight: product.name.split(' ').pop() || '1kg',
                                                    quantity: 1,
                                                });
                                            }}
                                            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-[#3B745B] px-6 py-2.5 sm:py-3 text-sm sm:text-base font-bold text-white transition-colors hover:bg-[#2a5542]"
                                        >
                                            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                                            Add to cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                    <div className="text-center py-12 sm:py-16">
                        <Flame className="h-16 w-16 sm:h-20 sm:w-20 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl sm:text-2xl font-bold text-[#253D4E] mb-2">No hot deals found</h3>
                        <p className="text-sm sm:text-base text-[#7E7E7E]">Try selecting a different category</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default HotDeals;

