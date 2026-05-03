import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/products/search?q=${query}`
        );
        setProducts(data);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  return (
    <div className="p-5">
      <h2 className="text-xl mb-4">
        Search results for "<span className="text-orange-500">{query}</span>"
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <Link
              to={`/product/${p._id}`}
              key={p._id}
              className="bg-white p-3 rounded shadow"
            >
              <img
                src={
                  p?.images?.length
                    ? p.images[0].startsWith("http")
                      ? p.images[0]
                      : `http://localhost:4000/${
                          p.images[0].startsWith("/")
                            ? p.images[0].slice(1)
                            : p.images[0]
                        }`
                    : "/placeholder.jpg"
                }
                alt={p?.name}
                className="w-full h-56 object-contain mb-3"
              />

              <p className="font-semibold">{p.name}</p>
              <p className="text-gray-500">{p.brand}</p>
              <p className="text-orange-600">${p.newPrice}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default SearchResults;
