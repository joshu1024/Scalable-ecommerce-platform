import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminStats } from "../../features/adminSlice.js";
import OrdersChart from "../../pages/admin/OrdersChart.jsx";
import { useNavigate } from "react-router-dom";
import { logOutUser } from "../../features/userSlice.js";
import { LogoutIcon } from "@heroicons/react/outline";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { stats, loading, error } = useSelector((state) => state.admin);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [animateModal, setAnimateModal] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  const openModal = () => {
    setShowLogoutModal(true);
    setAnimateModal(true);
  };

  const closeModal = () => {
    setAnimateModal(false);
    setTimeout(() => setShowLogoutModal(false), 300); // wait for animation to finish
  };

  const handleLogout = async () => {
    await dispatch(logOutUser());
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading)
    return (
      <div className="text-center mt-10 text-lg font-semibold">
        Loading dashboard...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 mt-10 font-semibold">
        Error: {error}
      </div>
    );

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Header with icon logout */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>
        <button
          onClick={openModal}
          title="Logout"
          className="p-2 rounded-full hover:bg-red-100 transition"
        >
          <LogoutIcon className="h-6 w-6 text-red-500 hover:text-red-600" />
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <StatCard title="Total Users" value={stats.users} color="bg-blue-500" />
        <StatCard
          title="Total Products"
          value={stats.products}
          color="bg-green-500"
        />
        <StatCard
          title="Total Orders"
          value={stats.orders}
          color="bg-purple-500"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats?.revenue?.toLocaleString?.() || 0}`}
          color="bg-yellow-500"
        />
      </div>

      {/* Orders chart */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
            Revenue Over Time
          </h2>
        </div>
        <div className="overflow-x-auto">
          <OrdersChart />
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${
            animateModal ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`bg-white rounded-lg shadow-lg p-6 w-80 transform transition-all duration-300 ${
              animateModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Logout
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, color }) => (
  <div
    className={`${color} text-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-200 text-center`}
  >
    <h2 className="text-base sm:text-lg font-medium">{title}</h2>
    <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">{value}</p>
  </div>
);

export default AdminDashboard;
