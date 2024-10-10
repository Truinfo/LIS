import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Api } from '../../../../Security/helpers/axios';
// Define the initial state
const initialState = {
    bills: [],
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
};

// Async thunk for fetching bills using Axios
export const fetchBills = createAsyncThunk(
    'bills/fetchBills',
    async ({ societyId, blockno, flatno }) => {

        const response = await Api.get(`/getPaymentsOfEach/${societyId}/${blockno}/${flatno}`); 

        return response.data;
    }
);

const billsSlice = createSlice({
    name: 'bills',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBills.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBills.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.bills = action.payload;
            })
            .addCase(fetchBills.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default billsSlice.reducer;
