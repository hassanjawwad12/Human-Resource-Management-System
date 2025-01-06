import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

const BASE_URL = import.meta.env.VITE_API_DOMAIN;
const SUB_API_NAME = import.meta.env.VITE_SUB_API_NAME;

const initialState = {
    loading: false,
    error: null,
};

// Thunks for various API calls
export const getAllAvailableEmployeesByCompany = createAsyncThunk(
    'rota/getAllAvailableEmployeesByCompany',
    async (companyId, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/CompanyEmployees/GetAllAvailableEmployeesByCompany`;

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

export const saveCompanyShifts = createAsyncThunk(
    'rota/saveCompanyShifts',
    async (shiftData, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/CompanyShifts/Save`;

        try {
            const response = await axios.post(url, shiftData, {
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

export const saveShiftEmployee = createAsyncThunk(
    'rota/saveShiftEmployee',
    async (shiftData, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/CompanyShifts/SaveShiftEmployee`;

        try {
            const response = await axios.post(url, shiftData, {
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

export const updateShiftNameAndDescriptionById = createAsyncThunk(
    'rota/updateShiftNameAndDescriptionById',
    async (shiftData, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/CompanyShifts/UpdateShiftNameAndDescriptionById`;

        try {
            const response = await axios.post(url, shiftData, {
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

export const updateAndDeleteShiftEmployee = createAsyncThunk(
    'rota/UpdateAndDeleteShiftEmployee',
    async (shiftData, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/CompanyShifts/UpdateAndDeleteShiftEmployee`;

        try {
            const response = await axios.post(url, shiftData, {
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

export const getAllShiftsByCompanyId = createAsyncThunk(
    'rota/getAllShiftsByCompanyId',
    async (companyId, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/CompanyShifts/GetAllShiftsByCompanyId`;

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

export const getAllActiveShiftsByCompanyId = createAsyncThunk(
    'rota/getAllActiveShiftsByCompanyId',
    async (companyId, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/CompanyShifts/GetAllActiveShiftsByCompanyId`;

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

export const updateShiftById = createAsyncThunk(
    'rota/updateShiftById',
    async (data, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/CompanyShifts/UpdateShiftById`;

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

export const updateShiftArchivedStatusById = createAsyncThunk(
    'rota/UpdateShiftArchivedStatusById',
    async (data, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/CompanyShifts/UpdateShiftArchivedStatusById`;

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
export const getAllArchivedShiftsByCompanyId = createAsyncThunk(
    'rota/getAllArchivedShiftsByCompanyId',
    async (data, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/CompanyShifts/GetAllArchivedShiftsByCompanyId`;

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

export const cloneShiftByIdAndEmployeeIds = createAsyncThunk(
    'rota/cloneShiftByIdAndEmployeeIds',
    async (data, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/CompanyShifts/CloneShiftByIdAndEmployeeIds`;

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

export const UpdateShiftStatusById = createAsyncThunk(
    'rota/UpdateShiftStatusById',
    async (data, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/CompanyShifts/UpdateShiftStatusById`;

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

export const deleteEmployeeShiftById = createAsyncThunk(
    'rota/DeleteEmployeeShiftById',
    async (data, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/CompanyShifts/DeleteEmployeeShiftById`;

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

const RotaSlice = createSlice({
    name: 'rota',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllAvailableEmployeesByCompany.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllAvailableEmployeesByCompany.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(getAllAvailableEmployeesByCompany.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to get all available employees by company';
            })
            .addCase(saveCompanyShifts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(saveCompanyShifts.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(saveCompanyShifts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to save company shifts';
            })
            .addCase(getAllShiftsByCompanyId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllShiftsByCompanyId.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(getAllShiftsByCompanyId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to get all shifts by company ID';
            });
    },
});

export default RotaSlice.reducer;