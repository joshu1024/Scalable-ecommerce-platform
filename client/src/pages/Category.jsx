import React from "react";
import { useNavigate } from "react-router-dom";
import { categories, brands } from "../assets/data.js";

const Category = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${categoryName.toLowerCase()}`);
  };

  const handleBrandClick = (brandName) => {
    navigate(`/brand/${brandName.toLowerCase()}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-8">
      <section className="mt-2 bg-white/80 rounded-md shadow-md px-8 py-8 max-w-7xl mx-auto">
        {/* Shop by Category */}
        <div className="mb-12 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold pt-4 text-gray-800">
            Shop by Category
          </h1>

          <div className="mt-8 flex flex-wrap justify-center gap-30">
            {categories.map((category) => (
              <div
                key={category.category}
                onClick={() => handleCategoryClick(category.category)}
                className="cursor-pointer bg-white border border-gray-200 rounded-md shadow-md hover:shadow-lg 
                         hover:scale-105 transition-all duration-200 w-[240px] sm:w-[160px] h-[150px] 
                         flex flex-col justify-center items-center space-y-3"
              >
                <img
                  src={category.image}
                  alt={category.category}
                  className="w-14 sm:w-16"
                  loading="lazy"
                />
                <p className="font-semibold text-gray-700 text-sm sm:text-base text-center">
                  {category.category}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Shop by Brand */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold pt-4 text-gray-800">
            Shop by Brand
          </h1>

          <div className="mt-8 flex flex-wrap justify-center gap-30">
            {brands.map((brand) => (
              <div
                key={brand.brand}
                onClick={() => handleBrandClick(brand.brand)}
                className="cursor-pointer bg-white border border-gray-200 rounded-md shadow-md hover:shadow-lg 
                         hover:scale-105 transition-all duration-200 w-[140px] sm:w-[160px] h-[150px] 
                         flex flex-col justify-center items-center space-y-3"
              >
                <img
                  src={brand.image}
                  alt={brand.brand}
                  className="w-14 sm:w-16"
                  loading="lazy"
                />
                <p className="font-semibold text-gray-700 text-sm sm:text-base text-center">
                  {brand.brand}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Category;
