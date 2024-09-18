
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
export const fetchAmenityBookings = createAsyncThunk(
    'amenityBooking/fetchAmenityBookings',
    async ({ id, userId }) => {
        const response = await axiosInstance.get(`/getAmenityByIdAndUserId/${id}/${userId}`);
        return response.data;
    }
);

const amenityBookingSlice = createSlice({
    name: 'amenityBooking',
    initialState: {
        bookings: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAmenityBookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAmenityBookings.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action.payload)
                state.bookings = action.payload;
            })
            .addCase(fetchAmenityBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});

export default amenityBookingSlice.reducer;
