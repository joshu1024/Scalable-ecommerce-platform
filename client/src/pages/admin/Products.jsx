import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct } from "../../features/productSlice.js";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector((state) => state.products);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading)
    return <div className="text-center mt-10 text-lg">Loading products...</div>;

  if (error)
    return <div className="text-center mt-10 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 text-center sm:text-left">
          Manage Products
        </h1>
        <button
          onClick={() => navigate("/admin/products/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition-all duration-200"
        >
          + Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full text-sm sm:text-base border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left font-semibold">Image</th>
              <th className="p-3 text-left font-semibold">Name</th>
              <th className="p-3 text-left font-semibold">Category</th>
              <th className="p-3 text-left font-semibold">Price</th>
              <th className="p-3 text-left font-semibold">Stock</th>
              <th className="p-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products?.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product._id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={
                          product.images[0].startsWith("http")
                            ? product.images[0]
                            : `${BASE_URL}/${product.images[0]}`
                        }
                        alt={product.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400 italic text-xs sm:text-sm">
                        No image
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-gray-700 truncate max-w-[150px] sm:max-w-none">
                    {product.name}
                  </td>
                  <td className="p-3 text-gray-600">{product.category}</td>
                  <td className="p-3 text-gray-800 font-medium">
                    ${product.newPrice}
                  </td>
                  <td className="p-3 text-gray-600">{product.stock}</td>

                  <td className="p-3 flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() =>
                        navigate(`/admin/products/edit/${product._id}`)
                      }
                      className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => dispatch(deleteProduct(product._id))}
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
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
