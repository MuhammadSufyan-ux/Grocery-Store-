import React from "react";
import logo from "../assets/images/Logo.png"; // Ensure this path is correct
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Tag,
    RefreshCcw,
    Truck,
} from "lucide-react";

// Placeholder imports for payment icons. Replace with your actual images.
// import visa from "./assets/payment/visa.png";
// import mastercard from "./assets/payment/mastercard.png";
// etc.

function Footer() {
    return (
        <footer className="bg-white pt-16 pb-8 border-t border-gray-100 font-sans">
            <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">

                {/* ================= TOP SECTION (Features) ================= */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 pb-16 border-b border-gray-100">
                    {/* Feature 1 */}
                    <div className="flex items-start gap-4">
                        <div className="h-12 w-12 flex items-center justify-center rounded-full bg-[#DEF9EC]">
                            <Tag className="h-6 w-6 text-[#3B745B]" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[#253D4E] mb-2">
                                Best Prices & Deals
                            </h3>
                            <p className="text-[#7E7E7E] text-sm">
                                Don't miss our daily amazing deals and prices
                            </p>
                        </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="flex items-start gap-4">
                        <div className="h-12 w-12 flex items-center justify-center rounded-full bg-[#DEF9EC]">
                            <RefreshCcw className="h-6 w-6 text-[#3B745B]" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[#253D4E] mb-2">
                                Refundable
                            </h3>
                            <p className="text-[#7E7E7E] text-sm">
                                If your items have damage we agree to refund it
                            </p>
                        </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="flex items-start gap-4">
                        <div className="h-12 w-12 flex items-center justify-center rounded-full bg-[#DEF9EC]">
                            <Truck className="h-6 w-6 text-[#3B745B]" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[#253D4E] mb-2">
                                Free delivery
                            </h3>
                            <p className="text-[#7E7E7E] text-sm">
                                Do purchase over $50 and get free delivery anywhere
                            </p>
                        </div>
                    </div>
                </div>

                {/* ================= MIDDLE SECTION (Links) ================= */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-16">

                    {/* Column 1: Contact Info */}
                    <div className="lg:col-span-2">
                        {/* Logo Image */}
                        <img src={logo} alt="Groceyish" className="h-12 w-auto mb-6" />

                        <ul className="flex flex-col gap-4 text-[#253D4E]">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-[#3B745B] mt-0.5 flex-shrink-0" />
                                <span>Address: 1762 School House Road</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-[#3B745B] flex-shrink-0" />
                                <span>Call Us: 1233-777</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-[#3B745B] flex-shrink-0" />
                                <span>Email: groceyish@contact.com</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Clock className="h-5 w-5 text-[#3B745B] mt-0.5 flex-shrink-0" />
                                <span>Work hours: 8:00 - 20:00, Sunday - Thursday</span>
                            </li>
                        </ul>
                    </div>

                    {/* Column 2: Account */}
                    <div>
                        <h3 className="text-xl font-bold text-[#253D4E] mb-6">Account</h3>
                        <ul className="flex flex-col gap-4 text-[#253D4E]">
                            <li><a href="#" className="hover:text-[#3B745B] transition-colors">Wishlist</a></li>
                            <li><a href="#" className="hover:text-[#3B745B] transition-colors">Cart</a></li>
                            <li><a href="#" className="hover:text-[#3B745B] transition-colors">Track Order</a></li>
                            <li><a href="#" className="hover:text-[#3B745B] transition-colors">Shipping Details</a></li>
                        </ul>
                    </div>

                    {/* Column 3: Useful links */}
                    <div>
                        <h3 className="text-xl font-bold text-[#253D4E] mb-6">Useful links</h3>
                        <ul className="flex flex-col gap-4 text-[#253D4E]">
                            <li><a href="#" className="hover:text-[#3B745B] transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-[#3B745B] transition-colors">Hot deals</a></li>
                            <li><a href="#" className="hover:text-[#3B745B] transition-colors">Promotions</a></li>
                            <li><a href="#" className="hover:text-[#3B745B] transition-colors">New products</a></li>
                        </ul>
                    </div>

                    {/* Column 4: Help Center */}
                    <div>
                        <h3 className="text-xl font-bold text-[#253D4E] mb-6">Help Center</h3>
                        <ul className="flex flex-col gap-4 text-[#253D4E]">
                            <li><a href="#" className="hover:text-[#3B745B] transition-colors">Payments</a></li>
                            <li><a href="#" className="hover:text-[#3B745B] transition-colors">Refund</a></li>
                            <li><a href="#" className="hover:text-[#3B745B] transition-colors">Checkout</a></li>
                            <li><a href="#" className="hover:text-[#3B745B] transition-colors">Shipping</a></li>
                            <li><a href="#" className="hover:text-[#3B745B] transition-colors">Q&A</a></li>
                            <li><a href="#" className="hover:text-[#3B745B] transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>

                {/* ================= BOTTOM SECTION (Copyright & Icons) ================= */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-gray-100">

                    {/* Copyright */}
                    <p className="text-[#7E7E7E] text-sm">
                        © 2022, All rights reserved
                    </p>

                    {/* Payment Methods (Placeholders - replace with images) */}
                    <div className="flex items-center gap-3">
                        <div className="h-8 px-2 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-600 font-semibold">VISA</div>
                        <div className="h-8 px-2 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-600 font-semibold">MasterCard</div>
                        <div className="h-8 px-2 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-600 font-semibold">Maestro</div>
                        <div className="h-8 px-2 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-600 font-semibold">Amex</div>
                    </div>

                    {/* Social Media Icons */}
                    <div className="flex items-center gap-4">
                        <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-[#3B745B] text-white hover:bg-[#2a5542] transition-colors">
                            <Facebook className="h-5 w-5" />
                        </a>
                        <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-[#3B745B] text-white hover:bg-[#2a5542] transition-colors">
                            <Linkedin className="h-5 w-5" />
                        </a>
                        <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-[#3B745B] text-white hover:bg-[#2a5542] transition-colors">
                            <Instagram className="h-5 w-5" />
                        </a>
                        <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-[#3B745B] text-white hover:bg-[#2a5542] transition-colors">
                            <Twitter className="h-5 w-5" />
                        </a>
                    </div>
                </div>

            </div>
        </footer>
    );
}

export default Footer;
