import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../Security/helpers/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fetchSocietyId = async () => {
    const storedAdmin = await AsyncStorage.getItem('societyAdmin');
    const societyAdmin = JSON.parse(storedAdmin) || {};
    return societyAdmin._id || "6683b57b073739a31e8350d0"; // Default ID
};
export const getAllMonthsBySocietyId = createAsyncThunk(
    'dashboard/getAllMonthsBySocietyId',
    async () => {
        const response = await axiosInstance.get(`/getAllMonthsBySocietyId/${societyId}`);
        return response.data.maintanance;
    }
);


const DashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        dashboard: [],
        profile: [],
        status: 'idle',
        error: null,
        successMessage: null,
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllMonthsBySocietyId.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getAllMonthsBySocietyId.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.dashboard = action.payload;
            })
            .addCase(getAllMonthsBySocietyId.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
          
    },
});


export const DashboardReducer = DashboardSlice.reducer;