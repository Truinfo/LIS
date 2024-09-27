import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../Security/helpers/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


// Helper function to get the societyId
const getSocietyId = async () => {
    const societyAdmin = await AsyncStorage.getItem('societyAdmin');
    return JSON.parse(societyAdmin)?._id || "6683b57b073739a31e8350d0";
};

export const fetchEvent = createAsyncThunk(
    'event/fetchEvent',
    async () => {
        const societyId = await getSocietyId();
        const response = await axiosInstance.get(`/events/getAllEvents/${societyId}`);
        return response.data.events;

    }
);

export const fetchEventById = createAsyncThunk(
    'event/fetchEventById',
    async (id) => {
        console.log("this is cksmwgvoae")
        const societyId = await getSocietyId();
        const response = await axiosInstance.get(`/events/getEventById/${id}/${societyId}`);
        console.log(response.data.event)
        return response.data.event;
    }
);

export const createEvent = createAsyncThunk(
    'event/AddEvent',
    async (formData) => {
        const response = await axiosInstance.post('/events/createEvent', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
);


export const updateEvent = createAsyncThunk(
    'event/updateEvent',
    async ({ id, formData }) => {
        const societyId = await getSocietyId();
        const response = await axiosInstance.put(`/events/updateEvent/${societyId}/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
);

export const deleteEvent = createAsyncThunk(
    "event/deleteEvent",
    async (id) => {
        const societyId = await getSocietyId();
        const response = await axiosInstance.delete(`/events/deleteEvent/${id}/${societyId}`);
        return response.data;
    }
);

const EventSlice = createSlice({
    name: 'event',
    initialState: {
        event: [],
        status: 'idle',
        error: null,
        successMessage: null,
    },

    reducers: {
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchEvent.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchEvent.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.event = action.payload;
            })
            .addCase(fetchEvent.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchEventById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchEventById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.event = action.payload;
            })
            .addCase(fetchEventById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createEvent.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createEvent.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.event = action.payload;
                state.successMessage = action.payload.message;
            })
            .addCase(createEvent.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
                state.successMessage = null;
            })
            .addCase(updateEvent.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateEvent.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.event = action.payload;
                state.successMessage = action.payload.message;
            })
            .addCase(updateEvent.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(deleteEvent.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteEvent.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.event = action.payload;
                state.successMessage = action.payload.message;
                state.error = null;
            })
            .addCase(deleteEvent.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ? action.payload : 'Failed to fetch inventory';
            });
    },
});


export const SocietyEventReducer = EventSlice.reducer;