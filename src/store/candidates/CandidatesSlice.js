import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';
import { data } from '../../views/pages/multistep-form/addbySearch/Data';

const BASE_URL = import.meta.env.VITE_API_DOMAIN;
const SUB_API_NAME = import.meta.env.VITE_SUB_API_NAME;

const initialState = {
    allCandidatesList: [],
    selectedCandidatesList: [],
    selectedCandidate: {},
    loading: false,
    error: null,
};

// Thunks for various API calls
export const getUsersWithUpcomingSchedule = createAsyncThunk(
    'candidates/getUsersWithUpcomingSchedule',
    async (companyId, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/CandidateSchedule/GetAllByUsersWithUpcomingSchedule`;

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

export const getAllEmployeesByCompany = createAsyncThunk(
    'candidates/getAllEmployeesByCompany',
    async (_, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/CompanyEmployees/GetAllEmployeesByCompany`;

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

const CandidatesSlice = createSlice({
    name: 'candidates',
    initialState,
    reducers: {
        addAllCandidates: (state, action) => {
            state.allCandidatesList = action.payload
        },
        setSelectedCandidate: (state, action) => {
            state.selectedCandidate = action.payload;
        },
        addSelectedCandidates: (state, action) => {
            state.selectedCandidatesList = state.allCandidatesList.filter((emp) => action.payload.includes(emp.id));
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUsersWithUpcomingSchedule.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUsersWithUpcomingSchedule.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedCandidatesList = action.payload.DATA;
                state.error = null;
            })
            .addCase(getUsersWithUpcomingSchedule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to get users with upcoming schedule';
            })
            .addCase(getAllEmployeesByCompany.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllEmployeesByCompany.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedCandidatesList = action.payload.DATA;
                state.error = null;
            })
            .addCase(getAllEmployeesByCompany.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to get all employees by company';
            });
    },
});

export const { setSelectedCandidate, addSelectedCandidates, addAllCandidates } = CandidatesSlice.actions;

export default CandidatesSlice.reducer;