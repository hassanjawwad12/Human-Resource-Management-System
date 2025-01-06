// UserRightsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

const initialState = {
    userFeatures: [],
    usersList: [],
    loading: false,
    error: null,
};

export const getUsers = createAsyncThunk(
    'hr/getUsers',
    async (credentials, { rejectWithValue }) => {

        const url = `${'http://35.179.98.1:8081'}/${'ExergyHRM'}/Users/GetUsersDropDownByFirm`

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

export const getUserFeatures = createAsyncThunk(
    'hr/getUserFeatures',
    async (credentials, { rejectWithValue }) => {

        const url = `${'http://35.179.98.1:8081'}/${'ExergyHRM'}/UsersFeatures/GetAllGroupedFeaturesWithSelectionByUserId`

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

export const saveFeatures = createAsyncThunk(
    'hr/saveFeatures',
    async (credentials, { rejectWithValue }) => {

        const url = `${'http://35.179.98.1:8081'}/${'ExergyHRM'}/UsersFeatures/Save`

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

const UserRightsSlice = createSlice({
    name: 'hr',
    initialState,
    reducers: {
        updatePermissions: (state, action) => {
            const { moduleId, featureId, checked } = action.payload;

            const data = state.userFeatures;

            let module = data.find((obj) => obj.id === moduleId)
            let feature = module.features.find((obj2) => obj2.id === featureId)

            feature.isChecked = checked === 1 ? 0 : 1;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getUsers.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getUsers.fulfilled, (state, action) => {
            state.usersList = action.payload.DATA;
            state.loading = false;
            state.error = null;
        });
        builder.addCase(getUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to get data';
        });
        builder.addCase(getUserFeatures.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getUserFeatures.fulfilled, (state, action) => {
            state.userFeatures = action.payload.DATA;
            state.loading = false;
            state.error = null;
        });
        builder.addCase(getUserFeatures.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to get data';
        });
    },
});

// Extract the action creators
export const { updatePermissions } = UserRightsSlice.actions;

export default UserRightsSlice.reducer;
