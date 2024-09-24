
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../../Security/helpers/axios';

const initialState = {
    society: null,
    status: 'idle',
    error: null
};

export const fetchSocietyById = createAsyncThunk(
    'society/fetchSocietyById',
    async (societyId) => {
        console.log("datadas",societyId)
        const response = await axiosInstance.get(`/societyDetails/${societyId}`);

        return response.data.society;

    }
);
const societySlice = createSlice({
    name: 'society',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSocietyById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSocietyById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.society = action.payload;
            })
            .addCase(fetchSocietyById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export default societySlice.reducer;
