// Hero/ProductModal.jsx
import { useEffect } from "react";
import ReactImageMagnify from "react-image-magnify";
import { IoClose } from "react-icons/io5";

const ProductModal = ({
  product,
  selectedImg,
  setSelectedImg,
  handleAdd,
  closeModal,
}) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
  const mainImg = selectedImg?.startsWith("http")
    ? selectedImg
    : `${BASE_URL}/${selectedImg}`;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="relative flex flex-col md:flex-row bg-white p-6 w-[90%] md:w-[60%] rounded-xl shadow-2xl">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
          onClick={closeModal}
        >
          <IoClose size={22} />
        </button>

        <div className="basis-1/2 mr-6 flex justify-center items-center">
          <ReactImageMagnify
            {...{
              smallImage: {
                alt: product.name,
                isFluidWidth: true,
                src: selectedImg || product.images[0],
              },
              largeImage: {
                src: selectedImg || product.images[0],
                width: 1200,
                height: 1500,
              },
              enlargedImageContainerStyle: {
                backgroundColor: "rgba(255,255,255,0.95)",
                borderRadius: "8px",
              },
            }}
          />
        </div>

        <div className="flex flex-col basis-1/2 space-y-4">
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p className="text-gray-500">{product.brand}</p>
          <div className="flex gap-3 items-center">
            <span className="line-through text-gray-400 text-lg">
              ${product.oldPrice}
            </span>
            <span className="text-xl font-semibold text-blue-600">
              ${product.newPrice}
            </span>
          </div>
          <p
            className={`text-sm ${
              product.stock <= 2
                ? "text-red-500 animate-pulse"
                : "text-gray-600"
            }`}
          >
            Only {product.stock} left in stock!
          </p>

          <button
            onClick={() => handleAdd(product)}
            className="mt-3 bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-all"
          >
            Add to Cart
          </button>

          <div className="flex gap-3 pt-4">
            {product.images.map((img, i) => {
              const src = img.startsWith("http") ? img : `${BASE_URL}/${img}`;
              return (
                <img
                  key={i}
                  src={src}
                  alt={product.name}
                  className={`w-16 h-16 object-contain border rounded cursor-pointer hover:border-black ${
                    selectedImg === src ? "border-black" : "border-gray-300"
                  }`}
                  onClick={() => setSelectedImg(src)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
