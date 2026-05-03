import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchCart,
  removeFromCart,
  clearCartAsync,
} from "../features/cartSlice.js";
import { CircularProgress, Button } from "@mui/material";
import toast from "react-hot-toast";

const BASE_URL = "http://localhost:4000";

const getImageUrl = (image) => {
  if (!image) return "/placeholder.jpg";
  return image.startsWith("http")
    ? image
    : `${BASE_URL}/${image.startsWith("/") ? image.slice(1) : image}`;
};

const Cart = () => {
  const dispatch = useDispatch();
  const { items, loading, totalPrice, error } = useSelector(
    (state) => state.cart
  );
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );

  if (error)
    return (
      <p className="text-red-500 text-center mt-10">{error.message || error}</p>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 bg-white rounded-md shadow-md mt-4">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Your Cart 🛒
      </h2>

      {items.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 mb-3">Your cart is empty.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={`${item.productId?._id || item._id}-${index}`}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-4"
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full">
                  <img
                    src={getImageUrl(item.productId?.images?.[0])}
                    alt={item.productId?.name}
                    className="w-10 h-10 object-contain"
                  />
                  <div className="text-center sm:text-left">
                    <p className="font-semibold text-gray-800">
                      {item.productId?.name}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Price: ${item.productId?.newPrice}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="mt-3 sm:mt-0 flex justify-center sm:justify-end">
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => {
                      dispatch(removeFromCart(item.productId?._id));
                      toast.success(`${item.productId?.name} removed`);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center sm:text-right">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Total: ${Number(totalPrice || 0).toFixed(2)}
            </h3>

            <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-3">
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  dispatch(clearCartAsync());
                  toast.success("Cart cleared!");
                }}
              >
                Clear Cart
              </Button>

              <button
                onClick={() => navigate("/checkout")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
