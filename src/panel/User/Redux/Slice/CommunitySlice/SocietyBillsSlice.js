// src/redux/slices/societyBillsSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../../Security/helpers/axios';

// Define the initial state
const initialState = {
  societyBills: [],
  loading: false,
  error: null,
};

// Define the async thunk for fetching society bills
export const fetchSocietyBills = createAsyncThunk(
  'societyBills/fetchSocietyBills',
  async (societyId, { rejectWithValue }) => {
    try {
      // Replace the URL with your API endpoint
      const response = await axiosInstance.get(`/getBillsBySocietyId/${societyId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create the slice
const societyBillsSlice = createSlice({
  name: 'societyBills',
  initialState,
  reducers: {
    // Optional: Define any synchronous actions if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSocietyBills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSocietyBills.fulfilled, (state, action) => {
        state.loading = false;
        state.societyBills = action.payload;
      })
      .addCase(fetchSocietyBills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default societyBillsSlice.reducer;
