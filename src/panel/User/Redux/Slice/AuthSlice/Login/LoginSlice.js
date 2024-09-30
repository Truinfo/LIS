import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../../../../../Security/helpers/axios";
import axios from "axios";
export const userLogin = createAsyncThunk(
    "auth/userLogin",
    async ({ email, password }, { rejectWithValue }) => {

        try {
            const response = await axiosInstance.post(
                "user/userSignin",
                {
                    email,
                    password,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);


const userSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        token: null,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(userLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.profile;
                state.token = action.payload.token;
                const { _id, name, role, societyId, userId, buildingName, flatNumber, societyName, sequrityId, userType } = action.payload.profile;
                const userData = {
                    _id,
                    sequrityId,
                    userId,
                    name,
                    role,
                    societyId, societyName,
                    buildingName, flatNumber, userType
                };
                const userDataString = JSON.stringify(userData);
                AsyncStorage.setItem('user', userDataString)
            })
            .addCase(userLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
