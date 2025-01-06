// ProfileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../utils/axios';

const BASE_URL = import.meta.env.VITE_API_DOMAIN;
const SUB_API_NAME = import.meta.env.VITE_SUB_API_NAME;

const initialState = {
    profileData: {},
    loading: false,
    error: null,
};

export const getProfileByUser = createAsyncThunk(
    'user/getProfileByUser',
    async (credentials, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/Users/GetProfileByUser`;

        try {
            const response = await axios.post(url, credentials, {
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem("Exergy HRMToken")}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.USER_MESSAGE);
        }
    }
);

export const updateProfileByUser = createAsyncThunk(
    'user/updateProfileByUser',
    async (credentials, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/Users/UpdateProfileByUser`;

        try {
            const response = await axios.post(url, credentials, {
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem("Exergy HRMToken")}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.USER_MESSAGE);
        }
    }
);

export const updateProfileImageByUser = createAsyncThunk(
    'user/updateProfileImageByUser',
    async (data, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/Users/UpdateProfileImageByUser`;

        try {
            const response = await axios.post(url, data, {
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem("Exergy HRMToken")}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.USER_MESSAGE);
        }
    }
);

export const getProfileImageByFileName = createAsyncThunk(
    'user/getProfileImageByFileName',
    async (data, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/Users/GetProfileImageByFileName`;

        try {
            const response = await axios.post(url, data, {
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem("Exergy HRMToken")}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.USER_MESSAGE);
        }
    }
);

const ProfileSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getProfileByUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getProfileByUser.fulfilled, (state, action) => {
            state.profileData = action.payload.DATA;
            state.loading = false;
            state.error = null;
        });
        builder.addCase(getProfileByUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to get data';
        });
    },
});

export default ProfileSlice.reducer;