import React from "react";
import { Link } from "react-router-dom";
import { Building2, DollarSign, ShoppingCart, Wallet, Truck, Headphones, CheckCircle2, Linkedin, Twitter } from "lucide-react";

// Import images
import team1 from "../assets/images/team1.png";
import team2 from "../assets/images/team2.png";
import team3 from "../assets/images/team3.png";
import aboutGrocery from "../assets/images/aboutgrocery image.png";

function AboutUs() {
    const stats = [
        {
            icon: Building2,
            value: "10.5k",
            label: "Sellers active our site",
            highlight: false,
        },
        {
            icon: DollarSign,
            value: "33k",
            label: "Monthly Product Sale",
            highlight: true,
        },
        {
            icon: ShoppingCart,
            value: "45.5k",
            label: "Customer active in our site",
            highlight: false,
        },
        {
            icon: Wallet,
            value: "25k",
            label: "Annual gross sale in our site",
            highlight: false,
        },
    ];

    const teamMembers = [
        {
            name: "Tom Cruise",
            role: "Founder & Chairman",
            image: team1,
        },
        {
            name: "Emma Watson",
            role: "Managing Director",
            image: team2,
        },
        {
            name: "Will Smith",
            role: "Product Designer",
            image: team3,
        },
    ];

    const features = [
        {
            icon: Truck,
            title: "FREE AND FAST DELIVERY",
            description: "Free delivery for all orders over $140",
        },
        {
            icon: Headphones,
            title: "24/7 CUSTOMER SERVICE",
            description: "Friendly 24/7 customer support",
        },
        {
            icon: CheckCircle2,
            title: "MONEY BACK GUARANTEE",
            description: "We return money within 30 days",
        },
    ];

    return (
        <div className="w-full bg-white min-h-screen py-12">
            <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
                
                {/* Breadcrumb */}
                <div className="mb-8">
                    <nav className="flex items-center gap-2 text-sm text-[#7E7E7E]">
                        <Link to="/" className="hover:text-[#3B745B] transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-[#253D4E] font-semibold">About</span>
                    </nav>
                </div>

                {/* Our Story Section */}
                <div className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    <div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3B745B] mb-6">
                            Our Story
                        </h2>
                        <div className="space-y-4 text-[#7E7E7E] leading-relaxed">
                            <p className="text-base sm:text-lg">
                                Launched in 2015, Exclusive is South Asia's premier online shopping marketplace with an active presence in UK. Supported by wide range of tailored marketing, data and service solutions, Exclusive has 10,500 sellers and 300 brands and serves 3 millions customers across the region.
                            </p>
                            <p className="text-base sm:text-lg">
                                Exclusive has more than 1 Million products to offer, growing at a very fast. Exclusive offers a diverse assortment in categories ranging from consumer.
                            </p>
                        </div>
                    </div>
                    <div className="w-full">
                        <img
                            src={aboutGrocery}
                            alt="Grocery Store"
                            className="w-full h-auto rounded-lg shadow-lg object-cover"
                        />
                    </div>
                </div>

                {/* Statistics Section */}
                <div className="mb-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <div
                                key={index}
                                className={`p-6 rounded-lg border-2 transition-all hover:shadow-lg ${
                                    stat.highlight
                                        ? "bg-[#3B745B] border-[#3B745B] text-white"
                                        : "bg-white border-gray-200 text-[#253D4E]"
                                }`}
                            >
                                <div className={`mb-4 ${stat.highlight ? "text-white" : "text-[#3B745B]"}`}>
                                    <IconComponent className="h-10 w-10" />
                                </div>
                                <h3 className={`text-3xl font-bold mb-2 ${stat.highlight ? "text-white" : "text-[#253D4E]"}`}>
                                    {stat.value}
                                </h3>
                                <p className={`text-sm ${stat.highlight ? "text-white/90" : "text-[#7E7E7E]"}`}>
                                    {stat.label}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Team Section */}
                <div className="mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-[#253D4E] mb-8 text-center">
                        Our Team
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {teamMembers.map((member, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow"
                            >
                                <div className="mb-4">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-gray-100"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-[#253D4E] mb-2">{member.name}</h3>
                                <p className="text-sm text-[#7E7E7E] mb-4">{member.role}</p>
                                <div className="flex items-center justify-center gap-3">
                                    <a
                                        href="#"
                                        className="w-8 h-8 rounded-full bg-[#3B745B] text-white flex items-center justify-center hover:bg-[#2a5542] transition-colors"
                                    >
                                        <Twitter className="h-4 w-4" />
                                    </a>
                                    <a
                                        href="#"
                                        className="w-8 h-8 rounded-full bg-[#3B745B] text-white flex items-center justify-center hover:bg-[#2a5542] transition-colors"
                                    >
                                        <Linkedin className="h-4 w-4" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Features/Guarantees Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => {
                        const IconComponent = feature.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow"
                            >
                                <div className="mb-4 flex justify-center">
                                    <div className="w-16 h-16 rounded-full bg-[#DEF9EC] flex items-center justify-center">
                                        <IconComponent className="h-8 w-8 text-[#3B745B]" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-[#253D4E] mb-2">{feature.title}</h3>
                                <p className="text-sm text-[#7E7E7E]">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default AboutUs;

