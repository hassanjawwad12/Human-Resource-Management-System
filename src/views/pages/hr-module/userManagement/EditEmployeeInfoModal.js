import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  MenuItem,
  Select,
  InputAdornment,
  TextField,
  Autocomplete,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CustomTextField from '../../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../../components/forms/theme-elements/CustomFormLabel';
import CountrySelect from '../../admin-module/firmManagement/CountrySelector';
import { addNewEmployee } from '../../../../store/hr/EmployeeSlice';
import AlertMessage from '../../../../components/shared/AlertMessage';
import UploadAvatar from '../../../apps/user-profile/UploadAvatar';
import { updateProfileImageByUser } from '../../../../store/auth/userProfile/ProfileSlice';
import { AddDepartment, AddDesignation } from '../../multistep-form/addManually/RoleAndStatus';
import dayjs from 'dayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FormControl } from '@mui/material';
import { getAllEmployeesData } from '../../../../store/hr/EmployeeSlice';

const validationSchema = Yup.object({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  contactNo: Yup.string()
    .required('Contact No is required')
    .min(7, 'Too Short!')
    .max(15, 'Too Long!'),
  cnicNo: Yup.string().required('National ID is required'),
  countryId: Yup.object().nullable().required('Country is Required'),
  departmentId: Yup.number().required('Department is required'),
  designationId: Yup.number().required('Designation is required'),
});

