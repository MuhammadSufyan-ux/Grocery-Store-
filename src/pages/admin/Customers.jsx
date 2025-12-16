import React from "react";
import { Users } from "lucide-react";

const Customers = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-[#253D4E]">Customers</h1>
                <p className="text-gray-600 mt-1">Manage customer accounts</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Customers management page coming soon...</p>
            </div>
        </div>
    );
};

export default Customers;

