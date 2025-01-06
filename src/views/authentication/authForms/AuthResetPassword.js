import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { Box, Button, Stack, FormGroup, FormControlLabel, Typography } from '@mui/material';

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import CustomCheckbox from '../../../components/forms/theme-elements/CustomCheckbox';
import { useDispatch } from 'react-redux';
import { updatePassword } from '../../../store/auth/login/LoginSlice';
import AlertMessage from '../../../components/shared/AlertMessage';
import CustomPasswordField from '../../../components/forms/theme-elements/CustomPasswordField';

const validationSchema = yup.object({
    password: yup
        .string('Enter your password')
        .min(8, 'Password should be of minimum 8 characters length')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        )
        .required('Password is required'),
    confirmPassword: yup.string().when('password', {
        is: (val) => (val && val.length > 0 ? true : false),
        then: yup.string().required('Confirm password is required').oneOf([yup.ref('password')], 'Both password need to be the same')
    }),
});

const AuthResetPassword = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [alert, setAlert] = useState({
        open: false,
        severity: '',
        message: ''
    });

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            const formData = new FormData();
            formData.append('uUID', params.u);
            formData.append('oTP', params.o);
            formData.append('password', values.password);

            dispatch(updatePassword(formData))
                .then((result) => {
                    console.log(result)

                    if (result.payload.SUCCESS === 1) {
                        setAlert({
                            open: true,
                            severity: 'success',
                            message: result.payload.USER_MESSAGE
                        })
                        setTimeout(() => {
                            navigate('/auth/login')
                        }, 3000)
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
                    console.log(err)
                    setAlert({
                        open: true,
                        severity: 'error',
                        message: err.USER_MESSAGE || 'Something went wrong.'
                    })
                })
        },
    });

    return (
        <>
            <AlertMessage open={alert.open} setAlert={setAlert} severity={alert.severity} message={alert.message} />
            <form onSubmit={formik.handleSubmit}>
                <Stack>
                    <Box>
                        <CustomFormLabel>Password</CustomFormLabel>
                        <CustomPasswordField
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
                    <Box mb={3}>
                        <CustomFormLabel>Confirm Password</CustomFormLabel>
                        <CustomPasswordField
                            fullWidth
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                        />
                    </Box>
                </Stack>
                <Stack mt={'1.5rem'} spacing={2}>
                    <Button color="primary" variant="contained" size="large" fullWidth type='submit' >
                        Reset Password
                    </Button>
                    <Button color="primary" variant="contained" size="large" fullWidth component={Link} to="/auth/login" >
                        Back to Login
                    </Button>
                </Stack>
            </form>
        </>
    );
};

export default AuthResetPassword;
