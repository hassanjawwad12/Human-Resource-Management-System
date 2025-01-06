// DepartmentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

const BASE_URL = import.meta.env.VITE_API_DOMAIN;
const SUB_API_NAME = import.meta.env.VITE_SUB_API_NAME;

const initialState = {
    departmentList: [],
    loading: false,
    error: null,
};

export const createNewDepartment = createAsyncThunk(
    'hr/createNewDepartment',
    async (credentials, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/FirmsDepartments/Save`;

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

export const getDepartmentById = createAsyncThunk(
    'hr/getDepartmentById',
    async (credentials, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/FirmsDepartments/GetById`;

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

export const getAllDepartments = createAsyncThunk(
    'hr/getAllDepartments',
    async (credentials, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/FirmsDepartments/GetAllByFirmId?firmId=${credentials}`;

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

export const DeleteDepartment = createAsyncThunk(
    'hr/deleteDepartment',
    async (credentials, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/FirmsDepartments/Delete?id=${credentials}`;
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

const DepartmentSlice = createSlice({
    name: 'hr',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createNewDepartment.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createNewDepartment.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
        });
        builder.addCase(createNewDepartment.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to get data';
        });
        builder.addCase(getAllDepartments.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getAllDepartments.fulfilled, (state, action) => {
            state.departmentList = action.payload.DATA;
            state.loading = false;
            state.error = null;
        });
        builder.addCase(getAllDepartments.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to get data';
        });
    },
});

export default DepartmentSlice.reducer;