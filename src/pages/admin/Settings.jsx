import React, { useState, useEffect } from "react";
import { Settings as SettingsIcon, Save, CreditCard, Truck, Loader } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Settings = () => {
    const { token } = useAuth();
    const { success, error } = useToast();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [paymentMethods, setPaymentMethods] = useState({
        bankTransfer: {
            enabled: false,
            label: "Bank Local Transfer",
            bankDetails: {
                accountName: "",
                accountNumber: "",
                bankName: "",
                iban: "",
                swiftCode: "",
                branchName: "",
                routingNumber: "",
                additionalInfo: "",
            },
        },
        cod: {
            enabled: true,
            label: "Cash on Delivery",
            instructions: "",
        },
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setFetching(true);
            const response = await fetch(`${API_URL}/api/settings`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setPaymentMethods(data.settings.paymentMethods);
            }
        } catch (err) {
            console.error("Error fetching settings:", err);
            error("Failed to load settings");
        } finally {
            setFetching(false);
        }
    };

    const handlePaymentMethodChange = (method, field, value) => {
        setPaymentMethods((prev) => ({
            ...prev,
            [method]: {
                ...prev[method],
                [field]: value,
            },
        }));
    };

    const handleBankDetailsChange = (field, value) => {
        setPaymentMethods((prev) => ({
            ...prev,
            bankTransfer: {
                ...prev.bankTransfer,
                bankDetails: {
                    ...prev.bankTransfer.bankDetails,
                    [field]: value,
                },
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/settings`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    paymentMethods,
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                success("Settings updated successfully!");
                setPaymentMethods(data.settings.paymentMethods);
            } else {
                error(data.message || "Failed to update settings");
            }
        } catch (err) {
            console.error("Error updating settings:", err);
            error("Failed to update settings");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader className="h-8 w-8 animate-spin text-[#3B745B]" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-[#253D4E]">Settings</h1>
                <p className="text-gray-600 mt-1">Manage store settings and preferences</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Payment Methods Tab */}
                    <div className="border-b border-gray-200">
                        <div className="px-6 py-4 bg-gray-50">
                            <h2 className="text-xl font-bold text-[#253D4E] flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Payment Methods
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Configure available payment methods for customers
                            </p>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Bank Transfer Option */}
                        <div className="border border-gray-200 rounded-lg p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <CreditCard className="h-6 w-6 text-[#3B745B]" />
                                    <div>
                                        <h3 className="text-lg font-semibold text-[#253D4E]">
                                            Bank Local Transfer
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Allow customers to pay via bank transfer
                                        </p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={paymentMethods.bankTransfer.enabled}
                                        onChange={(e) =>
                                            handlePaymentMethodChange("bankTransfer", "enabled", e.target.checked)
                                        }
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#3B745B]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3B745B]"></div>
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                    Display Label
                                </label>
                                <input
                                    type="text"
                                    value={paymentMethods.bankTransfer.label}
                                    onChange={(e) =>
                                        handlePaymentMethodChange("bankTransfer", "label", e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] focus:border-transparent"
                                    placeholder="Bank Local Transfer"
                                />
                            </div>

                            {/* Bank Details Section - Only show if enabled */}
                            {paymentMethods.bankTransfer.enabled && (
                                <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                                    <h4 className="text-md font-semibold text-[#253D4E] mb-4">Bank Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#253D4E] mb-2">
                                                Account Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={paymentMethods.bankTransfer.bankDetails?.accountName || ""}
                                                onChange={(e) => handleBankDetailsChange("accountName", e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] focus:border-transparent"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#253D4E] mb-2">
                                                Account Number <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={paymentMethods.bankTransfer.bankDetails?.accountNumber || ""}
                                                onChange={(e) => handleBankDetailsChange("accountNumber", e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] focus:border-transparent"
                                                placeholder="1234567890"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#253D4E] mb-2">
                                                Bank Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={paymentMethods.bankTransfer.bankDetails?.bankName || ""}
                                                onChange={(e) => handleBankDetailsChange("bankName", e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] focus:border-transparent"
                                                placeholder="Example Bank"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#253D4E] mb-2">
                                                IBAN
                                            </label>
                                            <input
                                                type="text"
                                                value={paymentMethods.bankTransfer.bankDetails?.iban || ""}
                                                onChange={(e) => handleBankDetailsChange("iban", e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] focus:border-transparent"
                                                placeholder="GB82 WEST 1234 5698 7654 32"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#253D4E] mb-2">
                                                SWIFT Code
                                            </label>
                                            <input
                                                type="text"
                                                value={paymentMethods.bankTransfer.bankDetails?.swiftCode || ""}
                                                onChange={(e) => handleBankDetailsChange("swiftCode", e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] focus:border-transparent"
                                                placeholder="CHASUS33"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#253D4E] mb-2">
                                                Branch Name
                                            </label>
                                            <input
                                                type="text"
                                                value={paymentMethods.bankTransfer.bankDetails?.branchName || ""}
                                                onChange={(e) => handleBankDetailsChange("branchName", e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] focus:border-transparent"
                                                placeholder="Main Branch"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#253D4E] mb-2">
                                                Routing Number
                                            </label>
                                            <input
                                                type="text"
                                                value={paymentMethods.bankTransfer.bankDetails?.routingNumber || ""}
                                                onChange={(e) => handleBankDetailsChange("routingNumber", e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] focus:border-transparent"
                                                placeholder="123456789"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#253D4E] mb-2">
                                            Additional Information
                                        </label>
                                        <textarea
                                            value={paymentMethods.bankTransfer.bankDetails?.additionalInfo || ""}
                                            onChange={(e) => handleBankDetailsChange("additionalInfo", e.target.value)}
                                            rows="3"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] focus:border-transparent"
                                            placeholder="Any additional instructions for customers..."
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* COD Option */}
                        <div className="border border-gray-200 rounded-lg p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Truck className="h-6 w-6 text-[#3B745B]" />
                                    <div>
                                        <h3 className="text-lg font-semibold text-[#253D4E]">
                                            Cash on Delivery (COD)
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Allow customers to pay cash when receiving order
                                        </p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={paymentMethods.cod.enabled}
                                        onChange={(e) =>
                                            handlePaymentMethodChange("cod", "enabled", e.target.checked)
                                        }
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#3B745B]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3B745B]"></div>
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#253D4E] mb-2">
                                    Display Label
                                </label>
                                <input
                                    type="text"
                                    value={paymentMethods.cod.label}
                                    onChange={(e) =>
                                        handlePaymentMethodChange("cod", "label", e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] focus:border-transparent"
                                    placeholder="Cash on Delivery"
                                />
                            </div>

                            {/* COD Instructions Section - Only show if enabled */}
                            {paymentMethods.cod.enabled && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h4 className="text-md font-semibold text-[#253D4E] mb-4">COD Instructions</h4>
                                    <div>
                                        <label className="block text-sm font-medium text-[#253D4E] mb-2">
                                            Instructions for Customers
                                        </label>
                                        <textarea
                                            value={paymentMethods.cod.instructions || ""}
                                            onChange={(e) =>
                                                handlePaymentMethodChange("cod", "instructions", e.target.value)
                                            }
                                            rows="4"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] focus:border-transparent"
                                            placeholder="e.g., Please have exact change ready. Cash payment only upon delivery."
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Optional: Add any instructions or notes that customers should know about COD payment
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Info Message */}
                        {!paymentMethods.bankTransfer.enabled && !paymentMethods.cod.enabled && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-sm text-yellow-800">
                                    <strong>Warning:</strong> At least one payment method should be enabled for customers to place orders.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading || (!paymentMethods.bankTransfer.enabled && !paymentMethods.cod.enabled)}
                            className="px-6 py-2.5 bg-[#3B745B] text-white font-semibold rounded-lg hover:bg-[#2d5a47] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader className="h-5 w-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-5 w-5" />
                                    Save Settings
                                </>
                            )}
                        </button>
                    </div>
            </div>
            </form>
        </div>
    );
};

export default Settings;
