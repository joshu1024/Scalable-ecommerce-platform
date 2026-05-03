import React, { useEffect, useState } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/admin/orders`);
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to load orders");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/admin/orders/${id}`);
      setOrders((prev) => prev.filter((order) => order._id !== id));
      alert("Order deleted successfully");
    } catch (err) {
      console.error("Failed to delete order:", err);
      alert("Failed to delete order");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`${BASE_URL}/api/admin/orders/${id}`, {
        status: newStatus,
      });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update order status");
    }
  };

  if (loading)
    return (
      <div className="text-center text-gray-600 p-8 text-lg">
        Loading orders...
      </div>
    );

  if (error)
    return <div className="text-center text-red-600 p-8 text-lg">{error}</div>;

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-gray-800 text-center sm:text-left">
          Order Management
        </h2>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full text-sm sm:text-base border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left font-semibold">Order ID</th>
              <th className="p-3 text-left font-semibold">User</th>
              <th className="p-3 text-left font-semibold">Email</th>
              <th className="p-3 text-left font-semibold">Total</th>
              <th className="p-3 text-left font-semibold">Status</th>
              <th className="p-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3 text-gray-700 truncate max-w-[120px] sm:max-w-none">
                    {order._id}
                  </td>
                  <td className="p-3 text-gray-700">
                    {order.user?.name || "Guest"}
                  </td>
                  <td className="p-3 text-gray-600">
                    {order.user?.email || "N/A"}
                  </td>
                  <td className="p-3 text-gray-800 font-medium">
                    ${order.total ? order.total.toFixed(2) : "0.00"}
                  </td>

                  {/* Status cell with dropdown + badge */}
                  <td className="p-3">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="border rounded px-2 py-1 font-medium w-full text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none transition"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    {/* Status badge below */}
                    <span
                      className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold ${
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

                  {/* Actions */}
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-all"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center text-gray-500 p-6 italic"
                >
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
