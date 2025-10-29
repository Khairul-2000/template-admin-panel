import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Setting = () => {
    const [apiKey, setApiKey] = useState("sk_liv•••••••••••••••••••uvwxyz");
    const [showKey, setShowKey] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [tempKey, setTempKey] = useState("");
    const [lastUpdated, setLastUpdated] = useState("Just now");

    // Mock the actual API key (in production, this would come from your backend)
    const actualKey = "sk_liv1234567890abcdefghijklmnopqrstuvwxyz";

    const handleUpdate = () => {
        if (isEditing && tempKey) {
            // Here you would typically send the API key to your backend
            setApiKey(maskApiKey(tempKey));
            setLastUpdated("Just now");
            setIsEditing(false);
            setTempKey("");
            // You might want to add a success notification here
        } else {
            setIsEditing(true);
            setTempKey("");
        }
    };

    const maskApiKey = (key) => {
        if (!key) return "";
        const start = key.substring(0, 6);
        const end = key.substring(key.length - 6);
        const middle = "•".repeat(20);
        return `${start}${middle}${end}`;
    };

    const handleCancel = () => {
        setIsEditing(false);
        setTempKey("");
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Main Container */}
            <div className="max-w-4xl mx-auto">
                {/* Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            OpenAPI Management
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Manage your OpenAI API key securely
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="space-y-6">
                            {/* API Key Section */}
                            <div>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-base font-medium text-gray-900">
                                            OpenAPI Key
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Used for OpenAI API integration
                                        </p>

                                        {/* API Key Input Field */}
                                        <div className="mt-4 flex items-center space-x-3">
                                            <div className="flex-1 relative">
                                                {isEditing ? (
                                                    <input
                                                        type={showKey ? "text" : "password"}
                                                        value={tempKey}
                                                        onChange={(e) => setTempKey(e.target.value)}
                                                        placeholder="Enter your OpenAI API key"
                                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                ) : (
                                                    <div className="flex items-center space-x-2">
                                                        <code className="px-3 w-full py-2 bg-gray-100 rounded-md font-mono text-sm text-gray-700">
                                                            {showKey ? actualKey : apiKey}
                                                        </code>
                                                        <button
                                                            onClick={() => setShowKey(!showKey)}
                                                            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                                                            aria-label={showKey ? "Hide API key" : "Show API key"}
                                                        >
                                                            {showKey ? (
                                                                <EyeOff className="w-7 h-7" />
                                                            ) : (
                                                                <Eye className="w-7 h-7" />
                                                            )}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div className="mt-3 flex items-center space-x-4 text-sm">
                                            <div className="flex items-center space-x-2">
                                                <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                                                <span className="text-green-600 font-medium">Active</span>
                                            </div>
                                            <span className="text-gray-500">
                                                Last updated: {lastUpdated}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Update Button */}
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={handleUpdate}
                                            className="px-4 py-2 bg-blue-600 text-white font-medium text-sm rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        >
                                            {isEditing ? "Save" : "Update"}
                                        </button>
                                        {isEditing && (
                                            <button
                                                onClick={handleCancel}
                                                className="px-4 py-2 bg-gray-200 text-gray-700 font-medium text-sm rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Setting;