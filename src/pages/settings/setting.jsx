import { useState } from "react";
import { Eye, EyeOff, Settings, Key, Wrench } from "lucide-react";

const Setting = () => {
    const [apiKey, setApiKey] = useState("sk_liv•••••••••••••••••••uvwxyz");
    const [showKey, setShowKey] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [tempKey, setTempKey] = useState("");
    const [lastUpdated, setLastUpdated] = useState("Just now");
    
    // New states for settings sections
    const [activeSection, setActiveSection] = useState("api");
    const [maintenanceMode, setMaintenanceMode] = useState(false);

    const actualKey = "sk_liv1234567890abcdefghijklmnopqrstuvwxyz";

    const handleUpdate = () => {
        if (isEditing && tempKey) {
            setApiKey(maskApiKey(tempKey));
            setLastUpdated("Just now");
            setIsEditing(false);
            setTempKey("");
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
            <div className="max-w-4xl mx-auto">
                {/* Settings Navigation */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Settings className="w-5 h-5 mr-2" />
                            Settings Menu
                        </h2>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setActiveSection("api")}
                                className={`flex items-center px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                                    activeSection === "api"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                <Key className="w-4 h-4 mr-2" />
                                API Management
                            </button>
                            <button
                                onClick={() => setActiveSection("system")}
                                className={`flex items-center px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                                    activeSection === "system"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                <Wrench className="w-4 h-4 mr-2" />
                                System Settings
                            </button>
                        </div>
                    </div>
                </div>

                {/* API Management Section */}
                {activeSection === "api" && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-100">
                            <h1 className="text-2xl font-semibold text-gray-900">
                                OpenAPI Management
                            </h1>
                            <p className="text-gray-500 mt-1">
                                Manage your OpenAI API key securely
                            </p>
                        </div>

                        <div className="p-6">
                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-base font-medium text-gray-900">
                                                OpenAPI Key
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Used for OpenAI API integration
                                            </p>

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
                )}

                {/* System Settings Section */}
                {activeSection === "system" && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-100">
                            <h1 className="text-2xl font-semibold text-gray-900">
                                System Settings
                            </h1>
                            <p className="text-gray-500 mt-1">
                                Configure system-level options and maintenance
                            </p>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* API Update Toggle */}
                          

                            {/* Maintenance Mode Toggle */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex-1">
                                    <h3 className="text-base font-medium text-gray-900">
                                        Maintenance Mode
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Enable maintenance mode to prevent API calls during updates
                                    </p>
                                </div>
                                <button
                                    onClick={() => setMaintenanceMode(!maintenanceMode)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                                        maintenanceMode ? "bg-orange-600" : "bg-gray-300"
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            maintenanceMode ? "translate-x-6" : "translate-x-1"
                                        }`}
                                    />
                                </button>
                            </div>

                            {/* Status Summary */}
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <h4 className="text-sm font-medium text-blue-900 mb-2">Current Status</h4>
                                <div className="space-y-1 text-sm text-blue-700">
                                  
                                    <p>• Maintenance Mode: <span className="font-medium">{maintenanceMode ? "Active" : "Inactive"}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Setting;