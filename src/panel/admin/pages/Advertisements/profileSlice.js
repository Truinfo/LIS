import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../Security/helpers/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Wrap AsyncStorage call inside the thunk
export const fetchResidentProfile = createAsyncThunk(
  'profile/fetchResidentProfile',
  async () => {
    // Fetch the society admin from AsyncStorage inside the async function
    const societyAdmin = await AsyncStorage.getItem('societyAdmin');
    const parsedAdmin = societyAdmin ? JSON.parse(societyAdmin) : {};
    const societyId = parsedAdmin._id || "6683b57b073739a31e8350d0";
    
    // Fetch profile data from the server using axios
    const response = await axiosInstance.get(`/society/profile/${societyId}`);
    return response.data.admins;
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profile: [],
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
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchResidentProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;  // Use error message from action
      });
  },
});

export const AdminProfileReducer = profileSlice.reducer;
