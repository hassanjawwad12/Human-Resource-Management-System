// HRSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

const BASE_URL = import.meta.env.VITE_API_DOMAIN;
const SUB_API_NAME = import.meta.env.VITE_SUB_API_NAME;

const initialState = {
    features: [],
    loading: false,
    error: null,
};

export const getHRFeatures = createAsyncThunk(
    'hr/getHRFeatures',
    async (credentials, { rejectWithValue }) => {
        let formData = new FormData();
        formData.append("groupId", 102);

        const url = `${BASE_URL}${SUB_API_NAME}/UsersFeatures/GetAllByGroupIdAndUser`;

        try {
            const response = await axios.post(url, formData, {
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

export const enrollCompanyEmployee = createAsyncThunk(
    'rota/enrollCompanyEmployee',
    async (data, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/CompanyEmployeesFingerprints/enroll`;

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

const HRSlice = createSlice({
    name: 'hr',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getHRFeatures.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getHRFeatures.fulfilled, (state, action) => {
            state.features = action.payload.DATA;
            state.loading = false;
            state.error = null;
        });
        builder.addCase(getHRFeatures.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to get data';
        });
    },
});

export default HRSlice.reducer;