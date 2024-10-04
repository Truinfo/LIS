import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../Security/helpers/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchVisitors = createAsyncThunk(
  "visitors/fetchVisitors",
  async () => {
    const societyAdminString = await AsyncStorage.getItem("societyAdmin");
    const data = societyAdminString ? JSON.parse(societyAdminString) : {};
    const societyId = data._id || "6683b57b073739a31e8350d0"; // Default ID
    const response = await axiosInstance(
      `/getAllVisitorsBySocietyId/${societyId}`
    );
    return response.data.visitors;
  }
);

export const deleteEntry = createAsyncThunk(
  "visitors/Delete",
  async (selectedEntry) => {
    const societyAdminString = await AsyncStorage.getItem("societyAdmin");
    const data = societyAdminString ? JSON.parse(societyAdminString) : {};
    const societyId = data._id || "6683b57b073739a31e8350d0"; // Default ID
    const response = await axiosInstance(`/deleteEntryVisitor/${societyId}/${selectedEntry.block}/${selectedEntry.flatNo}/${selectedEntry.visitorId}`);
    return response.data.visitor;
  }
);

const visitorsSlice = createSlice({
  name: "visitors",
  initialState: {
    visitors: [],
    status: "idle",
    error: null,
    successMessage: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVisitors.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchVisitors.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.visitors = action.payload;
        state.successMessage = action.payload.message;
      })
      .addCase(fetchVisitors.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteEntry.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteEntry.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.successMessage = action.payload.message;
      })
      .addCase(deleteEntry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const AdminEntriesReducer = visitorsSlice.reducer;
