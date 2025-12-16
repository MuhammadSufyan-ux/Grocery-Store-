import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ShoppingCart, Star, Filter, X, Sliders, Grid, List, Loader } from "lucide-react";
import { useCart } from "../context/CartContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Shop() {
    const { addToCart } = useCart();
    const [searchParams, setSearchParams] = useSearchParams();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [viewMode, setViewMode] = useState("grid");
    const [priceRange, setPriceRange] = useState([0, 100]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedRating, setSelectedRating] = useState(0);
    const [sortBy, setSortBy] = useState("default");
    
    // Data states
    const [allProducts, setAllProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch products and categories on mount
    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    // Handle URL query parameter for category
    useEffect(() => {
        const categoryParam = searchParams.get("category");
        if (categoryParam) {
            // Decode the category parameter and set it
            const decodedCategory = decodeURIComponent(categoryParam);
            setSelectedCategories([decodedCategory]);
        } else {
            // Clear selection if no category in URL
            setSelectedCategories([]);
        }
    }, [searchParams]);

    // Calculate price range from products
    useEffect(() => {
        if (allProducts.length > 0) {
            const prices = allProducts.map(p => p.salePrice || p.regularPrice || 0);
            const minPrice = Math.floor(Math.min(...prices));
            const maxPrice = Math.ceil(Math.max(...prices));
            setPriceRange([minPrice, maxPrice]);
        }
    }, [allProducts]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_URL}/api/products?limit=1000&status=active`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Transform products to match UI structure
                const formattedProducts = data.products.map((product) => {
                    // Extract category name - handle both string and object cases
                    let categoryName = product.category;
                    if (typeof product.category === 'object' && product.category !== null) {
                        categoryName = product.category.name || product.category._id || '';
                    }
                    
                    return {
                        id: product._id,
                        _id: product._id,
                        category: categoryName,
                        name: product.name,
                        image: product.image,
                        rating: product.rating || 0,
                        salePrice: product.salePrice,
                        regularPrice: product.regularPrice,
                        price: `£${product.salePrice?.toFixed(2) || product.regularPrice?.toFixed(2) || 0}`,
                        oldPrice: product.salePrice && product.regularPrice > product.salePrice 
                            ? `£${product.regularPrice.toFixed(2)}` 
                            : null,
                        status: product.status,
                        inStock: product.stock?.inStock !== false,
                    };
                });
                setAllProducts(formattedProducts);
            } else {
                setError("Failed to load products");
            }
        } catch (err) {
            console.error("Error fetching products:", err);
            setError("Error loading products. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_URL}/api/categories?includeSubCategories=false`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                const formattedCategories = data.categories
                    .filter((cat) => cat.isActive !== false)
                    .map((cat) => cat.name);
                setCategories(formattedCategories);
            }
        } catch (err) {
            console.error("Error fetching categories:", err);
        }
    };

    const handleCategoryToggle = (category) => {
        setSelectedCategories(prev => {
            const newCategories = prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category];
            
            // Update URL if category filter changes
            if (newCategories.length === 1) {
                setSearchParams({ category: newCategories[0] });
            } else if (newCategories.length === 0) {
                setSearchParams({});
            } else {
                // Multiple categories selected, don't update URL
            }
            
            return newCategories;
        });
    };

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        return allProducts.filter(product => {
            // Category filter - compare category names (case-insensitive)
            if (selectedCategories.length > 0) {
                const productCategory = (product.category || '').trim().toLowerCase();
                const matchesCategory = selectedCategories.some(selectedCat => 
                    (selectedCat || '').trim().toLowerCase() === productCategory
                );
                if (!matchesCategory) {
                    return false;
                }
            }
            
            // Rating filter
            if (selectedRating > 0 && product.rating < selectedRating) {
                return false;
            }
            
            // Price filter
            const productPrice = product.salePrice || product.regularPrice || 0;
            if (productPrice < priceRange[0] || productPrice > priceRange[1]) {
                return false;
            }
            
            // Stock filter (only show in-stock products)
            if (!product.inStock) {
                return false;
            }
            
            return true;
        });
    }, [allProducts, selectedCategories, selectedRating, priceRange]);

    const sortedProducts = useMemo(() => {
        return [...filteredProducts].sort((a, b) => {
            const priceA = a.salePrice || a.regularPrice || 0;
            const priceB = b.salePrice || b.regularPrice || 0;
            
            switch (sortBy) {
                case "price-low":
                    return priceA - priceB;
                case "price-high":
                    return priceB - priceA;
                case "rating":
                    return (b.rating || 0) - (a.rating || 0);
                default:
                    return 0;
            }
        });
    }, [filteredProducts, sortBy]);

    // Calculate max price for slider
    const maxPrice = useMemo(() => {
        if (allProducts.length === 0) return 100;
        const prices = allProducts.map(p => p.salePrice || p.regularPrice || 0);
        return Math.ceil(Math.max(...prices));
    }, [allProducts]);

    const handleClearFilters = () => {
        setSelectedCategories([]);
        setSelectedRating(0);
        const prices = allProducts.map(p => p.salePrice || p.regularPrice || 0);
        const minPrice = Math.floor(Math.min(...prices));
        const maxPrice = Math.ceil(Math.max(...prices));
        setPriceRange([minPrice, maxPrice]);
        setSearchParams({});
    };

    const handleAddToCart = (product) => {
        const sizeInfo = product.size 
            ? `${product.size.value}${product.size.unit}` 
            : product.name.split(' ').pop() || '1kg';
        
        addToCart({
            id: product._id || product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            weight: sizeInfo,
            quantity: 1,
        });
    };

    return (
        <div className="w-full bg-white min-h-screen py-4 sm:py-6 md:py-8">
            <div className="mx-auto w-full max-w-[1600px] px-2 sm:px-4 md:px-6 lg:px-8">
                
                {/* Breadcrumb */}
                <div className="mb-4 sm:mb-6">
                    <nav className="flex items-center gap-2 text-xs sm:text-sm text-[#7E7E7E]">
                        <Link to="/" className="hover:text-[#3B745B] transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-[#253D4E] font-semibold">Shop</span>
                    </nav>
                </div>

                {/* Header Section */}
                <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#253D4E] mb-1">Shop</h1>
                        <p className="text-xs sm:text-sm text-[#7E7E7E]">
                            {loading ? "Loading..." : `Showing ${sortedProducts.length} product${sortedProducts.length !== 1 ? 's' : ''}`}
                        </p>
                    </div>

                    {/* Filter Button & Sort */}
                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                        {/* Filter Toggle Button */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#3B745B] text-white rounded-lg hover:bg-[#2a5542] transition-colors text-xs sm:text-sm font-semibold"
                        >
                            <Filter className="h-4 w-4" />
                            <span className="hidden sm:inline">Filters</span>
                        </button>

                        {/* View Mode Toggle */}
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 ml-auto sm:ml-0">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-1.5 sm:p-2 rounded transition-colors ${
                                    viewMode === "grid"
                                        ? "bg-[#3B745B] text-white"
                                        : "text-[#253D4E] hover:bg-gray-200"
                                }`}
                            >
                                <Grid className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-1.5 sm:p-2 rounded transition-colors ${
                                    viewMode === "list"
                                        ? "bg-[#3B745B] text-white"
                                        : "text-[#253D4E] hover:bg-gray-200"
                                }`}
                            >
                                <List className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                        </div>

                        {/* Sort Dropdown */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#3B745B] bg-white"
                        >
                            <option value="default">Sort by: Default</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="rating">Rating: High to Low</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-4 sm:gap-6 relative">
                    {/* Sidebar Overlay (Mobile) */}
                    {sidebarOpen && (
                        <div
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                    )}

                    {/* Filters Sidebar */}
                    <aside
                        className={`fixed lg:static top-0 left-0 h-full lg:h-auto w-80 sm:w-96 lg:w-64 bg-white z-50 lg:z-auto transform transition-transform duration-300 ease-in-out ${
                            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                        } shadow-xl lg:shadow-none border-r border-gray-200 lg:border-r-0 overflow-y-auto`}
                    >
                        <div className="p-4 sm:p-6">
                            {/* Sidebar Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg sm:text-xl font-bold text-[#253D4E] flex items-center gap-2">
                                    <Sliders className="h-5 w-5 text-[#3B745B]" />
                                    Filters
                                </h2>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="h-5 w-5 text-[#253D4E]" />
                                </button>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <h3 className="text-sm sm:text-base font-semibold text-[#253D4E] mb-4">Price Range</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-xs sm:text-sm text-[#7E7E7E]">
                                        <span>£{priceRange[0]}</span>
                                        <span>£{priceRange[1]}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={priceRange[0]}
                                        max={maxPrice}
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <h3 className="text-sm sm:text-base font-semibold text-[#253D4E] mb-4">Categories</h3>
                                {loading ? (
                                    <div className="space-y-2">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="h-8 bg-gray-200 animate-pulse rounded"></div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {categories.length > 0 ? (
                                            categories.map((category) => (
                                                <label
                                                    key={category}
                                                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCategories.includes(category)}
                                                        onChange={() => handleCategoryToggle(category)}
                                                        className="w-4 h-4 text-[#3B745B] border-gray-300 rounded focus:ring-[#3B745B]"
                                                    />
                                                    <span className="text-sm text-[#253D4E]">{category}</span>
                                                </label>
                                            ))
                                        ) : (
                                            <p className="text-xs text-gray-500">No categories available</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Rating Filter */}
                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <h3 className="text-sm sm:text-base font-semibold text-[#253D4E] mb-4">Rating</h3>
                                <div className="space-y-2">
                                    {[5, 4, 3, 2, 1].map((rating) => (
                                        <label
                                            key={rating}
                                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                                        >
                                            <input
                                                type="radio"
                                                name="rating"
                                                checked={selectedRating === rating}
                                                onChange={() => setSelectedRating(rating === selectedRating ? 0 : rating)}
                                                className="w-4 h-4 text-[#3B745B] border-gray-300 focus:ring-[#3B745B]"
                                            />
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-4 w-4 ${
                                                            i < rating
                                                                ? "fill-[#FDC040] text-[#FDC040]"
                                                                : "fill-gray-200 text-gray-200"
                                                        }`}
                                                    />
                                                ))}
                                                <span className="text-xs text-[#7E7E7E] ml-1">& up</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Clear Filters */}
                            <button
                                onClick={handleClearFilters}
                                className="w-full py-2.5 bg-gray-100 text-[#253D4E] rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </aside>

                    {/* Products Section */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader className="h-8 w-8 animate-spin text-[#3B745B]" />
                                <p className="ml-3 text-gray-600">Loading products...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-12 sm:py-16">
                                <Filter className="h-16 w-16 sm:h-20 sm:w-20 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl sm:text-2xl font-bold text-[#253D4E] mb-2">Error loading products</h3>
                                <p className="text-sm sm:text-base text-[#7E7E7E] mb-4">{error}</p>
                                <button
                                    onClick={fetchProducts}
                                    className="px-6 py-2 bg-[#3B745B] text-white rounded-lg hover:bg-[#2a5542] transition-colors text-sm font-semibold"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : sortedProducts.length > 0 ? (
                            viewMode === "grid" ? (
                                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                    {sortedProducts.map((product) => (
                                        <div
                                            key={product._id || product.id}
                                            className="group relative rounded-xl sm:rounded-2xl border border-gray-100 bg-white p-3 sm:p-4 transition-all duration-300 hover:border-[#3B745B]/50 hover:shadow-lg"
                                        >
                                            {/* Product Image */}
                                            <Link to={`/product/${product._id || product.id}`}>
                                                <div className="mb-3 sm:mb-4 flex h-40 sm:h-48 md:h-56 items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                                                        onError={(e) => {
                                                            e.target.src = "https://via.placeholder.com/300x300?text=No+Image";
                                                        }}
                                                    />
                                                </div>
                                            </Link>

                                            {/* Category */}
                                            <div className="mb-1 text-[10px] sm:text-xs text-[#ADADAD] truncate">{product.category}</div>

                                            {/* Title */}
                                            <Link to={`/product/${product._id || product.id}`}>
                                                <h3 className="mb-2 text-sm sm:text-base font-bold text-[#253D4E] line-clamp-2 min-h-[2.5rem] hover:text-[#3B745B] transition-colors">
                                                    {product.name}
                                                </h3>
                                            </Link>

                                            {/* Rating Stars */}
                                            <div className="mb-2 flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-3 w-3 sm:h-4 sm:w-4 ${i < (product.rating || 0) ? "fill-[#FDC040] text-[#FDC040]" : "fill-gray-200 text-gray-200"}`}
                                                    />
                                                ))}
                                                <span className="ml-1 text-xs text-[#ADADAD]">({product.rating || 0})</span>
                                            </div>

                                            {/* Price */}
                                            <div className="mb-4 flex items-center gap-2">
                                                <span className="text-lg sm:text-xl font-bold text-[#3B745B]">{product.price}</span>
                                                {product.oldPrice && (
                                                    <span className="text-sm text-[#ADADAD] line-through">{product.oldPrice}</span>
                                                )}
                                            </div>

                                            {/* Add to Cart Button */}
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                disabled={!product.inStock}
                                                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#3B745B] py-2.5 sm:py-3 text-sm sm:text-base font-bold text-white transition-colors hover:bg-[#2a5542] disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                                                {product.inStock ? "Add to cart" : "Out of Stock"}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4 sm:gap-6">
                                    {sortedProducts.map((product) => (
                                        <div
                                            key={product._id || product.id}
                                            className="group flex flex-col sm:flex-row gap-4 sm:gap-6 rounded-xl sm:rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 transition-all duration-300 hover:border-[#3B745B]/50 hover:shadow-lg"
                                        >
                                            {/* Image */}
                                            <Link to={`/product/${product._id || product.id}`} className="w-full sm:w-48 md:w-64 flex-shrink-0 h-48 sm:h-48 md:h-56 rounded-lg overflow-hidden bg-gray-50">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                                                    onError={(e) => {
                                                        e.target.src = "https://via.placeholder.com/300x300?text=No+Image";
                                                    }}
                                                />
                                            </Link>

                                            {/* Content */}
                                            <div className="flex-1 flex flex-col">
                                                <div className="mb-1 text-xs text-[#ADADAD]">{product.category}</div>
                                                <Link to={`/product/${product._id || product.id}`}>
                                                    <h3 className="mb-2 text-lg sm:text-xl font-bold text-[#253D4E] hover:text-[#3B745B] transition-colors">
                                                        {product.name}
                                                    </h3>
                                                </Link>
                                                <div className="mb-3 flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-4 w-4 ${i < (product.rating || 0) ? "fill-[#FDC040] text-[#FDC040]" : "fill-gray-200 text-gray-200"}`}
                                                        />
                                                    ))}
                                                    <span className="ml-1 text-sm text-[#ADADAD]">({product.rating || 0})</span>
                                                </div>
                                                <div className="mt-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-2xl sm:text-3xl font-bold text-[#3B745B]">{product.price}</span>
                                                        {product.oldPrice && (
                                                            <span className="text-lg text-[#ADADAD] line-through">{product.oldPrice}</span>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => handleAddToCart(product)}
                                                        disabled={!product.inStock}
                                                        className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-[#3B745B] px-6 py-2.5 sm:py-3 text-sm sm:text-base font-bold text-white transition-colors hover:bg-[#2a5542] disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                                                        {product.inStock ? "Add to cart" : "Out of Stock"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        ) : (
                            <div className="text-center py-12 sm:py-16">
                                <Filter className="h-16 w-16 sm:h-20 sm:w-20 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl sm:text-2xl font-bold text-[#253D4E] mb-2">No products found</h3>
                                <p className="text-sm sm:text-base text-[#7E7E7E] mb-4">Try adjusting your filters</p>
                                <button
                                    onClick={handleClearFilters}
                                    className="px-6 py-2 bg-[#3B745B] text-white rounded-lg hover:bg-[#2a5542] transition-colors text-sm font-semibold"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Shop;
