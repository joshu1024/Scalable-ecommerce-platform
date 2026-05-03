import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const NewProduct = () => {
  const [name, setName] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("oldPrice", oldPrice);
      formData.append("newPrice", newPrice);
      formData.append("brand", brand);
      formData.append("category", category);
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }

      await axios.post(`${BASE_URL}/api/products/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Product created successfully");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Failed to create product");
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="number"
          placeholder="Old Price"
          value={oldPrice}
          onChange={(e) => setOldPrice(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="number"
          placeholder="New Price"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="text"
          placeholder="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="file"
          multiple
          onChange={(e) => setImages(e.target.files)}
          className="border p-2 w-full rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Product
        </button>
      </form>
    </div>
  );
};

export default NewProduct;
