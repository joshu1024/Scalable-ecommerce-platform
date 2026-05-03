import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast.error("Failed to fetch users");
    }
  };

  // Delete a user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(users.filter((u) => u._id !== id));
      toast.success("User deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    }
  };

  // Toggle user role
  const handleRoleToggle = async (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    try {
      await axios.put(
        `${BASE_URL}/api/admin/users/${user._id}`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUsers(
        users.map((u) => (u._id === user._id ? { ...u, role: newRole } : u))
      );
      toast.success(`User role updated to ${newRole}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update role");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      (u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-gray-800 text-center sm:text-left">
          All Users
        </h2>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 w-full sm:w-1/2 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full text-sm sm:text-base border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left font-semibold">ID</th>
              <th className="p-3 text-left font-semibold">Name</th>
              <th className="p-3 text-left font-semibold">Email</th>
              <th className="p-3 text-left font-semibold">Role</th>
              <th className="p-3 text-left font-semibold">Created At</th>
              <th className="p-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3 text-gray-600 truncate max-w-[100px] sm:max-w-none">
                    {user._id}
                  </td>
                  <td className="p-3 text-gray-800">{user.name}</td>
                  <td className="p-3 text-gray-600">{user.email}</td>
                  <td
                    className={`p-3 font-medium ${
                      user.role === "admin" ? "text-blue-600" : "text-gray-700"
                    }`}
                  >
                    {user.role}
                  </td>
                  <td className="p-3 text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleRoleToggle(user)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-all"
                    >
                      Toggle Role
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
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
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
