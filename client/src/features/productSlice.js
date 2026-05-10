import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/products`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load products",
      );
    }
  },
);
export const getProductById = createAsyncThunk(
  "products/getProduct",
  async (id, { rejectWithValue }) => {
    try {
      await axios.get(`${BASE_URL}/api/admin/products/${id}`, {
        withCredentials: true,
      });
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch product",
      );
    }
  },
);
export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/api/admin/products/${id}`, {
        withCredentials: true,
      });
      toast.success("Product deleted successfully");
      return id;
    } catch (err) {
      console.error(
        "❌ Delete error:",
        err.response?.status,
        err.response?.data,
      ); // ✅ add this

      return rejectWithValue(
        err.response?.data?.message || "Failed to delete product",
      );
    }
  },
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        console.log("Redux payload:", action.payload);

        state.products = state.products.filter((p) => {
          console.log("Product ID:", p.id);
          return p.id !== action.payload;
        });
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
