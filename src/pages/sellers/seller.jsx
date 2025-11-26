import React, { useState } from "react";
import { createSeller, updateSeller, deleteSeller, useSellers } from "../../api/api";
import { toast } from "react-toastify";
import { Pencil, Trash2, Plus, X } from "lucide-react";

const SellerPage = () => {
    const { allSellers, isLoading, isError, error, refetch } = useSellers();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentSellerId, setCurrentSellerId] = useState(null);
    const [sellerData, setSellerData] = useState({
        title: "",
        description: "",
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Debug: Log the API response
    React.useEffect(() => {
        if (allSellers) {
            console.log("Sellers API Response:", allSellers);
        }
        if (isError) {
            console.error("Sellers API Error:", error);
        }
    }, [allSellers, isError, error]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSellerData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSellerData(prev => ({
                ...prev,
                image: file
            }));
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            if (isEditMode) {
                await updateSeller(currentSellerId, sellerData);
                toast.success("Seller updated successfully!");
            } else {
                await createSeller(sellerData);
                toast.success("Seller created successfully!");
            }
            handleCloseModal();
            refetch();
        } catch (error) {
            console.error("Error saving seller:", error);
            toast.error(error.response?.data?.message || "Failed to save seller");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (seller) => {
        setIsEditMode(true);
        setCurrentSellerId(seller.id);
        setSellerData({
            title: seller.title,
            description: seller.description,
            image: seller.image
        });
        setImagePreview(seller.image);
        setIsModalOpen(true);
    };

    const handleDelete = async (sellerId) => {
        if (window.confirm("Are you sure you want to delete this seller?")) {
            try {
                await deleteSeller(sellerId);
                toast.success("Seller deleted successfully!");
                refetch();
            } catch (error) {
                console.error("Error deleting seller:", error);
                toast.error(error.response?.data?.message || "Failed to delete seller");
            }
        }
    };

    const handleOpenAddModal = () => {
        setIsEditMode(false);
        setCurrentSellerId(null);
        setSellerData({
            title: "",
            description: "",
            image: null
        });
        setImagePreview(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setCurrentSellerId(null);
        setSellerData({
            title: "",
            description: "",
            image: null
        });
        setImagePreview(null);
        const fileInput = document.getElementById("image");
        if (fileInput) fileInput.value = "";
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Sellers Management</h1>
                <button
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <Plus size={20} />
                    Add Seller
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center">Loading...</div>
                ) : isError ? (
                    <div className="p-8 text-center text-red-500">
                        Error loading sellers: {error?.message || 'Unknown error'}
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Image
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {(() => {
                                // Handle different API response structures
                                const sellers = allSellers?.data || allSellers?.results || allSellers || [];
                                const sellerArray = Array.isArray(sellers) ? sellers : [];
                                
                                return sellerArray.length > 0 ? (
                                    sellerArray.map((seller) => (
                                        <tr key={seller.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <img
                                                    src={seller.image}
                                                    alt={seller.title}
                                                    className="h-12 w-12 rounded-lg object-cover"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {seller.title}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-500 line-clamp-2">
                                                    {seller.description}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleEdit(seller)}
                                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(seller.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                            No sellers found. Click "Add Seller" to create one.
                                        </td>
                                    </tr>
                                );
                            })()}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold">
                                {isEditMode ? "Edit Seller" : "Add New Seller"}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Title Input */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                    Seller Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={sellerData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter seller title"
                                    required
                                />
                            </div>

                            {/* Description Input */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={sellerData.description}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter seller description"
                                    required
                                />
                            </div>

                            {/* Image Input */}
                            <div>
                                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                                    Seller Image {isEditMode && "(Leave empty to keep current image)"}
                                </label>
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    required={!isEditMode}
                                />
                            </div>

                            {/* Image Preview */}
                            {imagePreview && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Image Preview
                                    </label>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-48 h-48 object-cover rounded-lg border border-gray-300"
                                    />
                                </div>
                            )}

                            {/* Buttons */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? "Saving..." : (isEditMode ? "Update" : "Create")}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    disabled={isSubmitting}
                                    className="flex-1 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerPage;