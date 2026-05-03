import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCartAsync } from "../features/cartSlice.js";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p className="p-5">Loading product...</p>;
  const handleAdd = (product) => {
    if (!product) return;
    dispatch(addToCartAsync({ productId: product._id, quantity: 1 }));
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className=" flex p-5 items-center justify-center">
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
        className="w-full md:w-1/2 h-96 object-cover mb-4 mr-5"
      />

      <div className="">
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-500 mb-2 font-medium">{product.brand}</p>
        <p className="text-orange-600 text-lg mb-4">
          Price: ${product.newPrice}
        </p>
        <p>Category: {product.category}</p>
        <p>In Stock: {product.stock}</p>
        <button
          onClick={() => handleAdd(product)}
          className="bg-gray-900 text-white text-sm px-6 py-2 rounded-md w-full mt-4"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
