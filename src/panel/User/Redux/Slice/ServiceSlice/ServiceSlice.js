import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../../../Security/helpers/axios';
// export const fetchServices = createAsyncThunk(
//   'services/fetchServices',
//   async () => {
//     try {
//       const userJson = await AsyncStorage.getItem('user');
//       if (!userJson) {
//         throw new Error('User object not found in AsyncStorage');
//       }
//       const user = JSON.parse(userJson);
//       const { societyId } = user || "6683b57b073739a31e8350d0";
//       if (!societyId) {
//         throw new Error('Society ID not found in user object');
//       }
//       const response = await axiosInstance.get(`/getAllServicePersons/${societyId}`);
//       return response.data.service.society;
//     } catch (error) {
//       throw error;
//     }
//   }
// );
const societyId = "6683b57b073739a31e8350d0";
export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async () => {
    try {
      const response = await axiosInstance.get(`/getAllServicePersons/${societyId}`);
      return response.data.service.society;
    } catch (error) {
      throw error;
    }
  }
);
const serviceSlice = createSlice({
  name: 'services',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default serviceSlice.reducer;
