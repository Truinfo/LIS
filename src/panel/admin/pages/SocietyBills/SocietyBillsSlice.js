// SocietyBillsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from "../../../Security/helpers/axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Utility function to fetch societyId
const getSocietyId = async () => {
    try {
        const societyAdminString = await AsyncStorage.getItem("societyAdmin");
        const data = societyAdminString ? JSON.parse(societyAdminString) : {};
        return data._id || "6683b57b073739a31e8350d0";
    } catch (error) {
        console.error("Error fetching societyId:", error);
        return "6683b57b073739a31e8350d0"; // Fallback ID
    }
};

// Thunk to fetch bills by society ID
export const fetchBillsBySocietyId = createAsyncThunk(
    'bills/fetchBillsBySocietyId',
    async () => {
        const societyId = await getSocietyId();
        const response = await axiosInstance.get(`/getBillsBySocietyId/${societyId}`);
        console.log(response.data.society.bills);
        return response.data.society.bills;
    }
);

// Thunk to get a specific bill by ID
export const getBillById = createAsyncThunk(
    'bills/getBillById',
    async ({ id }) => {
        const societyId = await getSocietyId();
        const response = await axiosInstance.get(`/getBillById/${societyId}/${id}`);
        return response.data.bill;
    }
);

// Thunk to create a new bill
export const createBill = createAsyncThunk(
    'bills/createBill',
    async (formData) => {
        const societyId = await getSocietyId();
        const response = await axiosInstance.post('/createBill', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
);

// Thunk to edit an existing bill
export const editBill = createAsyncThunk(
    'bills/editBill',
    async ({ id, formData }) => {
        const societyId = await getSocietyId();
        const response = await axiosInstance.put(`/editBill/${societyId}/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
);

// Thunk to delete a bill
export const deleteBill = createAsyncThunk(
    "bills/deleteBill",
    async ({ id }) => {
        const societyId = await getSocietyId();
        const response = await axiosInstance.delete(`/deleteBill/${societyId}/${id}`);
        return response.data;
    }
);

const SocietyBillsSlice = createSlice({
    name: 'bills',
    initialState: {
        bills: [],
        status: 'idle',
        error: null,
        successMessage: null,
    },

    reducers: {
        // Define any synchronous reducers if needed
    },

    extraReducers: (builder) => {
        builder
            // fetchBillsBySocietyId Thunk
            .addCase(fetchBillsBySocietyId.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBillsBySocietyId.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.bills = action.payload;
            })
            .addCase(fetchBillsBySocietyId.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // getBillById Thunk
            .addCase(getBillById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getBillById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Assuming getBillById returns a single bill, consider storing it separately
                // For example, state.selectedBill = action.payload;
                // But here, we'll push it to bills for consistency
                state.bills = [action.payload];
            })
            .addCase(getBillById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // createBill Thunk
            .addCase(createBill.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createBill.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.bills.push(action.payload);
                state.successMessage = action.payload.message;
            })
            .addCase(createBill.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // editBill Thunk
            .addCase(editBill.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(editBill.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Assuming editBill returns the updated list of bills
                state.bills = action.payload;
                state.successMessage = action.payload.message;
            })
            .addCase(editBill.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // deleteBill Thunk
            .addCase(deleteBill.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteBill.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Assuming deleteBill returns the updated list of bills
                state.bills = action.payload;
                state.successMessage = action.payload.message;
                state.error = null;
            })
            .addCase(deleteBill.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ? action.payload : 'Failed to fetch inventory';
            });
    },
});

export const societyBillsReducer = SocietyBillsSlice.reducer;
