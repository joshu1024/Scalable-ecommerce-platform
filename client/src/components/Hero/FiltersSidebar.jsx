import { TbArrowsSort } from "react-icons/tb";
import { useEffect } from "react";

const FiltersSidebar = ({
  menu,
  panelRef,
  activeParent,
  setActiveParent,
  selectedCategory,
  setSelectedCategory,
  selectedBrands,
  setSelectedBrands,
  sortBy,
  setSortBy,
  filteredProducts,
  setSelectedProduct,
  setSelectedImg,
  handleAdd,
  navigate,
}) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
  const toggleCategory = (cat) =>
    setSelectedCategory((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );

  const toggleBrand = (brand) =>
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  // Close the panel when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setActiveParent(null); // Close the panel
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [panelRef, setActiveParent]);

  return (
    <div className="bg-white/80 rounded-md shadow-md mt-2 basis-1/5 space-y-6 pt-2 relative hidden sm:hidden lg:block">
      {menu.map((item, i) => (
        <div
          key={i}
          onClick={() => {
            const newParent = activeParent === item.name ? null : item.name;
            setActiveParent(newParent);

            const categories = ["Men", "Women", "Kids"];

            if (item.name === "Products") {
              // Show all products
              setSelectedCategory([]);
              setSelectedBrands([]);
            } else if (categories.includes(item.name)) {
              // Auto-filter by category
              setSelectedCategory((prev) =>
                prev.includes(item.name) ? [] : [item.name],
              );
            } else if (item.name === "Home") {
              // 👇 Navigate to homepage
              navigate("/");
              setActiveParent(null); // Close any open panel
            }
          }}
          className={`hover:bg-gray-100 hover:shadow-sm cursor-pointer pt-4 ${
            activeParent === item.name ? "bg-gray-100 text-amber-500" : ""
          }`}
        >
          <item.icon
            className="inline-block m-4 text-gray-700 hover:text-amber-400"
            size={20}
          />
          <span className="text-base font-medium text-gray-600 hover:text-amber-400">
            {item.name}
          </span>
        </div>
      ))}

      {activeParent && (
        <div
          ref={panelRef}
          className="absolute flex flex-col top-0 left-[100%] w-[104vh] h-[100%] bg-white shadow-lg rounded-md p-4 z-50 overflow-y-auto"
        >
          <div className="flex justify-between mb-3">
            <h2 className="font-bold">All Products</h2>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border px-2 py-1 rounded text-sm"
            >
              <option value="">Sort By</option>
              <option value="priceHighToLow">Price: High → Low</option>
              <option value="priceLowtoHigh">Price: Low → High</option>
              <option value="nameAZ">Name: A → Z</option>
              <option value="nameZA">Name: Z → A</option>
              <option value="stock">Stock</option>
            </select>
          </div>

          {/* Filters */}
          <div className="flex">
            <div className="basis-1/5 pr-4 border-r">
              <h3 className="font-semibold mb-2">Category</h3>
              {["Men", "Women", "Kids"].map((cat) => (
                <div key={cat} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={selectedCategory.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                  />
                  <label className="ml-2">{cat}</label>
                </div>
              ))}

              <h3 className="font-semibold mt-4 mb-2">Brand</h3>
              {["Nike", "Adidas", "Puma"].map((b) => (
                <div key={b} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(b)}
                    onChange={() => toggleBrand(b)}
                  />
                  <label className="ml-2">{b}</label>
                </div>
              ))}
            </div>

            {/* Products */}
            <div className="grid grid-cols-3 gap-5 flex-grow">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="shadow-md rounded-md px-2 py-3 hover:shadow-xl hover:scale-[1.03] transition-transform duration-300 cursor-pointer"
                  onClick={() => {
                    setSelectedProduct(product);
                    setSelectedImg(product.images[0]);
                  }}
                >
                  <img
                    src={
                      product.images?.[0]?.startsWith("http")
                        ? product.images[0]
                        : `${BASE_URL}/${product.images[0]}`
                    }
                    alt={product.name}
                    className="h-56 w-full object-contain"
                  />
                  <h3 className="font-bold">{product.name}</h3>
                  <p className="text-gray-500 text-sm">{product.brand}</p>
                  <div className="flex justify-between">
                    <span className="line-through">${product.oldPrice}</span>
                    <span className="text-blue-600 font-semibold">
                      ${product.newPrice}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAdd(product);
                    }}
                    className="bg-gray-800 text-white text-sm rounded-md w-full py-2 mt-3"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltersSidebar;
