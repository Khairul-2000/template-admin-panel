import { useState, useEffect } from "react";
import { Eye, EyeOff, Settings, Key, Wrench } from "lucide-react";
import { API, useAuthCredential, useSiteStatus } from "../../api/api";

const Setting = () => {
  const { authCredential, isLoading, isError, error, refetch } =
    useAuthCredential();

  const { siteStatusData, refetch: refetchSiteStatus } = useSiteStatus();

  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tempKey, setTempKey] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  const [activeSection, setActiveSection] = useState("api");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Mask API key
  const maskApiKey = (key) => {
    if (!key) return "";
    if (key.length <= 12) return key;

    const start = key.slice(0, 6);
    const end = key.slice(-6);
    const middle = "•".repeat(20);
    return `${start}${middle}${end}`;
  };

  // Load API key + maintenance mode from backend
  useEffect(() => {
    if (authCredential?.OPENAI_API_KEY) {
      setApiKey(maskApiKey(authCredential.OPENAI_API_KEY));
      setLastUpdated(authCredential.updated_at);
    }

    if (siteStatusData?.is_maintenance_mode !== undefined) {
      setMaintenanceMode(siteStatusData.is_maintenance_mode);
    }
  }, [authCredential, siteStatusData]);

  // Save API Key updates
  const handleUpdate = async () => {
    if (isEditing && tempKey) {
      try {
        await API.patch("/api/auth/cretiential/update/", {
          OPENAI_API_KEY: tempKey,
        });

        setApiKey(maskApiKey(tempKey));
        setLastUpdated("Just now");
        setIsEditing(false);
        setTempKey("");
        refetch();
      } catch (err) {
        console.error("Error updating API key:", err);
      }
    } else {
      setIsEditing(true);
      setTempKey("");
    }
  };

  // Cancel edit
  const handleCancel = () => {
    setIsEditing(false);
    setTempKey("");
  };

  // Update maintenance mode
  const toggleMaintenanceMode = async () => {
    try {
      await API.patch("/api/auth/site/status/update/", {
        is_maintenance_mode: !maintenanceMode,
      });

      setMaintenanceMode(!maintenanceMode);
      refetchSiteStatus();
    } catch (err) {
      console.error("Error updating maintenance mode:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* ---------------- SETTINGS NAV ---------------- */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold flex items-center">
              <Settings className="w-5 h-5 mr-2" /> Settings Menu
            </h2>

            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => setActiveSection("api")}
                className={`flex items-center px-4 py-2 rounded-md text-sm ${
                  activeSection === "api"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <Key className="w-4 h-4 mr-2" />
                API Management
              </button>

              <button
                onClick={() => setActiveSection("system")}
                className={`flex items-center px-4 py-2 rounded-md text-sm ${
                  activeSection === "system"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <Wrench className="w-4 h-4 mr-2" />
                System Settings
              </button>
            </div>
          </div>
        </div>

        {/* ---------------- API MANAGEMENT ---------------- */}
        {activeSection === "api" && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h1 className="text-2xl font-semibold">OpenAPI Management</h1>
              <p className="text-gray-500">Manage your OpenAI API key securely</p>
            </div>

            <div className="p-6">
              <h3 className="text-base font-medium">OpenAI API Key</h3>

              <div className="mt-4 flex items-center space-x-3">
                <div className="flex-1 relative">
                  {isEditing ? (
                    <input
                      type={showKey ? "text" : "password"}
                      value={tempKey}
                      onChange={(e) => setTempKey(e.target.value)}
                      placeholder="Enter your API key"
                      className="w-full px-3 py-2 bg-gray-50 border rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <code className="px-3 py-2 bg-gray-100 rounded-md font-mono text-sm">
                        {showKey
                          ? authCredential?.OPENAI_API_KEY
                          : apiKey}
                      </code>

                      <button
                        onClick={() => setShowKey(!showKey)}
                        className="p-2"
                      >
                        {showKey ? (
                          <EyeOff className="w-6 h-6" />
                        ) : (
                          <Eye className="w-6 h-6" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="mt-3 text-sm">
                <span className="text-green-600 font-medium">● Active</span>
                <span className="text-gray-500 ml-4">
                  Last updated: {lastUpdated}
                </span>
              </div>

              {/* Buttons */}
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  {isEditing ? "Save" : "Update"}
                </button>

                {isEditing && (
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-200 rounded-md"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- SYSTEM SETTINGS ---------------- */}
        {activeSection === "system" && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h1 className="text-2xl font-semibold">System Settings</h1>
              <p className="text-gray-500">
                Configure system-level options and maintenance
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Maintenance Mode */}
              <div className="flex items-center justify-between p-4 bg-gray-50 border rounded-lg">
                <div>
                  <h3 className="font-medium">Maintenance Mode</h3>
                  <p className="text-sm text-gray-500">
                    Enable maintenance mode during system updates
                  </p>
                </div>

                <button
                  onClick={toggleMaintenanceMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    maintenanceMode ? "bg-orange-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 bg-white rounded-full transform transition ${
                      maintenanceMode ? "translate-x-6" : "translate-x-1"
                    }`}
                  ></span>
                </button>
              </div>

              {/* Status Summary */}
              <div className="p-4 bg-blue-50 border rounded-lg">
                <h4 className="text-sm font-medium text-blue-900">
                  Current Status
                </h4>
                <p className="text-sm text-blue-700 mt-1">
                  • Maintenance Mode:{" "}
                  <span className="font-medium">
                    {maintenanceMode ? "Active" : "Inactive"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Setting;
