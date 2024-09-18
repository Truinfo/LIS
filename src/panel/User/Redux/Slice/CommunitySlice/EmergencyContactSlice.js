import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../../Security/helpers/axios";

// Define thunk to fetch emergency contacts from backend
// Define thunk to fetch emergency contacts from backend
export const fetchEmergencyContacts = createAsyncThunk(
  'emergencyContacts/fetchContacts',
  async (societyId, { rejectWithValue }) => {
    if (!societyId) {
      return rejectWithValue({ message: "Invalid society ID" });
    }

    try {
      const response = await axiosInstance.get(`/getEmergencyContactBySocietyId/${societyId}`);
      return response.data;
    } catch (error) {
      // Log the error for debugging
      console.error("Error fetching emergency contacts:", error);
      return rejectWithValue(error.response ? error.response.data : { message: "Network error" });
    }
  }
);

const initialState = {
  contacts: [],
  status: 'idle',
  error: null,
};
// Create slice for emergency contacts
const emergencyContactsSlice = createSlice({
  name: 'emergencyContacts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmergencyContacts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEmergencyContacts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.contacts = action.payload;
        console.log("Contacts fetched successfully");
      })
      .addCase(fetchEmergencyContacts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || "Failed to fetch contacts";
        console.log("Failed to fetch contacts:", action.payload);
      });
  },
});


export default emergencyContactsSlice.reducer;
