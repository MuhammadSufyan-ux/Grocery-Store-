import React, { useState } from "react";
import { Search, Bell, User, ChevronDown, Moon, Sun } from "lucide-react";
import profile from "../../assets/images/user_profile.png";

const AdminNavbar = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    return (
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
            <div className="px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    {/* Left: Search */}
                    <div className="flex-1 max-w-xl hidden md:block">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-4 ml-auto">
                        {/* Mobile Search */}
                        <button className="md:hidden p-2 text-gray-600 hover:text-[#3B745B]">
                            <Search className="h-5 w-5" />
                        </button>

                        {/* Dark Mode Toggle */}
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="p-2 text-gray-600 hover:text-[#3B745B] hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {isDarkMode ? (
                                <Sun className="h-5 w-5" />
                            ) : (
                                <Moon className="h-5 w-5" />
                            )}
                        </button>

                        {/* Notifications */}
                        <div className="relative">
                            <button className="relative p-2 text-gray-600 hover:text-[#3B745B] hover:bg-gray-100 rounded-lg transition-colors">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                            </button>
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <img
                                    src={profile}
                                    alt="Profile"
                                    className="h-8 w-8 rounded-full object-cover border-2 border-gray-200"
                                />
                                <div className="hidden sm:block text-left">
                                    <p className="text-sm font-semibold text-[#253D4E]">Ramzi Cherif</p>
                                    <p className="text-xs text-gray-500">Administrator</p>
                                </div>
                                <ChevronDown className="h-4 w-4 text-gray-400 hidden sm:block" />
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsProfileOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                                        <a
                                            href="#"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Profile Settings
                                        </a>
                                        <a
                                            href="#"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Account Settings
                                        </a>
                                        <hr className="my-2" />
                                        <a
                                            href="#"
                                            className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            Logout
                                        </a>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminNavbar;

