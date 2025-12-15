import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail } from "lucide-react";

function ContactUs() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log("Contact form submitted:", formData);
        alert("Message sent successfully!");
        setFormData({ name: "", email: "", phone: "", message: "" });
    };

    return (
        <div className="w-full bg-white min-h-screen py-12">
            <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
                
                {/* Breadcrumb */}
                <div className="mb-8">
                    <nav className="flex items-center gap-2 text-sm text-[#7E7E7E]">
                        <Link to="/" className="hover:text-[#3B745B] transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-[#253D4E] font-semibold">Contact</span>
                    </nav>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Contact Information */}
                    <div>
                        <div className="bg-white border-2 border-[#DEF9EC] rounded-lg p-6 sm:p-8 space-y-8">
                            {/* Call To Us Section */}
                            <div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#DEF9EC] flex items-center justify-center flex-shrink-0">
                                        <Phone className="h-6 w-6 text-[#3B745B]" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#253D4E] mb-2">Call To Us</h3>
                                        <p className="text-sm text-[#7E7E7E] mb-3">
                                            We are available 24/7, 7 days a week.
                                        </p>
                                        <p className="text-sm text-[#253D4E]">
                                            Phone: <span className="font-semibold">+8801611112222</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Write To US Section */}
                            <div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#DEF9EC] flex items-center justify-center flex-shrink-0">
                                        <Mail className="h-6 w-6 text-[#3B745B]" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#253D4E] mb-2">Write To US</h3>
                                        <p className="text-sm text-[#7E7E7E] mb-3">
                                            Fill out our form and we will contact you within 24 hours.
                                        </p>
                                        <div className="space-y-1">
                                            <p className="text-sm text-[#253D4E]">
                                                Emails: <span className="font-semibold">customer@exclusive.com</span>
                                            </p>
                                            <p className="text-sm text-[#253D4E]">
                                                Emails: <span className="font-semibold">support@exclusive.com</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Contact Form */}
                    <div>
                        <form onSubmit={handleSubmit} className="bg-white border  border-gray-200 rounded-lg p-6 sm:p-8 space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                    Your Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3B745B] bg-gray-50 text-[#253D4E]"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                    Your Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3B745B] bg-gray-50 text-[#253D4E]"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                    Your Phone <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3B745B] bg-gray-50 text-[#253D4E]"
                                    placeholder="Enter your phone number"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                    Your Massage <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                    rows={6}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3B745B] bg-gray-50 text-[#253D4E] resize-none"
                                    placeholder="Enter your message"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-[#3B745B] text-white font-bold rounded-lg hover:bg-[#2a5542] transition-colors"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactUs;

