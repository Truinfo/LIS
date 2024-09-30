import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios"
import AsyncStorage from '@react-native-async-storage/async-storage';

const fetchSocietyId = async () => {
    const storedAdmin = await AsyncStorage.getItem("societyAdmin");
    const societyAdmin = JSON.parse(storedAdmin) || {};
    return societyAdmin._id || "6683b57b073739a31e8350d0"; // Default ID
};

export const getAmenityOfCommunityHal = createAsyncThunk(
    'booking/getAmenityOfCommunityHal',
    async () => {
        const societyId = await fetchSocietyId();
        const response = await axios.get(`http://192.168.29.151:2000/api/getAmenityOfCommunityHal/${societyId}`);
        return response.data.amenity;
    }
);

// router.get('/getAmenityByIdAndUserId/:id/:userId', getAmenityByIdAndUserId);
export const getAmenityByIdAndUserId = createAsyncThunk(
    'booking/getAmenityByIdAndUserId',
    async ({ userId }) => {
        const societyId = await fetchSocietyId();
        const response = await axios.get(`http://192.168.29.151:2000/api/getAmenityByIdAndUserId/${societyId}/${userId}`);
        return response.data.booking;
    }
);

// router.put('/bookAmenity/:id', bookAmenity);
export const bookAmenity = createAsyncThunk(
    'booking/bookAmenity',
    async ({ id, formData }) => {
        const response = await axios.put(`http://192.168.29.151:2000/api/bookAmenity/${id}`, formData);
        return response.data;
    }
);

// router.put('/updateAmenityBooking/:id/:userId', updateAmenityBooking);
export const updateAmenityBooking = createAsyncThunk(
    'booking/updateAmenityBooking',
    async ({ userId, formData }) => {
        const societyId = await fetchSocietyId();
        console.log(societyId)
        const response = await axios.put(`http://192.168.29.151:2000/api/updateAmenityBooking/${societyId}/${userId}`, formData);
        return response.data;
    }
);

// router.delete('/deleteAmenityBooking/:id/:userId', deleteAmenityBooking);
export const deleteAmenityBooking = createAsyncThunk(
    "booking/deleteAmenityBooking",
    async (userId) => {
        const id = userId.userId
        const societyId = await fetchSocietyId();
        const response = await axios.delete(`http://192.168.29.151:2000/api/deleteAmenityBooking/${societyId}/${id}`);
        console.log(response.data, "hello")
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