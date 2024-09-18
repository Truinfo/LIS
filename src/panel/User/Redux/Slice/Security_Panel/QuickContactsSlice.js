import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from '../../../../Security/helpers/axios';

export const fetchCommityMembers = createAsyncThunk(
    "quickContacts/fetchCommityMembers",
    async ({societyId}, { rejectWithValue }) => {
        try {
            response = await axiosInstance.get(`/getCommityMembersBySocietyId/${societyId}`
        );
        return response.data.commityMember;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);


const quickContactsSlice = createSlice({
    name: "quickContacts",
    initialState: {
        quickContacts: [],
        status: "idle",
        error: null,
        successMessage: null,

    },
    reducers: {
        resetState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
            state.successMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCommityMembers.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchCommityMembers.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.quickContacts = action.payload;
                state.successMessage = action.payload.message;
            })
            .addCase(fetchCommityMembers.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload.message;
            });
    },
});

export const { resetState } = quickContactsSlice.actions;
export default quickContactsSlice.reducer;