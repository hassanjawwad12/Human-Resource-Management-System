// DesignationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

const BASE_URL = import.meta.env.VITE_API_DOMAIN;
const SUB_API_NAME = import.meta.env.VITE_SUB_API_NAME;

const initialState = {
    designationList: [],
    loading: false,
    error: null,
};

export const createNewDesignation = createAsyncThunk(
    'hr/createNewDesignation',
    async (credentials, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/FirmsDesignations/Save`;

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

export const getDesignationById = createAsyncThunk(
    'hr/getDesignationById',
    async (credentials, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/FirmsDesignations/GetById`;

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

export const getAllDesignations = createAsyncThunk(
    'hr/getAllDesignations',
    async (credentials, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/FirmsDesignations/GetAllByFirmId?firmId=${credentials}`;

        try {
            const response = await axios.post(url, null, {
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

export const DeleteDesignation = createAsyncThunk(
    'hr/DeleteDesignation',
    async (credentials, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/FirmsDesignations/Delete?id=${credentials}`;
        try {
            const response = await axios.post(url, null, {
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


const DesignationSlice = createSlice({
    name: 'hr',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createNewDesignation.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createNewDesignation.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
        });
        builder.addCase(createNewDesignation.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to get data';
        });
        builder.addCase(getAllDesignations.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getAllDesignations.fulfilled, (state, action) => {
            state.designationList = action.payload.DATA;
            state.loading = false;
            state.error = null;
        });
        builder.addCase(getAllDesignations.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to get data';
        });
    },
});

export default DesignationSlice.reducer;
