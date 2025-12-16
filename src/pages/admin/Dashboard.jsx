import React from "react";
import {
    ShoppingCart,
    DollarSign,
    Users,
    Package,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";

const Dashboard = () => {
    // Mock data - replace with actual data from API/context later
    const stats = [
        {
            title: "Total Revenue",
            value: "£45,231",
            change: "+20.1%",
            trend: "up",
            icon: DollarSign,
            color: "bg-green-500",
        },
        {
            title: "Total Orders",
            value: "1,423",
            change: "+12.5%",
            trend: "up",
            icon: ShoppingCart,
            color: "bg-blue-500",
        },
        {
            title: "Total Customers",
            value: "892",
            change: "+8.2%",
            trend: "up",
            icon: Users,
            color: "bg-purple-500",
        },
        {
            title: "Total Products",
            value: "156",
            change: "-2.1%",
            trend: "down",
            icon: Package,
            color: "bg-orange-500",
        },
    ];

    const recentOrders = [
        { id: "#1234", customer: "John Doe", product: "Fresh Vegetables", amount: "£45.99", status: "completed" },
        { id: "#1235", customer: "Jane Smith", product: "Organic Fruits", amount: "£32.50", status: "pending" },
        { id: "#1236", customer: "Mike Johnson", product: "Dairy Products", amount: "£67.20", status: "completed" },
        { id: "#1237", customer: "Sarah Wilson", product: "Bakery Items", amount: "£28.75", status: "processing" },
        { id: "#1238", customer: "Tom Brown", product: "Beverages", amount: "£15.40", status: "completed" },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "processing":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-[#253D4E]">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store today.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-bold text-[#253D4E] mt-2">{stat.value}</p>
                                    <div className="flex items-center gap-2 mt-3">
                                        {stat.trend === "up" ? (
                                            <>
                                                <TrendingUp className="h-4 w-4 text-green-500" />
                                                <span className="text-sm font-medium text-green-600">
                                                    {stat.change}
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <TrendingDown className="h-4 w-4 text-red-500" />
                                                <span className="text-sm font-medium text-red-600">
                                                    {stat.change}
                                                </span>
                                            </>
                                        )}
                                        <span className="text-sm text-gray-500">from last month</span>
                                    </div>
                                </div>
                                <div className={`${stat.color} p-3 rounded-lg`}>
                                    <Icon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts and Recent Orders Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Chart Area - Placeholder */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-[#253D4E]">Sales Overview</h2>
                        <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B745B]">
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                            <option>Last 3 months</option>
                        </select>
                    </div>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <div className="text-center">
                            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">Chart will be displayed here</p>
                            <p className="text-sm text-gray-400 mt-1">Integrate with Chart.js or Recharts</p>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-[#3B745B] to-[#2a5542] rounded-xl shadow-sm p-6 text-white">
                        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full bg-white/20 hover:bg-white/30 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-between">
                                Add New Product
                                <ArrowUpRight className="h-4 w-4" />
                            </button>
                            <button className="w-full bg-white/20 hover:bg-white/30 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-between">
                                View Orders
                                <ArrowUpRight className="h-4 w-4" />
                            </button>
                            <button className="w-full bg-white/20 hover:bg-white/30 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-between">
                                Manage Inventory
                                <ArrowUpRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-[#253D4E] mb-4">Top Categories</h3>
                        <div className="space-y-4">
                            {["Vegetables", "Fruits", "Dairy", "Bakery"].map((category, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">{category}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#3B745B] rounded-full"
                                                style={{ width: `${75 - index * 10}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-semibold text-[#253D4E] w-12 text-right">
                                            {75 - index * 10}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[#253D4E]">Recent Orders</h2>
                    <button className="text-sm text-[#3B745B] hover:text-[#2a5542] font-medium">
                        View all
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Order ID</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Customer</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Product</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                    <td className="py-3 px-4 text-sm font-medium text-[#253D4E]">{order.id}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{order.customer}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{order.product}</td>
                                    <td className="py-3 px-4 text-sm font-semibold text-[#253D4E]">{order.amount}</td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                order.status
                                            )}`}
                                        >
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

