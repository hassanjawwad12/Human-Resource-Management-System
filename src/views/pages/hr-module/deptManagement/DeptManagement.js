import React, {  useState } from 'react';
import { Box, Button } from '@mui/material';
import {  useLocation, useNavigate } from 'react-router-dom';
import CustomTextField from '../../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../../components/forms/theme-elements/CustomFormLabel';
import { Stack } from '@mui/system';
import { Formik, useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import AlertMessage from '../../../../components/shared/AlertMessage';
import { createNewDepartment, getDepartmentById } from '../../../../store/hr/DepartmentSlice';
import LoadingButton from '@mui/lab/LoadingButton';

const validationSchema = yup.object({
    label: yup.string().required('Department is Required'),
});

const DeptManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [toggle, setToggle] = useState(false);
    const [alert, setAlert] = useState({
        open: false,
        severity: '',
        message: ''
    });
    const [deptData, setDeptData] = useState(null);
    const { loading } = useSelector((state) => state.departmentReducer);

    const formik = useFormik({
        initialValues: {
            label: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            let formData = new FormData();
            formData.append('label', values.label)

            if (location?.state?.id) {
                formData.append('id', deptData.id)
            }

            dispatch(createNewDepartment(formData))
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
            formData.append('id', location?.state?.id)

            dispatch(getDepartmentById(formData))
                .then((result) => {

                    if (result.payload.SUCCESS === 1) {
                        setDeptData(result.payload.DATA)
                        formik.setValues({
                            label: result.payload.DATA.label
                        })

                        setToggle(false)
                        setAlert({
                            open: true,
                            severity: 'success',
                            message: result.payload.USER_MESSAGE || 'Retrieved department successfully'
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


    return (
        <>
            <AlertMessage open={alert.open} setAlert={setAlert} severity={alert.severity} message={alert.message} />
            <form onSubmit={formik.handleSubmit}>
                <Box>
                    <Stack mb={3}>
                        <Box sx={{ width: "100%" }}>
                            <CustomFormLabel htmlFor="label">
                                Department
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
                    </Stack>

                    <Stack direction='row' justifyContent='space-between' alignItems='center'>
                        <Button
                            onClick={() => navigate('/hr/departmentList')}
                            sx={{ bgcolor: '#fff !important', color: 'primary.main !important' }}
                            color="primary"
                            variant="outlined"
                            size="large"
                        >
                            View
                        </Button>

                        <LoadingButton
                            color="primary"
                            loading={loading}
                            variant="contained"
                            size="large"
                            type='submit'
                        >
                            <span style={{ marginRight: loading ? '10px' : '0px' }}>{location?.state?.id ? 'Update' : 'Save'}</span>
                        </LoadingButton>
                    </Stack>
                </Box>
            </form>
        </>
    )
};

export default DeptManagement;
