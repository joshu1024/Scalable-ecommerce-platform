import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, loginUser } from "../features/userSlice.js";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (isLogin) {
        await dispatch(
          loginUser({ email: formData.email, password: formData.password })
        ).unwrap();
        toast.success("Logged in successfully");
      } else {
        await dispatch(registerUser(formData)).unwrap();
        toast.success("Registered successfully");
      }
    } catch (err) {
      toast.error(err || "Something went wrong");
    }
  }

  return (
    <div className="flex flex-col min-h-screen justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          {isLogin ? "Login" : "Register"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          {!isLogin && (
            <div className="flex flex-col">
              <label
                htmlFor="userName"
                className="text-gray-700 font-medium mb-2"
              >
                Username
              </label>
              <input
                id="userName"
                type="text"
                name="userName"
                onChange={handleChange}
                value={formData.userName}
                placeholder="Enter username"
                required
                className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              onChange={handleChange}
              value={formData.email}
              placeholder="Enter your email"
              required
              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="text-gray-700 font-medium mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              onChange={handleChange}
              value={formData.password}
              placeholder="Enter your password"
              required
              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Button */}
          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-70"
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Register"}
          </button>

          {/* Toggle between Login/Register */}
          <p className="text-center mt-4 text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                if (isLogin) {
                  setIsLogin(false);
                } else {
                  navigate("/login");
                }
              }}
              className="text-blue-600 hover:underline"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>

          {/* Optional: show backend error */}
          {error && (
            <p className="text-center text-red-500 text-sm mt-2">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
