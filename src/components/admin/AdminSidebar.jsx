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
                className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white text-[#253D4E] rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
            >
                <Menu className="h-5 w-5" />
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
                className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200 shadow-sm transition-transform duration-300 ease-in-out ${
                    isMobileOpen ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo Section */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 flex-shrink-0">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 bg-[#3B745B] rounded-lg flex items-center justify-center flex-shrink-0">
                                <LayoutDashboard className="h-5 w-5 text-white" />
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-base font-bold text-[#253D4E] leading-tight">Admin Panel</h2>
                                <p className="text-xs text-gray-500 leading-tight">Grocery Store</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="lg:hidden p-1.5 text-gray-400 hover:text-[#253D4E] hover:bg-gray-100 rounded transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="flex-1 overflow-y-auto px-3 py-3 scrollbar-hide">
                        <ul className="space-y-1">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.path);
                                return (
                                    <li key={item.path}>
                                        <Link
                                            to={item.path}
                                            onClick={() => setIsMobileOpen(false)}
                                            className={`group flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 ${
                                                active
                                                    ? "bg-[#3B745B] text-white shadow-sm"
                                                    : "text-[#253D4E] hover:bg-gray-100 hover:text-[#3B745B]"
                                            }`}
                                        >
                                            <Icon className={`h-4 w-4 flex-shrink-0 transition-colors ${
                                                active 
                                                    ? 'text-white' 
                                                    : 'text-gray-600 group-hover:text-[#3B745B]'
                                            }`} />
                                            <span className="font-medium text-sm">{item.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Footer Section */}
                    <div className="px-3 py-3 border-t border-gray-200 space-y-1 flex-shrink-0">
                        <Link
                            to="/"
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#253D4E] hover:bg-gray-100 hover:text-[#3B745B] transition-all duration-200"
                        >
                            <Home className="h-4 w-4 text-gray-600" />
                            <span className="font-medium text-sm">Back to Store</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[#253D4E] hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                        >
                            <LogOut className="h-4 w-4 text-gray-600" />
                            <span className="font-medium text-sm">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;

