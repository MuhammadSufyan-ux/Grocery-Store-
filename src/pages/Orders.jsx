import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Package, Calendar, MapPin, CreditCard, Loader, ChevronDown, ChevronUp, ShoppingBag } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Orders = () => {
    const { token, isAuthenticated } = useAuth();
    const { error } = useToast();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrders, setExpandedOrders] = useState(new Set());

    useEffect(() => {
        if (isAuthenticated()) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [token, isAuthenticated]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/orders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setOrders(data.orders || []);
            } else {
                error(data.message || "Failed to fetch orders");
            }
        } catch (err) {
            console.error("Error fetching orders:", err);
            error("An error occurred while fetching orders");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch (error) {
            return "Invalid Date";
        }
    };

    const formatAddress = (address) => {
        if (!address) return "No address provided";
        const parts = [
            address.streetAddress,
            address.apartment,
            address.townCity,
            address.state,
            address.zipCode,
            address.country,
        ].filter(Boolean);
        return parts.length > 0 ? parts.join(", ") : "No address provided";
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "delivered":
                return "bg-green-50 text-green-700 border-green-300";
            case "shipped":
                return "bg-blue-50 text-blue-700 border-blue-300";
            case "processing":
                return "bg-amber-50 text-amber-700 border-amber-300";
            case "cancelled":
                return "bg-red-50 text-red-700 border-red-300";
            default:
                return "bg-gray-50 text-gray-700 border-gray-300";
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case "paid":
                return "bg-green-50 text-green-700 border-green-300";
            case "pending":
                return "bg-amber-50 text-amber-700 border-amber-300";
            case "failed":
                return "bg-red-50 text-red-700 border-red-300";
            case "refunded":
                return "bg-purple-50 text-purple-700 border-purple-300";
            default:
                return "bg-gray-50 text-gray-700 border-gray-300";
        }
    };

    const toggleOrderExpansion = (orderId) => {
        const newExpanded = new Set(expandedOrders);
        if (newExpanded.has(orderId)) {
            newExpanded.delete(orderId);
        } else {
            newExpanded.add(orderId);
        }
        setExpandedOrders(newExpanded);
    };

    if (!isAuthenticated()) {
        return (
            <div className="w-full bg-gray-50 min-h-screen py-8 sm:py-12">
                <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                            <Package className="h-10 w-10 text-gray-400" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#253D4E] mb-3">Please Login to View Orders</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">You need to be logged in to view your order history and track your purchases.</p>
                        <Link
                            to="/login"
                            className="inline-flex items-center justify-center px-8 py-3.5 bg-[#3B745B] text-white font-semibold rounded-lg hover:bg-[#2d5a47] transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            Login to Continue
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="w-full bg-gray-50 min-h-screen py-8 sm:py-12">
                <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-center h-64">
                        <Loader className="h-10 w-10 animate-spin text-[#3B745B] mb-4" />
                        <p className="text-gray-600 font-medium">Loading your orders...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-gray-50 min-h-screen py-6 sm:py-8 lg:py-12">
            <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <div className="mb-6 sm:mb-8">
                    <nav className="flex items-center gap-2 text-xs sm:text-sm text-[#7E7E7E]">
                        <Link to="/" className="hover:text-[#3B745B] transition-colors">
                            Home
                        </Link>
                        <span>/</span>
                        <span className="text-[#253D4E] font-semibold">My Orders</span>
                    </nav>
                </div>

                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#253D4E] mb-2">My Orders</h1>
                    <p className="text-sm sm:text-base text-gray-600">View and track your order history</p>
                </div>

                {/* Orders List */}
                {orders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 lg:p-16 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                            <ShoppingBag className="h-10 w-10 text-gray-400" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-[#253D4E] mb-3">No Orders Yet</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">You haven't placed any orders yet. Start shopping to see your order history here.</p>
                        <Link
                            to="/shop"
                            className="inline-flex items-center justify-center px-8 py-3.5 bg-[#3B745B] text-white font-semibold rounded-lg hover:bg-[#2d5a47] transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4 sm:space-y-6">
                        {orders.map((order) => {
                            const isExpanded = expandedOrders.has(order._id);
                            const itemsCount = order.items?.length || 0;
                            const showAllItems = isExpanded || itemsCount <= 2;
                            
                            return (
                                <div
                                    key={order._id}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200"
                                >
                                    {/* Order Header - Mobile Optimized */}
                                    <div className="p-4 sm:p-6 border-b border-gray-100">
                                        <div className="flex flex-col gap-4">
                                            {/* Top Row: Order Number, Total, Expand Button */}
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                                                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#253D4E]">
                                                            Order #{order.orderNumber}
                                                        </h3>
                                                        <span
                                                            className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold border ${getStatusColor(
                                                                order.status
                                                            )}`}
                                                        >
                                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
                                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                                            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                                                            <span className="whitespace-nowrap">{formatDate(order.createdAt)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                                            <CreditCard className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                                                            <span className="capitalize whitespace-nowrap">
                                                                {order.paymentMethod === "bankTransfer"
                                                                    ? "Bank Transfer"
                                                                    : "Cash on Delivery"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="text-right">
                                                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#3B745B]">
                                                            £{(order.total || 0).toFixed(2)}
                                                        </p>
                                                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                                            {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                                                        </p>
                                                    </div>
                                                    {/* Mobile Expand/Collapse Button */}
                                                    <button
                                                        onClick={() => toggleOrderExpansion(order._id)}
                                                        className="md:hidden p-2 -mt-1 -mr-2 text-gray-400 hover:text-gray-600 transition-colors"
                                                        aria-label={isExpanded ? "Collapse order" : "Expand order"}
                                                    >
                                                        {isExpanded ? (
                                                            <ChevronUp className="h-5 w-5" />
                                                        ) : (
                                                            <ChevronDown className="h-5 w-5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Payment Status Badge */}
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold border ${getPaymentStatusColor(
                                                        order.paymentStatus
                                                    )}`}
                                                >
                                                    Payment: {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Items - Always visible on desktop, expandable on mobile */}
                                    <div className={`p-4 sm:p-6 ${isExpanded || itemsCount <= 2 ? 'block' : 'hidden'} md:block`}>
                                        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                                            {(showAllItems ? (order.items || []) : (order.items || []).slice(0, 2)).map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                                >
                                                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-200 shadow-sm">
                                                        <img
                                                            src={
                                                                item.image ||
                                                                `https://via.placeholder.com/80?text=${encodeURIComponent(
                                                                    item.name?.substring(0, 2) || 'P'
                                                                )}`
                                                            }
                                                            alt={item.name}
                                                            className="w-full h-full object-contain p-2"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-sm sm:text-base text-[#253D4E] mb-1 truncate">{item.name}</h4>
                                                        <p className="text-xs sm:text-sm text-gray-600">
                                                            {item.weight} × {item.quantity}
                                                        </p>
                                                    </div>
                                                    <div className="text-right flex-shrink-0">
                                                        <p className="font-bold text-sm sm:text-base text-[#3B745B]">
                                                            £{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                            {!showAllItems && itemsCount > 2 && (
                                                <button
                                                    onClick={() => toggleOrderExpansion(order._id)}
                                                    className="w-full py-2 text-sm text-[#3B745B] font-medium hover:text-[#2d5a47] transition-colors"
                                                >
                                                    +{itemsCount - 2} more item{itemsCount - 2 !== 1 ? 's' : ''}
                                                </button>
                                            )}
                                        </div>

                                        {/* Shipping Address */}
                                        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            <div className="flex items-start gap-2 sm:gap-3">
                                                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                                <div className="flex-1 min-w-0">
                                                    <span className="block text-xs sm:text-sm font-medium text-[#253D4E] mb-1">Shipping Address</span>
                                                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed break-words">
                                                        {formatAddress(order.shippingAddress)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Summary */}
                                        <div className="pt-4 sm:pt-6 border-t border-gray-200">
                                            <div className="space-y-2 sm:space-y-3">
                                                <div className="flex items-center justify-between text-sm sm:text-base">
                                                    <span className="text-gray-600">Subtotal</span>
                                                    <span className="font-semibold text-[#253D4E]">£{order.subtotal?.toFixed(2) || '0.00'}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm sm:text-base">
                                                    <span className="text-gray-600">Shipping</span>
                                                    <span className="font-semibold text-[#3B745B]">
                                                        {order.shippingCost > 0 ? `£${order.shippingCost.toFixed(2)}` : "Free"}
                                                    </span>
                                                </div>
                                                {order.discount > 0 && (
                                                    <div className="flex items-center justify-between text-sm sm:text-base">
                                                        <span className="text-gray-600">Discount</span>
                                                        <span className="font-semibold text-green-600">
                                                            -£{order.discount.toFixed(2)}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                                    <span className="text-base sm:text-lg font-bold text-[#253D4E]">Total</span>
                                                    <span className="text-lg sm:text-xl font-bold text-[#3B745B]">
                                                        £{order.total?.toFixed(2) || '0.00'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mobile: Show expand/collapse button if more than 2 items */}
                                    {itemsCount > 2 && (
                                        <div className="md:hidden p-4 border-t border-gray-100">
                                            <button
                                                onClick={() => toggleOrderExpansion(order._id)}
                                                className="w-full flex items-center justify-center gap-2 py-2 text-sm text-[#3B745B] font-medium hover:text-[#2d5a47] transition-colors"
                                            >
                                                {isExpanded ? (
                                                    <>
                                                        Show Less
                                                        <ChevronUp className="h-4 w-4" />
                                                    </>
                                                ) : (
                                                    <>
                                                        View All Items
                                                        <ChevronDown className="h-4 w-4" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
