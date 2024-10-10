import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../Security/helpers/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const fetchVisitors = createAsyncThunk(
  "visitors/fetchVisitors",
  async () => {
    const societyAdminString = await AsyncStorage.getItem("user");
    const data = societyAdminString ? JSON.parse(societyAdminString) : {};
    const societyId = data._id; // Default ID
    const response = await axios.get(
      `http://192.168.29.35:2000/api/getAllVisitorsBySocietyId/${societyId}`
    );
    return response.data.visitors;
  }
);

export const deleteEntry = createAsyncThunk(
  "visitors/Delete",
  async ({block,flatNo,visitorId}) => {
    const societyAdminString = await AsyncStorage.getItem("user");
    const data = societyAdminString ? JSON.parse(societyAdminString) : {};
    const societyId = data._id; 
    const response = await axiosInstance.delete(
      `/deleteEntryVisitor/${societyId}/${block}/${flatNo}/${visitorId}`
    );
    return response.data;
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
