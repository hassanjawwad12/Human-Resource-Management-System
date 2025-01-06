import React, { useState } from 'react';
import {
  Paper,
  Stack,
  Typography,
  IconButton,
  Collapse,
  TextField,
  Grid,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { EmployeeProfilingSurvey } from '../../../store/hr/EmployeeSlice';
import AlertMessage from '../../../components/shared/AlertMessage';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FormControl, MenuItem, Select } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const user = JSON.parse(localStorage.getItem('Exergy HRMData'));
const pwd = localStorage.getItem('password');
const validationSchema = Yup.object({
  firstName: Yup.string().required('Full Name is required'),
  lastName: Yup.string().required('Full Name is required'),
  genderId: Yup.string().required('Gender is required'),
  dateOfBirth: Yup.date().required('Date of Birth is required'),
  bankAccount: Yup.string().required('Bank Account Number is required'),
  bloodGroup: Yup.string().required('Blood Group is required'),
  personalEmail: Yup.string().email('Invalid email address').required('Personal Email is required'),
  cnicNo: Yup.string().required('CNIC Number is required'),
  contactNo: Yup.string().required('Contact Number is required'),
  emergencyNo: Yup.string().required('Emergency Number is required'),
  currentAddress: Yup.string().required('Current Address is required'),
  homeAddress: Yup.string().required('Home Address is required'),
  totalExperience: Yup.string().required('Total Experience is required'),
  additionalSkills: Yup.string().required('Additional Skills are required'),
  languageInterests: Yup.string().required('Programming Language Interests are required'),
  strongestLanguage: Yup.string().required('Strongest Programming Language is required'),
  university: Yup.string().required('University Name is required'),
  lastEducationalDegree: Yup.string().required('Last Educational Degree is required'),
});

const initialValues = {
  userId: user?.employeeId,
  companyId: 52,
  email: user?.email,
  password: pwd,
  newUser: 1,
  firstName: '',
  lastName: '',
  genderId: 1,
  dateOfBirth: null,
  bankAccount: '',
  bloodGroup: '',
  personalEmail: '',
  cnicNo: '',
  contactNo: '',
  emergencyNo: '',
  currentAddress: '',
  homeAddress: '',
  totalExperience: '',
  additionalSkills: '',
  languageInterests: '',
  strongestLanguage: '',
  university: '',
  lastEducationalDegree: '',
};

const GenderSelect = ({ field, form: { setFieldValue } }) => (
  <FormControl fullWidth variant="outlined">
    <Select
      labelId="gender-select-label"
      id="genderId"
      name="genderId"
      value={field.value}
      onChange={(event) => {
        setFieldValue('genderId', event.target.value);
      }}
    >
      <MenuItem value={1}>Male</MenuItem>
      <MenuItem value={2}>Female</MenuItem>
    </Select>
  </FormControl>
);

// Date of Birth field component
const DateOfBirthPicker = ({ field, form: { setFieldValue } }) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DatePicker
      label="Date of Birth"
      value={field.value}
      onChange={(value) => {
        setFieldValue('dateOfBirth', value);
      }}
      renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
    />
  </LocalizationProvider>
);

const CustomTextField = ({ field, form: { touched, errors }, ...props }) => (
  <TextField
    {...field}
    {...props}
    fullWidth
    variant="outlined"
    error={touched[field.name] && Boolean(errors[field.name])}
    helperText={touched[field.name] && errors[field.name]}
    sx={{
      '& .MuiInputLabel-root:not(.Mui-focused)': {
        color: 'gray',
      },
    }}
  />
);

