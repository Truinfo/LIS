import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../Security/helpers/axios';

// const societyAdmin = JSON.parse(localStorage.getItem('societyAdmin')) || {};
// const societyId = societyAdmin._id || "6683b57b073739a31e8350d0";
const societyId = "6683b57b073739a31e8350d0";

export const fetchResidentProfile = createAsyncThunk(
  'profile/fetchResidentProfile',
  async () => {
      const response = await axiosInstance.get(`/society/profile/${societyId}`);

      return response.data.admins; 

      
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profile: {}, // Changed to an object
    status: 'idle',
    error: null,
    successMessage: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResidentProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResidentProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload; // Assuming action.payload is an object
        state.error = null;
      })
      .addCase(fetchResidentProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});



export const AdminprofileReducer = profileSlice.reducer;