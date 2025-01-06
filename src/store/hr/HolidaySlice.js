// HolidaySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

const BASE_URL = import.meta.env.VITE_API_DOMAIN;
const SUB_API_NAME = import.meta.env.VITE_SUB_API_NAME;

const initialState = {
    holidayList: [],
    loading: false,
    error: null,
};

export const saveCompanyHoliday = createAsyncThunk(
    'holiday/saveCompanyHoliday',
    async (holidayData, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/Holidays/Save`;

        try {
            const response = await axios.post(url, holidayData, {
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

export const getAllCompanyHolidays = createAsyncThunk(
    'holiday/getAllCompanyHolidays',
    async (companyId, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/Holidays/getAllHolidays`;
        try {
            const response = await axios.post(url, companyId, {
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

export const deleteCompanyHoliday = createAsyncThunk(
    'holiday/deleteCompanyHoliday',
    async (holidayId, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/Holidays/deleteById`;

        try {
            const response = await axios.post(url, holidayId, {
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

const HolidaySlice = createSlice({
    name: 'holiday',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(saveCompanyHoliday.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(saveCompanyHoliday.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(saveCompanyHoliday.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to save holiday';
            })
            .addCase(getAllCompanyHolidays.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCompanyHolidays.fulfilled, (state, action) => {
                state.loading = false;
                state.holidayList = action.payload.DATA;
                state.error = null;
            })
            .addCase(getAllCompanyHolidays.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to get holidays';
            })
            .addCase(deleteCompanyHoliday.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCompanyHoliday.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                // You might want to update the holidayList here if the API doesn't return the updated list
                // state.holidayList = state.holidayList.filter(holiday => holiday.id !== action.meta.arg);
            })
            .addCase(deleteCompanyHoliday.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to delete holiday';
            });
    },
});

export default HolidaySlice.reducer;