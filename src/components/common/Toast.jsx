import React, { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const Toast = ({ message, type = "success", onClose, duration = 5000 }) => {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const icons = {
        success: CheckCircle,
        error: AlertCircle,
        warning: AlertTriangle,
        info: Info,
    };

    const colors = {
        success: "bg-green-500",
        error: "bg-red-500",
        warning: "bg-yellow-500",
        info: "bg-blue-500",
    };

    const bgColors = {
        success: "bg-green-50 border-green-500",
        error: "bg-red-50 border-red-500",
        warning: "bg-yellow-50 border-yellow-500",
        info: "bg-blue-50 border-blue-500",
    };

    const textColors = {
        success: "text-green-800",
        error: "text-red-800",
        warning: "text-yellow-800",
        info: "text-blue-800",
    };

    const Icon = icons[type] || icons.info;

    return (
        <div
            className={`flex items-center gap-3 p-4 rounded-lg shadow-lg border-l-4 ${bgColors[type]} ${textColors[type]} animate-slide-in-right min-w-[300px] max-w-md`}
            role="alert"
        >
            <Icon className={`h-5 w-5 ${colors[type]} text-white rounded-full p-1 flex-shrink-0`} />
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button
                onClick={onClose}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
};

export default Toast;

