import React, {useState} from 'react';
import { Box,Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomTextField from '../../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../../components/forms/theme-elements/CustomFormLabel';
import { Stack } from '@mui/system';
import { Formik, useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch} from 'react-redux';
import AlertMessage from '../../../../components/shared/AlertMessage';
import Breadcrumb from '../../../../layouts/full/shared/breadcrumb/Breadcrumb';
import { createNewDesignation, getDesignationById } from '../../../../store/hr/DesignationSlice';

const validationSchema = yup.object({
    label: yup.string().required('Designation is Required'),
});

const DesignationManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [toggle, setToggle] = useState(false);
    const [alert, setAlert] = useState({
        open: false,
        severity: '',
        message: ''
    });
    const [designationData, setDesignationData] = useState(null);

    const formik = useFormik({
        initialValues: {
            label: '',
            description: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            let formData = new FormData();
            formData.append('label', values.label)
            formData.append('description', values.description)

            if (location?.state?.id) {
                formData.append('id', designationData.id)
            }

            dispatch(createNewDesignation(formData))
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
                            message: result.payload.USER_MESSAGE || 'Designation retrieved successfully'
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
            title: 'Designation Management',
        }
    ];

    return (
        <>
            <AlertMessage open={alert.open} setAlert={setAlert} severity={alert.severity} message={alert.message} />

            {/* <Breadcrumb title="Designation Management" items={BCrumb} /> */}

            <form onSubmit={formik.handleSubmit}>
                <Box>
                    <Stack mb={3}>
                        <Stack direction="row" spacing={3}>
                            <Box sx={{ width: "100%" }}>
                                <CustomFormLabel htmlFor="label">
                                    Designation
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
                    </Stack>

                    <Stack direction='row' justifyContent='space-between' alignItems='center'>
                        <Button
                            onClick={() => navigate('/hr/designationList')}
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

export default DesignationManagement;
