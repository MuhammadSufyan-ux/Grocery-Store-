import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Star, ShoppingCart, ChevronLeft, ChevronRight, Heart, Truck, RefreshCcw, ChevronRight as ChevronRightIcon, Loader, Maximize2, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const userProfile = "https://via.placeholder.com/56?text=User";

function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const [selectedImage, setSelectedImage] = useState(0);
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
    const [selectedWeight, setSelectedWeight] = useState(null);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [isFullscreen, setIsFullscreen] = useState(false);
    const mainImageRef = useRef(null);
    const zoomImageRef = useRef(null);
    
    // Product data states
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [error, setError] = useState(null);

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

    // Fetch product data
    useEffect(() => {
        if (id) {
            fetchProduct();
        }
    }, [id]);

    // Set default selected weight when product loads
    useEffect(() => {
        if (product) {
            if (product.sizes && product.sizes.length > 0) {
                const defaultSize = product.sizes[0];
                setSelectedWeight(`${defaultSize.value}${defaultSize.unit}`);
            } else if (product.size) {
                setSelectedWeight(`${product.size.value}${product.size.unit}`);
            } else {
                setSelectedWeight("1kg");
            }
        }
    }, [product]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_URL}/api/products/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setProduct(data.product);
                // Fetch related products from same category
                fetchRelatedProducts(data.product.category);
                // Fetch reviews for this product
                fetchReviews(data.product._id);
            } else {
                setError("Product not found");
            }
        } catch (err) {
            console.error("Error fetching product:", err);
            setError("Error loading product. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedProducts = async (category) => {
        try {
            const response = await fetch(`${API_URL}/api/products?category=${encodeURIComponent(category)}&limit=5&status=active`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Filter out the current product and format
                const formattedProducts = data.products
                    .filter(p => p._id !== id)
                    .slice(0, 5)
                    .map((p) => ({
                        id: p._id,
                        _id: p._id,
                        name: p.name,
                        category: p.category,
                        image: p.image,
                        rating: p.rating || 0,
                        salePrice: p.salePrice,
                        regularPrice: p.regularPrice,
                        price: `£${p.salePrice?.toFixed(2) || p.regularPrice?.toFixed(2) || 0}`,
                        oldPrice: p.salePrice && p.regularPrice > p.salePrice 
                            ? `£${p.regularPrice.toFixed(2)}` 
                            : null,
                    }));
                setRelatedProducts(formattedProducts);
            }
        } catch (err) {
            console.error("Error fetching related products:", err);
        }
    };

    const fetchReviews = async (productId) => {
        try {
            setLoadingReviews(true);
            const response = await fetch(`${API_URL}/api/reviews/product/${productId}?limit=50`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Format reviews to match UI structure
                const formattedReviews = data.reviews.map((review) => ({
                    id: review._id,
                    name: review.name || (review.user && review.user.name) || "Anonymous",
                    role: "Customer",
                    rating: review.rating,
                    title: review.title,
                    comment: review.comment,
                    avatar: userProfile, // Default avatar, can be extended with user avatars later
                    createdAt: review.createdAt,
                }));
                setReviews(formattedReviews);
            }
        } catch (err) {
            console.error("Error fetching reviews:", err);
            // Set empty array on error so UI still renders
            setReviews([]);
        } finally {
            setLoadingReviews(false);
        }
    };

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

    // Get all images (main image + gallery)
    const getAllImages = () => {
        if (!product) return [];
        const images = [product.image];
        if (product.gallery && product.gallery.length > 0) {
            images.push(...product.gallery);
        }
        return images;
    };

    // Get weight options
    const getWeightOptions = () => {
        if (!product) return [];
        if (product.sizes && product.sizes.length > 0) {
            return product.sizes.map(size => `${size.value}${size.unit}`);
        }
        if (product.size) {
            return [`${product.size.value}${product.size.unit}`];
        }
        return ["1kg"];
    };

    // Get current price based on selected weight
    const getCurrentPrice = () => {
        if (!product) return { price: 0, oldPrice: null };
        
        if (selectedWeight && product.sizes && product.sizes.length > 0) {
            const selectedSize = product.sizes.find(
                s => `${s.value}${s.unit}` === selectedWeight
            );
            if (selectedSize && selectedSize.price) {
                return {
                    price: selectedSize.price,
                    oldPrice: product.regularPrice > selectedSize.price ? product.regularPrice : null
                };
            }
        }
        
        return {
            price: product.salePrice || product.regularPrice || 0,
            oldPrice: product.salePrice && product.regularPrice > product.salePrice ? product.regularPrice : null
        };
    };

    if (loading) {
        return (
            <div className="w-full bg-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader className="h-12 w-12 animate-spin text-[#3B745B] mx-auto mb-4" />
                    <p className="text-gray-600">Loading product...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="w-full bg-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-[#253D4E] mb-4">Product Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || "The product you're looking for doesn't exist."}</p>
                    <Link
                        to="/shop"
                        className="inline-block px-6 py-3 bg-[#3B745B] text-white rounded-lg hover:bg-[#2a5542] transition-colors font-semibold"
                    >
                        Back to Shop
                    </Link>
                </div>
            </div>
        );
    }

    const images = getAllImages();
    const weightOptions = getWeightOptions();
    const currentPrice = getCurrentPrice();
    const productId = product._id;
    const isWishlisted = isInWishlist(productId);
    const inStock = product.stock?.inStock !== false;

    return (
        <div className="w-full bg-white min-h-screen">
            <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
                
                {/* ================= BREADCRUMB NAVIGATION ================= */}
                <div className="mb-8">
                    <nav className="flex items-center gap-2 text-sm text-[#7E7E7E]">
                        <Link to="/" className="hover:text-[#3B745B] transition-colors">Home</Link>
                        <ChevronRightIcon className="h-4 w-4" />
                        <Link to="/shop" className="hover:text-[#3B745B] transition-colors">Shop</Link>
                        <ChevronRightIcon className="h-4 w-4" />
                        <span>{product.category}</span>
                        <ChevronRightIcon className="h-4 w-4" />
                        <span className="text-[#253D4E] font-semibold">{product.name}</span>
                    </nav>
                </div>

                {/* ================= PRODUCT DETAIL SECTION ================= */}
                <div className="mb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        
                        {/* LEFT: Product Images */}
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Thumbnails Column - Scrollable with fixed height matching main image */}
                            {images.length > 1 && (
                                <div className="flex flex-row lg:flex-col gap-3 order-2 lg:order-1 lg:h-[500px] lg:overflow-y-auto lg:overflow-x-hidden overflow-x-auto lg:pr-2 scrollbar-hide">
                                    {images.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setSelectedImage(index);
                                                // Scroll thumbnail into view if needed (for mobile)
                                                if (window.innerWidth < 1024) {
                                                    const element = document.querySelector(`[data-thumbnail-index="${index}"]`);
                                                    element?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                                                }
                                            }}
                                            data-thumbnail-index={index}
                                            className={`flex-shrink-0 h-20 w-20 lg:h-20 lg:w-20 rounded-lg border-2 overflow-hidden transition-all bg-white cursor-pointer ${
                                                selectedImage === index
                                                    ? "border-[#3B745B] ring-2 ring-[#3B745B] ring-offset-1 scale-105"
                                                    : "border-gray-200 hover:border-gray-400 hover:scale-105"
                                            }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`${product.name} ${index + 1}`}
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = "https://via.placeholder.com/100?text=No+Image";
                                                }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Main Product Image with Zoom */}
                            <div className="flex-1 order-1 lg:order-2 relative group">
                                <div 
                                    ref={mainImageRef}
                                    className="w-full h-96 lg:h-[500px] bg-gray-50 rounded-2xl p-8 flex items-center justify-center border border-gray-200 relative overflow-hidden cursor-zoom-in"
                                    onMouseEnter={() => setIsZoomed(true)}
                                    onMouseLeave={() => setIsZoomed(false)}
                                    onMouseMove={(e) => {
                                        if (!mainImageRef.current) return;
                                        const rect = mainImageRef.current.getBoundingClientRect();
                                        const x = ((e.clientX - rect.left) / rect.width) * 100;
                                        const y = ((e.clientY - rect.top) / rect.height) * 100;
                                        setZoomPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
                                    }}
                                >
                                    <img
                                        src={images[selectedImage] || product.image}
                                        alt={product.name}
                                        className={`max-h-full max-w-full object-contain transition-all duration-200 ${
                                            isZoomed ? "scale-150" : "scale-100"
                                        }`}
                                        style={{
                                            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                                        }}
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/500?text=No+Image";
                                        }}
                                    />
                                    
                                    {/* Zoom Indicator (optional - shows cursor position) */}
                                    {isZoomed && (
                                        <div 
                                            className="absolute pointer-events-none border-2 border-[#3B745B] rounded-full w-32 h-32 opacity-50"
                                            style={{
                                                left: `calc(${zoomPosition.x}% - 4rem)`,
                                                top: `calc(${zoomPosition.y}% - 4rem)`,
                                            }}
                                        />
                                    )}
                                    
                                    {/* Fullscreen Button */}
                                    <button
                                        onClick={() => setIsFullscreen(true)}
                                        className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-lg shadow-md transition-all opacity-0 group-hover:opacity-100 z-10"
                                        aria-label="View fullscreen"
                                    >
                                        <Maximize2 className="h-5 w-5 text-[#253D4E]" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Fullscreen Image Modal */}
                        {isFullscreen && (
                            <div 
                                className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                                onClick={() => setIsFullscreen(false)}
                            >
                                <button
                                    onClick={() => setIsFullscreen(false)}
                                    className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                                    aria-label="Close fullscreen"
                                >
                                    <X className="h-6 w-6 text-white" />
                                </button>
                                
                                {/* Navigation Arrows */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedImage(selectedImage > 0 ? selectedImage - 1 : images.length - 1);
                                            }}
                                            className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                                            aria-label="Previous image"
                                        >
                                            <ChevronLeft className="h-8 w-8 text-white" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedImage(selectedImage < images.length - 1 ? selectedImage + 1 : 0);
                                            }}
                                            className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                                            aria-label="Next image"
                                        >
                                            <ChevronRight className="h-8 w-8 text-white" />
                                        </button>
                                    </>
                                )}
                                
                                <div className="max-w-7xl max-h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                                    <img
                                        ref={zoomImageRef}
                                        src={images[selectedImage] || product.image}
                                        alt={product.name}
                                        className="max-h-[90vh] max-w-full object-contain"
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/800?text=No+Image";
                                        }}
                                    />
                                </div>

                                {/* Image Counter */}
                                {images.length > 1 && (
                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
                                        {selectedImage + 1} / {images.length}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* RIGHT: Product Details */}
                        <div className="flex flex-col">
                            <h1 className="text-3xl lg:text-4xl font-bold text-[#253D4E] mb-4">
                                {product.name}
                            </h1>
                            
                            <div className="flex items-center gap-3 mb-4 flex-wrap">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => {
                                        const rating = product.rating || 0;
                                        if (i < Math.floor(rating)) {
                                            return <Star key={i} className="h-5 w-5 fill-[#3B745B] text-[#3B745B]" />;
                                        } else if (i < rating) {
                                            return (
                                                <div key={i} className="relative h-5 w-5">
                                                    <Star className="h-5 w-5 fill-gray-200 text-gray-200" />
                                                    <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                                                        <Star className="h-5 w-5 fill-[#3B745B] text-[#3B745B]" />
                                                    </div>
                                                </div>
                                            );
                                        } else {
                                            return <Star key={i} className="h-5 w-5 fill-gray-200 text-gray-200" />;
                                        }
                                    })}
                                </div>
                                <span className="text-sm text-[#7E7E7E]">({product.reviewsCount || 0} Reviews)</span>
                                <span className="h-4 w-px bg-gray-300"></span>
                                <span className={`text-sm font-semibold ${inStock ? "text-[#3B745B]" : "text-red-600"}`}>
                                    {inStock ? "In Stock" : "Out of Stock"}
                                </span>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-[#253D4E]">
                                        £{currentPrice.price.toFixed(2)}
                                    </span>
                                    {product.size && (
                                        <span className="text-xl text-[#7E7E7E]">
                                            /{product.size.unit}
                                        </span>
                                    )}
                                    {currentPrice.oldPrice && (
                                        <span className="text-xl text-[#7E7E7E] line-through ml-2">
                                            £{currentPrice.oldPrice.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <p className="text-[#7E7E7E] mb-6 leading-relaxed">
                                {product.description}
                            </p>

                            {/* Weight/Size Selection */}
                            {weightOptions.length > 1 && (
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-[#253D4E] mb-3">
                                        {product.size?.unit ? `${product.size.unit.charAt(0).toUpperCase() + product.size.unit.slice(1)}:` : "Size:"}
                                    </label>
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
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-4 mb-8">
                                <button 
                                    onClick={() => {
                                        if (!inStock) return;
                                        addToCart({
                                            id: productId,
                                            name: product.name,
                                            image: images[selectedImage] || product.image,
                                            price: `£${currentPrice.price.toFixed(2)}`,
                                            weight: selectedWeight || weightOptions[0] || "1kg",
                                            quantity: 1,
                                        });
                                    }}
                                    disabled={!inStock}
                                    className="px-8 py-4 bg-[#3B745B] text-white font-bold rounded-lg hover:bg-[#2a5542] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    {inStock ? "Add to cart" : "Out of Stock"}
                                </button>
                                <button 
                                    onClick={() => {
                                        if (isWishlisted) {
                                            removeFromWishlist(productId);
                                        } else {
                                            addToWishlist({
                                                id: productId,
                                                name: product.name,
                                                image: images[selectedImage] || product.image,
                                                price: `£${currentPrice.price.toFixed(2)}`,
                                                rating: product.rating || 0,
                                                reviewsCount: product.reviewsCount || 0,
                                                category: product.category,
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
                                        <p className="font-semibold text-[#253D4E] mb-1">
                                            {product.isDeliveryFree ? "Free Delivery" : "Delivery Available"}
                                        </p>
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
                {product.description && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-[#253D4E] mb-6">Description</h2>
                        <div className="text-[#7E7E7E] leading-relaxed space-y-4">
                            <p>{product.description}</p>
                        </div>
                    </div>
                )}

                {/* ================= ABOUT THIS ITEM SECTION ================= */}
                {product.about && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-[#253D4E] mb-6">About this item</h2>
                        <div className="text-[#7E7E7E] leading-relaxed whitespace-pre-line">
                            {product.about.split('\n').map((line, index) => (
                                <p key={index} className="mb-2">{line}</p>
                            ))}
                        </div>
                    </div>
                )}

                {/* ================= REVIEWS SECTION ================= */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-[#253D4E] mb-8 text-center">
                        What People Say about this product
                    </h2>
                    
                    {loadingReviews ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader className="h-8 w-8 animate-spin text-[#3B745B] mr-3" />
                            <p className="text-gray-600">Loading reviews...</p>
                        </div>
                    ) : reviews.length > 0 ? (
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
                                                            onError={(e) => {
                                                                e.target.src = userProfile;
                                                            }}
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
                            {reviews.length > (windowWidth >= 1024 ? 3 : windowWidth >= 640 ? 2 : 1) && (
                                <>
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
                                </>
                            )}

                            {/* Dots Indicator */}
                            {reviews.length > 1 && (
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
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-600 text-lg">No reviews yet. Be the first to review this product!</p>
                        </div>
                    )}
                </div>

                {/* ================= RELATED PRODUCTS SECTION ================= */}
                {relatedProducts.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-[#253D4E] mb-8">Related Products</h2>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {relatedProducts.map((relatedProduct) => {
                                const isProductWishlisted = isInWishlist(relatedProduct.id || relatedProduct._id);
                                return (
                                    <div
                                        key={relatedProduct.id || relatedProduct._id}
                                        className="bg-white rounded-2xl p-4 border border-gray-200 hover:shadow-lg transition-shadow relative"
                                    >
                                        {/* Wishlist Button */}
                                        <button
                                            onClick={() => {
                                                const prodId = relatedProduct.id || relatedProduct._id;
                                                if (isProductWishlisted) {
                                                    removeFromWishlist(prodId);
                                                } else {
                                                    addToWishlist({
                                                        id: prodId,
                                                        name: relatedProduct.name,
                                                        image: relatedProduct.image,
                                                        price: relatedProduct.price,
                                                        oldPrice: relatedProduct.oldPrice,
                                                        rating: relatedProduct.rating,
                                                        category: relatedProduct.category,
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

                                        <Link to={`/product/${relatedProduct.id || relatedProduct._id}`}>
                                            <div className="h-32 mb-4 flex items-center justify-center bg-white rounded-lg overflow-hidden border border-gray-100">
                                                <img
                                                    src={relatedProduct.image}
                                                    alt={relatedProduct.name}
                                                    className="h-full w-full object-contain p-2"
                                                    onError={(e) => {
                                                        e.target.src = "https://via.placeholder.com/200?text=No+Image";
                                                    }}
                                                />
                                            </div>
                                        </Link>
                                        
                                        <div className="text-xs text-[#ADADAD] mb-1">{relatedProduct.category}</div>
                                        <Link to={`/product/${relatedProduct.id || relatedProduct._id}`}>
                                            <h3 className="text-sm font-bold text-[#253D4E] mb-2 hover:text-[#3B745B] transition-colors">
                                                {relatedProduct.name}
                                            </h3>
                                        </Link>
                                        
                                        <div className="flex items-center gap-1 mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-3 w-3 ${
                                                        i < (relatedProduct.rating || 0)
                                                            ? "fill-[#FDC040] text-[#FDC040]"
                                                            : "fill-gray-200 text-gray-200"
                                                    }`}
                                                />
                                            ))}
                                            <span className="text-xs text-[#ADADAD] ml-1">({relatedProduct.rating || 0})</span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-base font-bold text-[#3B745B]">{relatedProduct.price}</span>
                                            {relatedProduct.oldPrice && (
                                                <span className="text-xs text-[#ADADAD] line-through">{relatedProduct.oldPrice}</span>
                                            )}
                                        </div>
                                        
                                        <button 
                                            onClick={() => {
                                                addToCart({
                                                    id: relatedProduct.id || relatedProduct._id,
                                                    name: relatedProduct.name,
                                                    image: relatedProduct.image,
                                                    price: relatedProduct.price,
                                                    weight: relatedProduct.name.split(' ').pop() || '1kg',
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
                )}
            </div>
        </div>
    );
}

export default ProductDetail;
