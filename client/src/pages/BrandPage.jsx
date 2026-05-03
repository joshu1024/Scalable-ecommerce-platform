import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCartAsync } from "../features/cartSlice.js";
import toast from "react-hot-toast";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const BrandPage = () => {
  const { name } = useParams();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/products/brand/${encodeURIComponent(name)}`
        );
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching brand products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [name]);

  if (loading) return <p className="text-center p-10">Loading...</p>;
  const handleAdd = (product) => {
    if (!product) return;
    dispatch(addToCartAsync({ productId: product._id, quantity: 1 }));
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="p-10">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md shadow-md transition"
        >
          <IoArrowBack size={18} />
          <span>Back Home</span>
        </button>
      </div>
      <h1 className="text-3xl font-bold text-center mb-8">{name} Products</h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <img
                src={
                  product.images?.length
                    ? product.images[0].startsWith("http")
                      ? product.images[0]
                      : `${BASE_URL}/${
                          product.images[0].startsWith("/")
                            ? product.images[0].slice(1)
                            : product.images[0]
                        }`
                    : "/placeholder.jpg"
                }
                alt={product.name}
                className="object-cover w-full h-56 rounded-t-md"
              />

              <h2 className="mt-3 text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-500">{product.category}</p>
              <p className="font-bold mt-1">${product.newPrice}</p>
              <button
                onClick={() => handleAdd(product)}
                className="bg-gray-900 text-white text-sm px-6 py-2 rounded-md w-full mt-4"
              >
                Add to cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandPage;
