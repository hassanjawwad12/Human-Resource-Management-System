// AdminSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

const BASE_URL = import.meta.env.VITE_API_DOMAIN;
const SUB_API_NAME = import.meta.env.VITE_SUB_API_NAME;

const initialState = {
    features: [],
    loading: false,
    error: null,
};

export const getAdminFeatures = createAsyncThunk(
    'hr/getAdminFeatures',
    async (credentials, { rejectWithValue }) => {
        let formData = new FormData();
        formData.append("groupId", 101);

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

export const getAllFeaturesByEmployeeId = createAsyncThunk(
    'hr/GetAllFeaturesByEmployeeId',
    async (formData, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/CompanyEmployeesFeatures/GetAllFeaturesByEmployeeId`;

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

export const saveEmployeeFeatures = createAsyncThunk(
    'hr/saveEmployeeFeatures',
    async (formData, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/CompanyEmployeesFeatures/Save`;

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

export const getAllFeatures = createAsyncThunk(
    'hr/GetAllFeatures',
    async (formData, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/CompanyEmployeesFeatures/GetAllFeatures`;

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

const AdminSlice = createSlice({
    name: 'hr',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAdminFeatures.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getAdminFeatures.fulfilled, (state, action) => {
            state.features = action.payload.DATA;
            state.loading = false;
            state.error = null;
        });
        builder.addCase(getAdminFeatures.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to get data';
        });
    },
});

export default AdminSlice.reducer;