import React, { useState } from 'react';
import {
  FaBox,
  FaUsers,
  FaShoppingCart,
  FaCheckCircle,
  FaArrowUp,
  FaArrowDown,
  FaChevronDown,
  FaExclamationTriangle
} from 'react-icons/fa';
import { ImCancelCircle } from "react-icons/im";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('current');

  // Mock data for the dashboard
  const userData = {
    name: "Moni Roy",
    greeting: "Hi, Good Morning"
  };

  // Month options for dropdown
  const monthOptions = [
    { value: 'current', label: 'Current Month' },
    { value: 'january', label: 'January' },
    { value: 'february', label: 'February' },
    { value: 'march', label: 'March' },
    { value: 'april', label: 'April' },
    { value: 'may', label: 'May' },
    { value: 'june', label: 'June' },
    { value: 'july', label: 'July' },
    { value: 'august', label: 'August' },
    { value: 'september', label: 'September' },
    { value: 'october', label: 'October' },
    { value: 'november', label: 'November' },
    { value: 'december', label: 'December' }
  ];

  // Function to get active orders based on selected month
  const getActiveOrdersForMonth = (month) => {
    const monthData = {
      current: 4,
      january: 3,
      february: 5,
      march: 2,
      april: 7,
      may: 6,
      june: 4,
      july: 8,
      august: 5,
      september: 3,
      october: 4,
      november: 6,
      december: 9
    };
    return monthData[month] || 0;
  };

  const overviewData = {
    totalProduct: 15,
    totalUsers: 20,
    activeOrders: getActiveOrdersForMonth(selectedMonth),
    successfulOrder: 5,
    cancelledOrders: 2
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

  // Mock data for not available items
  const notAvailableItems = [
    { id: 1, productName: "iPhone 15 Pro Max", quantity: 3 },
    { id: 2, productName: "Samsung Galaxy S24 Ultra", quantity: 2 },
    { id: 3, productName: "MacBook Pro M3", quantity: 1 },
    { id: 4, productName: "Sony WH-1000XM5", quantity: 5 },
    { id: 5, productName: "iPad Pro 12.9", quantity: 2 }
  ];

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
              <p className="text-gray-500 text-sm mt-1">Total Items</p>
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
              
              {/* Month Dropdown */}
              <div className="relative mt-3 w-full">
                <select 
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                >
                  {monthOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
              </div>
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

          {/* order cancelled card */}
           <div className="bg-white rounded-lg p-5 shadow-sm">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-3 rounded-full mb-3">
                {/* <FaCheckCircle className="text-blue-600 text-xl" /> */}
                <ImCancelCircle className="text-blue-600 text-xl" />

              </div>
              <h3 className="text-2xl font-bold text-gray-800">{overviewData.cancelledOrders}</h3>
              <p className="text-gray-500 text-sm mt-1">Orders Cancelled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Not Available Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Not Available</h2>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-red-50 border-b border-red-100">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-red-500 text-lg mr-3" />
              <h3 className="text-lg font-semibold text-red-700">Items Requested by Customers</h3>
            </div>
            <p className="text-red-600 text-sm mt-1">Products that customers requested but were not available in inventory</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {notAvailableItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.quantity}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {notAvailableItems.length === 0 && (
            <div className="px-6 py-8 text-center">
              <FaCheckCircle className="mx-auto h-12 w-12 text-green-400 mb-4" />
              <p className="text-gray-500">No unavailable items requested by customers</p>
            </div>
          )}
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