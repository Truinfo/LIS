import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios"
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../../Security/helpers/axios';

const fetchSocietyId = async () => {
    const storedAdmin = await AsyncStorage.getItem("societyAdmin");
    const societyAdmin = JSON.parse(storedAdmin) || {};
    return societyAdmin._id || "6683b57b073739a31e8350d0"; // Default ID
};

export const getAmenityOfCommunityHal = createAsyncThunk(
    'booking/getAmenityOfCommunityHal',
    async () => {
        const societyId = await fetchSocietyId();
        const response = await axiosInstance.get(`/getAmenityOfCommunityHal/${societyId}`);
        return response.data.amenity;
    }
);

// router.get('/getAmenityByIdAndUserId/:id/:userId', getAmenityByIdAndUserId);
export const getAmenityByIdAndUserId = createAsyncThunk(
    'booking/getAmenityByIdAndUserId',
    async ({ userId }) => {
        const societyId = await fetchSocietyId();
        const response = await axiosInstance.get(`/getAmenityByIdAndUserId/${societyId}/${userId}`);
        return response.data.booking;
    }
);

// router.put('/bookAmenity/:id', bookAmenity);
export const bookAmenity = createAsyncThunk(
    'booking/bookAmenity',
    async ({ id, formData }) => {
        const response = await axiosInstance.post(`/bookAmenity/${id}`, formData, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    }
);

// router.put('/updateAmenityBooking/:id/:userId', updateAmenityBooking);
export const updateAmenityBooking = createAsyncThunk(
    'booking/updateAmenityBooking',
    async ({ userId, formData }) => {
        const societyId = await fetchSocietyId();
        const response = await axiosInstance.put(`/updateAmenityBooking/${societyId}/${userId}`, formData);
        return response.data;
    }
);

export const deleteAmenityBooking = createAsyncThunk(
    "booking/deleteAmenityBooking",
    async (userId) => {
        const id = userId
        const societyId = await fetchSocietyId();
        const response = await axiosInstance.delete(`/deleteAmenityBooking/${societyId}/${id}`, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    }
);

const BookingSlice = createSlice({
    name: 'booking',
    initialState: {
        booking: [],
        status: 'idle',
        error: null,
        successMessage: null,
    },

    reducers: {
    },

    extraReducers: (builder) => {
        builder
            .addCase(getAmenityOfCommunityHal.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getAmenityOfCommunityHal.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.booking = action.payload;
            })
            .addCase(getAmenityOfCommunityHal.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(getAmenityByIdAndUserId.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getAmenityByIdAndUserId.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.booking = action.payload;
            })
            .addCase(getAmenityByIdAndUserId.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(bookAmenity.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(bookAmenity.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.booking = action.payload;
                state.successMessage = action.payload.message;
            })
            .addCase(bookAmenity.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateAmenityBooking.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateAmenityBooking.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.booking = action.payload;
                state.successMessage = action.payload.message;
            })
            .addCase(updateAmenityBooking.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(deleteAmenityBooking.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteAmenityBooking.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.booking = action.payload;
                state.successMessage = action.payload.message;
                state.error = null;
            })
            .addCase(deleteAmenityBooking.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ? action.payload : 'Failed to fetch inventory';
            });
    },
});


export const AdminBookingReducer = BookingSlice.reducer;