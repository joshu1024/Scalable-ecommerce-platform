import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.withCredentials = true;

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// 🛒 Add to Cart
export const addToCartAsync = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/cart/addToCart`, {
        productId,
        quantity,
      });
      return response.data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/cart/getCart`, {
        withCredentials: true,
      });
      return response.data.cart;
      console.log("BASE URL:", import.meta.env.VITE_API_BASE_URL);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const clearCartAsync = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/cart/clearCart`);
      return response.data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const checkoutCart = createAsyncThunk(
  "cart/checkoutCart",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/order`,
        {
          items,
          total,
        },
        { withCredentials: true },
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Checkout failed",
      );
    }
  },
);

const initialState = {
  items: JSON.parse(localStorage.getItem("cartItems")) || [],
  totalPrice: 0,
  loading: false,
  error: null,
};

const saveCart = (items) => {
  localStorage.setItem("cartItems", JSON.stringify(items));
};

// 💰 Calculate total price
const calculateTotal = (items) => {
  return items.reduce(
    (sum, item) =>
      sum +
      (item.productId?.newPrice || item.productId?.price || 0) * item.quantity,
    0,
  );
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item.productId?.id !== action.payload,
      );
      state.totalPrice = calculateTotal(state.items);
      saveCart(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
      saveCart(state.items);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCartAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.items || [];
        state.totalPrice = calculateTotal(state.items);
        saveCart(state.items);
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload?.items || [];
        state.totalPrice = calculateTotal(state.items);
        saveCart(state.items);
      })
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.items = [];
        state.totalPrice = 0;
        saveCart(state.items);
      });
  },
});

export const { removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
