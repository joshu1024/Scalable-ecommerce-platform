import React, { useState, useEffect } from "react";

const HeroSlider = ({ slides, navigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      goNext();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const goNext = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const goPrev = () =>
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="basis-3/4 relative bg-white/90 rounded-md shadow-md mt-2 overflow-hidden flex items-center justify-center">
      <div className="flex flex-col items-center justify-center w-full h-[70vh] relative">
        <img
          className="object-contain w-[400px] h-[400px] md:w-[700px] md:h-[700px]"
          src={slides[currentIndex].slide}
          alt="Sneaker"
        />
        <button
          onClick={() => navigate("/products")}
          className="absolute bottom-10 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full shadow-md transition-all"
        >
          Shop Now
        </button>
      </div>

      <button
        className="absolute left-6 bg-gray-300 hover:bg-gray-400 text-white rounded-full p-4 transition"
        onClick={goPrev}
      >
        &#10094;
      </button>
      <button
        className="absolute right-6 bg-gray-300 hover:bg-gray-400 text-white rounded-full p-4 transition"
        onClick={goNext}
      >
        &#10095;
      </button>

      <div className="absolute bottom-4 text-center w-full">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`inline-block w-3 h-3 rounded-full mx-1 cursor-pointer ${
              currentIndex === index ? "bg-cyan-400" : "bg-gray-400"
            }`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
