import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cartSlice.js";
import productReducer from "../features/productSlice.js";
import userReducer from "../features/userSlice.js";
import adminReducer from "../features/adminSlice.js";
import orderReducer from "../features/orderSlice.js";

export const store = configureStore({
  reducer: {
    user: userReducer,
    products: productReducer,
    cart: cartReducer,
    admin: adminReducer,
    orders: orderReducer,
  },
});

export default store;
