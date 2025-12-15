import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingCart, ChevronLeft, ChevronRight, Heart, Truck, RefreshCcw, ChevronRight as ChevronRightIcon } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

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
import userProfile from "../assets/images/user_profile.png";

function ProductDetail() {
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const [selectedImage, setSelectedImage] = useState(0);
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
    const [selectedWeight, setSelectedWeight] = useState("800g");
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
    
    // Product ID for wishlist
    const productId = 1;
    const isWishlisted = isInWishlist(productId);

    // Handle window resize for responsive carousel
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    // Product thumbnails
    const productThumbnails = [
        { id: 1, image: apple, name: "Apple" },
        { id: 2, image: orange, name: "Orange" },
        { id: 3, image: potato, name: "Potato" },
        { id: 4, image: carrot, name: "Carrot" },
    ];

    // Main product data
    const mainProduct = {
        name: "Premium Quality Strawberries",
        rating: 4.5,
        reviewsCount: 150,
        inStock: true,
        price: "£2.00",
        priceUnit: "/KG",
        description: "Premium Quality Strawberries locally grown in Lahore. Each and every Strawberry has undergone strict quality check. Harvested fresh daily from farm.",
    };

    const weightOptions = ["500g", "800g", "1 kg", "2 kg", "5g"];

    // Reviews data
    const reviews = [
        {
            id: 1,
            name: "Leo",
            role: "Lead Designer",
            rating: 4,
            title: "It was a very good experience",
            comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            avatar: userProfile,
        },
        {
            id: 2,
            name: "Leo",
            role: "Lead Designer",
            rating: 4,
            title: "It was a very good experience",
            comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            avatar: userProfile,
        },
        {
            id: 3,
            name: "Leo",
            role: "Lead Designer",
            rating: 4,
            title: "It was a very good experience",
            comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            avatar: userProfile,
        },
        {
            id: 4,
            name: "Leo",
            role: "Lead Designer",
            rating: 4,
            title: "It was a very good experience",
            comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            avatar: userProfile,
        },
        {
            id: 5,
            name: "Leo",
            role: "Lead Designer",
            rating: 4,
            title: "It was a very good experience",
            comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            avatar: userProfile,
        },
    ];

    // Related products
    const relatedProducts = [
        { id: 1, name: "Redish 500g", category: "Vegetables", image: redish, rating: 4, price: "£2", oldPrice: "£3.99", brand: "Mr.food" },
        { id: 2, name: "Potatos 1kg", category: "Vegetables", image: potato, rating: 5, price: "£1", oldPrice: "£1.99", brand: "Mr.food" },
        { id: 3, name: "Tomatos 200g", category: "Fruits", image: tomato, rating: 4, price: "£0.30", oldPrice: "£0.99", brand: "Mr.food" },
        { id: 4, name: "Broccoli 1kg", category: "Vegetables", image: broccoli, rating: 4, price: "£1.50", oldPrice: "£2.99", brand: "Mr.food" },
        { id: 5, name: "Green Beans 250g", category: "Vegetables", image: greenbean, rating: 2, price: "£1", oldPrice: "£1.99", brand: "Mr.food" },
    ];

    const getMaxIndex = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth >= 1024) return Math.max(0, reviews.length - 3); // Desktop: 3 cards
            if (window.innerWidth >= 640) return Math.max(0, reviews.length - 2); // Tablet: 2 cards
            return Math.max(0, reviews.length - 1); // Mobile: 1 card
        }
        return Math.max(0, reviews.length - 3);
    };

    const nextReview = () => {
        setCurrentReviewIndex((prev) => {
            const maxIndex = getMaxIndex();
            return prev >= maxIndex ? 0 : prev + 1;
        });
    };

    const prevReview = () => {
        setCurrentReviewIndex((prev) => {
            const maxIndex = getMaxIndex();
            return prev <= 0 ? maxIndex : prev - 1;
        });
    };

    return (
        <div className="w-full bg-white min-h-screen">
            <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
                
                {/* ================= BREADCRUMB NAVIGATION ================= */}
                <div className="mb-8">
                    <nav className="flex items-center gap-2 text-sm text-[#7E7E7E]">
                        <Link to="/" className="hover:text-[#3B745B] transition-colors">Home</Link>
                        <ChevronRightIcon className="h-4 w-4" />
                        <span>Fruits</span>
                        <ChevronRightIcon className="h-4 w-4" />
                        <span className="text-[#253D4E] font-semibold">Strawberry</span>
                    </nav>
                </div>

                {/* ================= PRODUCT DETAIL SECTION ================= */}
                <div className="mb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        
                        {/* LEFT: Product Images */}
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Thumbnails Column */}
                            <div className="flex flex-row lg:flex-col gap-4 order-2 lg:order-1">
                                {productThumbnails.map((thumb, index) => (
                                    <button
                                        key={thumb.id}
                                        onClick={() => setSelectedImage(index + 1)}
                                        className={`flex-shrink-0 h-20 w-20 lg:h-24 lg:w-24 rounded-lg border-2 overflow-hidden transition-all bg-white ${
                                            selectedImage === index + 1
                                                ? "border-[#3B745B] scale-105"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    >
                                        <img
                                            src={thumb.image}
                                            alt={thumb.name}
                                            className="h-full w-full object-contain p-2"
                                        />
                                    </button>
                                ))}
                            </div>

                            {/* Main Product Image */}
                            <div className="flex-1 order-1 lg:order-2">
                                <div className="w-full h-96 lg:h-[500px] bg-gray-50 rounded-2xl p-8 flex items-center justify-center border border-gray-200">
                                    <img
                                        src={selectedImage === 0 ? strawberry : productThumbnails[selectedImage - 1].image}
                                        alt={mainProduct.name}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Product Details */}
                        <div className="flex flex-col">
                            <h1 className="text-3xl lg:text-4xl font-bold text-[#253D4E] mb-4">
                                {mainProduct.name}
                            </h1>
                            
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => {
                                        if (i < Math.floor(mainProduct.rating)) {
                                            // Full star
                                            return <Star key={i} className="h-5 w-5 fill-[#3B745B] text-[#3B745B]" />;
                                        } else if (i < mainProduct.rating) {
                                            // Half star - show as half-filled
                                            return (
                                                <div key={i} className="relative h-5 w-5">
                                                    <Star className="h-5 w-5 fill-gray-200 text-gray-200" />
                                                    <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                                                        <Star className="h-5 w-5 fill-[#3B745B] text-[#3B745B]" />
                                                    </div>
                                                </div>
                                            );
                                        } else {
                                            // Empty star
                                            return <Star key={i} className="h-5 w-5 fill-gray-200 text-gray-200" />;
                                        }
                                    })}
                                </div>
                                <span className="text-sm text-[#7E7E7E]">({mainProduct.reviewsCount} Reviews)</span>
                                <span className="h-4 w-px bg-gray-300"></span>
                                <span className="text-sm font-semibold text-[#3B745B]">In Stock</span>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-[#253D4E]">{mainProduct.price}</span>
                                    <span className="text-xl text-[#7E7E7E]">{mainProduct.priceUnit}</span>
                                </div>
                            </div>

                            <p className="text-[#7E7E7E] mb-6 leading-relaxed">
                                {mainProduct.description}
                            </p>

                            {/* Weight Selection */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-[#253D4E] mb-3">Kg:</label>
                                <div className="flex flex-wrap gap-3">
                                    {weightOptions.map((weight) => (
                                        <button
                                            key={weight}
                                            onClick={() => setSelectedWeight(weight)}
                                            className={`px-6 py-2 rounded-lg border-2 font-semibold text-sm transition-all ${
                                                selectedWeight === weight
                                                    ? "bg-[#3B745B] text-white border-[#3B745B]"
                                                    : "bg-white text-[#253D4E] border-gray-300 hover:border-[#3B745B]"
                                            }`}
                                        >
                                            {weight}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 mb-8">
                                <button 
                                    onClick={() => {
                                        addToCart({
                                            id: productId,
                                            name: mainProduct.name,
                                            image: selectedImage === 0 ? strawberry : productThumbnails[selectedImage - 1].image,
                                            price: mainProduct.price,
                                            weight: selectedWeight,
                                            quantity: 1,
                                        });
                                    }}
                                    className="px-8 py-4 bg-[#3B745B] text-white font-bold rounded-lg hover:bg-[#2a5542] transition-colors flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    Add to cart
                                </button>
                                <button 
                                    onClick={() => {
                                        if (isWishlisted) {
                                            removeFromWishlist(productId);
                                        } else {
                                            addToWishlist({
                                                id: productId,
                                                name: mainProduct.name,
                                                image: selectedImage === 0 ? strawberry : productThumbnails[selectedImage - 1].image,
                                                price: mainProduct.price,
                                                rating: mainProduct.rating,
                                                reviewsCount: mainProduct.reviewsCount,
                                                category: "Fruits",
                                            });
                                        }
                                    }}
                                    className={`w-14 h-14 border-2 rounded-lg transition-colors flex items-center justify-center ${
                                        isWishlisted 
                                            ? "border-[#3B745B] bg-[#DEF9EC]" 
                                            : "border-gray-300 hover:border-gray-400"
                                    }`}
                                >
                                    <Heart className={`h-6 w-6 ${isWishlisted ? "fill-[#3B745B] text-[#3B745B]" : "text-[#253D4E]"}`} />
                                </button>
                            </div>

                            {/* Delivery and Return Information Box */}
                            <div className="border border-gray-300 rounded-lg p-4 space-y-4">
                                {/* Delivery Information */}
                                <div className="flex items-start gap-3">
                                    <Truck className="h-5 w-5 text-[#253D4E] mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-[#253D4E] mb-1">Free Delivery</p>
                                        <a href="#" className="text-sm text-[#253D4E] underline hover:text-[#3B745B] transition-colors">
                                            Enter your postal code for Delivery Availability.
                                        </a>
                                    </div>
                                </div>

                                {/* Return Information */}
                                <div className="flex items-start gap-3">
                                    <RefreshCcw className="h-5 w-5 text-[#253D4E] mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-[#253D4E] mb-1">Return Delivery</p>
                                        <a href="#" className="text-sm text-[#253D4E]">
                                            Free 30 Days Delivery Returns. <span className="underline">Details.</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= DESCRIPTION SECTION ================= */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-[#253D4E] mb-6">Description</h2>
                    <div className="text-[#7E7E7E] leading-relaxed space-y-4">
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>This product will have a battery that exceeds 80% capacity relative to new</li>
                            <li>Accessories may not be original</li>
                            <li>Product will come with a SIM removal tool, a charger and a charging cable</li>
                            <li>This product is eligible for a replacement or refund within 90-day of receipt</li>
                        </ul>
                    </div>
                </div>

                {/* ================= ABOUT THIS ITEM SECTION ================= */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-[#253D4E] mb-6">About this item</h2>
                    <ul className="space-y-3 text-[#7E7E7E]">
                        <li className="flex items-start gap-2">
                            <span className="text-[#3B745B] font-bold">•</span>
                            <span><strong className="text-[#253D4E]">EDTA:</strong> Ensures stability and enhances the product's performance.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#3B745B] font-bold">•</span>
                            <span><strong className="text-[#253D4E]">LMW (Low Molecular Weight):</strong> Delivers hydration deep into the skin for a plump and healthy appearance.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#3B745B] font-bold">•</span>
                            <span><strong className="text-[#253D4E]">Glycerin:</strong> Locks in moisture to keep your lips and cheeks hydrated all day.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#3B745B] font-bold">•</span>
                            <span><strong className="text-[#253D4E]">Provitamin B5:</strong> Provides nourishment and soothes the skin for a smooth application.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#3B745B] font-bold">•</span>
                            <span><strong className="text-[#253D4E]">B3 (Niacinamide):</strong> Brightens and improves skin texture for a flawless look.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#3B745B] font-bold">•</span>
                            <span><strong className="text-[#253D4E]">PE:</strong> Maintains formula stability over time.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#3B745B] font-bold">•</span>
                            <span><strong className="text-[#253D4E]">Color:</strong> Adds the perfect pink hue for a natural blush and lip color.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#3B745B] font-bold">•</span>
                            <span><strong className="text-[#253D4E]">Potassium Sorbate:</strong> Preserves the product for extended use.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#3B745B] font-bold">•</span>
                            <span><strong className="text-[#253D4E]">Aqua:</strong> Serves as a hydrating base for the formula.</span>
                        </li>
                    </ul>
                </div>

                {/* ================= REVIEWS SECTION ================= */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-[#253D4E] mb-8 text-center">
                        What People Say about this product
                    </h2>
                    
                    <div className="relative px-4 sm:px-8 lg:px-16">
                        {/* Review Cards Carousel */}
                        <div className="overflow-hidden">
                            <div 
                                className="flex transition-transform duration-300 ease-in-out gap-4 sm:gap-6"
                                style={{ 
                                    transform: `translateX(-${currentReviewIndex * (windowWidth >= 1024 ? 100 / 3 : windowWidth >= 640 ? 100 / 2 : 100)}%)` 
                                }}
                            >
                                {reviews.map((review) => (
                                    <div
                                        key={review.id}
                                        className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] flex-shrink-0"
                                    >
                                        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-md border border-gray-100">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-start gap-3">
                                                    <img
                                                        src={review.avatar}
                                                        alt={review.name}
                                                        className="h-14 w-14 rounded-full object-cover flex-shrink-0"
                                                    />
                                                    <div>
                                                        <h3 className="text-base font-bold text-[#253D4E] mb-1">{review.name}</h3>
                                                        <p className="text-sm text-[#7E7E7E]">{review.role}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 flex-shrink-0">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-4 w-4 ${
                                                                i < review.rating
                                                                    ? "fill-[#3B745B] text-[#3B745B]"
                                                                    : "fill-gray-200 text-gray-200"
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <h4 className="text-base font-bold text-[#253D4E] mb-3">{review.title}</h4>
                                            <p className="text-sm text-[#7E7E7E] leading-relaxed">{review.comment}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Arrows */}
                        <button
                            onClick={prevReview}
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-[#3B745B] text-white flex items-center justify-center hover:bg-[#2a5542] transition-colors shadow-lg z-10"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                            onClick={nextReview}
                            className="absolute right-0 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-[#3B745B] text-white flex items-center justify-center hover:bg-[#2a5542] transition-colors shadow-lg z-10"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>

                        {/* Dots Indicator */}
                        <div className="flex justify-center items-center gap-2 mt-8">
                            <ChevronLeft className="h-4 w-4 text-[#3B745B]" />
                            {reviews.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentReviewIndex(index)}
                                    className={`rounded-full transition-all ${
                                        index === currentReviewIndex
                                            ? "w-2 h-2 bg-[#3B745B]"
                                            : "w-2 h-2 bg-gray-300"
                                    }`}
                                />
                            ))}
                            <ChevronRight className="h-4 w-4 text-[#3B745B]" />
                        </div>
                    </div>
                </div>

                {/* ================= RELATED PRODUCTS SECTION ================= */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-[#253D4E] mb-8">Related Products</h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {relatedProducts.map((product) => {
                            const isProductWishlisted = isInWishlist(product.id);
                            return (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-2xl p-4 border border-gray-200 hover:shadow-lg transition-shadow relative"
                                >
                                    {/* Wishlist Button */}
                                    <button
                                        onClick={() => {
                                            if (isProductWishlisted) {
                                                removeFromWishlist(product.id);
                                            } else {
                                                addToWishlist({
                                                    id: product.id,
                                                    name: product.name,
                                                    image: product.image,
                                                    price: product.price,
                                                    oldPrice: product.oldPrice,
                                                    rating: product.rating,
                                                    category: product.category,
                                                    brand: product.brand,
                                                });
                                            }
                                        }}
                                        className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
                                            isProductWishlisted 
                                                ? "bg-[#DEF9EC] text-[#3B745B]" 
                                                : "bg-white text-[#253D4E] hover:bg-gray-100"
                                        } shadow-sm`}
                                        aria-label={isProductWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                                    >
                                        <Heart className={`h-4 w-4 ${isProductWishlisted ? "fill-[#3B745B]" : ""}`} />
                                    </button>

                                    <div className="h-32 mb-4 flex items-center justify-center bg-white rounded-lg overflow-hidden border border-gray-100">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-full w-full object-contain p-2"
                                        />
                                    </div>
                                    
                                    <div className="text-xs text-[#ADADAD] mb-1">{product.category}</div>
                                    <h3 className="text-sm font-bold text-[#253D4E] mb-2">{product.name}</h3>
                                    
                                    <div className="flex items-center gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-3 w-3 ${
                                                    i < product.rating
                                                        ? "fill-[#FDC040] text-[#FDC040]"
                                                        : "fill-gray-200 text-gray-200"
                                                }`}
                                            />
                                        ))}
                                        <span className="text-xs text-[#ADADAD] ml-1">({product.rating})</span>
                                    </div>
                                    
                                    <div className="text-xs text-[#ADADAD] mb-2">By {product.brand}</div>
                                    
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-base font-bold text-[#3B745B]">{product.price}</span>
                                        <span className="text-xs text-[#ADADAD] line-through">{product.oldPrice}</span>
                                    </div>
                                    
                                    <button 
                                        onClick={() => {
                                            addToCart({
                                                id: product.id,
                                                name: product.name,
                                                image: product.image,
                                                price: product.price,
                                                weight: product.name.split(' ').pop() || '1kg', // Extract weight from name
                                                quantity: 1,
                                            });
                                        }}
                                        className="w-full py-2 bg-[#DEF9EC] text-[#3B745B] text-sm font-bold rounded-lg hover:bg-[#3B745B] hover:text-white transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
