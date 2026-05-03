import React from "react";
import { Outlet, NavLink } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

        <nav className="flex flex-col gap-3">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `hover:text-gray-300 ${
                isActive ? "font-semibold text-blue-400" : ""
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `hover:text-gray-300 ${
                isActive ? "font-semibold text-blue-400" : ""
              }`
            }
          >
            Products
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `hover:text-gray-300 ${
                isActive ? "font-semibold text-blue-400" : ""
              }`
            }
          >
            Orders
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `hover:text-gray-300 ${
                isActive ? "font-semibold text-blue-400" : ""
              }`
            }
          >
            Users
          </NavLink>
        </nav>
      </aside>

      {/* Main content area */}
      <main className="flex-1 bg-gray-50 p-6 overflow-auto">
        <Outlet /> {/* Renders nested admin pages */}
      </main>
    </div>
  );
};

export default AdminLayout;
