import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { addToCartAsync } from "../../features/cartSlice.js";
import { slides, menu } from "../../assets/data.js";
import HeroSlider from "./HeroSlider";
import FiltersSidebar from "./FiltersSidebar";
import ProductFilterPanel from "./ProductFilterPanel";
import ProductModal from "./ProductModal";

const Hero = () => {
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [activeParent, setActiveParent] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const panelRef = useRef(null);
  const [searchParams] = useSearchParams();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/products`);
        setFetchedProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // Filter + Sort products
  const filteredProducts = useMemo(() => {
    return fetchedProducts
      .filter(
        (p) =>
          (selectedCategory.length === 0 ||
            selectedCategory.includes(p.category)) &&
          (selectedBrands.length === 0 || selectedBrands.includes(p.brand)),
      )
      .sort((a, b) => {
        if (sortBy === "priceLowtoHigh") return a.newPrice - b.newPrice;
        if (sortBy === "priceHighToLow") return b.newPrice - a.newPrice;
        if (sortBy === "nameAZ") return a.name.localeCompare(b.name);
        if (sortBy === "nameZA") return b.name.localeCompare(a.name);
        if (sortBy === "stock") return a.stock - b.stock;
        return 0;
      });
  }, [fetchedProducts, selectedCategory, selectedBrands, sortBy]);

  // Add to cart
  const handleAdd = (product) => {
    dispatch(addToCartAsync({ productId: product._id, quantity: 1 }));
    toast.success(`${product.name} added to cart`);
  };

  // Close modal
  const closeModal = () => setSelectedProduct(null);

  return (
    <section className="flex flex-col lg:flex-row gap-4 px-8 max-w-7xl mx-auto mt-2">
      <FiltersSidebar
        menu={menu}
        panelRef={panelRef}
        activeParent={activeParent}
        setActiveParent={setActiveParent}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedBrands={selectedBrands}
        setSelectedBrands={setSelectedBrands}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filteredProducts={filteredProducts}
        setSelectedProduct={setSelectedProduct}
        setSelectedImg={setSelectedImg}
        handleAdd={handleAdd}
        navigate={navigate}
      />

      <HeroSlider slides={slides} navigate={navigate} />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          selectedImg={selectedImg}
          setSelectedImg={setSelectedImg}
          handleAdd={handleAdd}
          closeModal={closeModal}
        />
      )}
    </section>
  );
};

export default Hero;
