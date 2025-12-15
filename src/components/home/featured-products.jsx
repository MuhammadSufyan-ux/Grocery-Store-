import React from "react";
import { ShoppingCart, Star, ArrowLeft, ArrowRight, ArrowRight as ArrowRightSmall } from "lucide-react";
import { useCart } from "../../context/CartContext";
import redish from "../../assets/featured-products/redish.png";
import potato from "../../assets/featured-products/potato.png";
import tomato from "../../assets/featured-products/tomato.png";
import broccoli from "../../assets/featured-products/broccoli.png";
import greenbean from "../../assets/featured-products/greenbean.png";
// Make sure these paths are correct for your project
import FreeDBG from "../../assets/featured-products/freedeliveryBG.png";
import OraganicFBG from "../../assets/featured-products/organicfoodBG.png";

export default function FeaturedProducts() {
    const { addToCart } = useCart();
    
    const products = [
        {
            id: 1,
            category: "Vegetables",
            name: "Redish 500g",
            image: redish,
            rating: 4,
            price: "£2",
            oldPrice: "£3.99",
        },
        {
            id: 2,
            category: "Vegetables",
            name: "Potatos 1kg",
            image: potato,
            rating: 4,
            price: "£1",
            oldPrice: "£1.99",
        },
        {
            id: 3,
            category: "Fruits",
            name: "Tomatos 200g",
            image: tomato,
            rating: 4,
            price: "£0.30",
            oldPrice: "£0.99",
        },
        {
            id: 4,
            category: "Vegetables",
            name: "Broccoli 1kg",
            image: broccoli,
            rating: 4,
            price: "£1.50",
            oldPrice: "£2.99",
        },
        {
            id: 5,
            category: "Vegetables",
            name: "Green Beans 250g",
            image: greenbean,
            rating: 4,
            price: "£1",
            oldPrice: "£1.99",
        },
    ];

    return (
        <section className="w-full bg-white py-6 sm:py-8 md:py-10">
            <div className="mx-auto w-full max-w-[1600px] px-2 sm:px-4 md:px-6 lg:px-8">

                {/* ================= HEADER ================= */}
                <div className="mb-6 sm:mb-8 flex flex-col items-start sm:items-center justify-between gap-3 sm:gap-4 md:flex-row">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#253D4E]">Featured Products</h2>

                    <div className="flex flex-wrap items-center justify-start sm:justify-center gap-3 sm:gap-4 md:gap-6 text-sm sm:text-base md:text-[16px] font-semibold text-[#253D4E] w-full sm:w-auto">
                        <a href="#" className="hover:text-[#3B745B] transition-colors whitespace-nowrap">All</a>
                        <a href="#" className="text-[#3B745B] whitespace-nowrap">Vegetables</a>
                        <a href="#" className="hover:text-[#3B745B] transition-colors whitespace-nowrap">Fruits</a>
                        <a href="#" className="hover:text-[#3B745B] transition-colors whitespace-nowrap">Coffee & teas</a>
                        <a href="#" className="hover:text-[#3B745B] transition-colors whitespace-nowrap">Meat</a>
                    </div>
                </div>

                {/* ================= PRODUCTS ROW ================= */}
                <div className="relative mb-16 overflow-visible">

                    {/* Left Arrow (Visible on XL screens) */}
                    <button className="absolute -left-5 top-1/2 z-50 -translate-y-1/2 hidden h-10 w-10 items-center justify-center rounded-full bg-[#f2f3f4] text-[#253D4E] hover:bg-[#3B745B] hover:text-white transition-colors shadow-lg xl:flex">
                        <ArrowLeft className="h-5 w-5" />
                    </button>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="group relative rounded-xl sm:rounded-2xl border border-gray-100 bg-white p-2 sm:p-3 md:p-4 transition-all duration-300 hover:border-[#3B745B]/50 hover:shadow-lg"
                            >
                                {/* Product Image */}
                                <div className="mb-2 sm:mb-3 md:mb-4 flex h-28 sm:h-36 md:h-44 items-center justify-center overflow-hidden rounded-lg">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                                    />
                                </div>

                                {/* Category */}
                                <div className="mb-1 text-[10px] sm:text-xs text-[#ADADAD] truncate">{product.category}</div>

                                {/* Title */}
                                <h3 className="mb-1 sm:mb-2 text-xs sm:text-sm md:text-base font-bold text-[#253D4E] line-clamp-2">{product.name}</h3>

                                {/* Rating Stars */}
                                <div className="mb-1 sm:mb-2 flex items-center gap-0.5 sm:gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${i < product.rating ? "fill-[#FDC040] text-[#FDC040]" : "fill-gray-200 text-gray-200"}`}
                                        />
                                    ))}
                                    <span className="ml-0.5 sm:ml-1 text-[10px] sm:text-xs text-[#ADADAD]">({product.rating})</span>
                                </div>

                                {/* Vendor info */}
                                <div className="mb-2 sm:mb-3 text-[10px] sm:text-xs text-[#ADADAD]">
                                    By <span className="text-[#3B745B]">Mr.food</span>
                                </div>

                                {/* Price & Add Button */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mt-auto">
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        <span className="text-sm sm:text-base md:text-lg font-bold text-[#3B745B]">{product.price}</span>
                                        <span className="text-xs sm:text-sm text-[#ADADAD] line-through">{product.oldPrice}</span>
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
                                        className="w-full sm:w-auto flex items-center justify-center gap-1 rounded bg-[#DEF9EC] px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-[#3B745B] transition-colors hover:bg-[#3B745B] hover:text-white"
                                    >
                                        <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">Add</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Arrow (Visible on XL screens) */}
                    <button className="absolute -right-5 top-1/2 z-50 -translate-y-1/2 hidden h-10 w-10 items-center justify-center rounded-full bg-[#f2f3f4] text-[#253D4E] hover:bg-[#3B745B] hover:text-white transition-colors shadow-lg xl:flex">
                        <ArrowRight className="h-5 w-5" />
                    </button>
                </div>

                {/* ================= BANNER CARDS SECTION ================= */}
                <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">

                    {/* Banner 1: Free Delivery */}
                    <div
                        className="relative h-[250px] sm:h-[300px] overflow-hidden object-cover rounded-xl sm:rounded-2xl bg-cover bg-center p-4 sm:p-6 md:p-8 lg:h-[350px]"
                        style={{ backgroundImage: `url(${FreeDBG})` }}
                    >
                        <div className="relative z-10 flex h-full flex-col items-start justify-center">
                            <span className="mb-2 sm:mb-3 md:mb-4 inline-block rounded bg-[#FDC040] px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-bold text-[#253D4E]">
                                Free delivery
                            </span>
                            <h3 className="mb-1 sm:mb-2 text-xl sm:text-2xl md:text-3xl font-bold text-[#253D4E]">
                                Free delivery over $50
                            </h3>
                            <p className="mb-4 sm:mb-6 md:mb-8 text-sm sm:text-base md:text-lg text-[#7E7E7E]">
                                Shop $50 product and get free <br className="hidden sm:inline" /> delivery anywhre.
                            </p>
                            <button className="flex items-center gap-1.5 sm:gap-2 rounded bg-[#3B745B] px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-bold text-white transition-colors hover:bg-[#2a5542]">
                                Shop Now <ArrowRightSmall className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Banner 2: Organic Food */}
                    <div
                        className="relative h-[250px] sm:h-[300px] overflow-hidden object-cover rounded-xl sm:rounded-2xl bg-cover bg-center p-4 sm:p-6 md:p-8 lg:h-[350px]"
                        style={{ backgroundImage: `url(${OraganicFBG})` }}
                    >
                        <div className="relative z-10 flex h-full flex-col items-start justify-center">
                            <span className="mb-2 sm:mb-3 md:mb-4 inline-block rounded bg-[#3B745B] px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-bold text-white">
                                60% off
                            </span>
                            <h3 className="mb-1 sm:mb-2 text-xl sm:text-2xl md:text-3xl font-bold text-[#253D4E]">
                                Organic Food
                            </h3>
                            <p className="mb-4 sm:mb-6 md:mb-8 text-sm sm:text-base md:text-lg text-[#7E7E7E]">
                                Save up to 60% off on your <br className="hidden sm:inline" /> first order
                            </p>
                            <button className="flex items-center gap-1.5 sm:gap-2 rounded bg-[#3B745B] px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-bold text-white transition-colors hover:bg-[#2a5542]">
                                Order Now <ArrowRightSmall className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}
