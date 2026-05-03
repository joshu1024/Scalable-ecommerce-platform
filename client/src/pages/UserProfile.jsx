import React, { useEffect, useState } from "react";
import axios from "axios";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/api/user/profile`);
        setUser(res.data.user);
        setOrders(res.data.orders);
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Loading profile...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-600 text-lg">
        {error}
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* User Info */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">
          Welcome, {user?.userName}
        </h2>
        <p className="text-gray-600 mb-1">
          <strong>Email:</strong> {user?.email}
        </p>
      </div>

      {/* Orders */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Your Orders
        </h3>

        {orders.length === 0 ? (
          <p className="text-gray-500 italic">You have no orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 text-left font-semibold">Order ID</th>
                  <th className="p-3 text-left font-semibold">Total</th>
                  <th className="p-3 text-left font-semibold">Status</th>
                  <th className="p-3 text-left font-semibold">Date</th>
                  <th className="p-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr className="border-t hover:bg-gray-50 transition-colors">
                      <td className="p-3 text-gray-700 truncate max-w-[120px] sm:max-w-none">
                        {order._id}
                      </td>
                      <td className="p-3 text-gray-800 font-medium">
                        ${order.total?.toFixed(2) || "0.00"}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-700"
                              : order.status === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : order.status === "Cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : order.status === "Processing"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() =>
                            setExpandedOrder(
                              expandedOrder === order._id ? null : order._id,
                            )
                          }
                          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm transition-all"
                        >
                          {expandedOrder === order._id
                            ? "Hide Details"
                            : "View Details"}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Details */}
                    {expandedOrder === order._id && (
                      <tr>
                        <td colSpan="5" className="bg-gray-50 p-4">
                          {order.items && order.items.length > 0 ? (
                            <ul className="space-y-2">
                              {order.items.map((item, index) => (
                                <li
                                  key={index}
                                  className="flex justify-between border-b pb-2 text-gray-700"
                                >
                                  <span>
                                    {item.product?.name || "Product"} (x
                                    {item.quantity})
                                  </span>
                                  <span>
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500 italic">
                              No items found for this order.
                            </p>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
