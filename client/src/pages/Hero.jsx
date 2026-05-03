import { useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState, useMemo } from "react";
import { TbArrowsSort } from "react-icons/tb";
import { slides, menu, products } from "../assets/data.js";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { addToCartAsync } from "../features/cartSlice.js";
import { toast } from "react-hot-toast";
import axios from "axios";
import ReactImageMagnify from "react-image-magnify";

const Hero = ({ product }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeParent, setActiveParent] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const [sortBy, setSortBy] = useState("");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

  const panelRef = useRef(null);

  const navigate = useNavigate();
  const [fetchedProducts, setFetchedProducts] = useState([]);

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

  const options = [
    { value: "priceLowtoHigh", label: "Low to High" },
    { value: "priceHighToLow", label: "High to Low" },
    { value: "nameAZ", label: "A → Z" },
    { value: "nameZA", label: "Z → A" },
    { value: "stock", label: "Stock" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      goNext();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  function goNext() {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }
  function goPrev() {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }

  function getCurrent(index) {
    setCurrentIndex(index);
  }

  function handleClick(item) {
    if (item.children.length > 0) {
      setActiveParent((prev) => (prev === item.name ? null : item.name));
      if (["Men", "Women", "Kids"].includes(item.name)) {
        setSelectedCategory([item.name]);
        setSelectedBrands([]);
      }
      if (item.name === "Products") {
        setSelectedCategory([]);
        setSelectedBrands([]);
      } else {
        if (["Nike", "Adidas", "Puma"].includes(item.name)) {
          setSelectedBrands([item.name]);
        }
      }
    } else {
      navigate(item.path);
    }
  }
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

  function handleCategoryChange(category) {
    setSelectedCategory((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  }

  function handleBrandsChange(brand) {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b != brand) : [...prev, brand],
    );
  }
  useEffect(() => {
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setActiveParent(null);
      }
    }
    if (activeParent) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeParent]);

  const dispatch = useDispatch();
  const handleAdd = () => {
    console.log("Selected Product:", selectedProduct);
    if (!selectedProduct) return;
    dispatch(addToCartAsync({ productId: selectedProduct._id, quantity: 1 }));
    toast.success(`${selectedProduct.name} added to cart`);
  };
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");

    if (category) {
      setSelectedCategory([category]);
      setSelectedBrands([]);
    } else if (brand) {
      setSelectedBrands([brand]);
      setSelectedCategory([]);
    } else {
      setSelectedCategory([]);
      setSelectedBrands([]);
    }
  }, [searchParams]);
  useEffect(() => {
    const element = document.getElementById("product-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedCategory, selectedBrands]);

  return (
    <div className="">
      <section className="flex flex-col lg:flex-row gap-4 px-8 max-w-7xl mx-auto mt-2">
        <div className=" bg-white/80 rounded-md shadow-md mt-2 basis-1/5 space-y-6 pt-2 relative hidden sm:hidden lg:block">
          {menu.map((item, index) => (
            <div
              key={index}
              onClick={() => handleClick(item)}
              className="hover:bg-gray-100 hover:shadow-sm cursor-pointer pt-4 "
            >
              {
                <item.icon
                  className="inline-block m-4 text-gray-700 hover:text-amber-400"
                  size={20}
                />
              }
              <span className="text-base font-medium text-gray-600 hover:text-amber-400">
                {item.name}
              </span>
            </div>
          ))}

          {activeParent && (
            <div
              ref={panelRef}
              className="absolute flex  flex-col top-0 left-[100%] w-[104vh] h-[100%] bg-white shadow-lg rounded-md p-4 z-50 overflow-y-auto"
            >
              <div className="flex">
                <div className="basis-1/5">
                  <h2 className="font-bold mb-2">Filters</h2>
                </div>
                <div className="flex w-full justify-between">
                  <h2 className="font-bold mb-2">All products</h2>
                  <div className="flex gap-x-8">
                    <p>products</p>
                    <select
                      className="text-sm"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="">
                        <TbArrowsSort className="ml-0" /> Sort by
                      </option>
                      <option value="priceHighToLow">high to low</option>
                      <option value="priceLowtoHigh">low to high</option>
                      <option value="nameAZ">A to Z</option>
                      <option value="nameZA">Z to A</option>
                      <option value="stock">stock</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex">
                {/* filter */}
                <div className="basis-1/5">
                  <div className="space-y-2 mb-6 border-r-1 border-gray-200 mr-1">
                    <h3 className="font-semibold">Category</h3>
                    {["Men", "Women", "Kids"].map((cat) => (
                      <div key={cat} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={cat}
                          checked={selectedCategory.includes(cat)}
                          onChange={() => handleCategoryChange(cat)}
                          className="cursor-pointer"
                        />
                        <label
                          htmlFor={cat}
                          className="cursor-pointer text-gray-700"
                        >
                          {cat}
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 mb-6 border-r-1 border-gray-200 mr-1">
                    <h3 className="font-semibold">Brand</h3>
                    {["Nike", "Adidas", "Puma"].map((b) => (
                      <ul key={b} className="space-x-2">
                        <input
                          type="checkbox"
                          id={b}
                          checked={selectedBrands.includes(b)}
                          onChange={() => handleBrandsChange(b)}
                        />
                        <label htmlFor={b}>{b}</label>
                      </ul>
                    ))}
                  </div>
                </div>
                {/* products */}

                <div className=" grid grid-cols-3 gap-5 flex-grow overflow-hidden  border-t-1 border-gray-200 pt-1">
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
                            : product.images?.[0]
                              ? `${BASE_URL}/${product.images[0]}`
                              : "/placeholder.png"
                        }
                        alt={product.name}
                        className="h-58 mb-1 object-contain"
                      />

                      <h3 className="font-bold">{product.name}</h3>
                      <p
                        className={`absolute text-xs text-white rounded-full px-1 top-2 mt-1 hover:animate-pulse ${
                          product.stock <= 2 ? "bg-red-500 " : ""
                        }`}
                      >
                        only {product.stock} items left
                      </p>

                      <div className="flex flex-col w-full">
                        <div className="flex gap-24 text-left text-gray-400">
                          <p className="">{product.category}</p>
                          <p className="mx-2">{product.brand}</p>
                        </div>
                        <div className="flex justify-between">
                          <h4 className="line-through">${product.oldPrice}</h4>
                          <h4>${product.newPrice}</h4>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <button className="bg-gray-800 text-white text-sm rounded-md px-8 font-semibold py-2 mb-4 mt-4 transition ">
                          View Product
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {selectedProduct && (
                  <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center animate-fadeIn">
                    {/* Modal container */}
                    <div className="relative flex bg-white p-6 w-[60%] rounded-xl shadow-2xl transform scale-95 animate-scaleIn">
                      {/* Close button */}
                      <button
                        className="absolute top-3 right-3 text-gray-600 hover:text-black"
                        onClick={() => setSelectedProduct(null)}
                      >
                        <IoClose size={22} />
                      </button>

                      {/* Left side – Image with magnifier */}
                      <div className="basis-1/2 mr-6 flex justify-center items-center bg-white rounded-lg">
                        <ReactImageMagnify
                          {...{
                            smallImage: {
                              alt: selectedProduct.name,
                              isFluidWidth: true,
                              src: selectedImg || selectedProduct.images[0],
                            },
                            largeImage: {
                              src: selectedImg || selectedProduct.images[0],
                              width: 1200,
                              height: 1500,
                            },
                            enlargedImageContainerStyle: {
                              backgroundColor: "rgba(255,255,255,0.95)",
                              borderRadius: "8px",
                              zIndex: 7777,
                            },
                            enlargedImageContainerDimensions: {
                              width: "200%",
                              height: "200%",
                            },
                            isHintEnabled: true,
                          }}
                        />
                      </div>

                      {/* Right side – Product details */}
                      <div className="flex flex-col basis-1/2 space-y-4">
                        <h2 className="text-2xl font-bold">
                          {selectedProduct.name}
                        </h2>
                        <p className="text-gray-500">{selectedProduct.brand}</p>
                        <div className="flex gap-3 items-center">
                          <span className="line-through text-gray-400 text-lg">
                            ${selectedProduct.oldPrice}
                          </span>
                          <span className="text-xl font-semibold text-blue-600">
                            ${selectedProduct.newPrice}
                          </span>
                        </div>
                        <p
                          className={`text-sm ${
                            selectedProduct.stock <= 2
                              ? "text-red-500 animate-pulse"
                              : "text-gray-600"
                          }`}
                        >
                          Only {selectedProduct.stock} left in stock!
                        </p>

                        <button
                          onClick={handleAdd}
                          className="mt-3 bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-all"
                          disabled={selectedProduct.stock === 0}
                        >
                          Add to Cart
                        </button>

                        {/* Thumbnails */}
                        <div className="flex gap-3 pt-4">
                          {selectedProduct.images.map((img, idx) => {
                            const src = img.startsWith("http")
                              ? img
                              : `${BASE_URL}/${img}`;
                            return (
                              <img
                                key={idx}
                                src={src}
                                alt={selectedProduct.name}
                                className={`w-16 h-16 object-contain border rounded cursor-pointer hover:border-black ${
                                  selectedImg === src
                                    ? "border-black"
                                    : "border-gray-300"
                                }`}
                                onClick={() => setSelectedImg(src)}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="basis-3/4 relative bg-white/90 rounded-md shadow-md mt-2 overflow-hidden flex items-center justify-center">
          <div className="flex flex-col items-center justify-center w-full h-[70vh] relative">
            <img
              className="object-contain w-[400px] h-[400px] md:w-[700px] md:h-[700px]"
              src={slides[currentIndex].slide}
              alt="Sneaker"
            />

            {/* ✅ Call to Action Button */}
            <button
              onClick={() => navigate("/products")}
              className="absolute bottom-10 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full shadow-md transition-all"
            >
              Shop Now
            </button>
          </div>

          {/* ✅ Navigation Arrows */}
          <button
            className="absolute left-6 bg-gray-300 hover:bg-gray-400 text-white rounded-full p-4 transition"
            onClick={() => goPrev()}
          >
            &#10094;
          </button>
          <button
            className="absolute right-6 bg-gray-300 hover:bg-gray-400 text-white rounded-full p-4 transition"
            onClick={() => goNext()}
          >
            &#10095;
          </button>

          {/* ✅ Dots at the Bottom */}
          <div className="absolute bottom-4 text-center w-full">
            {slides.map((_, index) => (
              <span
                key={index}
                className={`inline-block w-3 h-3 rounded-full mx-1 cursor-pointer ${
                  currentIndex === index ? "bg-cyan-400" : "bg-gray-400"
                }`}
                onClick={() => getCurrent(index)}
              ></span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
