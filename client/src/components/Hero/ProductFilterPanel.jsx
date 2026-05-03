// Hero/ProductFilterPanel.jsx
import React from "react";
import ProductGrid from "./ProductGrid.jsx";

const ProductFilterPanel = React.forwardRef(
  (
    {
      menu,
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
    },
    ref
  ) => {
    const handleCategoryChange = (cat) => {
      setSelectedCategory((prev) =>
        prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
      );
    };

    const handleBrandsChange = (brand) => {
      setSelectedBrands((prev) =>
        prev.includes(brand)
          ? prev.filter((b) => b !== brand)
          : [...prev, brand]
      );
    };

    return (
      <div className="bg-white/80 rounded-md shadow-md mt-2 basis-1/5 space-y-6 pt-2 relative hidden sm:hidden lg:block">
        {menu.map((item, i) => (
          <div
            key={i}
            onClick={() =>
              item.children.length > 0
                ? setActiveParent((prev) =>
                    prev === item.name ? null : item.name
                  )
                : null
            }
            className="hover:bg-gray-100 hover:shadow-sm cursor-pointer pt-4"
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
            ref={ref}
            className="absolute flex flex-col top-0 left-[100%] w-[80vw] h-[100%] bg-white shadow-lg rounded-md p-4 z-50 overflow-y-auto"
          >
            <div className="flex justify-between mb-2">
              <h2 className="font-bold">Filters</h2>
              <select
                className="text-sm border px-2 py-1 rounded"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="">Sort by</option>
                <option value="priceHightoLow">High to Low</option>
                <option value="priceLowtoHigh">Low to High</option>
                <option value="nameAZ">A to Z</option>
                <option value="nameZA">Z to A</option>
                <option value="stock">Stock</option>
              </select>
            </div>

            {/* Filter checkboxes */}
            <div className="flex gap-8">
              <div>
                <h3 className="font-semibold mb-2">Category</h3>
                {["Men", "Women", "Kids"].map((cat) => (
                  <div key={cat}>
                    <input
                      type="checkbox"
                      checked={selectedCategory.includes(cat)}
                      onChange={() => handleCategoryChange(cat)}
                    />
                    <label className="ml-2">{cat}</label>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="font-semibold mb-2">Brand</h3>
                {["Nike", "Adidas", "Puma"].map((b) => (
                  <div key={b}>
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(b)}
                      onChange={() => handleBrandsChange(b)}
                    />
                    <label className="ml-2">{b}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Product grid */}
            <ProductGrid
              filteredProducts={filteredProducts}
              setSelectedProduct={setSelectedProduct}
              setSelectedImg={setSelectedImg}
            />
          </div>
        )}
      </div>
    );
  }
);

export default ProductFilterPanel;