export default function EditEmployeeInfoModal({
  open,
  setOpen,
  selectedEmployee,
  setChangesCount,
  firmId,
  countryList,
  departments,
  designations,
  setItemAdded,
}) {
  const dispatch = useDispatch();
  const [addDepartmentOpen, setAddDepartmentOpen] = useState(false);
  const [addDesignationOpen, setAddDesignationOpen] = useState(false);
  const [employee, setEmployees] = useState([]);
  const [alert, setAlert] = useState({
    open: false,
    severity: '',
    message: '',
  });
  const [avatarData, setAvatarData] = useState({
    preview: `http://122.248.194.140:8081/ExergyHRM/Users/GetProfileImageByFileName?fileName=${selectedEmployee.profileFileName}`,
    file: null,
  });

  const initialGender = selectedEmployee?.genderId === 1 ? 'Male' : 'Female';

  const formik = useFormik({
    initialValues: {
      firstName: selectedEmployee?.firstName || '',
      id: selectedEmployee.id || '',
      lastName: selectedEmployee?.lastName || '',
      gender: selectedEmployee?.genderId === 1 ? 'Male' : 'Female',
      email: selectedEmployee?.email || '',
      userId: selectedEmployee?.userId || '',
      dob: dayjs(selectedEmployee?.dateOfBirth, 'DD/MM/YYYY') || '',
      bloodGroup: selectedEmployee?.bloodGroup || '',
      joiningDate: selectedEmployee?.dateOfJoining || '',
      password: selectedEmployee?.password || '',
      contactNo: selectedEmployee?.contactNo || '',
      cnicNo: selectedEmployee?.cnic || '',
      countryId: countryList.find((a) => a.id === selectedEmployee.originOfPassportId),
      bankAccountNo: selectedEmployee?.bankAccount || '',
      departmentId: selectedEmployee?.departmentId || '',
      designationId: selectedEmployee?.designationId || '',
      hourlyRate: selectedEmployee?.ratePerHour || 0,
      managerId: selectedEmployee?.managerId || '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const formattedDate = dayjs(values.joiningDate).format('YYYY-MM-DD');
      const formattedDate2 = dayjs(values.dob).format('YYYY-MM-DD');

      const transformedValues = {
        companyId: firmId,
        firstName: values.firstName,
        lastName: values.lastName,
        displayName: `${values.firstName} ${values.lastName}`,
        genderId: values.gender === 'Male' ? 1 : 2,
        email: values.email,
        password: values.password,
        contactNo: values.contactNo,
        dateOfBirth: formattedDate2,
        bloodGroup: values.bloodGroup,
        dateOfJoining: formattedDate,
        originOfPassportId: values.countryId?.id || 0,
        cnicNo: values.cnicNo,
        bankAccount: values.bankAccountNo,
        departmentId: values.departmentId || 0,
        designationId: values.designationId || 0,
        hourlyRate: values.hourlyRate,
        userId: values.userId || 0,
        isActive: selectedEmployee?.isActive || 1,
        managerId: values.managerId || 0,
      };

      let formdata = new FormData();

      let formDataImg = new FormData();

      formDataImg.append('file', avatarData.file);
      formDataImg.append('userId', selectedEmployee.userId);

      for (const key in transformedValues) {
        formdata.append(key, transformedValues[key]);
      }
      dispatch(updateProfileImageByUser(formDataImg))
        .then((result) => {
          if (result.payload.SUCCESS === 1) {
          } else {
            setFormSubmiting(false);
            setAlert({
              open: true,
              severity: 'error',
              message: result.payload,
            });
          }
        })
        .catch((err) => {
          setFormSubmiting(false);
          setAlert({
            open: true,
            severity: 'error',
            message: err.USER_MESSAGE || 'Something went wrong.',
          });
        });
      dispatch(addNewEmployee(formdata))
        .then((result) => {
          if (result.payload.SUCCESS === 1) {
            setAlert({
              open: true,
              severity: 'success',
              message: 'Employee information has been edited',
            });
            setChangesCount((prev) => prev + 1);
            toast.success('Employee saved successfully');
            handleClose();
          } else {
            setAlert({
              open: true,
              severity: 'error',
              message: result.payload,
            });
            toast.error('Employeee save failed');
          }
        })
        .catch((err) => {
          console.log(err);
          setAlert({
            open: true,
            severity: 'error',
            message: err.USER_MESSAGE || "Couldn't edit employee. Please try again.",
          });
        });
    },
  });

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

  const handleClose = () => {
    setOpen(false);
    formik.resetForm();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth={'md'}>
        <AlertMessage
          open={alert.open}
          setAlert={setAlert}
          severity={alert.severity}
          message={alert.message}
        />
        <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white' }}>
          Edit {selectedEmployee.fullName}'s Information
        </DialogTitle>

        {
          <form onSubmit={formik.handleSubmit}>
            <DialogContent>
              {addDepartmentOpen && (
                <AddDepartment
                  firmId={firmId}
                  setAddDepartment={setAddDepartmentOpen}
                  setItemAdded={setItemAdded}
                  edit={true}
                />
              )}

              {addDesignationOpen && (
                <AddDesignation
                  firmId={firmId}
                  setAddDesignation={setAddDesignationOpen}
                  setItemAdded={setItemAdded}
                  edit={true}
                />
              )}
              <Stack>
                <Stack direction="row" spacing={3}>
                  <Box className="flex items-end " sx={{ width: '10%' }}>
                    <UploadAvatar
                      avatarData={avatarData}
                      setAvatarData={setAvatarData}
                      h={70}
                      w={70}
                    />
                  </Box>
                  <Box sx={{ width: '33%' }}>
                    <CustomFormLabel htmlFor="firstName">
                      First Name<span style={{ color: 'red', fontSize: '15px' }}>*</span>
                    </CustomFormLabel>
                    <CustomTextField
                      id="firstName"
                      name="firstName"
                      fullWidth
                      {...formik.getFieldProps('firstName')}
                      error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                      helperText={formik.touched.firstName && formik.errors.firstName}
                    />
                  </Box>
                  <Box sx={{ width: '33%' }}>
                    <CustomFormLabel htmlFor="lastName">Last Name</CustomFormLabel>
                    <CustomTextField
                      id="lastName"
                      name="lastName"
                      fullWidth
                      {...formik.getFieldProps('lastName')}
                      error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                      helperText={formik.touched.lastName && formik.errors.lastName}
                    />
                  </Box>
                  <Box sx={{ width: '33%' }}>
                    <CustomFormLabel htmlFor="userId">Employee ID</CustomFormLabel>
                    <CustomTextField
                      id="userId"
                      name="userId"
                      fullWidth
                      {...formik.getFieldProps('userId')}
                    />
                  </Box>
                </Stack>

                <Stack direction="row" spacing={3}>
                  <Box sx={{ width: '33%' }}>
                    <CustomFormLabel htmlFor="email">
                      Email<span style={{ color: 'red', fontSize: '15px' }}>*</span>
                    </CustomFormLabel>
                    <CustomTextField
                      id="email"
                      name="email"
                      fullWidth
                      {...formik.getFieldProps('email')}
                      error={formik.touched.email && Boolean(formik.errors.email)}
                      helperText={formik.touched.email && formik.errors.email}
                    />
                  </Box>
                  <Box sx={{ width: '33%' }}>
                    <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
                    <CustomTextField
                      id="password"
                      name="password"
                      fullWidth
                      {...formik.getFieldProps('password')}
                      error={formik.touched.password && Boolean(formik.errors.password)}
                      helperText={formik.touched.password && formik.errors.password}
                    />
                  </Box>
                  <Box sx={{ width: '33%' }}>
                    <CustomFormLabel htmlFor="contactNo">
                      Contact No<span style={{ color: 'red', fontSize: '15px' }}>*</span>
                    </CustomFormLabel>
                    <CustomTextField
                      id="contactNo"
                      name="contactNo"
                      fullWidth
                      {...formik.getFieldProps('contactNo')}
                      error={formik.touched.contactNo && Boolean(formik.errors.contactNo)}
                      helperText={formik.touched.contactNo && formik.errors.contactNo}
                    />
                  </Box>
                </Stack>

                <Stack direction="row" spacing={3}>
                  <Box sx={{ width: '33%' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <CustomFormLabel htmlFor="dob">
                        Date of Birth
                        <span style={{ color: 'red', fontSize: '15px' }}>*</span>
                      </CustomFormLabel>
                      <DatePicker
                        inputFormat="DD/MM/YYYY"
                        value={formik.values.dob}
                        onChange={(value) => formik.setFieldValue('dob', value)}
                        renderInput={(props) => <TextField {...props} fullWidth size="medium" />}
                      />
                    </LocalizationProvider>
                  </Box>
                  <Box sx={{ width: '33%' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <CustomFormLabel htmlFor="joiningDate">
                        Joining Date
                        <span style={{ color: 'red', fontSize: '15px' }}>*</span>
                      </CustomFormLabel>
                      <DatePicker
                        inputFormat="DD/MM/YYYY"
                        value={formik.values.joiningDate}
                        onChange={(value) => formik.setFieldValue('joiningDate', value)}
                        renderInput={(props) => <TextField {...props} fullWidth size="medium" />}
                      />
                    </LocalizationProvider>
                  </Box>
                  <Box sx={{ width: '33%' }}>
                    <CustomFormLabel htmlFor="bloodGroup">
                      Blood Group <span style={{ color: 'red', fontSize: '15px' }}>*</span>
                    </CustomFormLabel>
                    <CustomTextField
                      id="bloodGroup"
                      name="bloodGroup"
                      fullWidth
                      {...formik.getFieldProps('bloodGroup')}
                    />
                  </Box>
                </Stack>

                <Stack direction="row" spacing={3}>
                  <Box sx={{ width: '33%' }}>
                    <CustomFormLabel htmlFor="cnicNo">National ID</CustomFormLabel>
                    <CustomTextField
                      id="cnicNo"
                      name="cnicNo"
                      fullWidth
                      {...formik.getFieldProps('cnicNo')}
                      error={formik.touched.cnicNo && Boolean(formik.errors.cnicNo)}
                      helperText={formik.touched.cnicNo && formik.errors.cnicNo}
                    />
                  </Box>
                  <Box sx={{ width: '33%' }}>
                    <CustomFormLabel htmlFor="bankAccountNo">Bank Account No</CustomFormLabel>
                    <CustomTextField
                      id="bankAccountNo"
                      name="bankAccountNo"
                      fullWidth
                      {...formik.getFieldProps('bankAccountNo')}
                      error={formik.touched.bankAccountNo && Boolean(formik.errors.bankAccountNo)}
                      helperText={formik.touched.bankAccountNo && formik.errors.bankAccountNo}
                    />
                  </Box>
                  <Box sx={{ width: '33%' }}>
                    <CustomFormLabel htmlFor="hourlyRate">Hourly Rate</CustomFormLabel>
                    <TextField
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <strong>£</strong>
                          </InputAdornment>
                        ),
                      }}
                      inputProps={{
                        inputMode: 'decimal',
                        step: 'any',
                      }}
                      id="hourlyRate"
                      name="hourlyRate"
                      fullWidth
                      type="number"
                      {...formik.getFieldProps('hourlyRate')}
                      error={formik.touched.hourlyRate && Boolean(formik.errors.hourlyRate)}
                      helperText={formik.touched.hourlyRate && formik.errors.hourlyRate}
                    />
                  </Box>
                </Stack>

                <Stack direction="row" spacing={3}>
                  <Box sx={{ width: '33%' }}>
                    <CustomFormLabel htmlFor="countryId">Country</CustomFormLabel>
                    <CountrySelect countries={countryList} formik={formik} />
                  </Box>

                  <Box sx={{ width: '33%' }}>
                    <CustomFormLabel htmlFor="gender">
                      Gender
                      <span style={{ color: 'red', fontSize: '15px' }}>*</span>
                    </CustomFormLabel>
                    <FormControl fullWidth variant="outlined">
                      <Select
                        labelId="gender-select-label"
                        id="gender"
                        name="gender"
                        value={formik.values.gender}
                        onChange={(event) => {
                          const selectedValue = event.target.value;
                          const genderId = selectedValue === 'Male' ? 1 : 2;
                          formik.setFieldValue('gender', genderId);
                        }}
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  <Box sx={{ width: '33%' }}>
                    <CustomFormLabel htmlFor="firstName">Line Manager</CustomFormLabel>
                    <Autocomplete
                      options={employee}
                      className="w-full bg-white text-white rounded-lg"
                      getOptionLabel={(option) => option.fullName}
                      onChange={handleEmployeeChange}
                      value={employee.find((emp) => emp.id === selectedEmployee?.managerId) || null}
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

                <Stack direction="row" spacing={3}>
                  <Box sx={{ width: '50%' }}>
                    <Box className="flex items-center justify-between gap-3">
                      <CustomFormLabel htmlFor="departmentId">Department</CustomFormLabel>
                      <Typography
                        onClick={() => setAddDepartmentOpen(true)}
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          mt: 2,
                          px: '.4rem',
                          minWidth: 'auto',
                          color: 'primary.main',
                          cursor: 'pointer',
                          fontWeight: '600',
                        }}
                      >
                        + Add
                      </Typography>
                    </Box>
                    <Select
                      id="departmentId"
                      name="departmentId"
                      fullWidth
                      {...formik.getFieldProps('departmentId')}
                      error={formik.touched.departmentId && Boolean(formik.errors.departmentId)}
                    >
                      {departments.map((department) => (
                        <MenuItem key={department.id} value={department.id}>
                          {department.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.departmentId && formik.errors.departmentId && (
                      <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 1 }}>
                        {formik.errors.departmentId}
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ width: '50%' }}>
                    <Box className="flex items-center justify-between gap-3">
                      <CustomFormLabel htmlFor="departmentId">Designation</CustomFormLabel>
                      <Typography
                        onClick={() => setAddDesignationOpen(true)}
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          mt: 2,
                          px: '.4rem',
                          minWidth: 'auto',
                          color: 'primary.main',
                          cursor: 'pointer',
                          fontWeight: '600',
                        }}
                      >
                        + Add
                      </Typography>
                    </Box>
                    <Select
                      id="designationId"
                      name="designationId"
                      fullWidth
                      {...formik.getFieldProps('designationId')}
                      error={formik.touched.designationId && Boolean(formik.errors.designationId)}
                    >
                      {designations.map((designation) => (
                        <MenuItem key={designation.id} value={designation.id}>
                          {designation.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.designationId && formik.errors.designationId && (
                      <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 1 }}>
                        {formik.errors.designationId}
                      </Box>
                    )}
                  </Box>
                </Stack>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', mx: 1, p: 2 }}>
              <Button
                variant="outlined"
                onClick={handleClose}
                sx={{ mr: 1, color: 'primary.main !important', bgcolor: '#fff !important' }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Save Changes
              </Button>
            </DialogActions>
          </form>
        }
      </Dialog>
    </>
  );
}
