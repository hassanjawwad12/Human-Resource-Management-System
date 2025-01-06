import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';


const BASE_URL = import.meta.env.VITE_API_DOMAIN;
const SUB_API_NAME = import.meta.env.VITE_SUB_API_NAME;


const initialState = {
  employeesList: [],
  loading: false,
  error: null,
  weeksOfMonth: [],
  upcomingMonths: [],
  selectedEmployeeId: null, 
};


// Thunks for various API calls
export const getUsersByFirm = createAsyncThunk(
  'hr/getUsersByFirm',
  async (credentials, { rejectWithValue }) => {
    const url = `${BASE_URL}${SUB_API_NAME}/Users/GetUsersDropDownByFirm`;


    try {
      const response = await axios.post(url, null, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('Exergy HRMToken')}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.USER_MESSAGE);
    }
  },
);


export const getBranchesByFirm = createAsyncThunk(
  'hr/getBranchesByFirm',
  async (credentials, { rejectWithValue }) => {
    const url = `${BASE_URL}${SUB_API_NAME}/Users/GetFirmBranchesDropdownByFirm`;


    try {
      const response = await axios.post(url, null, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('Exergy HRMToken')}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.USER_MESSAGE);
    }
  },
);


export const getDepartmantsByFirm = createAsyncThunk(
  'hr/getDepartmantsByFirm',
  async (credentials, { rejectWithValue }) => {
    const url = `${BASE_URL}${SUB_API_NAME}/FirmsDepartments/GetAllByFirmId`;


    try {
      const response = await axios.post(url, credentials, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('Exergy HRMToken')}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.USER_MESSAGE);
    }
  },
);


export const getDesignationsByFirm = createAsyncThunk(
  'hr/getDesignationsByFirm',
  async (credentials, { rejectWithValue }) => {
    const url = `${BASE_URL}${SUB_API_NAME}/FirmsDesignations/GetAllByFirmId`;


    try {
      const response = await axios.post(url, credentials, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('Exergy HRMToken')}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.USER_MESSAGE);
    }
  },
);


export const getWeeksOfMonth = createAsyncThunk(
  'hr/getWeeksOfMonth',
  async (yearAndMonth, { rejectWithValue }) => {
    const url = `${BASE_URL}${SUB_API_NAME}/Weekdays/GetWeeksOfMonth`;


    try {
      const response = await axios.post(url, yearAndMonth, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('Exergy HRMToken')}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.USER_MESSAGE || 'Something went wrong.');
    }
  },
);


export const getUpcomingMonths = createAsyncThunk(
  'hr/getUpcomingMonths',
  async (_, { rejectWithValue }) => {
    const url = `${BASE_URL}${SUB_API_NAME}/Weekdays/GetUpcomingMonths`;


    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('Exergy HRMToken')}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.USER_MESSAGE || 'Something went wrong.');
    }
  },
);


export const addNewEmployee = createAsyncThunk(
  'hr/addNewEmployee',
  async (employeeData, { rejectWithValue }) => {
    const url = `${BASE_URL}${SUB_API_NAME}/CompanyEmployees/Save`;


    try {
      const response = await axios.post(url, employeeData, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('Exergy HRMToken')}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.USER_MESSAGE);
    }
  },
);
export const getEmployeeHierarchy = createAsyncThunk(
  'hr/addNewEmployee',
  async (employeeData, { rejectWithValue }) => {
    const url = `${BASE_URL}${SUB_API_NAME}/hierarchy/getAll`;


    try {
      const response = await axios.post(url, employeeData, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('Exergy HRMToken')}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.USER_MESSAGE);
    }
  },
);
export const saveEmployeeHierarchy = createAsyncThunk(
  'hr/addNewEmployee',
  async (employeeData, { rejectWithValue }) => {
    const url = `${BASE_URL}${SUB_API_NAME}/hierarchy/saveAll`;


    try {
      const response = await axios.post(url, employeeData, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('Exergy HRMToken')}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.USER_MESSAGE);
    }
  },
);


export const MarkCompanyProfileCompleted = createAsyncThunk(
  'hr/updateProfileCompleted',
  async (employeeData, { rejectWithValue }) => {
    const url = `${BASE_URL}${SUB_API_NAME}/Users/UpdateCompanyProfileCompletedByUser`;


    try {
      const response = await axios.post(url, null, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('Exergy HRMToken')}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.USER_MESSAGE);
    }
  },
);


export const getAllEmployeesData = createAsyncThunk(
  'hr/getAllEmployeesData',
  async (credentials, { rejectWithValue }) => {
    const url = `${BASE_URL}${SUB_API_NAME}/CompanyEmployees/GetAllEmployeesByCompany`;

    try {
      const response = await axios.post(url, credentials, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('Exergy HRMToken')}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.USER_MESSAGE);
    }
  },
);


export const getEmployeeById = createAsyncThunk(
  'hr/getEmployeeById',
  async (credentials, { rejectWithValue }) => {
    const url = `${BASE_URL}${SUB_API_NAME}/Users/GetWithCustomFieldsById`;


    try {
      const response = await axios.post(url, credentials, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('Exergy HRMToken')}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.USER_MESSAGE);
    }
  },
);


export const updateEmployeeData = createAsyncThunk(
  'hr/updateEmployeeData',
  async (credentials, { rejectWithValue }) => {
    const url = `${BASE_URL}${SUB_API_NAME}/Users/Save`;


    try {
      const response = await axios.post(url, credentials, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('Exergy HRMToken')}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.USER_MESSAGE);
    }
  },
);

//employee Profiling Data
//SURVEY DETAILS
export const EmployeeProfilingSurvey = createAsyncThunk(
  'attendance/getSurveyDetails',
  async (data, { rejectWithValue }) => {
    const url = `${BASE_URL}${SUB_API_NAME}/CompanyEmployees/Save`;

    try {
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('Exergy HRMToken')}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.USER_MESSAGE);
    }
  },
);

const EmployeeSlice = createSlice({
  name: 'hr',
  initialState,
  reducers: {
    setSelectedEmployeeId: (state, action) => {
      state.selectedEmployeeId = action.payload; 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllEmployeesData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllEmployeesData.fulfilled, (state, action) => {
        state.employeesList = action.payload.DATA;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAllEmployeesData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to get data';
      })
      .addCase(getWeeksOfMonth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWeeksOfMonth.fulfilled, (state, action) => {
        state.weeksOfMonth = action.payload.DATA;
        state.loading = false;
        state.error = null;
      })
      .addCase(getWeeksOfMonth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to get data';
      })
      .addCase(getUpcomingMonths.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUpcomingMonths.fulfilled, (state, action) => {
        state.upcomingMonths = action.payload.DATA;
        state.loading = false;
        state.error = null;
      })
      .addCase(getUpcomingMonths.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to get data';
      })
      .addCase(addNewEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Add logic to handle successful addition of a new employee if needed
      })
      .addCase(addNewEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add a new employee';
      });
  },
});

export const { setSelectedEmployeeId } = EmployeeSlice.actions; 
export default EmployeeSlice.reducer;


