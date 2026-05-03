// Hero/ProductGrid.jsx
import React from "react";
import { useDispatch } from "react-redux";
import { addToCartAsync } from "../../features/cartSlice.js";
import { toast } from "react-hot-toast";

const ProductGrid = ({
  filteredProducts,
  setSelectedProduct,
  setSelectedImg,
}) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
  const dispatch = useDispatch();

  return (
    <div className="grid grid-cols-3 gap-5 mt-4">
      {filteredProducts.map((product) => (
        <div
          key={product._id}
          className="relative shadow-md rounded-md px-1 hover:shadow-xl hover:scale-[1.03] transition-transform duration-300 cursor-pointer"
          onClick={() => {
            setSelectedProduct(product);
            setSelectedImg(product.images[0]);
          }}
        >
          <img
            src={
              product.images?.[0]?.startsWith("http")
                ? product.images[0]
                : `${BASE_URL}/${product.images?.[0]}`
            }
            alt={product.name}
            className="h-58 mb-1 object-contain"
          />
          <h3 className="font-bold">{product.name}</h3>
          <p className="absolute text-xs text-white rounded-full px-1 top-2 mt-1 bg-red-500">
            only {product.stock} left
          </p>
          <div className="flex justify-between">
            <h4 className="line-through">${product.oldPrice}</h4>
            <h4>${product.newPrice}</h4>
          </div>
          <div className="flex justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch(
                  addToCartAsync({ productId: product._id, quantity: 1 })
                );
                toast.success(`${product.name} added to cart`);
              }}
              className="bg-gray-800 text-white text-sm rounded-md px-8 font-semibold py-2 mb-4 mt-4 transition"
            >
              Add to cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
