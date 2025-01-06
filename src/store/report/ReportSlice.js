// ReportSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

const initialState = {
    features: [],
    employeeList: [],
    attendanceList: [],
    leaveList: [],
    loading: false,
    error: null,
};

export const getReportFeatures = createAsyncThunk(
    'report/getReportFeatures',
    async (credentials, { rejectWithValue }) => {

        let formData = new FormData();
        formData.append("groupId", 106);

        const url = `${'http://35.179.98.1:8081'}/${'ExergyHRM'}/UsersFeatures/GetAllByGroupIdAndUser`

        try {
            // Make your API request using Axios
            const response = await axios.post(url, formData,
                {
                    headers: {
                        Authorization: `Bearer ${window.localStorage.getItem("Exergy HRMToken")}`
                    }
                });

            // Extract the user data from the response
            const result = response.data;

            return result;
        } catch (error) {
            // If an error occurs, reject the promise with the error message
            return rejectWithValue(error.USER_MESSAGE);
        }
    }
);

export const getEmployeesReport = createAsyncThunk(
    'report/getEmployeesReport',
    async (credentials, { rejectWithValue }) => {

        const url = `${'http://35.179.98.1:8081'}/${''}/ExergyHRMUsers/GetAllWithCustomFieldsByUserFirm`

        try {
            // Make your API request using Axios
            const response = await axios.post(url, credentials,
                {
                    headers: {
                        Authorization: `Bearer ${window.localStorage.getItem("Exergy HRMToken")}`
                    }
                });

            // Extract the user data from the response
            const result = response.data;

            return result;
        } catch (error) {
            // If an error occurs, reject the promise with the error message
            return rejectWithValue(error.USER_MESSAGE);
        }
    }
);

export const getAttendanceReport = createAsyncThunk(
    'report/getAttendanceReport',
    async (credentials, { rejectWithValue }) => {

        const url = `${'http://35.179.98.1:8081'}/${'ExergyHRM'}/Attendances/GetAllUsersAttendancesDayWiseByFirm`

        try {
            // Make your API request using Axios
            const response = await axios.post(url, null,
                {
                    headers: {
                        Authorization: `Bearer ${window.localStorage.getItem("Exergy HRMToken")}`
                    }
                });

            // Extract the user data from the response
            const result = response.data;

            return result;
        } catch (error) {
            // If an error occurs, reject the promise with the error message
            return rejectWithValue(error.USER_MESSAGE);
        }
    }
);

export const getLeavesReport = createAsyncThunk(
    'report/getLeavesReport',
    async (credentials, { rejectWithValue }) => {

        const url = `${'http://35.179.98.1:8081'}/${'ExergyHRM'}/Leaves/GetAllByFirm`

        try {
            // Make your API request using Axios
            const response = await axios.post(url, null,
                {
                    headers: {
                        Authorization: `Bearer ${window.localStorage.getItem("Exergy HRMToken")}`
                    }
                });

            // Extract the user data from the response
            const result = response.data;

            return result;
        } catch (error) {
            // If an error occurs, reject the promise with the error message
            return rejectWithValue(error.USER_MESSAGE);
        }
    }
);

const ReportSlice = createSlice({
    name: 'report',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getReportFeatures.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getReportFeatures.fulfilled, (state, action) => {
            state.features = action.payload.DATA;
            state.loading = false;
            state.error = null;
        });
        builder.addCase(getReportFeatures.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to get data';
        });
        builder.addCase(getEmployeesReport.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getEmployeesReport.fulfilled, (state, action) => {
            state.employeeList = action.payload.DATA;
            state.loading = false;
            state.error = null;
        });
        builder.addCase(getEmployeesReport.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to get data';
        });
        builder.addCase(getAttendanceReport.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getAttendanceReport.fulfilled, (state, action) => {
            state.attendanceList = action.payload.DATA;
            state.loading = false;
            state.error = null;
        });
        builder.addCase(getAttendanceReport.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to get data';
        });
        builder.addCase(getLeavesReport.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getLeavesReport.fulfilled, (state, action) => {
            state.leaveList = action.payload.DATA;
            state.loading = false;
            state.error = null;
        });
        builder.addCase(getLeavesReport.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to get data';
        });
    },
});

// Extract the action creators
// export const { } = ReportSlice.actions;

export default ReportSlice.reducer;
