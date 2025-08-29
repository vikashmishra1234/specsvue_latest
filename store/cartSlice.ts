"use client"

import { ICart } from '@/models/Cart';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

// Type for a product (Define properly if you have a schema)


// Type for the slice state


// Initial state
const initialState: any = {
  products: [],
  loading: false,
  error: null,
}

// Async thunk for fetching products from the database
export const fetchProducts = createAsyncThunk<any, string>(
  'products/fetchProducts',
  async (userId, thunkAPI) => {
    try {
      const response = await axios.get(`/api/get-cart?userId=${userId}`);
      return response.data?.cartProducts;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch cart products");
    }
  }
);
// Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetProducts: (state) => {
      state.products = []
      state.loading = false
      state.error = null
    },
    addToCart: (state, action: PayloadAction<any>) => {
      state.products.push(action.payload); // Append new product to the existing array
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch products'
      })
  },
})

export const { resetProducts, addToCart } = cartSlice.actions
export default cartSlice.reducer
