import React, { useState } from "react";
import {
  FaBox,
  FaUsers,
  FaShoppingCart,
  FaCheckCircle,
  FaChevronDown,
  FaExclamationTriangle,
} from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useDashboard, useEarnings, useLowStock } from "../../api/api";



const Dashboard = () => {
  const { dashboardData, isLoading, isError, error } = useDashboard();
  const { earnsData } = useEarnings();
  const { lowStock } = useLowStock();

  const [selectedMonth, setSelectedMonth] = useState("current");

  if (isLoading) return <p className="p-6">Loading...</p>;
  if (isError) return <p className="p-6 text-red-500">{error.message}</p>;


  const ordersChartData = dashboardData?.total_orders
    ? Object.keys(dashboardData.total_orders).map((month) => ({
        month,
        orders: dashboardData.total_orders[month],
      }))
    : [];

  const earningsChartData = earnsData?.total_earnings
    ? Object.keys(earnsData.total_earnings).map((month) => ({
        month,
        earnings: earnsData.total_earnings[month],
      }))
    : [];

  const monthOptions = [
    { value: "current", label: "Current Month" },
    ...Object.keys(dashboardData?.total_orders || {}).map((m) => ({
      value: m,
      label: m,
    })),
  ];

  const getActiveOrders = (month) => {
    if (month === "current") {
      const lastMonth = Object.keys(dashboardData.total_orders).slice(-1)[0];
      return dashboardData.total_orders[lastMonth];
    }
    return dashboardData.total_orders[month] || 0;
  };

  const overviewData = {
    totalProduct: dashboardData.total_products,
    totalUsers: dashboardData.total_users,
    activeOrders: getActiveOrders(selectedMonth),
    successfulOrder: dashboardData.total_completed_orders,
    cancelledOrders: dashboardData.total_Cancelled_orders,
  };

  const ordersStats = {
    totalOrders: ordersChartData.reduce((sum, item) => sum + item.orders, 0),
    percentageChange: 10,
    isIncrease: true,
    timeframe: "Last Month",
    comparisonText: "vs Last month",
  };

  const earningsStats = {
    totalEarnings: earningsChartData.reduce(
      (sum, item) => sum + Number(item.earnings),
      0
    ),
    percentageChange: 12,
    isIncrease: true,
    timeframe: "Last Month",
    comparisonText: "vs Last month",
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
        <p className="text-gray-600 text-sm">Hi, Good Morning</p>
        <h1 className="text-2xl font-bold text-gray-800 mt-1">
          {dashboardData?.current_user}
        </h1>
      </div>

      {/* Overview */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Operation's Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Product */}
          <div className="bg-white rounded-lg p-5 shadow-sm flex flex-col items-center">
            <div className="bg-blue-100 p-3 rounded-full mb-3">
              <FaBox className="text-blue-600 text-xl" />
            </div>
            <h3 className="text-2xl font-bold">{overviewData.totalProduct}</h3>
            <p className="text-gray-500 text-sm mt-1">Total Products</p>
          </div>

          {/* Total Users */}
          <div className="bg-white rounded-lg p-5 shadow-sm flex flex-col items-center">
            <div className="bg-blue-100 p-3 rounded-full mb-3">
              <FaUsers className="text-blue-600 text-xl" />
            </div>
            <h3 className="text-2xl font-bold">{overviewData.totalUsers}</h3>
            <p className="text-gray-500 text-sm mt-1">Total Users</p>
          </div>

          {/* Active Orders */}
          <div className="bg-white rounded-lg p-5 shadow-sm flex flex-col items-center">
            <div className="bg-blue-100 p-3 rounded-full mb-3">
              <FaShoppingCart className="text-blue-600 text-xl" />
            </div>
            <h3 className="text-2xl font-bold">{overviewData.activeOrders}</h3>
            <p className="text-gray-500 text-sm mt-1">Active Orders</p>

            {/* Month Dropdown */}
            <div className="relative mt-3 w-full">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-md"
              >
                {monthOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label} 
                  </option>
                ))}
              </select>
              {/* <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" /> */}
            </div>
          </div>

          {/* Successful Orders */}
          <div className="bg-white rounded-lg p-5 shadow-sm flex flex-col items-center">
            <div className="bg-blue-100 p-3 rounded-full mb-3">
              <FaCheckCircle className="text-blue-600 text-xl" />
            </div>
            <h3 className="text-2xl font-bold">
              {overviewData.successfulOrder}
            </h3>
            <p className="text-gray-500 text-sm mt-1">Completed Orders</p>
          </div>

          {/* Cancelled Orders */}
          <div className="bg-white rounded-lg p-5 shadow-sm flex flex-col items-center">
            <div className="bg-blue-100 p-3 rounded-full mb-3">
              <ImCancelCircle className="text-blue-600 text-xl" />
            </div>
            <h3 className="text-2xl font-bold">
              {overviewData.cancelledOrders}
            </h3>
            <p className="text-gray-500 text-sm mt-1">Cancelled Orders</p>
          </div>
        </div>
      </div>

      {/* Not Available */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Not Available
        </h2>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-red-50 border-b border-red-100 flex items-center">
            <FaExclamationTriangle className="text-red-500 text-lg mr-3" />
            <h3 className="text-lg font-semibold text-red-700">
              Items Low stock
            </h3>
          </div>

          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Quantity
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {lowStock?.results?.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 text-gray-900">{item.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Orders</h3>
          <p className="text-2xl font-bold">{ordersStats.totalOrders}</p>

          <div className="h-48 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ordersChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#B7B868"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Earnings Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Earnings</h3>
          <p className="text-2xl font-bold">
            £{earningsStats.totalEarnings.toFixed(2)}
          </p>

          <div className="h-48 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={earningsChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="earnings"
                  stroke="#48ACF0"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
