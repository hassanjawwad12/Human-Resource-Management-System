import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

const BASE_URL = import.meta.env.VITE_API_DOMAIN;
const SUB_API_NAME = import.meta.env.VITE_SUB_API_NAME;


const initialState = {
    firmData: null,
    allFirmData: [],
    loading: false,
    error: null,
    schedule: {
        workStartTime: null,
        workEndTime: null,
        selectedDays: [],
    },
};

export const getAllCountries = createAsyncThunk(
    'admin/getCountriesList',
    async (credentials, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/Countries/GetAll`;

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

export const saveFirmSchedule = createAsyncThunk(
    'admin/saveFirmSchedule',
    async (schedule, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/CompanySchedules/Save`;

        try {
            const response = await axios.post(url, schedule, {
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

export const getFirmSchedule = createAsyncThunk(
    'admin/getFirmSchedule',
    async (formData, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/CompanySchedules/GetAllByFirmId`;

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

export const getCompany = createAsyncThunk(
    'admin/getCompanyData',
    async (credentials, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/Firms/GetByUser`;
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

export const getAllByFirm = createAsyncThunk(
    'admin/getAllDataByFirm',
    async (credentials, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/FirmsBranches/GetAllByFirm`;
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

export const saveFirm = createAsyncThunk(
    'admin/saveFirm',
    async (firmData, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/Firms/Save`;
        try {
            const response = await axios.post(url, firmData, {
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem("Exergy HRMToken")}`,
                },
            });
            const result = response.data;
            if (result.SUCCESS === 1) {
                const storedData = JSON.parse(localStorage.getItem("Exergy HRMData"));
                const updatedData = {
                    ...storedData,
                    firmId: result.DATA.id,
                };
                localStorage.setItem("Exergy HRMData", JSON.stringify(updatedData));
            }
            return result;
        } catch (error) {
            return rejectWithValue(error.USER_MESSAGE);
        }
    }
);

export const saveFirmBranches = createAsyncThunk(
    'admin/saveFirmBranches',
    async (firmBranchesData, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/FirmsBranches/Save`;
        try {
            const response = await axios.post(url, firmBranchesData, {
                headers: {
                    "Authorization": `Bearer ${window.localStorage.getItem("Exergy HRMToken")}`,
                    "Access-Control-Allow-Origin": "*"
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.USER_MESSAGE);
        }
    }
);

const FirmSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setSchedule: (state, action) => {
            state.schedule = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getCompany.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getCompany.fulfilled, (state, action) => {
            state.firmData = action.payload.DATA;
            state.loading = false;
            state.error = null;
        });
        builder.addCase(getCompany.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to get data';
        });
        builder.addCase(getAllByFirm.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getAllByFirm.fulfilled, (state, action) => {
            state.allFirmData = action.payload.DATA;
            state.loading = false;
            state.error = null;
        });
        builder.addCase(getAllByFirm.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to get data';
        });
        builder.addCase(getFirmSchedule.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getFirmSchedule.fulfilled, (state, action) => {
            state.schedule = action.payload.DATA;
            state.loading = false;
            state.error = null;
        });
        builder.addCase(getFirmSchedule.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to get schedule data';
        });
    },
});

export const { setSchedule } = FirmSlice.actions;

export default FirmSlice.reducer;