// src/pages/Checkout.jsx
import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useDispatch, useSelector } from "react-redux";
import { checkoutCart } from "../features/cartSlice";
import axios from "axios";

const Checkout = () => {
  const dispatch = useDispatch();
  const { items, totalPrice } = useSelector((state) => state.cart);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

  const initialOptions = {
    "client-id":
      "AVhcnD3RpwZcOKS-AA8jpS_FuzRgVnj25RtZ-eNtafl8mpNFhpru97SCVE5xJ05wD6PpDIkR1neYNVO6", // 👈 your sandbox client ID
    currency: "USD",
  };

  const handleCreateOrder = async ({ total }) => {
    const { data } = await axios.post(`${BASE_URL}/api/paypal/create-order`, {
      amount: total,
    });
    return data.id; // 👈 PayPal needs this
  };

  const handleApprove = async (data, actions) => {
    const response = await axios.post(`${BASE_URL}/api/paypal/capture-order`, {
      orderID: data.orderID,
    });
    alert("Payment successful!");
    console.log(response.data);
  };

  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "20px" }}>
      <h2>Checkout 🧾</h2>

      <ul>
        {items.map((item) => (
          <li key={item.productId?._id || item._id}>
            {item.productId?.images && (
              <img
                src={item.productId.images[0]}
                alt={item.productId?.name}
                style={{ width: "50px", marginRight: "10px" }}
              />
            )}
            {item.productId?.name} — {item.quantity} × $
            {item.productId?.newPrice}
          </li>
        ))}
      </ul>

      <h3>Total: ${totalPrice.toFixed(2)}</h3>

      {success ? (
        <p style={{ color: "green" }}>{message}</p>
      ) : (
        <PayPalScriptProvider
          options={{
            "client-id":
              "AVhcnD3RpwZcOKS-AA8jpS_FuzRgVnj25RtZ-eNtafl8mpNFhpru97SCVE5xJ05wD6PpDIkR1neYNVO6",
            currency: "USD",
          }}
        >
          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={(data, actions) => {
              return fetch(`${BASE_URL}/api/paypal/create-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: totalPrice }), // ✅ FIXED
              })
                .then((res) => res.json())
                .then((order) => {
                  console.log("✅ PayPal order response:", order);
                  return order.id; // ✅ PayPal expects this
                });
            }}
            onApprove={(data, actions) => {
              return fetch(
                `${BASE_URL}/api/paypal/capture-order/${data.orderID}`,
                { method: "POST" }
              )
                .then((res) => res.json())
                .then((details) => {
                  console.log("🎉 Payment captured:", details);
                  dispatch(checkoutCart());
                  alert("Payment successful!");
                });
            }}
            onError={(err) => {
              console.error("💥 PayPal error:", err);
              setMessage("PayPal payment failed.");
            }}
          />
        </PayPalScriptProvider>
      )}

      {message && !success && <p style={{ color: "red" }}>{message}</p>}
    </div>
  );
};

export default Checkout;
