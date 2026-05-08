import "./App.css";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCart } from "./features/cartSlice.js";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import Cart from "./pages/Cart";
import Footer from "./components/Footer";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import Checkout from "./pages/CheckOut.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import BrandPage from "./pages/BrandPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import Products from "./pages/admin/Products.jsx";
import Orders from "./pages/admin/Orders.jsx";
import Users from "./pages/admin/Users.jsx";
import NewProduct from "./pages/admin/NewProduct.jsx";
import EditProduct from "./pages/admin/EditProduct.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import UserProfile from "./pages/UserProfile.jsx";

import { useSelector } from "react-redux";

function App() {
  const location = useLocation();
  const hideLayout =
    location.pathname === "/register" ||
    location.pathname === "/login" ||
    location.pathname.startsWith("/admin");

  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector((state) => state.user);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchCart());
    }
  }, [dispatch, isLoggedIn]);

  return (
    <>
      {!hideLayout && !location.pathname.startsWith("/admin") && <NavBar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchResults />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProtectedRoute>
              <ProductDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/category/:name"
          element={
            <ProtectedRoute>
              <CategoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/brand/:name"
          element={
            <ProtectedRoute>
              <BrandPage />
            </ProtectedRoute>
          }
        />

        {/* ✅ New User Profile Route */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="products/new" element={<NewProduct />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
            <Route path="orders" element={<Orders />} />
            <Route path="users" element={<Users />} />
          </Route>
        </Route>
      </Routes>

      {!hideLayout && !location.pathname.startsWith("/admin") && <Footer />}

      <Toaster />
    </>
  );
}

export default App;
