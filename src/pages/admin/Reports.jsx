import React from "react";
import { FileText } from "lucide-react";

const Reports = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-[#253D4E]">Reports</h1>
                <p className="text-gray-600 mt-1">Generate and view reports</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Reports page coming soon...</p>
            </div>
        </div>
    );
};

export default Reports;

