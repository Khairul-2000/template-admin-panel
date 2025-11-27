import { useState, useEffect } from "react";
import { Eye, EyeOff, Settings, Key, Wrench } from "lucide-react";
import { API, useAuthCredential, useSiteStatus, updateCredentials } from "../../api/api";
import { FiRefreshCcw } from "react-icons/fi";


const Setting = () => {
  const { authCredential, isLoading, isError, error, refetch } =
    useAuthCredential();

  const { siteStatusData, refetch: refetchSiteStatus } = useSiteStatus();

  const [credentials, setCredentials] = useState({
    OPENAI_API_KEY: "",

  });
  const [showKeys, setShowKeys] = useState({
    OPENAI_API_KEY: false,


  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempCredentials, setTempCredentials] = useState({});
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

  // Load credentials + maintenance mode from backend
  useEffect(() => {
    if (authCredential) {
      setCredentials({
        OPENAI_API_KEY: authCredential.OPENAI_API_KEY || "",

      });
      setLastUpdated(Date(authCredential.updated_at) || "");
    }

    if (siteStatusData?.is_maintenance_mode !== undefined) {
      setMaintenanceMode(siteStatusData.is_maintenance_mode);
    }
  }, [authCredential, siteStatusData]);

  // Save credentials updates
  const handleUpdate = async () => {
    if (isEditing) {
      try {
        // Filter out empty values - only send credentials that were actually changed
        const updatedFields = Object.keys(tempCredentials).reduce((acc, key) => {
          if (tempCredentials[key] && tempCredentials[key].trim() !== "") {
            acc[key] = tempCredentials[key];
          }
          return acc;
        }, {});

        if (Object.keys(updatedFields).length === 0) {
          alert("Please enter at least one credential to update");
          return;
        }

        await updateCredentials(updatedFields);

        setCredentials(prev => ({ ...prev, ...updatedFields }));
        setLastUpdated("Just now");
        setIsEditing(false);
        setTempCredentials({});
        refetch();
      } catch (err) {
        console.error("Error updating credentials:", err);
        alert("Failed to update credentials. Please try again.");
      }
    } else {
      setIsEditing(true);
      setTempCredentials({});
    }
  };
    // handle the vector database refresh
  const handleDatabaseRefresh = async () => {
    try {
      // Call the API to refresh the database
      await fetch("https://ai.orderwithpluto.com/initializedb");
      alert("AI database refresh initiated successfully.");
    } catch (err) {
      console.error("Error refreshing AI database:", err);
      alert("Failed to refresh AI database. Please try again.");
    }
  };

  // Cancel edit
  const handleCancel = () => {
    setIsEditing(false);
    setTempCredentials({});
  };

  // Handle individual credential input change
  const handleCredentialChange = (key, value) => {
    setTempCredentials(prev => ({ ...prev, [key]: value }));
  };



  // Toggle visibility for individual keys
  const toggleKeyVisibility = (key) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
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
                className={`flex items-center px-4 py-2 rounded-md text-sm ${activeSection === "api"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                  }`}
              >
                <Key className="w-4 h-4 mr-2" />
                API Management
              </button>

              <button
                onClick={() => setActiveSection("system")}
                className={`flex items-center px-4 py-2 rounded-md text-sm ${activeSection === "system"
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
              <h1 className="text-2xl font-semibold">API Credentials Management</h1>
              <p className="text-gray-500">Manage your API credentials securely</p>
            </div>

            <div className="p-6 space-y-6">
              {/* OpenAI API Key */}
              <div>
                <h3 className="text-base font-medium mb-3">OpenAI API Key</h3>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    {isEditing ? (
                      <input
                        type={showKeys.OPENAI_API_KEY ? "text" : "password"}
                        value={tempCredentials.OPENAI_API_KEY || ""}
                        onChange={(e) => handleCredentialChange("OPENAI_API_KEY", e.target.value)}
                        placeholder="Enter OpenAI API key (leave empty to keep current)"
                        className="w-full px-3 py-2 bg-gray-50 border rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <code className="px-3 py-2 bg-gray-100 rounded-md font-mono text-sm flex-1 overflow-hidden text-ellipsis">
                          {showKeys.OPENAI_API_KEY
                            ? credentials.OPENAI_API_KEY || "Not set"
                            : maskApiKey(credentials.OPENAI_API_KEY || "")}
                        </code>
                        <button
                          onClick={() => toggleKeyVisibility("OPENAI_API_KEY")}
                          className="p-2"
                        >
                          {showKeys.OPENAI_API_KEY ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>


              {/* Status */}
              <div className="pt-4 border-t text-sm">
                <span className="text-green-600 font-medium">● Active</span>
                <span className="text-gray-500 ml-4">
                  Last updated: {lastUpdated || "Never"}
                </span>
              </div>

              {/* Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  {isEditing ? "Save Changes" : "Update Credentials"}
                </button>

                {isEditing && (
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {isEditing && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
                  <strong>Note:</strong> You can update one or multiple credentials at once. Leave fields empty to keep their current values.
                </div>
              )}
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
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${maintenanceMode ? "bg-orange-600" : "bg-gray-300"
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 bg-white rounded-full transform transition ${maintenanceMode ? "translate-x-6" : "translate-x-1"
                      }`}
                  ></span>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 border rounded-lg">
                <div >
                  <h3 className="font-medium">Refresh AI Database</h3>
                  <p className="text-sm text-gray-500">
                    Rebuild the AI database to incorporate recent changes
                  </p>
                </div>
                <div>
                  <button onClick={handleDatabaseRefresh} className="p-2 bg-gray-200 rounded-md hover:bg-gray-300 transition" ><FiRefreshCcw size={25}/>
                  </button>
                </div>
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

export default Setting 
