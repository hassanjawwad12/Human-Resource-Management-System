// SignupSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../utils/axios';

const BASE_URL = import.meta.env.VITE_API_DOMAIN;
const SUB_API_NAME = import.meta.env.VITE_SUB_API_NAME;

const initialState = {
    otpExpTime: 0,
    loading: false,
    error: null,
};

export const signupUser = createAsyncThunk(
    'auth/signup',
    async (credentials, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/Users/Signup`;

        try {
            const response = await axios.post(url, credentials);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.USER_MESSAGE);
        }
    }
);

export const verifyCode = createAsyncThunk(
    'auth/verify',
    async (credentials, { rejectWithValue }) => {
        const url = `${BASE_URL}${SUB_API_NAME}/Users/OTPVerification`;

        try {
            const response = await axios.post(url, credentials);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.USER_MESSAGE);
        }
    }
);

export const resendOTP = createAsyncThunk(
    'auth/resendOTP',
    async (credentials, { rejectWithValue }) => {
        const formData = new FormData();
        formData.append("uUID", credentials);

        const url = `${BASE_URL}${SUB_API_NAME}/Users/ResendOTPVerification`;

        try {
            const response = await axios.post(url, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.USER_MESSAGE);
        }
    }
);

const SignupSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setOTPExpTime: (state, action) => {
            state.otpExpTime = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(signupUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(signupUser.fulfilled, (state) => {
            state.loading = false;
            state.error = null;
        });
        builder.addCase(signupUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to signup';
        });
    },
});

export const { setOTPExpTime } = SignupSlice.actions;

export default SignupSlice.reducer;