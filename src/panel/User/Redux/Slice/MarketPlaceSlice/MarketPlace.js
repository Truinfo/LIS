import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../../Security/helpers/axios';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
    Properties: [],
    loading: false,
    error: null,
};

const fetchSocietyId = async () => {
    const storedAdmin = await AsyncStorage.getItem("societyAdmin");
    const societyAdmin = JSON.parse(storedAdmin) || {};
    return societyAdmin._id || "6683b57b073739a31e8350d0";
};
export const AddProperty = createAsyncThunk(
    'marketPlace/addProperty',
    async (data) => {

        const response = await axiosInstance.post(`/AddItems`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    }
);
export const getSocityAdds = createAsyncThunk(
    'marketPlace/getSocityProducts',
    async () => {
        const societyId = await fetchSocietyId()
        const response = await axiosInstance.get(`/getSocietyItems/${societyId}`);
        return response.data;
    }
);
export const getPropertyById = createAsyncThunk(
    'marketPlace/getSocityProductsById',
    async (id) => {
        const response = await axiosInstance.get(`/getItemBy/${id}`);
        return response.data;
    }
);
export const ResidentsAdds = createAsyncThunk(
    'marketPlace/getResidentById',
    async (id) => {
        const response = await axios.get(`http://192.168.29.151:2000/api/getMyAddByid/${id}`);
        return response.data;
    }
);

const MarketPlaceSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(AddProperty.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(AddProperty.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(AddProperty.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getSocityAdds.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSocityAdds.fulfilled, (state, action) => {
                state.loading = false;
                state.Properties = action.payload;
            })
            .addCase(getSocityAdds.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;

            })
            .addCase(getPropertyById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPropertyById.fulfilled, (state, action) => {
                state.loading = false;
                state.Properties = action.payload;
            })
            .addCase(getPropertyById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;

            })
            .addCase(ResidentsAdds.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(ResidentsAdds.fulfilled, (state, action) => {
                state.loading = false;
                state.Properties = action.payload;
            })
            .addCase(ResidentsAdds.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;

            })
    },
});
export const marketPLaceReducer = MarketPlaceSlice.reducer;
