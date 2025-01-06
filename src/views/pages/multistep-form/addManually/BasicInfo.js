import { Autocomplete } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getAllEmployeesData } from '../../../../store/hr/EmployeeSlice';
import { Box, Stack } from '@mui/system';
import { FormControl, MenuItem, Select } from '@mui/material';
import { TextField } from '@mui/material';
import CustomFormLabel from '../../../../components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '../../../../components/forms/theme-elements/CustomTextField';
import CustomPasswordField from '../../../../components/forms/theme-elements/CustomPasswordField';
import axios from 'axios';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
const BASE_URL = import.meta.env.VITE_API_DOMAIN;
const SUB_API_NAME = import.meta.env.VITE_SUB_API_NAME;

const BasicInfo = ({ formik }) => {
  const [employee, setEmployees] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchEmployeeID = async () => {
      try {
        const response = await axios.get(`${BASE_URL}${SUB_API_NAME}/CompanyEmployees/GetMaxId`, {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem('Exergy HRMToken')}`,
          },
        });

        formik.setFieldValue('userId', response.data.DATA);
      } catch (error) {
        console.error('Error fetching employee ID:', error);
      }
    };
    fetchEmployeeID();
  }, []);

  useEffect(() => {
    const formData = new FormData();
    formData.append('companyId', 52);
    dispatch(getAllEmployeesData(formData))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          setEmployees(result.payload.DATA);
        } else {
          console.error('Failed to fetch leave quotas:', result.payload.MESSAGE);
        }
      })
      .catch((err) => {
        console.error('An error occurred while fetching leave quotas:', err);
      });
  }, []);

  const handleEmployeeChange = (event, newValue) => {
    if (newValue) {
      formik.setFieldValue('managerId', newValue.employeeNo);
    }
  };

  return (
    <>
      <Stack direction="row" spacing={3}>
        <Box sx={{ width: '100%' }}>
          <CustomFormLabel htmlFor="userId">
            Employee ID
            <span style={{ color: 'red', fontSize: '15px' }}>*</span>
          </CustomFormLabel>
          <CustomTextField
            id="userId"
            variant="outlined"
            fullWidth
            name="userId"
            value={formik.values.userId}
            onChange={formik.handleChange}
          />
        </Box>
        <Box sx={{ width: '100%' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <CustomFormLabel htmlFor="joiningDate">
              Joining Date
              <span style={{ color: 'red', fontSize: '15px' }}>*</span>
            </CustomFormLabel>
            <DatePicker
              inputFormat="DD/MM/YY"
              value={formik.values.joiningDate}
              onChange={(value) => formik.setFieldValue('joiningDate', value)}
              renderInput={(props) => <TextField {...props} fullWidth size="medium" />}
            />
          </LocalizationProvider>
        </Box>
      </Stack>
      <Stack direction="row" spacing={3}>
        <Box sx={{ width: '100%' }}>
          <CustomFormLabel htmlFor="firstName">
            First Name
            <span style={{ color: 'red', fontSize: '15px' }}>*</span>
          </CustomFormLabel>
          <CustomTextField
            id="firstName"
            variant="outlined"
            fullWidth
            name="firstName"
            inputProps={{ autoComplete: 'off' }}
            value={formik.values.firstName}
            onChange={formik.handleChange}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
          />
        </Box>

        <Box sx={{ width: '100%' }}>
          <CustomFormLabel htmlFor="lastName">Last Name</CustomFormLabel>
          <CustomTextField
            id="lastName"
            variant="outlined"
            fullWidth
            name="lastName"
            inputProps={{ autoComplete: 'off' }}
            value={formik.values.lastName}
            onChange={formik.handleChange}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
          />
        </Box>
      </Stack>

      <Stack direction="row" spacing={3}>
        <Box sx={{ width: '100%' }}>
          <CustomFormLabel htmlFor="email">
            Email Address
            <span style={{ color: 'red', fontSize: '15px' }}>*</span>
          </CustomFormLabel>
          <CustomTextField
            id="email"
            variant="outlined"
            fullWidth
            name="email"
            inputProps={{ autoComplete: 'off' }}
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            autoComplete="off" // Turn off autofill
          />
        </Box>
        <Box sx={{ width: '100%' }}>
          <CustomFormLabel htmlFor="password">
            Password
            <span style={{ color: 'red', fontSize: '15px' }}>*</span>
          </CustomFormLabel>
          <CustomPasswordField
            id="password"
            variant="outlined"
            fullWidth
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            autoComplete="off" 
          />
        </Box>
      </Stack>

      <Stack direction="row" spacing={3}>
        <Box sx={{ width: '100%' }}>
          <CustomFormLabel htmlFor="contactNo">
            Contact Number
            <span style={{ color: 'red', fontSize: '15px' }}>*</span>
          </CustomFormLabel>
          <CustomTextField
            id="contactNo"
            variant="outlined"
            fullWidth
            type="number"
            inputProps={{ autoComplete: 'off' }}
            name="contactNo"
            value={formik.values.contactNo}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            error={formik.touched.contactNo && Boolean(formik.errors.contactNo)}
            helperText={formik.touched.contactNo && formik.errors.contactNo}
          />
        </Box>

        <Box sx={{ width: '100%' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <CustomFormLabel htmlFor="joiningDate">
              Date of Birth
              <span style={{ color: 'red', fontSize: '15px' }}>*</span>
            </CustomFormLabel>
            <DatePicker
              inputFormat="DD/MM/YY"
              value={formik.values.DOB}
              onChange={(value) => formik.setFieldValue('DOB', value)}
              renderInput={(props) => <TextField {...props} fullWidth size="medium" />}
            />
          </LocalizationProvider>
        </Box>
      </Stack>
      <Stack direction="row" spacing={3}>
        <Box sx={{ width: '100%' }}>
          <CustomFormLabel htmlFor="BloodGroup">
            Blood Group
            <span style={{ color: 'red', fontSize: '15px' }}>*</span>
          </CustomFormLabel>
          <CustomTextField
            id="BloodGroup"
            variant="outlined"
            fullWidth
            name="BloodGroup"
            value={formik.values.BloodGroup}
            onChange={formik.handleChange}
          />
        </Box>
        <Box sx={{ width: '100%' }}>
          <CustomFormLabel htmlFor="Gender">
            Gender
            <span style={{ color: 'red', fontSize: '15px' }}>*</span>
          </CustomFormLabel>

          <FormControl fullWidth variant="outlined">
            <Select
              labelId="gender-select-label"
              id="Gender"
              name="genderID"
              value={formik.values.genderId}
              onChange={(event) => {
                formik.setFieldValue('genderId', event.target.value);
              }}
            >
              <MenuItem value={1}>Male</MenuItem>
              <MenuItem value={2}>Female</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Stack>
      <Stack direction="row" spacing={3}>
        <Box sx={{ width: '49%' }}>
          <CustomFormLabel htmlFor="firstName">
            Line Manager
          </CustomFormLabel>

          <Autocomplete
            options={employee}
            className="w-full bg-white text-white rounded-lg"
            getOptionLabel={(option) => option.fullName}
            onChange={handleEmployeeChange}
            renderInput={(params) => (
              <TextField
                {...params}
                className="px-2 w-full"
                placeholder="Search Employee"
                variant="outlined"
              />
            )}
          />
        </Box>
      </Stack>
    </>
  );
};

export default BasicInfo;
