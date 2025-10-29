import React, { useState } from 'react';
import {
  FaBox,
  FaUsers,
  FaShoppingCart,
  FaCheckCircle,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  // Mock data for the dashboard
  const userData = {
    name: "Moni Roy",
    greeting: "Hi, Good Morning"
  };

  const overviewData = {
    totalProduct: 15,
    totalUsers: 20,
    activeOrders: 4,
    successfulOrder: 5
  };

  // Mock data for orders chart
  const ordersChartData = [
    { month: 'Jan', orders: 85 },
    { month: 'Feb', orders: 95 },
    { month: 'Mar', orders: 78 },
    { month: 'Apr', orders: 110 },
    { month: 'May', orders: 125 },
    { month: 'Jun', orders: 145 }
  ];

  const ordersStats = {
    totalOrders: 145,
    percentageChange: 8.2,
    isIncrease: true,
    timeframe: "Last Month",
    comparisonText: "vs Last month"
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file.name);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
        <p className="text-gray-600 text-sm">{userData.greeting}</p>
        <h1 className="text-2xl font-bold text-gray-800 mt-1">{userData.name}</h1>
      </div>

      {/* User's Overview Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">User's Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Product Card */}
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-3 rounded-full mb-3">
                <FaBox className="text-blue-600 text-xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{overviewData.totalProduct}</h3>
              <p className="text-gray-500 text-sm mt-1">Total Product</p>
            </div>
          </div>

          {/* Total Users Card */}
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-3 rounded-full mb-3">
                <FaUsers className="text-blue-600 text-xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{overviewData.totalUsers}</h3>
              <p className="text-gray-500 text-sm mt-1">Total Users</p>
            </div>
          </div>

          {/* Active Orders Card */}
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-3 rounded-full mb-3">
                <FaShoppingCart className="text-blue-600 text-xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{overviewData.activeOrders}</h3>
              <p className="text-gray-500 text-sm mt-1">Active Orders</p>
            </div>
          </div>

          {/* Successful Order Card */}
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-3 rounded-full mb-3">
                <FaCheckCircle className="text-blue-600 text-xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{overviewData.successfulOrder}</h3>
              <p className="text-gray-500 text-sm mt-1">Successful Order</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Orders Chart and Upload Product */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Orders</h3>
            <div className="flex items-center mt-2">
              <span className="text-2xl font-bold text-gray-800 mr-3">{ordersStats.totalOrders}</span>
              <div className={`flex items-center ${ordersStats.isIncrease ? 'text-green-500' : 'text-red-500'}`}>
                {ordersStats.isIncrease ? <FaArrowUp className="text-xs mr-1" /> : <FaArrowDown className="text-xs mr-1" />}
                <span className="text-sm font-medium">{ordersStats.percentageChange}%</span>
              </div>
              <span className="text-gray-500 text-sm ml-2">{ordersStats.comparisonText}</span>
            </div>
            <p className="text-gray-500 text-sm mt-1">📊 {ordersStats.timeframe}</p>
          </div>
          
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ordersChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  stroke="#9CA3AF"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#9CA3AF"
                />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#FF6B6B" 
                  strokeWidth={2}
                  dot={{ fill: '#FF6B6B', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upload Product Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Product</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
            <div className="flex flex-col items-center">
              <p className="text-gray-500 mb-4">
                {selectedFile ? selectedFile : 'No File Choosen'}
              </p>
              <p className="text-gray-400 text-sm mb-4">You've not selected a valid CSV file to process</p>
              
              <label className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 cursor-pointer transition-colors">
                Upload
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".csv"
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;