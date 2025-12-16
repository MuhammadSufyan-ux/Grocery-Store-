import React from "react";
import { Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-[#253D4E]">Settings</h1>
                <p className="text-gray-600 mt-1">Manage store settings and preferences</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <SettingsIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Settings page coming soon...</p>
            </div>
        </div>
    );
};

export default Settings;

