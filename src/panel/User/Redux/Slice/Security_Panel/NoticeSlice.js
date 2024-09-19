// noticeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../../Security/helpers/axios';

export const fetchNotices = createAsyncThunk('notices/fetchNotices', async (societyId) => {
  try {
    if (societyId) {
      const response = await axiosInstance.get(`https://livinsync.onrender.com/api/getAllNotice/${societyId}`);
      return response.data;
    }
  } catch (error) {
    console.error("API call failed:", error); // Log error for more context
    throw error;
  }
});

const noticeSlice = createSlice({
  name: 'notices',
  initialState: {
    notices: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotices.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNotices.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notices = action.payload;
      })
      .addCase(fetchNotices.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const selectNotices = (state) => state.notices.notices;
export const selectLoading = (state) => state.notices.loading;
export const selectError = (state) => state.notices.error;

export default noticeSlice.reducer;
