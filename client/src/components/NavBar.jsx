import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { MdAddShoppingCart, MdClose } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { GiHamburgerMenu } from "react-icons/gi";
import logo from "../assets/logo.png";
import { logOutUser } from "../features/userSlice";
import { motion, AnimatePresence } from "framer-motion";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: cartItems } = useSelector((state) => state.cart);
  const { user, isLoggedIn } = useSelector((state) => state.user);
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await dispatch(logOutUser());
    dispatch({ type: "cart/clearCart" });
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setResults([]);
    }
  };

  const handleSelectProduct = (id) => {
    navigate(`/product/${id}`);
    setResults([]);
    setSearchTerm("");
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setResults([]);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const controller = new AbortController();
    if (searchTerm.trim().length >= 2) {
      const delay = setTimeout(async () => {
        try {
          const { data } = await axios.get(
            `${BASE_URL}/api/products/search?q=${searchTerm}`,
            { signal: controller.signal }
          );
          setResults(data.slice(0, 5));
        } catch (err) {
          if (err.name !== "CanceledError") console.error(err);
        }
      }, 300);
      return () => {
        clearTimeout(delay);
        controller.abort();
      };
    } else {
      setResults([]);
    }
  }, [searchTerm]);
  const getImageUrl = (img) => {
    if (!img) return "/placeholder.jpg";
    return img.startsWith("http")
      ? img
      : `${BASE_URL}/${img.startsWith("/") ? img.slice(1) : img}`;
  };

  return (
    <nav className="bg-white/60 shadow-md sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 sm:px-8 h-16">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-80 transition"
        >
          <img src={logo} alt="logo" className="w-10" />
          <span className="text-2xl font-mono font-bold text-gray-700">
            <span className="text-blue-800">S</span>neaker
            <span className="text-blue-800">Z</span>one
          </span>
        </Link>

        {/* Desktop Search */}
        <div
          className="hidden md:block flex-grow max-w-md mx-4 relative"
          ref={dropdownRef}
        >
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search Sneakers..."
              className="border border-gray-400 rounded-full px-4 py-2 w-full focus:ring-2 focus:ring-amber-500 focus:outline-none transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              aria-label="Search"
              onClick={handleSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-amber-600 p-2 rounded-full"
            >
              <CiSearch className="text-white" />
            </button>
          </form>

          {/* Search Results */}
          <AnimatePresence>
            {results.length > 0 && (
              <motion.div className="absolute bg-white w-full mt-2 shadow-lg rounded-lg border border-gray-200 z-50 max-h-64 overflow-y-auto">
                {results.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleSelectProduct(item._id)}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <img
                      src={getImageUrl(item.images?.[0])}
                      alt={item?.name}
                      className="w-10 h-10 object-contain"
                    />

                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.brand}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-6">
          {/* User */}
          <div className="relative">
            <button
              aria-label="User menu"
              onClick={() => setUserDialogOpen(!userDialogOpen)}
              className="text-gray-800 hover:text-gray-600"
            >
              <FaUserCircle size={28} />
            </button>
            <AnimatePresence>
              {userDialogOpen && (
                <motion.div
                  key="user-menu"
                  onMouseLeave={() => setUserDialogOpen(false)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-lg w-48 py-3 z-50 text-center"
                >
                  {isLoggedIn ? (
                    <>
                      <p className="text-gray-600 mb-2">
                        Hi,{" "}
                        <span className="font-semibold">{user?.userName}</span>
                      </p>

                      <Link
                        to="/profile"
                        className="block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm w-32 mx-auto hover:bg-blue-700 transition mb-2"
                        onClick={() => setUserDialogOpen(false)}
                      >
                        Profile
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm w-32 hover:bg-gray-700 transition"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      className="block text-gray-600 hover:text-gray-900"
                    >
                      Login
                    </Link>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cart */}
          <div className="relative">
            <button
              aria-label="Open cart"
              onClick={() => setIsCartOpen(!isCartOpen)}
            >
              <MdAddShoppingCart size={28} />
            </button>
            {totalQuantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalQuantity}
              </span>
            )}
            <AnimatePresence>
              {" "}
              {isCartOpen && (
                <motion.div
                  key="cart-dropdown"
                  onMouseLeave={() => setIsCartOpen(false)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-lg w-72 z-50 max-h-80 overflow-y-auto p-4"
                >
                  <h2 className="font-bold mb-2">My Cart</h2>
                  {cartItems.length === 0 ? (
                    <p className="text-gray-500 text-sm">Your cart is empty</p>
                  ) : (
                    <>
                      <ul className="divide-y divide-gray-200">
                        {cartItems.map((product, i) => (
                          <li
                            key={product.productId?._id || i}
                            className="flex justify-between items-center py-2"
                          >
                            <img
                              src={
                                product.productId?.images?.length
                                  ? product.productId.images[0].startsWith(
                                      "http"
                                    )
                                    ? product.productId.images[0]
                                    : `${BASE_URL}/${
                                        product.productId.images[0].startsWith(
                                          "/"
                                        )
                                          ? product.productId.images[0].slice(1)
                                          : product.productId.images[0]
                                      }`
                                  : "/placeholder.jpg"
                              }
                              alt={product.productId?.name}
                              className="w-10 h-10 object-contain"
                            />

                            <p className="text-sm truncate w-32">
                              {product.productId?.name}
                            </p>
                            <p className="text-red-600 font-semibold text-sm">
                              $
                              {product.productId?.newPrice
                                ? product.productId.newPrice.toFixed(2)
                                : "0.00"}
                            </p>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => {
                          navigate("/cart");
                          setIsCartOpen(false);
                        }}
                        className="bg-gray-800 text-white w-full py-2 mt-3 rounded-lg hover:bg-gray-700 transition text-sm"
                      >
                        View Cart
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <MdClose size={28} />
            ) : (
              <GiHamburgerMenu size={28} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-inner px-4 py-3 space-y-3"
          >
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search Sneakers..."
                className="border border-gray-400 rounded-full px-4 py-2 w-full focus:ring-2 focus:ring-amber-500 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                aria-label="Search"
                onClick={handleSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-amber-600 p-2 rounded-full"
              >
                <CiSearch className="text-white" />
              </button>
            </form>

            <div className="flex flex-col gap-3 text-gray-700">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link to="/products" onClick={() => setMobileMenuOpen(false)}>
                Shop
              </Link>
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-red-600"
                >
                  Logout
                </button>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavBar;
