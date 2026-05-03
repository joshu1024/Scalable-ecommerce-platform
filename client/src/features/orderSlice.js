import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const checkoutCart = createAsyncThunk(
  "order/checkoutCart",
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/orders", orderData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to checkout"
      );
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    items: [],
    totalPrice: 0,
    loading: false,
    error: null,
    order: null,
  },
  reducers: {
    clearOrder: (state) => {
      state.order = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkoutCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkoutCart.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.items = [];
        state.totalPrice = 0;
      })
      .addCase(checkoutCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
