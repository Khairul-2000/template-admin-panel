import  { useEffect, useState } from "react";

const AddProducts = ({ isModalOpen = false, setIsModalOpen, initialProduct = null, onSave }) => {
    const emptyProduct = { name: "", price: "", stock: "" };
    const [selectedProduct, setSelectedProduct] = useState(initialProduct ? { ...initialProduct } : emptyProduct);

    // Reset the form whenever modal opens or initialProduct changes
    useEffect(() => {
        if (isModalOpen) {
            setSelectedProduct(initialProduct ? { ...initialProduct } : emptyProduct);
        }
    }, [isModalOpen, initialProduct]);

    if (!isModalOpen) return null; // don't render modal when closed

    const handleCloseModal = () => {
        setIsModalOpen(false);
        // reset local form state
        setSelectedProduct(initialProduct ? { ...initialProduct } : emptyProduct);
    };

    const handleSave = (e) => {
        e.preventDefault();
        // basic validation
        if (!selectedProduct.name || !selectedProduct.name.trim()) {
            // replace with better UI/validation as needed
            alert("Please enter a product name.");
            return;
        }

        const payload = {
            ...selectedProduct,
            price: parseFloat(selectedProduct.price) || 0,
            stock: parseInt(selectedProduct.stock, 10) || 0,
            image: selectedProduct.image || null
        };

        if (onSave) onSave(payload);
        setIsModalOpen(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Edit Product</h2>
                <form onSubmit={handleSave}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                        <input
                            type="text"
                            value={selectedProduct.name}
                            onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                        <input
                            type="number"
                            step="0.01"
                            value={selectedProduct.price}
                            onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                        <input
                            type="number"
                            value={selectedProduct.stock}
                            onChange={(e) => setSelectedProduct({ ...selectedProduct, stock: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                     <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setSelectedProduct({ ...selectedProduct, image: e.target.files[0] })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProducts;
