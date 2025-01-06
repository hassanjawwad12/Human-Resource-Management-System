import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Divider, Select, MenuItem, Autocomplete, TextField } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import CustomTextField from '../../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../../components/forms/theme-elements/CustomFormLabel';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Stack } from '@mui/system';
import { Formik, useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import AlertMessage from '../../../../components/shared/AlertMessage';
import Breadcrumb from '../../../../layouts/full/shared/breadcrumb/Breadcrumb';
import { createNewDesignation, getDesignationById } from '../../../../store/hr/DesignationSlice';
// import { saveHoliday } from '../../../../store/hr/HolidaySlice';

const validationSchema = yup.object({
  label: yup.string().required('Designation is Required'),
  startOnDate: yup.date().typeError("Please enter start date.").required("Start Date is Required"),
  endOnDate: yup.date().typeError("Please enter end date.").required("End Date is Required."),
});

const HolidayManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [toggle, setToggle] = useState(false);
  const [value, setValue] = React.useState('');
  const [alert, setAlert] = useState({
    open: false,
    severity: '',
    message: ''
  });
  const [designationData, setDesignationData] = useState(null);

  const formik = useFormik({
    initialValues: {
      label: '',
      description: '',
      startOnDate: '',
      endOnDate: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values, "values");

      let formData = new FormData();
      formData.append('label', values.label)
      formData.append('description', values.description)
      formData.append('startOnDate', values.startOnDate)
      formData.append('endOnDate', values.endOnDate)

      if (location?.state?.id) {
        formData.append('id', designationData.id)
      }

      dispatch(saveHoliday(formData))
        .then((result) => {

          if (result.payload.SUCCESS === 1) {
            setAlert({
              open: true,
              severity: 'success',
              message: result.payload.USER_MESSAGE
            })
          }
          else {
            setAlert({
              open: true,
              severity: 'error',
              message: result.payload
            })
          }
        })
        .catch((err) => {
          setAlert({
            open: true,
            severity: 'error',
            message: err.USER_MESSAGE || 'Something went wrong.'
          })
        });
    },
  });

  React.useEffect(() => {
    if (location?.state?.id) {
      let formData = new FormData();
      formData.append('designationId', location?.state?.id)

      dispatch(getDesignationById(formData))
        .then((result) => {

          if (result.payload.SUCCESS === 1) {
            setDesignationData(result.payload.DATA)
            formik.setValues({
              label: result.payload.DATA.label,
              description: result.payload.DATA.description
            })

            setToggle(false)
            setAlert({
              open: true,
              severity: 'success',
              message: result.payload.USER_MESSAGE || 'Holiday retrieved successfully'
            })
          }
          else {
            setAlert({
              open: true,
              severity: 'error',
              message: result.payload
            })
          }
        })
        .catch((error) => {
          setAlert({
            open: true,
            severity: 'error',
            message: error.USER_MESSAGE || 'Something went wrong.'
          })
        });
    }
  }, [])

  const BCrumb = [
    {
      to: '/hr',
      title: 'HR',
    },
    {
      title: 'Holiday Management',
    }
  ];

  return (
    <>
      <AlertMessage open={alert.open} setAlert={setAlert} severity={alert.severity} message={alert.message} />

      {/* <Breadcrumb title="Holiday Management" items={BCrumb} /> */}

      <form onSubmit={formik.handleSubmit}>
        <Box>
          <Stack mb={3}>
            <Stack direction="row" spacing={3}>
              <Box sx={{ width: "100%" }}>
                <CustomFormLabel htmlFor="label">
                  Holiday Label
                  <span style={{ color: "red", fontSize: "15px" }}>
                    *
                  </span>
                </CustomFormLabel>
                <CustomTextField id="label" variant="outlined" fullWidth
                  name="label"
                  value={formik.values.label}
                  onChange={formik.handleChange}
                  error={formik.touched.label && Boolean(formik.errors.label)}
                  helperText={formik.touched.label && formik.errors.label}
                />
              </Box>

              <Box sx={{ width: "100%" }}>
                <CustomFormLabel htmlFor="description">
                  Add Description
                  <span style={{ color: "#fff", fontSize: "15px" }}>
                    *
                  </span>
                </CustomFormLabel>
                <CustomTextField id="description" variant="outlined" fullWidth
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
              </Box>
            </Stack>

            <Stack direction="row" spacing={3}>
              <Box sx={{ width: "100%" }}>
                <CustomFormLabel htmlFor="startOnDate">
                  Start Date
                  <span style={{ color: "red", fontSize: "15px" }}>
                    *
                  </span>
                </CustomFormLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={formik.values.startOnDate}
                    onChange={(newValue) => formik.setFieldValue('startOnDate', newValue)}
                    renderInput={(props) =>
                      <CustomTextField
                        {...props}
                        fullWidth
                        error={formik.touched.startOnDate && Boolean(formik.errors.startOnDate)}
                        helperText={formik.touched.startOnDate && formik.errors.startOnDate}
                      />
                    }

                  />
                </LocalizationProvider>
              </Box>

              <Box sx={{ width: "100%" }}>
                <CustomFormLabel htmlFor="endOnDate">
                  End Date
                  <span style={{ color: "red", fontSize: "15px" }}>
                    *
                  </span>
                </CustomFormLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={formik.values.endOnDate}
                    onChange={(newValue) => formik.setFieldValue('endOnDate', newValue)}
                    renderInput={(props) =>
                      <CustomTextField
                        {...props}
                        fullWidth
                        error={formik.touched.endOnDate && Boolean(formik.errors.endOnDate)}
                        helperText={formik.touched.endOnDate && formik.errors.endOnDate}

                      />
                    }

                  />
                </LocalizationProvider>
              </Box>
            </Stack>
          </Stack>

          <Stack direction='row' justifyContent='space-between' alignItems='center'>
            <Button
              onClick={() => navigate('/hr/holidayList')}
              sx={{ bgcolor: '#fff !important', color: 'primary.main !important' }}
              color="primary"
              variant="outlined"
              size="large"
            >
              View
            </Button>

            <Button
              color="primary"
              variant="contained"
              size="large"
              type='submit'
            >
              {location?.state?.id ? 'Update' : 'Save'}
            </Button>
          </Stack>
        </Box>
      </form>
    </>
  )
};

export default HolidayManagement;
