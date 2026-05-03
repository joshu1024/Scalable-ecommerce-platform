import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5"; // 👈 optional icon

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/products`);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-500 text-lg">Loading products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-4">
        <p className="text-gray-500 text-lg">No products found.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-md shadow-md transition"
        >
          Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* 🔙 Back Button */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md shadow-md transition"
        >
          <IoArrowBack size={18} />
          <span>Back Home</span>
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-center">All Sneakers 👟</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white shadow-md rounded-lg p-3 hover:shadow-xl transition cursor-pointer"
            onClick={() => navigate(`/product/${product._id}`)}
          >
            <img
              src={
                product?.images?.length
                  ? product.images[0].startsWith("http")
                    ? product.images[0]
                    : `${BASE_URL}/${
                        product.images[0].startsWith("/")
                          ? product.images[0].slice(1)
                          : product.images[0]
                      }`
                  : "/placeholder.jpg"
              }
              alt={product?.name}
              className="w-full h-40 object-contain rounded-md mb-2"
            />

            <h2 className="text-sm font-semibold truncate">{product.name}</h2>
            <p className="text-gray-500 text-xs">{product.brand}</p>
            <p className="text-blue-600 font-bold">${product.newPrice}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
