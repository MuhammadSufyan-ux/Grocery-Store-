import React from "react";
import { X, CheckCircle, Package, MapPin, CreditCard, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const OrderSuccessModal = ({ order, onClose }) => {
    if (!order) return null;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatAddress = (address) => {
        const parts = [
            address.streetAddress,
            address.apartment,
            address.townCity,
            address.state,
            address.zipCode,
            address.country,
        ].filter(Boolean);
        return parts.join(", ");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-[#3B745B] to-[#2d5a47] text-white p-6 rounded-t-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="h-8 w-8" />
                        <div>
                            <h2 className="text-2xl font-bold">Order Placed Successfully!</h2>
                            <p className="text-sm text-green-100">Thank you for your order</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200 transition-colors p-2"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Order Number */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Order Number</p>
                                <p className="text-xl font-bold text-[#3B745B]">{order.orderNumber}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Order Date</p>
                                <p className="text-sm font-semibold text-[#253D4E]">
                                    {formatDate(order.createdAt)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div>
                        <h3 className="text-lg font-bold text-[#253D4E] mb-3 flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Order Items
                        </h3>
                        <div className="space-y-3">
                            {order.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg"
                                >
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                        <img
                                            src={item.image || `https://via.placeholder.com/64?text=${encodeURIComponent(item.name)}`}
                                            alt={item.name}
                                            className="w-full h-full object-contain p-2"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-[#253D4E]">{item.name}</h4>
                                        <p className="text-sm text-gray-600">
                                            {item.weight} x {item.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-[#3B745B]">
                                            £{(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Shipping Address */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-lg font-bold text-[#253D4E] mb-3 flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Shipping Address
                            </h3>
                            <p className="text-sm text-gray-700 whitespace-pre-line">
                                {formatAddress(order.shippingAddress)}
                            </p>
                            {order.shippingAddress.phoneNumber && (
                                <p className="text-sm text-gray-700 mt-2">
                                    Phone: {order.shippingAddress.phoneNumber}
                                </p>
                            )}
                        </div>

                        {/* Payment Information */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-lg font-bold text-[#253D4E] mb-3 flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Payment Information
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Payment Method:</span>
                                    <span className="font-semibold text-[#253D4E] capitalize">
                                        {order.paymentMethod === "bankTransfer"
                                            ? "Bank Transfer"
                                            : "Cash on Delivery"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Payment Status:</span>
                                    <span className="font-semibold capitalize">
                                        <span
                                            className={`${
                                                order.paymentStatus === "paid"
                                                    ? "text-green-600"
                                                    : order.paymentStatus === "pending"
                                                    ? "text-yellow-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            {order.paymentStatus}
                                        </span>
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Order Status:</span>
                                    <span className="font-semibold capitalize">
                                        <span
                                            className={`${
                                                order.status === "delivered"
                                                    ? "text-green-600"
                                                    : order.status === "shipped"
                                                    ? "text-blue-600"
                                                    : order.status === "processing"
                                                    ? "text-yellow-600"
                                                    : "text-gray-600"
                                            }`}
                                        >
                                            {order.status}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Total */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-[#253D4E] font-medium">Subtotal:</span>
                                <span className="font-semibold text-[#253D4E]">£{order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[#253D4E] font-medium">Shipping:</span>
                                <span className="font-semibold text-[#3B745B]">
                                    {order.shippingCost > 0 ? `£${order.shippingCost.toFixed(2)}` : "Free"}
                                </span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#253D4E] font-medium">Discount:</span>
                                    <span className="font-semibold text-green-600">
                                        -£{order.discount.toFixed(2)}
                                    </span>
                                </div>
                            )}
                            <div className="border-t border-gray-300 pt-2 mt-2">
                                <div className="flex justify-between">
                                    <span className="text-lg font-bold text-[#253D4E]">Total:</span>
                                    <span className="text-xl font-bold text-[#3B745B]">
                                        £{order.total.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                        <Link
                            to="/"
                            className="flex-1 px-6 py-3 bg-[#3B745B] text-white font-semibold rounded-lg hover:bg-[#2d5a47] transition-colors text-center"
                        >
                            Continue Shopping
                        </Link>
                        <Link
                            to="/account?tab=orders"
                            className="flex-1 px-6 py-3 bg-white border-2 border-[#3B745B] text-[#3B745B] font-semibold rounded-lg hover:bg-green-50 transition-colors text-center"
                        >
                            View My Orders
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessModal;
