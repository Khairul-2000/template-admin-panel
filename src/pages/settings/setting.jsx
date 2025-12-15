import { useState, useEffect } from "react";
import { Eye, EyeOff, Settings, Key, Wrench } from "lucide-react";
import { API, useAuthCredential, useSiteStatus, updateCredentials } from "../../api/api";
import { FiRefreshCcw } from "react-icons/fi";
import imageCompression from 'browser-image-compression';


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
  const [maintenanceImage, setMaintenanceImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

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

  // // Update maintenance mode
  // const toggleMaintenanceMode = async () => {
  //   try {
  //     await API.patch("/api/auth/site/status/update/", {
  //       is_maintenance_mode: !maintenanceMode,


  //     });

  //     setMaintenanceMode(!maintenanceMode);
  //     refetchSiteStatus();
  //   } catch (err) {
  //     console.error("Error updating maintenance mode:", err);
  //   }
  // };

  // Handle image file selection
  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     // Validate file type
  //     const validTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
  //     if (!validTypes.includes(file.type)) {
  //       alert('Please upload a valid image file (SVG, PNG, JPG, or GIF)');
  //       return;
  //     }

  //     // Validate file size (e.g., max 5MB)
  //     if (file.size > 5 * 1024 * 1024) {
  //       alert('File size must be less than 5MB');
  //       return;
  //     }

  //     setMaintenanceImage(file);

  //     // Create preview
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImagePreview(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };
  const handleImageChange = async (e) => {
  const file = e.target.files[0];
  if (file) {
    // Validate file type
    const validTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (SVG, PNG, JPG, or GIF)');
      return;
    }

    // Validate file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    try {
      // Skip compression for SVG
      if (file.type === 'image/svg+xml') {
        setMaintenanceImage(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
        return;
      }

      // Compression options
      const options = {
        maxSizeMB: 0.1, // 100KB = 0.1MB
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: 'image/jpeg' // or keep original with file.type
      };

      const compressedFile = await imageCompression(file, options);
      console.log(`Original: ${(file.size / 1024).toFixed(2)}KB, Compressed: ${(compressedFile.size / 1024).toFixed(2)}KB`);

      setMaintenanceImage(compressedFile);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Error compressing image:', error);
      alert('Failed to compress image. Please try another file.');
    }
  }
};

  // Upload maintenance image separately
  const handleUploadMaintenanceImage = async () => {
    if (!maintenanceImage) {
      alert('Please select an image first');
      return;
    }

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('poster', maintenanceImage);

      await API.patch("/api/auth/site/status/update/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Maintenance image uploaded successfully!');
      refetchSiteStatus();

      // Clear image after successful upload
      setMaintenanceImage(null);
      setImagePreview(null);
    } catch (err) {
      console.error("Error uploading maintenance image:", err);
      alert("Failed to upload maintenance image. Please try again.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Toggle maintenance mode only (without image)
  const toggleMaintenanceMode = async () => {
    try {
      await API.patch("/api/auth/site/status/update/", {
        is_maintenance_mode: !maintenanceMode,
      });

      setMaintenanceMode(!maintenanceMode);
      refetchSiteStatus();
    } catch (err) {
      console.error("Error updating maintenance mode:", err);
      alert("Failed to update maintenance mode. Please try again.");
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
              {/* Maintenance Mode Toggle */}
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

              {/* Refresh AI Database */}
              <div className="flex items-center justify-between p-4 bg-gray-50 border rounded-lg">
                <div>
                  <h3 className="font-medium">Refresh AI Database</h3>
                  <p className="text-sm text-gray-500">
                    Rebuild the AI database to incorporate recent changes
                  </p>
                </div>
                <div>
                  <button
                    onClick={handleDatabaseRefresh}
                    className="p-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                  >
                    <FiRefreshCcw size={25} />
                  </button>
                </div>
              </div>

              {/* Maintenance Image Upload */}
              <div className="p-4 bg-gray-50 border rounded-lg">
                <div className="mb-4">
                  <h3 className="font-medium">Maintenance Image</h3>
                  <p className="text-sm text-gray-500">
                    Upload an image to display during maintenance mode
                  </p>
                </div>

                <div>
                  <label
                    className="block mb-2 text-sm font-medium text-gray-700"
                    htmlFor="file_input"
                  >
                    Select Image
                  </label>

                  <input
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    id="file_input"
                    type="file"
                    accept="image/svg+xml,image/png,image/jpeg,image/jpg,image/gif"
                    onChange={handleImageChange}
                  />

                  <p className="mt-1 text-xs text-gray-500">
                    SVG, PNG, JPG or GIF (MAX. 5MB)
                  </p>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2 font-medium">Preview:</p>
                      <img
                        src={imagePreview}
                        alt="Maintenance preview"
                        className="w-full max-w-md h-48 object-contain rounded-lg border bg-white p-2"
                      />
                      <div className="flex space-x-2 mt-3">
                        <button
                          onClick={handleUploadMaintenanceImage}
                          disabled={isUploadingImage}
                          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {isUploadingImage ? "Uploading..." : "Upload Image"}
                        </button>
                        <button
                          onClick={() => {
                            setMaintenanceImage(null);
                            setImagePreview(null);
                          }}
                          disabled={isUploadingImage}
                          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              



            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Setting 
