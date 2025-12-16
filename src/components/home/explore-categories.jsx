import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Predefined background colors for categories
const categoryBgColors = [
    "bg-[#FEEFEA]", // Light Peach
    "bg-[#FFF3FF]", // Light Violet/Pink
    "bg-[#F2FCE4]", // Light Green
    "bg-[#ECFFEC]", // Mint Green
    "bg-[#FFFCEB]", // Light Yellow
    "bg-[#DEF9EC]", // Teal Green
    "bg-[#E8F4F8]", // Light Blue
    "bg-[#FFF0F5]", // Lavender Blush
];

function ExploreCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef(null);
    const autoScrollIntervalRef = useRef(null);

    useEffect(() => {
        fetchCategoriesAndProducts();
    }, []);

    // Auto-scroll functionality
    useEffect(() => {
        if (categories.length > 0 && scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            let isPaused = false;
            let scrollPosition = 0;
            const scrollSpeed = 0.5; // pixels per interval
            const scrollInterval = 30; // milliseconds

            const startAutoScroll = () => {
                if (autoScrollIntervalRef.current) {
                    clearInterval(autoScrollIntervalRef.current);
                }

                autoScrollIntervalRef.current = setInterval(() => {
                    if (isPaused) return;

                    const maxScroll = container.scrollWidth - container.clientWidth;

                    if (maxScroll <= 0) return; // No scroll needed

                    scrollPosition += scrollSpeed;

                    if (scrollPosition >= maxScroll) {
                        // Reset to beginning smoothly
                        scrollPosition = 0;
                        container.scrollTo({ left: 0, behavior: "smooth" });
                        // Wait a bit before resuming
                        setTimeout(() => {
                            scrollPosition = 0;
                        }, 1000);
                    } else {
                        container.scrollLeft = scrollPosition;
                    }
                }, scrollInterval);
            };

            // Pause on hover
            const handleMouseEnter = () => {
                isPaused = true;
            };

            const handleMouseLeave = () => {
                isPaused = false;
            };

            container.addEventListener("mouseenter", handleMouseEnter);
            container.addEventListener("mouseleave", handleMouseLeave);

            startAutoScroll();

            return () => {
                if (autoScrollIntervalRef.current) {
                    clearInterval(autoScrollIntervalRef.current);
                }
                container.removeEventListener("mouseenter", handleMouseEnter);
                container.removeEventListener("mouseleave", handleMouseLeave);
            };
        }
    }, [categories]);

    const fetchCategoriesAndProducts = async () => {
        try {
            setLoading(true);
            
            // Fetch categories and products in parallel
            const [categoriesResponse, productsResponse] = await Promise.all([
                fetch(`${API_URL}/api/categories?includeSubCategories=false`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }),
                fetch(`${API_URL}/api/products?limit=10000&status=active`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
            ]);

            const categoriesData = await categoriesResponse.json();
            const productsData = await productsResponse.json();

            if (categoriesResponse.ok && categoriesData.success) {
                // Count products per category
                const productCounts = {};
                if (productsResponse.ok && productsData.success && productsData.products) {
                    productsData.products.forEach((product) => {
                        // Extract category name - handle both string and object
                        let categoryName = product.category;
                        if (typeof product.category === 'object' && product.category !== null) {
                            categoryName = product.category.name || product.category._id || '';
                        }
                        
                        if (categoryName) {
                            const normalizedName = categoryName.trim().toLowerCase();
                            productCounts[normalizedName] = (productCounts[normalizedName] || 0) + 1;
                        }
                    });
                }

                // Transform categories to match UI structure
                const formattedCategories = categoriesData.categories
                    .filter((cat) => cat.isActive !== false) // Only show active categories
                    .sort((a, b) => (a.order || 0) - (b.order || 0)) // Sort by order
                    .map((cat, index) => {
                        const normalizedCatName = cat.name.trim().toLowerCase();
                        const count = productCounts[normalizedCatName] || 0;
                        
                        return {
                            _id: cat._id,
                            name: cat.name,
                            count: `${count} ${count === 1 ? 'Item' : 'Items'}`,
                            img: cat.image || "",
                            bg: categoryBgColors[index % categoryBgColors.length], // Cycle through colors
                            slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-"),
                        };
                    });

                setCategories(formattedCategories);
            }
        } catch (err) {
            console.error("Error fetching categories:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="w-full bg-white mt-10 mb-10">
            <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">

                {/* ================= HEADER ================= */}
                <div className="mb-6 sm:mb-8 md:mb-10 flex flex-col items-start sm:items-center justify-between gap-4 sm:gap-6 md:flex-row">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#253D4E]">
                        Explore Categories
                    </h2>

                    {/* Category Links - Single Row with Horizontal Scroll on Mobile */}
                    <div className="flex items-center gap-3 sm:gap-4 md:gap-6 text-sm sm:text-base md:text-[16px] font-semibold w-full md:w-auto overflow-x-auto scrollbar-hide">
                        <Link
                            to="/shop"
                            className="text-[#3B745B] transition-colors whitespace-nowrap flex-shrink-0 hover:underline"
                        >
                            All
                        </Link>
                        {loading ? (
                            // Loading skeleton
                            <>
                                {[...Array(4)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="h-5 w-20 bg-gray-200 animate-pulse rounded flex-shrink-0"
                                    ></div>
                                ))}
                            </>
                        ) : categories.length > 0 ? (
                            categories.map((cat) => (
                                <Link
                                    key={cat._id}
                                    to={`/shop?category=${encodeURIComponent(cat.name)}`}
                                    className="text-[#253D4E] hover:text-[#3B745B] hover:-translate-y-0.5 transition-all whitespace-nowrap flex-shrink-0"
                                >
                                    {cat.name}
                                </Link>
                            ))
                        ) : null}
                    </div>
                </div>

                {/* ================= CARDS SLIDER AREA ================= */}
                <div className="relative flex items-center">
                    {/* Left Arrow Button */}
                    <button
                        onClick={() => {
                            if (scrollContainerRef.current) {
                                // Calculate scroll amount: one card width + gap
                                const cardWidth = scrollContainerRef.current.querySelector('a, div[class*="flex-shrink-0"]')?.offsetWidth || 200;
                                scrollContainerRef.current.scrollBy({
                                    left: -(cardWidth + 24), // 24px is gap-6
                                    behavior: "smooth",
                                });
                            }
                        }}
                        className="absolute -left-4 z-50 hidden h-10 w-10 items-center justify-center rounded-full bg-[#f2f3f4] text-[#253D4E] hover:bg-[#3B745B] hover:text-white transition-colors shadow-lg xl:flex"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>

                    {/* Horizontal Scroll Container - Shows 7 in a row on desktop */}
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth w-full"
                        style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                        }}
                    >
                        {loading ? (
                            <div className="flex gap-6 w-full">
                                {[...Array(7)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex-shrink-0 bg-gray-100 animate-pulse flex flex-col items-center justify-center rounded-2xl py-6 px-4 h-40 w-32 sm:w-36 md:w-40 lg:w-44 xl:w-[calc((100%-144px)/7)]"
                                    >
                                        <div className="mb-4 h-20 w-20 bg-gray-300 rounded-lg"></div>
                                        <div className="h-4 w-20 bg-gray-300 rounded mb-2"></div>
                                        <div className="h-3 w-16 bg-gray-300 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        ) : categories.length > 0 ? (
                            categories.map((cat, index) => (
                                <Link
                                    key={cat._id || index}
                                    to={`/shop?category=${encodeURIComponent(cat.name)}`}
                                    className={`${cat.bg} group flex-shrink-0 flex cursor-pointer flex-col items-center justify-center rounded-2xl py-6 px-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-transparent hover:border-[#3B745B]/20 w-32 sm:w-36 md:w-40 lg:w-44 xl:w-[calc((100%-144px)/7)]`}
                                >
                                    {cat.img && cat.img.trim() !== "" && (
                                        <div className="mb-4 h-20 w-20 transition-transform duration-300 group-hover:scale-110 flex items-center justify-center">
                                            <img
                                                src={cat.img}
                                                alt={cat.name}
                                                className="h-full w-full object-contain rounded-lg"
                                                onError={(e) => {
                                                    e.target.style.display = "none";
                                                }}
                                            />
                                        </div>
                                    )}
                                    <h3 className="mb-1 text-[15px] font-bold text-[#253D4E] text-center">
                                        {cat.name}
                                    </h3>
                                    <span className="text-xs text-[#ADADAD]">{cat.count}</span>
                                </Link>
                            ))
                        ) : (
                            <div className="text-center py-12 text-gray-500 w-full">
                                No categories available
                            </div>
                        )}
                    </div>

                    {/* Right Arrow Button */}
                    <button
                        onClick={() => {
                            if (scrollContainerRef.current) {
                                // Calculate scroll amount: one card width + gap
                                const cardWidth = scrollContainerRef.current.querySelector('a, div[class*="flex-shrink-0"]')?.offsetWidth || 200;
                                scrollContainerRef.current.scrollBy({
                                    left: cardWidth + 24, // 24px is gap-6
                                    behavior: "smooth",
                                });
                            }
                        }}
                        className="absolute -right-4 z-50 hidden h-10 w-10 items-center justify-center rounded-full bg-[#f2f3f4] text-[#253D4E] hover:bg-[#3B745B] hover:text-white transition-colors shadow-lg xl:flex"
                    >
                        <ArrowRight className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </section>
    );
}

export default ExploreCategories;
