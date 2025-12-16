import React from "react";
import { BarChart3 } from "lucide-react";

const Analytics = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-[#253D4E]">Analytics</h1>
                <p className="text-gray-600 mt-1">View store analytics and insights</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Analytics page coming soon...</p>
            </div>
        </div>
    );
};

export default Analytics;

