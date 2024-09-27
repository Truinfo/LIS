import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../../Security/helpers/axios';

// Async thunk for fetching complaints
export const fetchComplaints = createAsyncThunk(
    'complaints/fetchComplaints',
    async (societyId, thunkAPI) => {
        try {
            const response = await axiosInstance.get(`/getAllComplaints/${societyId}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Async thunk for creating a complaint
export const createComplaint = createAsyncThunk(
    'complaints/createComplaint',
    async (complaintData, thunkAPI) => {
       
        try {
            const response = await axiosInstance.post('/createComplaint', complaintData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
export const updateComplaintResolution = createAsyncThunk(
    'complaints/updateComplaintResolution',
    async ({ societyId, complaintId, resolution }, thunkAPI) => {
        try {
            const response = await axiosInstance.put(`/updateComplaint/${societyId}/${complaintId}`, { resolution });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

const complaintsSlice = createSlice({
    name: 'complaints',
    initialState: {
        complaints: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Handling the fetch complaints actions
        builder
            .addCase(fetchComplaints.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchComplaints.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.complaints = action.payload;
            })
            .addCase(fetchComplaints.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Handling the create complaint actions
            .addCase(createComplaint.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createComplaint.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.complaints = action.payload; // Assuming action.payload is the created complaint
            })
            .addCase(createComplaint.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(updateComplaintResolution.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateComplaintResolution.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.complaints = action.payload;

            })
            .addCase(updateComplaintResolution.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default complaintsSlice.reducer;
