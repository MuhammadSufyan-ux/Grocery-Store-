import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    BarChart3,
    Settings,
    FileText,
    Tag,
    Menu,
    X,
    LogOut,
    Home,
    Image as ImageIcon
} from "lucide-react";

const AdminSidebar = () => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate("/admin/login");
    };

    const menuItems = [
        { path: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { path: "/admin/products", icon: Package, label: "Products" },
        { path: "/admin/orders", icon: ShoppingCart, label: "Orders" },
        { path: "/admin/customers", icon: Users, label: "Customers" },
        { path: "/admin/categories", icon: Tag, label: "Categories" },
        { path: "/admin/slides", icon: ImageIcon, label: "Slides Manager" },
        { path: "/admin/analytics", icon: BarChart3, label: "Analytics" },
        { path: "/admin/reports", icon: FileText, label: "Reports" },
        { path: "/admin/settings", icon: Settings, label: "Settings" },
    ];

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#3B745B] text-white rounded-md shadow-lg"
            >
                <Menu className="h-6 w-6" />
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 h-screen w-64 bg-[#253D4E] text-white transition-transform duration-300 ease-in-out ${
                    isMobileOpen ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo Section */}
                    <div className="flex items-center justify-between p-6 border-b border-[#3B745B]/30">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#3B745B] rounded-lg flex items-center justify-center">
                                <LayoutDashboard className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Admin Panel</h2>
                                <p className="text-xs text-gray-400">Grocery Store</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="lg:hidden text-gray-400 hover:text-white"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="flex-1 overflow-y-auto p-4">
                        <ul className="space-y-2">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.path);
                                return (
                                    <li key={item.path}>
                                        <Link
                                            to={item.path}
                                            onClick={() => setIsMobileOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                                active
                                                    ? "bg-[#3B745B] text-white shadow-lg"
                                                    : "text-gray-300 hover:bg-[#3B745B]/30 hover:text-white"
                                            }`}
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span className="font-medium">{item.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Footer Section */}
                    <div className="p-4 border-t border-[#3B745B]/30 space-y-2">
                        <Link
                            to="/"
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#3B745B]/30 hover:text-white transition-colors"
                        >
                            <Home className="h-5 w-5" />
                            <span className="font-medium">Back to Store</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600/30 hover:text-red-300 transition-colors"
                        >
                            <LogOut className="h-5 w-5" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;

