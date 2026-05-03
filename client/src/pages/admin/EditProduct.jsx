import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({
    name: "",
    price: "",
    brand: "",
    category: "",
  });
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${BASE_URL}/api/products/${id}`, product, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Failed to update product");
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="" className="font-semibold">
          Name:
        </label>
        <input
          type="text"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          className="border p-2 w-full rounded"
        />

        <label htmlFor="" className="font-semibold">
          Price:
        </label>
        <input
          type="number"
          value={product.newPrice}
          onChange={(e) => setProduct({ ...product, newPrice: e.target.value })}
          className="border p-2 w-full rounded"
        />
        <label htmlFor="" className="font-semibold">
          Stock:
        </label>
        <input
          type="text"
          value={product.stock}
          onChange={(e) => setProduct({ ...product, stock: e.target.value })}
          className="border p-2 w-full rounded"
        />
        <label htmlFor="" className="font-semibold">
          Category:
        </label>
        <input
          type="text"
          value={product.category}
          onChange={(e) => setProduct({ ...product, category: e.target.value })}
          className="border p-2 w-full rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
