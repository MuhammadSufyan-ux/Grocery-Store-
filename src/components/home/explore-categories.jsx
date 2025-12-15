import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Images (Using your provided imports)
import apple from "../../assets/categories/apple.png";
import carrot from "../../assets/categories/carrot.png";
import orange from "../../assets/categories/orange.png";
import peach from "../../assets/categories/peach.png";
import potato from "../../assets/categories/potato.png";
import stawberry from "../../assets/categories/strawberry.png";
import vegetables from "../../assets/categories/vegetables.png";

function ExploreCategories() {
    // Data array with specific background colors matching your design
    const categories = [
        {
            name: "Peach",
            count: "20 Items",
            img: peach,
            bg: "bg-[#FEEFEA]", // Light Peach
        },
        {
            name: "Vegetables",
            count: "220 Items",
            img: vegetables,
            bg: "bg-[#FFF3FF]", // Light Violet/Pink
        },
        {
            name: "Strawberry",
            count: "10 Items",
            img: stawberry,
            bg: "bg-[#F2FCE4]", // Light Green
        },
        {
            name: "Apple",
            count: "40 Items",
            img: apple,
            bg: "bg-[#FEEFEA]", // Light Peach
        },
        {
            name: "Orange",
            count: "23 Items",
            img: orange,
            bg: "bg-[#ECFFEC]", // Mint Green
        },
        {
            name: "Potato",
            count: "3 Items",
            img: potato,
            bg: "bg-[#FFFCEB]", // Light Yellow
        },
        {
            name: "Carrot",
            count: "9 Items",
            img: carrot,
            bg: "bg-[#DEF9EC]", // Teal Green
        },
    ];

    return (
        <section className="w-full bg-white mt-10 mb-10">
            <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">

                {/* ================= HEADER ================= */}
                <div className="mb-6 sm:mb-8 md:mb-10 flex flex-col items-start sm:items-center justify-between gap-4 sm:gap-6 md:flex-row">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#253D4E]">
                        Explore Categories
                    </h2>

                    <div className="flex flex-wrap items-center justify-start sm:justify-center gap-3 sm:gap-4 md:gap-6 text-sm sm:text-base md:text-[16px] font-semibold w-full sm:w-auto">
                        <a href="#" className="text-[#3B745B] transition-colors whitespace-nowrap">
                            All
                        </a>
                        <a href="#" className="text-[#253D4E] hover:text-[#3B745B] hover:-translate-y-0.5 transition-all whitespace-nowrap">
                            Vegetables
                        </a>
                        <a href="#" className="text-[#253D4E] hover:text-[#3B745B] hover:-translate-y-0.5 transition-all whitespace-nowrap">
                            Fruits
                        </a>
                        <a href="#" className="text-[#253D4E] hover:text-[#3B745B] hover:-translate-y-0.5 transition-all whitespace-nowrap">
                            Coffee & Teas
                        </a>
                        <a href="#" className="text-[#253D4E] hover:text-[#3B745B] hover:-translate-y-0.5 transition-all whitespace-nowrap">
                            Meat
                        </a>
                    </div>
                </div>

                {/* ================= CARDS SLIDER AREA ================= */}
                <div className="relative flex items-center overflow-visible">

                    {/* Left Arrow Button */}
                    <button className="absolute -left-4 z-50 hidden h-10 w-10 items-center justify-center rounded-full bg-[#f2f3f4] text-[#253D4E] hover:bg-[#3B745B] hover:text-white transition-colors shadow-lg xl:flex">
                        <ArrowLeft className="h-5 w-5" />
                    </button>

                    {/* Cards Grid */}
                    <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
                        {categories.map((cat, index) => (
                            <div
                                key={index}
                                className={`${cat.bg} group flex cursor-pointer flex-col items-center justify-center rounded-2xl py-6 px-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-transparent hover:border-[#3B745B]/20`}
                            >
                                <div className="mb-4 h-20 w-20 transition-transform duration-300 group-hover:scale-110">
                                    <img
                                        src={cat.img}
                                        alt={cat.name}
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <h3 className="mb-1 text-[15px] font-bold text-[#253D4E]">
                                    {cat.name}
                                </h3>
                                <span className="text-xs text-[#ADADAD]">{cat.count}</span>
                            </div>
                        ))}
                    </div>

                    {/* Right Arrow Button */}
                    <button className="absolute -right-4 z-50 hidden h-10 w-10 items-center justify-center rounded-full bg-[#f2f3f4] text-[#253D4E] hover:bg-[#3B745B] hover:text-white transition-colors shadow-lg xl:flex">
                        <ArrowRight className="h-5 w-5" />
                    </button>

                </div>
            </div>
        </section>
    );
}

export default ExploreCategories;
