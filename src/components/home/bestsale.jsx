import React from "react";
import { Star, ArrowRight, ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";

// Imported Images (as provided)
import redish from "../../assets/products/redish.png";
import potato from "../../assets/products/potato.png";
import tomato from "../../assets/products/tomato.png";
import broccoli from "../../assets/products/broccoli.png";
import greenbean from "../../assets/products/greenbean.png";
import coffe from "../../assets/products/coffe.png";
import greentea from "../../assets/products/greentea.png";
import halalsausage from "../../assets/products/halalsausage.png";
import onion from "../../assets/products/onion.png";

// Reusable Component for a Small Product List Item (for Top Sells, etc.)
const SmallProductItem = ({ image, name, price, oldPrice, rating }) => (
    <div className="flex items-center gap-2 sm:gap-3 md:gap-4 rounded-lg border border-gray-100 bg-white p-2 sm:p-3 md:p-4 hover:shadow-md transition-shadow">
        <div className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 flex-shrink-0">
            <img src={image} alt={name} className="h-full w-full object-contain" />
        </div>
        <div className="flex-1 min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-[#253D4E] truncate">{name}</h3>
            <div className="my-0.5 sm:my-1 flex items-center gap-0.5 sm:gap-1">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${i < rating ? "fill-[#FDC040] text-[#FDC040]" : "fill-gray-200 text-gray-200"}`}
                    />
                ))}
                <span className="text-[10px] sm:text-xs text-[#ADADAD]">({rating})</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs sm:text-sm font-bold text-[#3B745B]">{price}</span>
                <span className="text-[10px] sm:text-xs text-[#ADADAD] line-through">{oldPrice}</span>
            </div>
        </div>
    </div>
);

function BestSale() {
    const { addToCart } = useCart();
    
    // Data for Daily Best Sells
    const dailyBestSells = [
        {
            id: 1,
            badge: { text: "Save 10%", color: "bg-[#FDC040]" },
            category: "Coffee & Teas",
            name: "Coffee 1kg",
            image: coffe,
            rating: 4,
            price: "£20",
            oldPrice: "£25",
            sold: 20,
            total: 50,
            isBigCard: true,
        },
        {
            id: 2,
            badge: { text: "Best deal", color: "bg-[#DEF9EC] text-[#3B745B]" },
            category: "Meat",
            name: "Halal Sausage 350g",
            image: halalsausage,
            rating: 4,
            price: "£4",
            oldPrice: "£10",
            sold: 7,
            total: 20,
        },
        {
            id: 3,
            badge: { text: "Save 4%", color: "bg-[#FDC040]" },
            category: "Coffee & Teas",
            name: "Green Tea 250g",
            image: greentea,
            rating: 4,
            price: "£3",
            oldPrice: "£7",
            sold: 32,
            total: 50,
        },
        {
            id: 4,
            badge: { text: "Save 8%", color: "bg-[#FDC040]" },
            category: "Vegetables",
            name: "Onion 1kg",
            image: onion,
            rating: 4,
            price: "£0.50",
            oldPrice: "£2",
            sold: 2,
            total: 10,
        },
    ];

    // Data for 4-Column Lists (Top Sells, Top Rated, etc.)
    const topSells = [
        { name: "Orange 1kg", image: potato, price: "£2", oldPrice: "£3.99", rating: 4 },
        { name: "Broccoli 1kg", image: broccoli, price: "£1.50", oldPrice: "£2.99", rating: 4 },
        { name: "Redish 500g", image: redish, price: "£2", oldPrice: "£3.99", rating: 4 },
    ];
    const topRated = [
        { name: "Tomato 200g", image: tomato, price: "£0.30", oldPrice: "£0.99", rating: 5 },
        { name: "Green Beans", image: greenbean, price: "£1", oldPrice: "£1.99", rating: 5 },
        { name: "Coffee 1kg", image: coffe, price: "£20", oldPrice: "£25", rating: 5 },
    ];
    const trendingItems = [
        { name: "Halal Sausage", image: halalsausage, price: "£4", oldPrice: "£10", rating: 4 },
        { name: "Onion 1kg", image: onion, price: "£0.50", oldPrice: "£2", rating: 4 },
        { name: "Green Tea", image: greentea, price: "£3", oldPrice: "£7", rating: 4 },
    ];
    const recentlyAdded = [
        { name: "Redish 500g", image: redish, price: "£2", oldPrice: "£3.99", rating: 4 },
        { name: "Potato 1kg", image: potato, price: "£1", oldPrice: "£1.99", rating: 4 },
        { name: "Broccoli 1kg", image: broccoli, price: "£1.50", oldPrice: "£2.99", rating: 4 },
    ];

    return (
        <section className="w-full bg-white py-8 sm:py-12 md:py-16">
            <div className="mx-auto w-full max-w-[1600px] px-2 sm:px-4 md:px-6 lg:px-8">

                {/* ================= HEADER ================= */}
                <div className="mb-6 sm:mb-8 flex flex-col items-start sm:items-center justify-between gap-3 sm:gap-4 lg:flex-row">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 md:gap-8 w-full sm:w-auto">
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#253D4E]">Daily Best Sells</h2>
                        <div className="flex gap-3 sm:gap-4 md:gap-6 text-sm sm:text-base md:text-[16px] font-semibold text-[#253D4E]">
                            <a href="#" className="text-[#3B745B] whitespace-nowrap">Featured</a>
                            <a href="#" className="hover:text-[#3B745B] transition-colors whitespace-nowrap">Popular</a>
                            <a href="#" className="hover:text-[#3B745B] transition-colors whitespace-nowrap">New</a>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto">
                        <div className="flex items-center rounded bg-[#E74C3C] px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-white">
                            <span className="hidden sm:inline">Expires in: </span><span className="sm:ml-2">10 : 56 : 21</span>
                        </div>
                        <div className="flex gap-1.5 sm:gap-2 ml-auto sm:ml-0">
                            <button className="flex h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-[#f2f3f4] text-[#253D4E] hover:bg-[#3B745B] hover:text-white transition-colors">
                                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 rotate-180" />
                            </button>
                            <button className="flex h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-[#f2f3f4] text-[#253D4E] hover:bg-[#3B745B] hover:text-white transition-colors">
                                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ================= DAILY BEST SELLS GRID ================= */}
                <div className="mb-8 sm:mb-12 md:mb-16 grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">

                    {/* Product Cards */}
                    {dailyBestSells.map((product) => (
                        <div
                            key={product.id}
                            className={`group relative flex flex-col rounded-xl sm:rounded-2xl border border-gray-100 bg-white p-2 sm:p-3 md:p-5 transition-all duration-300 hover:border-[#3B745B]/50 hover:shadow-lg ${product.isBigCard ? 'lg:col-span-1 xl:col-span-1' : ''}`}
                        >
                            <span className={`absolute left-0 top-0 rounded-br-xl sm:rounded-br-2xl rounded-tl-xl sm:rounded-tl-2xl px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold ${product.badge.color} ${product.badge.text === 'Best deal' ? '' : 'text-white'}`}>
                                {product.badge.text}
                            </span>

                            <div className="mb-2 sm:mb-3 md:mb-4 flex h-24 sm:h-32 md:h-40 items-center justify-center overflow-hidden rounded-lg">
                                <img src={product.image} alt={product.name} className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110" />
                            </div>

                            <div className="mb-1 text-[10px] sm:text-xs text-[#ADADAD] truncate">{product.category}</div>
                            <h3 className="mb-1 sm:mb-2 text-xs sm:text-sm md:text-base font-bold text-[#253D4E] line-clamp-2">{product.name}</h3>

                            <div className="mb-1 sm:mb-2 flex items-center gap-0.5 sm:gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${i < product.rating ? "fill-[#FDC040] text-[#FDC040]" : "fill-gray-200 text-gray-200"}`} />
                                ))}
                                <span className="ml-0.5 sm:ml-1 text-[10px] sm:text-xs text-[#ADADAD]">({product.rating})</span>
                            </div>

                            <div className="mb-2 sm:mb-3 md:mb-4 text-[10px] sm:text-xs text-[#ADADAD]">
                                By <span className="text-[#3B745B]">Mr.food</span>
                            </div>

                            <div className="flex items-center justify-between mb-2 sm:mb-0">
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    <span className="text-sm sm:text-base md:text-lg font-bold text-[#3B745B]">{product.price}</span>
                                    <span className="text-xs sm:text-sm text-[#ADADAD] line-through">{product.oldPrice}</span>
                                </div>
                            </div>

                            <div className="mt-2 sm:mt-3 md:mt-4">
                                <div className="mb-1 flex justify-between text-[10px] sm:text-xs text-[#ADADAD]">
                                    <span>Sold: {product.sold}/{product.total}</span>
                                </div>
                                <div className="h-1 sm:h-1.5 w-full rounded-full bg-gray-100">
                                    <div className="h-full rounded-full bg-[#3B745B]" style={{ width: `${(product.sold / product.total) * 100}%` }}></div>
                                </div>
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
                                className="mt-2 sm:mt-3 md:mt-4 flex w-full items-center justify-center gap-1.5 sm:gap-2 rounded bg-[#3B745B] py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm font-bold text-white transition-colors hover:bg-[#2a5542]"
                            >
                                <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">Add to cart</span><span className="sm:hidden">Add</span>
                            </button>
                        </div>
                    ))}

                    {/* Registration Banner Card (Right Side) */}
                    <div className="col-span-2 md:col-span-1 lg:col-span-1 xl:col-span-1 flex flex-col items-center justify-center rounded-xl sm:rounded-2xl bg-[#FFFCEB] p-4 sm:p-6 md:p-8 text-center">
                        <h3 className="text-2xl sm:text-3xl font-bold text-[#253D4E] mb-2">10% OFF</h3>
                        <p className="text-sm sm:text-base text-[#7E7E7E] mb-4 sm:mb-6 md:mb-8">For new member sign up at the first time</p>

                        <form className="w-full">
                            <div className="mb-3 sm:mb-4 text-left">
                                <label className="mb-1.5 sm:mb-2 block text-xs font-bold text-[#253D4E]">Email address*</label>
                                <input type="email" placeholder="johndoe@gmail.com" className="w-full rounded-lg border border-gray-200 bg-white px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm outline-none focus:border-[#3B745B]" />
                            </div>
                            <div className="mb-4 sm:mb-6 text-left">
                                <label className="mb-1.5 sm:mb-2 block text-xs font-bold text-[#253D4E]">Password*</label>
                                <input type="password" placeholder="Maximum 8 characters" className="w-full rounded-lg border border-gray-200 bg-white px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm outline-none focus:border-[#3B745B]" />
                            </div>
                            <button className="w-full rounded-lg bg-[#3B745B] py-3 sm:py-4 text-xs sm:text-sm font-bold text-white transition-colors hover:bg-[#2a5542]">
                                Register Now
                            </button>
                        </form>
                    </div>
                </div>

                {/* ================= 4-COLUMN LISTS ================= */}
                <div className="mb-8 sm:mb-12 md:mb-16 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:grid-cols-4">
                    {/* Top Sells */}
                    <div>
                        <h3 className="mb-4 sm:mb-6 text-lg sm:text-xl font-bold text-[#253D4E] relative pb-2 sm:pb-3 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-16 sm:after:w-20 after:bg-[#3B745B]">Top Sells</h3>
                        <div className="flex flex-col gap-3 sm:gap-4">
                            {topSells.map((item, i) => <SmallProductItem key={i} {...item} />)}
                        </div>
                    </div>

                    {/* Top Rated */}
                    <div>
                        <h3 className="mb-4 sm:mb-6 text-lg sm:text-xl font-bold text-[#253D4E] relative pb-2 sm:pb-3 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-16 sm:after:w-20 after:bg-[#3B745B]">Top Rated</h3>
                        <div className="flex flex-col gap-3 sm:gap-4">
                            {topRated.map((item, i) => <SmallProductItem key={i} {...item} />)}
                        </div>
                    </div>

                    {/* Trending Items */}
                    <div>
                        <h3 className="mb-4 sm:mb-6 text-lg sm:text-xl font-bold text-[#253D4E] relative pb-2 sm:pb-3 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-16 sm:after:w-20 after:bg-[#3B745B]">Trending Items</h3>
                        <div className="flex flex-col gap-3 sm:gap-4">
                            {trendingItems.map((item, i) => <SmallProductItem key={i} {...item} />)}
                        </div>
                    </div>

                    {/* Recently Added */}
                    <div>
                        <h3 className="mb-4 sm:mb-6 text-lg sm:text-xl font-bold text-[#253D4E] relative pb-2 sm:pb-3 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-16 sm:after:w-20 after:bg-[#3B745B]">Recently Added</h3>
                        <div className="flex flex-col gap-3 sm:gap-4">
                            {recentlyAdded.map((item, i) => <SmallProductItem key={i} {...item} />)}
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}

export default BestSale;
