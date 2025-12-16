import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/Logo.png";
import profile from "../assets/images/user_profile.png";
import {
    Search,
    Heart,
    ShoppingCart,
    ChevronDown,
    Menu,
    X,
    Flame,
    Percent,
    Megaphone,
    History,
    Bell,
    ChevronRight
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Navbar = () => {
    const { getTotalItems, getTotalPrice } = useCart();
    const { getTotalItems: getWishlistTotalItems } = useWishlist();
    // --- State ---
    const [isCategoryOpen, setCategoryOpen] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isSearchModalOpen, setSearchModalOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const searchInputRef = useRef(null);
    const categoryDropdownRef = useRef(null);
    const megaMenuRef = useRef(null);

    const topSearches = ["Fresh Fruits", "Bakery", "Vegetables", "Milk", "Snacks"];

    // --- Fetch Categories ---
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_URL}/api/categories?includeSubCategories=true`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Group categories: main categories with their sub-categories
                const mainCategories = data.categories.filter((cat) => !cat.parentCategory);
                const subCategories = data.categories.filter((cat) => cat.parentCategory);

                // Group sub-categories by parent
                const groupedCategories = mainCategories.map((main) => {
                    const subs = subCategories.filter(
                        (sub) => (sub.parentCategory._id || sub.parentCategory).toString() === main._id.toString()
                    );
                    return {
                        ...main,
                        subCategories: subs.sort((a, b) => (a.order || 0) - (b.order || 0)),
                    };
                });

                setCategories(groupedCategories.sort((a, b) => (a.order || 0) - (b.order || 0)));
            }
        } catch (err) {
            console.error("Error fetching categories:", err);
        }
    };

    // --- Handlers ---

    // Close menus on resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setMobileMenuOpen(false);
                setSearchModalOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Set first category as hovered when menu opens
    useEffect(() => {
        if (isCategoryOpen && categories.length > 0 && !hoveredCategory) {
            setHoveredCategory(categories[0]._id);
        }
    }, [isCategoryOpen, categories]);

    // Close category dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                categoryDropdownRef.current &&
                !categoryDropdownRef.current.contains(event.target) &&
                (!megaMenuRef.current || !megaMenuRef.current.contains(event.target))
            ) {
                setCategoryOpen(false);
                setHoveredCategory(null);
            }
        };

        if (isCategoryOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isCategoryOpen]);

    const handleSearchFocus = () => {
        setSearchModalOpen(true);
    };

    return (
        <>
            <header className="relative w-full bg-white font-sans z-40">

                {/* ================= TOP ROW: Main Header ================= */}
                <div className="border-b border-gray-100 lg:border-none">
                    {/* CHANGED: px-4 sm:px-6 lg:px-8 (Standard spacing, not too wide, not too inside) */}
                    <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-2 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-5">

                        {/* 1. LEFT: Logo & Hamburger */}
                        <div className="flex items-center gap-2 sm:gap-4">
                            {/* Mobile Menu Trigger */}
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="lg:hidden text-[#253D4E] hover:text-[#3B745B] transition-colors"
                            >
                                <Menu className="h-6 w-6 sm:h-8 sm:w-8" />
                            </button>

                            {/* Logo */}
                            <img
                                src={logo}
                                alt="Groceyish"
                                className="h-8 w-auto sm:h-10 md:h-12 object-contain"
                            />
                        </div>

                        {/* 2. MIDDLE: Search Bar (Desktop) */}
                        <div className="hidden max-w-2xl flex-1 px-8 lg:flex relative" style={{ zIndex: 1 }}>
                            <div className="flex w-full items-center rounded bg-[#f3f4f6] border border-transparent focus-within:border-[#3B745B] focus-within:ring-1 focus-within:ring-[#3B745B] transition-all duration-200 relative overflow-visible">

                                {/* Category Mega Menu */}
                                <div
                                    ref={categoryDropdownRef}
                                    className="relative border-r border-gray-300"
                                    style={{ overflow: 'visible', zIndex: 50 }}
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCategoryOpen(!isCategoryOpen);
                                        }}
                                        onMouseEnter={() => setCategoryOpen(true)}
                                        className="flex w-40 items-center justify-between px-4 py-3.5 text-sm font-semibold text-[#253D4E] hover:text-[#3B745B]"
                                    >
                                        All Categories
                                        <ChevronDown className={`h-4 w-4 text-[#ADADAD] transition-transform duration-200 ${isCategoryOpen ? "rotate-180" : ""}`} />
                                    </button>

                                    {/* Mega Menu */}
                                    {isCategoryOpen && categories.length > 0 && (
                                        <div
                                            ref={megaMenuRef}
                                            className="absolute top-full left-0 w-[700px] max-w-[calc(100vw-2rem)] bg-white shadow-2xl border border-gray-200 rounded-lg mt-1 overflow-hidden transition-all duration-200 ease-out"
                                            style={{ zIndex: 1000 }}
                                            onMouseEnter={() => setCategoryOpen(true)}
                                            onMouseLeave={() => {
                                                setCategoryOpen(false);
                                                setHoveredCategory(null);
                                            }}
                                        >
                                            {/* Background Image with Low Opacity */}
                                            {hoveredCategory && (() => {
                                                const hoveredCat = categories.find(cat => cat._id === hoveredCategory);
                                                return hoveredCat?.image ? (
                                                    <div 
                                                        className="absolute inset-0 opacity-5 bg-cover bg-center bg-no-repeat transition-opacity duration-300 pointer-events-none"
                                                        style={{
                                                            backgroundImage: `url(${hoveredCat.image})`
                                                        }}
                                                    />
                                                ) : null;
                                            })()}
                                            
                                            {/* Content Container */}
                                            <div className="relative grid grid-cols-[200px_1fr] min-h-[300px]">
                                                {/* First Column: Main Categories */}
                                                <div className="bg-gray-50 border-r border-gray-200 py-2 overflow-y-auto max-h-[400px]">
                                                    <ul className="space-y-0">
                                                        {categories.map((category) => {
                                                            const isHovered = hoveredCategory === category._id;
                                                            return (
                                                                <li key={category._id}>
                                                                    <Link
                                                                        to={`/shop?category=${category.name}`}
                                                                        onMouseEnter={() => setHoveredCategory(category._id)}
                                                                        onClick={() => {
                                                                            setCategoryOpen(false);
                                                                            setHoveredCategory(null);
                                                                        }}
                                                                        className={`flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                                                                            isHovered 
                                                                ? 'bg-white text-[#3B745B] border-r-2 border-[#3B745B]' 
                                                                : 'text-[#253D4E] hover:bg-white/50 hover:text-[#3B745B]'
                                                                        }`}
                                                                    >
                                                                        {/* Category Image */}
                                                                        {category.image && (
                                                                            <img
                                                                                src={category.image}
                                                                                alt={category.name}
                                                                                className="w-5 h-5 rounded object-cover flex-shrink-0"
                                                                                onError={(e) => {
                                                                                    e.target.style.display = "none";
                                                                                }}
                                                                            />
                                                                        )}
                                                                        <span className="truncate">{category.name}</span>
                                                                    </Link>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                </div>

                                                {/* Second Column: Sub-Categories */}
                                                <div className="py-2 px-3 overflow-y-auto max-h-[400px]">
                                                    {hoveredCategory ? (() => {
                                                        const hoveredCat = categories.find(cat => cat._id === hoveredCategory);
                                                        if (!hoveredCat) return null;
                                                        
                                                        return (
                                                            <div>
                                                                {/* Main Category Header */}
                                                                <div className="mb-2 pb-2 border-b border-gray-200">
                                                                    <div className="flex items-center gap-2">
                                                                        {hoveredCat.image && (
                                                                            <img
                                                                                src={hoveredCat.image}
                                                                                alt={hoveredCat.name}
                                                                                className="w-6 h-6 rounded object-cover flex-shrink-0"
                                                                                onError={(e) => {
                                                                                    e.target.style.display = "none";
                                                                                }}
                                                                            />
                                                                        )}
                                                                        <h3 className="text-sm font-semibold text-[#253D4E] truncate">
                                                                            {hoveredCat.name}
                                                                        </h3>
                                                                    </div>
                                                                </div>

                                                                {/* Sub-Categories List */}
                                                                {hoveredCat.subCategories && hoveredCat.subCategories.length > 0 ? (
                                                                    <ul className="space-y-1">
                                                                        {hoveredCat.subCategories.map((sub) => (
                                                                            <li key={sub._id}>
                                                                                <Link
                                                                                    to={`/shop?category=${sub.name}`}
                                                                                    onClick={() => {
                                                                                        setCategoryOpen(false);
                                                                                        setHoveredCategory(null);
                                                                                    }}
                                                                                    className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#DEF9EC] hover:text-[#3B745B] transition-all duration-200 group"
                                                                                >
                                                                                    {/* Sub-Category Image */}
                                                                                    {sub.image && (
                                                                                        <img
                                                                                            src={sub.image}
                                                                                            alt={sub.name}
                                                                                            className="w-5 h-5 rounded object-cover flex-shrink-0"
                                                                                            onError={(e) => {
                                                                                                e.target.style.display = "none";
                                                                                            }}
                                                                                        />
                                                                                    )}
                                                                                    <span className="text-xs text-gray-700 group-hover:text-[#3B745B] flex-1 truncate">
                                                                                        {sub.name}
                                                                                    </span>
                                                                                    <ChevronRight className="h-3 w-3 text-gray-400 group-hover:text-[#3B745B] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                                                                </Link>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                ) : (
                                                                    <div className="text-center py-4 text-gray-500">
                                                                        <p className="text-xs">No sub-categories available</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })() : (
                                                        <div className="flex items-center justify-center h-full text-gray-400 px-4">
                                                            <p className="text-xs text-center">Hover over a category to view sub-categories</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Search Input */}
                                <div className="relative flex-1">
                                    <input
                                        ref={searchInputRef}
                                        onFocus={handleSearchFocus}
                                        type="text"
                                        placeholder="Search for items..."
                                        className="w-full bg-transparent px-4 py-3.5 text-sm text-[#253D4E] outline-none placeholder:text-[#ADADAD]"
                                    />
                                </div>

                                {/* Search Button */}
                                <button className="bg-[#F4C340] px-6 py-3.5 transition-colors hover:bg-[#e0b135]">
                                    <Search className="h-6 w-6 text-[#253D4E]" />
                                </button>
                            </div>
                        </div>

                        {/* 3. RIGHT: Actions */}
                        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 lg:gap-8">

                            {/* Mobile Search Icon */}
                            <button onClick={() => setSearchModalOpen(true)} className="lg:hidden text-[#253D4E]">
                                <Search className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
                            </button>

                            {/* Wishlist */}
                            <Link to="/wishlist" className="flex cursor-pointer items-center gap-1 sm:gap-2 group">
                                <div className="relative">
                                    <Heart className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-[#253D4E] group-hover:text-[#3B745B] transition-colors" />
                                    {getWishlistTotalItems() > 0 && (
                                        <span className="absolute -right-1 -top-1 sm:-right-1.5 sm:-top-1.5 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-[#3B745B] text-[9px] sm:text-[11px] font-bold text-white border-2 border-white">
                                            {getWishlistTotalItems()}
                                        </span>
                                    )}
                                </div>
                                <span className="hidden text-sm sm:text-base text-[#253D4E] xl:block group-hover:text-[#3B745B]">
                                    Wishlist
                                </span>
                            </Link>

                            {/* Cart */}
                            <Link to="/cart" className="flex cursor-pointer items-center gap-1 sm:gap-2 md:gap-3 group">
                                <div className="relative">
                                    <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-[#253D4E] group-hover:text-[#3B745B] transition-colors" />
                                    {getTotalItems() > 0 && (
                                        <span className="absolute -right-1 -top-1 sm:-right-1.5 sm:-top-1.5 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-[#3B745B] text-[9px] sm:text-[11px] font-bold text-white border-2 border-white">
                                            {getTotalItems()}
                                        </span>
                                    )}
                                </div>
                                <div className="hidden flex-col leading-tight xl:flex">
                                    <span className="text-xs text-[#ADADAD]">My cart</span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-sm sm:text-base font-bold text-[#3B745B]">
                                            £{getTotalPrice().toFixed(2)}
                                        </span>
                                        <ChevronDown className="h-3 w-3 text-[#ADADAD]" />
                                    </div>
                                </div>
                            </Link>

                            {/* User Profile */}
                            <div className="hidden cursor-pointer items-center gap-2 sm:gap-3 md:flex">
                                <img
                                    src={profile}
                                    alt="Ramzi"
                                    className="h-8 w-8 sm:h-10 sm:w-10 md:h-11 md:w-11 rounded-full object-cover border-2 border-gray-100"
                                />
                                <div className="hidden xl:flex items-center gap-1">
                                    <span className="text-sm sm:text-base font-bold text-[#253D4E]">
                                        Ramzi Cherif
                                    </span>
                                    <ChevronDown className="h-4 w-4 text-[#ADADAD]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= BOTTOM ROW: Navigation Bar (Green) ================= */}
                <div className="hidden lg:block bg-[#3B745B] text-white">
                    {/* CHANGED: px-4 sm:px-6 lg:px-8 to match the top row */}
                    <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-3 sm:py-4 sm:px-6 lg:px-8">

                        {/* Left: Text Links (No Icons) */}
                        <nav className="flex items-center gap-6 xl:gap-10">
                            <Link to="/" className="text-sm xl:text-[16px] font-bold hover:text-[#F4C340] transition-colors whitespace-nowrap">
                                Home
                            </Link>
                            <Link to="/about" className="text-sm xl:text-[16px] font-bold hover:text-[#F4C340] transition-colors whitespace-nowrap">
                                About Us
                            </Link>
                            <Link to="/contact" className="text-sm xl:text-[16px] font-bold hover:text-[#F4C340] transition-colors whitespace-nowrap">
                                Contact Us
                            </Link>
                        </nav>

                        {/* Right: Icon Links & Bell */}
                        <div className="flex items-center gap-4 xl:gap-8">
                            <Link to="/shop" className="flex items-center gap-1.5 xl:gap-2 text-xs xl:text-[15px] font-bold hover:text-[#F4C340] transition-colors">
                                <Megaphone className="h-4 w-4 xl:h-5 xl:w-5" /> <span className="hidden xl:inline">Shop</span>
                            </Link>
                            <Link to="/hot-deals" className="flex items-center gap-1.5 xl:gap-2 text-xs xl:text-[15px] font-bold hover:text-[#F4C340] transition-colors">
                                <Flame className="h-4 w-4 xl:h-5 xl:w-5" /> <span className="hidden xl:inline">Hot deals</span>
                            </Link>
                            <Link to="/promotions" className="flex items-center gap-1.5 xl:gap-2 text-xs xl:text-[15px] font-bold hover:text-[#F4C340] transition-colors">
                                <Percent className="h-4 w-4 xl:h-5 xl:w-5" /> <span className="hidden xl:inline">Promotions</span>
                            </Link>

                            {/* Bell Icon */}
                            <button className="ml-1 xl:ml-2 hover:text-[#F4C340] transition-colors">
                                <Bell className="h-5 w-5 xl:h-6 xl:w-6 fill-current" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* ================================================================= */}
            {/* ======================= OVERLAYS / MODALS ======================= */}
            {/* ================================================================= */}

            {/* 1. MOBILE MENU DRAWER */}
            <div className={`fixed inset-0 z-50 flex lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={() => setMobileMenuOpen(false)}
                ></div>

                {/* Drawer Content */}
                <div className={`relative w-[85%] max-w-[320px] bg-white h-full shadow-2xl flex flex-col p-6 transition-transform duration-300 ease-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>

                    {/* Header */}
                    <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                        <img src={logo} alt="Logo" className="h-10 w-auto" />
                        <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-gray-100 text-[#253D4E] transition-colors">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Links */}
                    <nav className="flex flex-col gap-5 text-[#253D4E]  text-lg">
                        <Link to="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#3B745B] transition-colors">Home</Link>
                        <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#3B745B] transition-colors">About Us</Link>
                        <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#3B745B] transition-colors">Contact Us</Link>

                        <div className="h-px bg-gray-100 my-2"></div>

                        <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 hover:text-[#3B745B] transition-colors">
                            <Megaphone className="h-5 w-5" /> Shop
                        </Link>
                        <Link to="/hot-deals" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 hover:text-[#3B745B] transition-colors">
                            <Flame className="h-5 w-5" /> Hot deals
                        </Link>
                        <Link to="/promotions" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 hover:text-[#3B745B] transition-colors">
                            <Percent className="h-5 w-5" /> Promotions
                        </Link>
                        <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 hover:text-[#3B745B] transition-colors">
                            <Heart className="h-5 w-5" /> Wishlist
                        </Link>
                    </nav>
                </div>
            </div>

            {/* 2. SEARCH MODAL */}
            {isSearchModalOpen && (
                <div className="fixed inset-0 z-[60] bg-white/95 backdrop-blur-md animate-in fade-in duration-200 flex flex-col items-center pt-20 px-4">
                    <button
                        onClick={() => setSearchModalOpen(false)}
                        className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-[#253D4E] transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>

                    <div className="w-full max-w-3xl">
                        <h2 className="text-2xl font-bold text-[#253D4E] mb-6 text-center">What are you looking for?</h2>

                        <div className="flex items-center bg-white border-2 border-[#3B745B] rounded-full px-6 py-4 shadow-lg mb-10">
                            <Search className="h-6 w-6 text-[#3B745B] mr-4" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search products..."
                                className="bg-transparent w-full text-lg text-[#253D4E] outline-none placeholder:text-gray-400"
                            />
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-sm font-bold text-[#ADADAD] uppercase tracking-wider mb-4 flex items-center gap-2">
                                <History className="h-4 w-4" /> Top Searches
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {topSearches.map((item, idx) => (
                                    <span
                                        key={idx}
                                        className="px-5 py-2.5 bg-[#f3f4f6] hover:bg-[#DEF9EC] hover:text-[#3B745B] rounded-full text-sm  text-gray-600 transition-colors cursor-pointer"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
