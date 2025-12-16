import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import authImage from "../assets/images/imageforauth.png";
import logo from "../assets/images/Logo.png";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!formData.email || !formData.password) {
            setError("Please fill in all fields");
            setLoading(false);
            return;
        }

        const result = await login(formData.email, formData.password);

        if (result.success) {
            // Small delay to ensure state is updated, then navigate
            setTimeout(() => {
                navigate("/", { replace: true });
            }, 200);
        } else {
            setError(result.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
            <div className="w-full h-screen lg:h-auto lg:max-w-6xl bg-white lg:rounded-2xl lg:shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 lg:min-h-[600px]">
                {/* Left Panel - Illustration (Hidden on Mobile) */}
                <div className="hidden lg:flex bg-[#f8f9fa] relative overflow-hidden items-center justify-center p-8">
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-4 left-4 w-8 h-8 bg-[#3B745B] rounded"></div>
                        <div className="absolute bottom-4 right-4 w-8 h-8 bg-[#3B745B] rounded"></div>
                    </div>
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                        <img
                            src={authImage}
                            alt="Authentication"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                {/* Right Panel - Login Form */}
                <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12 bg-white relative h-full">
                    {/* Logo - Mobile */}
                    <div className="lg:hidden mb-8 pb-6 border-b border-gray-200">
                        <Link to="/" className="inline-block">
                            <img
                                src={logo}
                                alt="Logo"
                                className="h-10 w-auto"
                            />
                        </Link>
                    </div>

                    {/* Decorative dots */}
                    <div className="absolute top-4 right-4 w-8 h-8 opacity-10">
                        <div className="grid grid-cols-2 gap-1">
                            <div className="w-2 h-2 bg-[#3B745B] rounded"></div>
                            <div className="w-2 h-2 bg-[#3B745B] rounded"></div>
                            <div className="w-2 h-2 bg-[#3B745B] rounded"></div>
                            <div className="w-2 h-2 bg-[#3B745B] rounded"></div>
                        </div>
                    </div>
                    <div className="absolute bottom-4 right-4 w-8 h-8 opacity-10">
                        <div className="grid grid-cols-2 gap-1">
                            <div className="w-2 h-2 bg-[#3B745B] rounded"></div>
                            <div className="w-2 h-2 bg-[#3B745B] rounded"></div>
                            <div className="w-2 h-2 bg-[#3B745B] rounded"></div>
                            <div className="w-2 h-2 bg-[#3B745B] rounded"></div>
                        </div>
                    </div>

                    <div className="max-w-md w-full mx-auto">
                        {/* Logo - Desktop */}
                        <div className="hidden lg:block mb-6">
                            <Link to="/" className="inline-block">
                                <img
                                    src={logo}
                                    alt="Logo"
                                    className="h-12 w-auto"
                                />
                            </Link>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-[#3B745B] mb-2">
                            Sign In!
                        </h1>
                        <p className="text-gray-600 mb-8 text-sm sm:text-base">
                            to be a part of this store
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <h2 className="text-lg font-semibold text-[#3B745B] mb-4">
                                    Personal Information
                                </h2>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#253D4E] mb-2">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#253D4E] mb-2">
                                            Password <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Enter your Password"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full px-8 py-3 bg-[#3B745B] text-white font-semibold rounded-lg hover:bg-[#2a5542] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Signing In..." : "Sign In"}
                                </button>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm">
                                    <Link
                                        to="/forgot-password"
                                        className="text-[#3B745B] hover:underline whitespace-nowrap"
                                    >
                                        Forgot Password?
                                    </Link>
                                    <span className="hidden sm:inline text-gray-400">|</span>
                                    <Link
                                        to="/register"
                                        className="text-[#253D4E] hover:text-[#3B745B] hover:underline whitespace-nowrap"
                                    >
                                        Don't have account? Signup
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;

