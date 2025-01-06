import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import ReactCodeInput from 'react-code-input';
import { Stack, fontWeight } from '@mui/system';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { resendOTP, verifyCode } from '../../../store/auth/signup/SignupSlice';
import { useDispatch, useSelector } from 'react-redux';
import AlertMessage from '../../../components/shared/AlertMessage';

import styles from './AuthTwoSteps.module.css'

const validationSchema = yup.object({
    oTP: yup
        .string('Enter OTP code')
        .min(6, 'OTP code should be of minimum 6 characters long')
        // .max(8, 'OTP must not exceed 8 characters')
        .required('OTP is required')
});
const reactCodeProps = {
    className: styles['auth-code-container'],
    inputStyle: {
        margin: '.5rem',
        MozAppearance: 'textfield',
        width: '2.5rem',
        borderRadius: '3px',
        fontSize: '2.2rem',
        height: '3.5rem',
        paddingLeft: '7.5px',
        backgroundColor: '#E0E0E0',
        color: 'black',
        border: '1px solid'
    },
    inputStyleInvalid: {
        fontFamily: 'monospace',
        margin: '4px',
        MozAppearance: 'textfield',
        width: '15px',
        borderRadius: '3px',
        fontSize: '14px',
        height: '26px',
        paddingLeft: '7px',
        backgroundColor: 'black',
        color: 'red',
        border: '1px solid red'
    }
}

const AuthTwoSteps = () => {
    const location = useLocation();
    const { UUID } = location.state;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { otpExpTime } = useSelector((state) => state.signupReducer);
    const [seconds, setSeconds] = useState(otpExpTime);
    const [timerActive, setTimerActive] = useState(false);
    const [resendEnabled, setResendEnabled] = useState(false);

    const [code, setCode] = useState('')
    const [alert, setAlert] = useState({
        open: false,
        severity: '',
        message: ''
    });

    const countdown = () => {
        if (seconds > 0) {
            setSeconds((prevState) => (prevState - 1));
        } else {
            setTimerActive(false);
            setResendEnabled(true);
        }
    };

    useEffect(() => {
        setTimerActive(true)
        let interval;
        if (timerActive) {
            interval = setInterval(countdown, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timerActive, seconds]);

    const formik = useFormik({
        initialValues: {
            oTP: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            const formData = new FormData();
            formData.append('uUID', UUID)
            formData.append('oTP', values.oTP)

            dispatch(verifyCode(formData))
                .then((result) => {
                    console.log(result, "result")
                    if (result.payload.SUCCESS === 1) {
                        setAlert({
                            open: true,
                            severity: 'success',
                            message: result.payload.USER_MESSAGE
                        })
                        setTimeout(() => {
                            navigate('/auth/login')
                        }, 3000)

                    } else {
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

    const onResend = () => {
        dispatch(resendOTP(UUID))
            .then((result) => {
                if (result.payload.SUCCESS === 1) {
                    console.log(result, "result")
                    console.log(UUID)

                    setSeconds(60)
                    setTimerActive(true)
                    setResendEnabled(false)

                    setAlert({
                        open: true,
                        severity: 'success',
                        message: result.payload.USER_MESSAGE
                    })
                } else {
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
    }
    const inputRefs = useRef([]); // Array to store refs for each input box
    // console.log(inputRefs.current.map(a => a.value))

    const filterChars = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', '[', ']', '{', '}', ';', ':', "'", '"', '\\', '|', ',', '<', '.', '>', '/', '?', '`', '~', ' ',
    ];

    return (
        <>
            <AlertMessage open={alert.open} setAlert={setAlert} severity={alert.severity} message={alert.message} />
            <Box mt={4}>
                <form onSubmit={formik.handleSubmit}>
                    <Stack mb={3}>
                        <Box className='flex justify-center '>
                            <ReactCodeInput {...reactCodeProps} fields={6}
                                type='text'
                                id="oTP"
                                filterChars={filterChars}
                                name="oTP"
                                value={formik.values.oTP}
                                onChange={(value) => formik.setFieldValue('oTP', value)}
                                error={formik.touched.oTP && Boolean(formik.errors.oTP)} />
                        </Box>


                    </Stack>

                    <Button
                        color="primary"
                        variant="contained"
                        size="large"
                        fullWidth
                        type='submit'
                    >
                        Verify My Account
                    </Button>
                    {formik.touched.oTP && Boolean(formik.errors.oTP) && <Typography className='text-center pt-4 text-red-500'>Code should be atleast 6 digits long</Typography>}
                </form>


                <Stack direction="row" spacing={1} mt={3}>
                    {resendEnabled && seconds === 0 ?
                        <>
                            < Typography
                                color="textSecondary"
                                variant="p"
                                fontWeight="400"
                            >
                                Didn't receive the code?
                            </Typography>
                            <Typography
                                onClick={onResend}
                                fontWeight="500"
                                sx={{
                                    textDecoration: 'none',
                                    color: 'primary.main',
                                    cursor: 'pointer'
                                }}
                            >
                                Resend
                            </Typography>
                        </>
                        :
                        <Stack direction="row" spacing={1}>
                            <Typography fontWeight="600" sx={{ width: "12px" }}>
                                {seconds}
                            </Typography>
                            <Typography>
                                seconds left
                            </Typography>
                        </Stack>
                    }
                </Stack>
            </Box >
        </>
    )
};

export default AuthTwoSteps;
