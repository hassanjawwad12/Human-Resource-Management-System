import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import CustomCheckbox from '../../../components/forms/theme-elements/CustomCheckbox';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import logo from 'src/assets/images/backgrounds/Exergy Systems-logo.png'
import { useFormik } from 'formik';
import * as yup from 'yup';
import { loginUser } from '../../../store/auth/login/LoginSlice';
import { useDispatch } from 'react-redux';
import AlertMessage from '../../../components/shared/AlertMessage';
import CustomPasswordField from '../../../components/forms/theme-elements/CustomPasswordField';

const validationSchema = yup.object({
  email: yup.string('Enter your email').email('Enter a valid email').required('Email is required'),
  password: yup
    .string('Enter your password')
    .required('Password is required')
});

const AuthLogin = ({ title, subtitle, subtext }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    open: false,
    severity: '',
    message: ''
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      localStorage.setItem('password', values.password);
      dispatch(loginUser(values))
        .then((result) => {
          if (result.payload.SUCCESS === 1) {
            setAlert({
              open: true,
              severity: 'success',
              message: 'Login successful'
            })
            const user= result.payload.DATA

            if(!user.isCompanyProfileCompleted)
            {
              navigate("/dashboards/employee");
            }
            else 
            {
              navigate("/dashboards/employee");
            }
       
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
            message: 'Something went wrong.'
          })
        });
    },
  });
  return (
    <>
      <AlertMessage open={alert.open} setAlert={setAlert} severity={alert.severity} message={alert.message} />
      <Box className='flex justify-center mb-[2.5rem]'>
        <img src={logo} className='w-[300px]' />
      </Box>
      {subtext}
      <form onSubmit={formik.handleSubmit}>
        <Stack>
          <Box>
            <CustomFormLabel htmlFor="email">Email</CustomFormLabel>
            <CustomTextField
              s
              variant="outlined"
              fullWidth
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Box>
          <Box>
            <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
            <CustomPasswordField
              variant="outlined"
              fullWidth
              id="password"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Box>
          <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
            <FormGroup>
              <FormControlLabel
                control={<CustomCheckbox defaultChecked />}
                label="Remember this Device"
              />
            </FormGroup>
            <Typography
              component={Link}
              to="/auth/forgot-password"
              fontWeight="500"
              sx={{
                textDecoration: 'none',
                color: 'primary.main',
              }}
            >
              Forgot Password ?
            </Typography>
          </Stack>
        </Stack>
        <Box mt={2}>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit"
          >
            Sign In
          </Button>
        </Box>
      </form>
      {subtitle}
    </>
  )
};

export default AuthLogin;