const EmployeeProfiling = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState({
    p1: true,
    p2: true,
    p3: true,
  });
  const [alert, setAlert] = useState({
    open: false,
    severity: '',
    message: '',
  });

  const handleClick = (sectionId) => {
    setExpanded((prevState) => ({
      ...prevState,
      [sectionId]: !prevState[sectionId],
    }));
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log(values);

    if (values.dateOfBirth) {
      values.dateOfBirth = values.dateOfBirth.format('YYYY/MM/DD');
    }
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });

      setLoading(true);
      dispatch(EmployeeProfilingSurvey(formData))
        .then((result) => {
          if (result.payload.SUCCESS === 1) {
            setAlert({
              open: true,
              severity: 'success',
              message: result.payload.USER_MESSAGE,
            });
            setLoading(false);
          } else {
            setAlert({
              open: true,
              severity: 'error',
              message: result.payload,
            });
            setLoading(false);
          }
        })
        .catch((err) => {
          setAlert({
            open: true,
            severity: 'error',
            message: err.USER_MESSAGE || 'Something went wrong.',
          });
          setLoading(false);
        });
    } catch (error) {
      console.error(error);
      setAlert({
        open: true,
        severity: 'error',
        message: 'An unexpected error occurred.',
      });
      setLoading(false);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <AlertMessage
        open={alert.open}
        setAlert={setAlert}
        severity={alert.severity}
        message={alert.message}
      />
      {loading ? (
        <div className="w-[100%] flex flex-col h-[80vh] items-center gap-4 justify-center">
          <CircularProgress className="text-[#3f50b5]" size={100} thickness={5} />
          <Typography variant="h4" className="text-black font-bold">
            Survey is being submitted..kindly wait a while
          </Typography>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-transparent text-black py-4 mt-3">
          <Typography variant="h1" className="text-blue-600 p-2" fontWeight={700}>
            Employee Profiling Survey
          </Typography>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form style={{ width: '100%' }}>
                {console.log(props)}
                <Paper
                  style={{
                    width: '100%',
                    paddingBottom: '20px',
                    marginTop: '20px',
                    padding: '20px',
                  }}
                >
                  <Stack pt={2} direction="row" alignItems="center" justifyContent="space-between">
                    <Typography color="primary" variant="h4">
                      Personal Data <span style={{ color: 'red', fontSize: '15px' }}>*</span>
                    </Typography>
                    <IconButton onClick={() => handleClick('p1')}>
                      {expanded.p1 ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Stack>
                  <Collapse in={expanded.p1} timeout="auto" unmountOnExit>
                    <Grid container spacing={2} sx={{ my: 1 }}>
                      <Grid item xs={12} md={6}>
                        <Field
                          name="firstName"
                          label="First Name as per CNIC"
                          component={CustomTextField}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field
                          name="lastName"
                          label="Last Name as per CNIC"
                          component={CustomTextField}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ my: 1 }}>
                      <Grid item xs={12} md={6}>
                        <Field name="genderId" component={GenderSelect} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field
                          name="personalEmail"
                          label="Personal Email"
                          component={CustomTextField}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ my: 1 }}>
                      <Grid item xs={12} md={6}>
                        <Field name="bloodGroup" label="Blood Group" component={CustomTextField} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field name="cnicNo" label="CNIC Number" component={CustomTextField} />
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ my: 1 }}>
                      <Grid item xs={12} md={6}>
                        <Field name="dateOfBirth" component={DateOfBirthPicker} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field
                          name="bankAccount"
                          label="Account Number as per CNIC"
                          component={CustomTextField}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ my: 1 }}>
                      <Grid item xs={12} md={6}>
                        <Field
                          name="contactNo"
                          label="Contact Number"
                          component={CustomTextField}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field
                          name="emergencyNo"
                          label="Emergency Number"
                          component={CustomTextField}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ my: 1 }}>
                      <Grid item xs={12} md={6}>
                        <Field
                          name="currentAddress"
                          label="Current Address"
                          component={CustomTextField}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field
                          name="homeAddress"
                          label="Home Address"
                          component={CustomTextField}
                        />
                      </Grid>
                    </Grid>
                  </Collapse>
                </Paper>

                <Paper
                  style={{
                    width: '100%',
                    paddingBottom: '20px',
                    marginTop: '20px',
                    padding: '20px',
                  }}
                >
                  <Stack pt={2} direction="row" alignItems="center" justifyContent="space-between">
                    <Typography color="primary" variant="h4">
                      Educational Data <span style={{ color: 'red', fontSize: '15px' }}>*</span>
                    </Typography>
                    <IconButton onClick={() => handleClick('p2')}>
                      {expanded.p2 ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Stack>
                  <Collapse in={expanded.p2} timeout="auto" unmountOnExit>
                    <Grid container spacing={2} sx={{ my: 1 }}>
                      <Grid item xs={12} md={6}>
                        <Field
                          name="lastEducationalDegree"
                          label="Last Educational Degree"
                          component={CustomTextField}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field
                          name="university"
                          label="University Name"
                          component={CustomTextField}
                        />
                      </Grid>
                    </Grid>
                  </Collapse>
                </Paper>

                <Paper
                  style={{
                    width: '100%',
                    paddingBottom: '20px',
                    marginTop: '20px',
                    padding: '20px',
                  }}
                >
                  <Stack pt={2} direction="row" alignItems="center" justifyContent="space-between">
                    <Typography color="primary" variant="h4">
                      Professional Data <span style={{ color: 'red', fontSize: '15px' }}>*</span>
                    </Typography>
                    <IconButton onClick={() => handleClick('p3')}>
                      {expanded.p3 ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Stack>
                  <Collapse in={expanded.p3} timeout="auto" unmountOnExit>
                    <Grid container spacing={2} sx={{ my: 1 }}>
                      <Grid item xs={12} md={6}>
                        <Field
                          name="languageInterests"
                          label="Programming Language Interests"
                          component={CustomTextField}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field
                          name="strongestLanguage"
                          label="Strongest Programming Language"
                          component={CustomTextField}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ my: 1 }}>
                      <Grid item xs={12} md={6}>
                        <Field
                          name="totalExperience"
                          label="Total Experience"
                          component={CustomTextField}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field
                          name="additionalSkills"
                          label="Additional Skills"
                          component={CustomTextField}
                        />
                      </Grid>
                    </Grid>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={props.isSubmitting}
                      style={{ marginTop: '20px', float: 'right' }}
                      className="text-lg p-1"
                    >
                      Submit
                    </Button>
                  </Collapse>
                </Paper>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </>
  );
};

export default EmployeeProfiling;
