import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCartAsync } from "../features/cartSlice.js";
import toast from "react-hot-toast";
import { IoArrowBack } from "react-icons/io5";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const CategoryPage = () => {
  const { name } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Helper: Build image URL safely
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder.jpg";
    return imagePath.startsWith("http")
      ? imagePath
      : `${BASE_URL}/${
          imagePath.startsWith("/") ? imagePath.slice(1) : imagePath
        }`;
  };

  // 🔹 Fetch products by category
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/products/category/${name}`
        );
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching category products:", error);
        toast.error("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [name]);

  // 🔹 Handle Add to Cart
  const handleAdd = (product) => {
    if (!product) return;
    dispatch(addToCartAsync({ productId: product._id, quantity: 1 }));
    toast.success(`${product.name} added to cart`);
  };

  // 🔹 Loading State
  if (loading)
    return (
      <p className="text-center p-10 text-lg sm:text-xl font-medium text-gray-600">
        Loading...
      </p>
    );

  return (
    <section className="px-4 sm:px-6 md:px-10 py-10 bg-gray-50 min-h-screen">
      {/* 🔙 Back Button */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md shadow-md transition"
          aria-label="Go back home"
        >
          <IoArrowBack size={18} />
          <span>Back Home</span>
        </button>
      </div>

      {/* 🏷️ Header */}
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8 capitalize text-gray-900">
        {name} Collection
      </h1>

      {/* 🛍️ Product Grid */}
      {products.length === 0 ? (
        <p className="text-center text-gray-500 text-sm sm:text-base">
          No products found.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white p-3 sm:p-4 rounded-xl shadow hover:shadow-xl transition-transform transform hover:-translate-y-1 duration-200 flex flex-col justify-between"
            >
              {/* 🖼️ Product Image */}
              <img
                loading="lazy"
                src={getImageUrl(product.images?.[0])}
                alt={product.name}
                className="object-cover w-full h-56 rounded-t-md"
              />

              {/* ℹ️ Product Info */}
              <div className="mt-3 sm:mt-4">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
                  {product.name}
                </h2>
                <p className="text-gray-500 text-sm">{product.brand}</p>
                <p className="font-bold mt-1 text-gray-900">
                  {product.newPrice
                    ? `$${product.newPrice}`
                    : "Price unavailable"}
                </p>
              </div>

              {/* 🛒 Add to Cart */}
              <button
                onClick={() => handleAdd(product)}
                aria-label={`Add ${product.name} to cart`}
                className="mt-3 sm:mt-4 bg-gray-900 text-white text-sm sm:text-base px-4 py-2 sm:py-2.5 rounded-lg w-full hover:bg-gray-800 active:scale-95 transition-all"
              >
                Add to cart
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CategoryPage;
