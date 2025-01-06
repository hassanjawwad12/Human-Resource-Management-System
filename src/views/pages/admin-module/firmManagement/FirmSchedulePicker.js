import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router';
import { Stack, Box, Typography, FormGroup, FormControlLabel, Button, Alert, Skeleton, Fade } from '@mui/material';
import { LocalizationProvider, DesktopTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import CustomTextField from '../../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../../components/forms/theme-elements/CustomFormLabel';
import Breadcrumb from '../../../../layouts/full/shared/breadcrumb/Breadcrumb';
import CustomCheckbox from '../../../../components/forms/theme-elements/CustomCheckbox';
import { setSchedule } from '../../../../store/admin/FirmSlice';
import { useDispatch, useSelector } from 'react-redux';
import AlertMessage from '../../../../components/shared/AlertMessage';
import { saveFirmSchedule, getFirmSchedule } from '../../../../store/admin/FirmSlice';
import { useParams } from 'react-router';
import CustomBackdrop from '../../../../components/forms/theme-elements/CustomBackdrop';
import { Switch } from '@mui/material';
export default function FirmSchedulePicker() {
    const firmId = JSON.parse(localStorage.getItem('Exergy HRMData'))?.firmId
    const { user } = useSelector((state) => state.loginReducer);

    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { firmData, } = useSelector((state) => state.firmReducer);

    const [loading, setLoading] = useState(true)
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const dayIds = daysOfWeek.map((day, index) => {
        return { id: index + 1, name: day };
    });

    const [alert, setAlert] = useState({
        open: false,
        severity: '',
        message: ''
    });


    const formik = useFormik({
        initialValues: {
            workStartTime: dayjs('2022-04-17T00:00'),
            workEndTime: dayjs('2022-04-17T12:00'),
            breakStartTime: dayjs('2022-04-17T00:00'),
            breakEndTime: dayjs('2022-04-17T00:00'),
            selectedDays: daysOfWeek,
        },
        validationSchema: Yup.object({
            workStartTime: Yup.string().nullable()
                .required('Workday Start time is required')
                .test('is-valid-time', 'Invalid start time (hh:mm A)', value => dayjs(value, 'hh:mmA').isValid()),

            workEndTime: Yup.string().nullable()
                .required('Workday End time is required')
                .test('is-valid-time', 'Invalid end time (hh:mm A)', value => dayjs(value, 'hh:mmA').isValid()),

            breakStartTime: Yup.string().nullable()
                .required('Break Start time is required')
                .test('is-valid-time', 'Invalid break start time (hh:mm A)', value => dayjs(value, 'hh:mmA').isValid()),

            breakEndTime: Yup.string().nullable()
                .required('Break End time is required')
                .test('is-valid-time', 'Invalid break end time (hh:mm A)', value => dayjs(value, 'hh:mmA').isValid()),

            selectedDays: Yup.array().nullable()
                .min(1, 'At least one working day must be selected')
                .required('Working days are required'),
        }),
        onSubmit: (values) => {
            const hehe = dayjs(values.workStartTime, 'hh:mmA').format('HH:mm')
            console.log(hehe)
            const schedule = {
                startTime: dayjs(values.workStartTime, 'hh:mmA').format('HH:mm'),
                endTime: dayjs(values.workEndTime, 'hh:mmA').format('HH:mm'),
                breakStartTime: dayjs(values.breakStartTime, 'hh:mmA').format('HH:mm'),
                breakEndTime: dayjs(values.breakEndTime, 'hh:mmA').format('HH:mm'),
                weekdaysIdList: values.selectedDays.map(day => {
                    return dayIds.find(d => d.name === day).id;
                }),
                companyId: firmId
            };
            let formdata = new FormData();

            for (const key in schedule) {
                formdata.append(key, schedule[key]);
            }

            // dispatch(setSchedule(schedule));
            // console.log('Form Values:', schedule);
            // navigate('/admin/addEmployees');

            dispatch(saveFirmSchedule(formdata))
                .then((result) => {
                    console.log(result, "result")
                    if (result.payload.SUCCESS === 1) {
                        setAlert({
                            open: true,
                            severity: 'success',
                            message: result.payload.USER_MESSAGE
                        })
                        if (user.isCompanyProfileCompleted) {
                            setAlert({
                                open: true,
                                severity: 'success',
                                message: "Firm data saved."
                            })
                            setTimeout(() => {
                                navigate('/admin')
                            }, 1000)

                        } else {
                            navigate(`/admin/addEmployees/${firmId}`)
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
                .catch((err) => {
                    console.log(err)
                    setAlert({
                        open: true,
                        severity: 'error',
                        message: err.USER_MESSAGE || 'Something went wrong.'
                    })
                });
        },
    });

    const setFetchedSchedule = (data) => {

        formik.setValues({
            ...formik.values,
            workStartTime: dayjs(data.startTime.join(':'), 'HH:mm').format('hh:mmA'),
            workEndTime: dayjs(data.endTime.join(':'), 'HH:mm').format('hh:mmA'),
            breakStartTime: dayjs(data.breakStartTime.join(':'), 'HH:mm').format('hh:mmA'),
            breakEndTime: dayjs(data.breakEndTime.join(':'), 'HH:mm').format('hh:mmA'),
            selectedDays: data.weekDays.map(day => {
                return dayIds.find(d => d.id === day.id).name;
            })
        })
    }

    useEffect(() => {
        let formdata = new FormData();
        formdata.append('companyId', firmId)
        for (let pair of formdata.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }
        dispatch(getFirmSchedule(formdata))
            .then((result) => {
                console.log(result, "result")
                if (result.payload.SUCCESS) {
                    setLoading(false)
                }
                if (result.payload.SUCCESS === 1 && result.payload.DATA.length > 0) {
                    setFetchedSchedule(result.payload.DATA[0])
                    // setAlert({
                    //     open: true,
                    //     severity: 'success',
                    //     message: 'Firm schedule received'
                    // })

                }
                else {
                    // setAlert({
                    //     open: true,
                    //     severity: 'error',
                    //     message: result.payload.SUCCESS
                    // })

                }

            })
            .catch((err) => {
                setLoading(false)
                console.log(err)
                setAlert({
                    open: true,
                    severity: 'error',
                    message: err.USER_MESSAGE || 'Couldnt fetch schedule. Make sure it exists.'
                })
            });

    }, [])

    function handleUserSelectedDays(day) {
        const { selectedDays } = formik.values;
        if (selectedDays.includes(day)) {
            formik.setFieldValue('selectedDays', selectedDays.filter((d) => d !== day));
        } else {
            formik.setFieldValue('selectedDays', [...selectedDays, day]);
        }
    }



    const BCrumb = [
        { to: '/admin', title: 'Admin' },
        { title: 'Firm Management' },
    ];

    return (
        <>
            <AlertMessage open={alert.open} setAlert={setAlert} severity={alert.severity} message={alert.message} />
            {/* <Breadcrumb title="Firm Management" items={BCrumb} /> */}
            {/* <CustomBackdrop loading={loading} /> */}
            {loading ?
                <Box>

                    <Skeleton variant="text" width={200} height={32} />

                    <Stack mb={7} mt={3}>
                        <Stack direction="row" spacing={3}>
                            <Box sx={{ width: '30%' }}>
                                {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                                    <Box key={item} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Skeleton variant="circular" width={34} height={24} />
                                        <Skeleton variant="text" width={100} height={24} sx={{ ml: 1 }} />
                                    </Box>
                                ))}
                            </Box>
                            <Stack width="100%">
                                <Stack width="100%" direction="row" gap={2}>
                                    {[1, 2].map((item) => (
                                        <Box key={item} sx={{ width: '100%' }}>
                                            <Skeleton variant="text" width={100} height={20} />
                                            <Skeleton variant="rounded" height={46} />
                                        </Box>
                                    ))}
                                </Stack>
                                <Stack direction={'row'} gap={2} mt={2}>
                                    {[1, 2].map((item) => (
                                        <Box key={item} sx={{ width: '100%' }}>
                                            <Skeleton variant="text" width={100} height={20} />
                                            <Skeleton variant="rounded" height={46} />
                                        </Box>
                                    ))}
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                    <Stack direction="row" mt={3} gap={2} justifyContent="space-between">
                        <Skeleton variant="rounded" width={60} height={36} />
                        <Stack direction="row" gap={2}>

                            <Skeleton variant="rounded" width={60} height={36} />
                        </Stack>
                    </Stack>
                </Box> :
                <Fade in>
                    <form onSubmit={formik.handleSubmit}>
                        <Typography color="primary" variant="h5" mb={1} >
                            Set Standard Schedule
                        </Typography>
                        {!loading && <Box>
                            {<Stack mb={7} mt={3}>
                                <Stack direction="row" spacing={3} >
                                    <Box sx={{ width: '30%' }}>
                                        {/* <CustomFormLabel htmlFor="selectedDays">Working Days:</CustomFormLabel> */}
                                        <FormGroup>
                                            {daysOfWeek.map((day) => (
                                                <FormControlLabel
                                                    sx={{ ml: 0 }}
                                                    key={day}
                                                    control={
                                                        <Switch
                                                            id={day}

                                                            name="selectedDays"
                                                            checked={formik.values.selectedDays.includes(day)}
                                                            onChange={() => handleUserSelectedDays(day)}
                                                            inputProps={{ 'aria-label': 'primary checkbox' }}
                                                        />
                                                    }

                                                    label={<Typography fontWeight={600} sx={{ width: '6rem' }}>{day}</Typography>}
                                                />
                                            ))}
                                        </FormGroup>
                                        {formik.touched.selectedDays && formik.errors.selectedDays ? (
                                            <Typography color="error">{formik.errors.selectedDays}</Typography>
                                        ) : null}
                                    </Box>
                                    <Stack width="100%" >
                                        <Stack width="100%" direction="row" gap={2}>
                                            <Box sx={{ width: '100%' }}>
                                                <CustomFormLabel sx={{ mb: 2 }} htmlFor="workStartTime">Working Hours</CustomFormLabel>

                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DesktopTimePicker
                                                        disabled={loading}
                                                        label='from'

                                                        value={dayjs(formik.values.workStartTime, 'hh:mmA')}
                                                        onChange={(value) => formik.setFieldValue('workStartTime', value)}
                                                        renderInput={(props) => (
                                                            <CustomTextField
                                                                {...props}
                                                                name="workStartTime"
                                                                fullWidth
                                                                error={formik.touched.workStartTime && Boolean(formik.errors.workStartTime)}
                                                                helperText={formik.touched.workStartTime && formik.errors.workStartTime}
                                                            />
                                                        )}
                                                    />
                                                </LocalizationProvider>
                                            </Box>
                                            <Box sx={{ width: '100%' }}>
                                                <CustomFormLabel sx={{ mb: 2 }} className='opacity-0' htmlFor="workEndTime">Workday End</CustomFormLabel>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DesktopTimePicker
                                                        label='to'
                                                        disabled={loading}
                                                        value={dayjs(formik.values.workEndTime, 'hh:mmA')}
                                                        onChange={(value) => formik.setFieldValue('workEndTime', value)}
                                                        renderInput={(props) => (
                                                            <CustomTextField
                                                                {...props}
                                                                name="workEndTime"
                                                                fullWidth
                                                                error={formik.touched.workEndTime && Boolean(formik.errors.workEndTime)}
                                                                helperText={formik.touched.workEndTime && formik.errors.workEndTime}
                                                            />
                                                        )}
                                                    />
                                                </LocalizationProvider>
                                            </Box>
                                        </Stack>
                                        <Stack direction={'row'} gap={2}>
                                            <Box sx={{ width: '100%' }}>
                                                <CustomFormLabel sx={{ mb: 2 }} htmlFor="breakStartTime">Break</CustomFormLabel>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DesktopTimePicker
                                                        label='from'
                                                        disabled={loading}
                                                        value={dayjs(formik.values.breakStartTime, 'hh:mmA')}
                                                        onChange={(value) => formik.setFieldValue('breakStartTime', value)}
                                                        renderInput={(props) => (
                                                            <CustomTextField
                                                                {...props}
                                                                name="breakStartTime"
                                                                fullWidth
                                                                error={formik.touched.breakStartTime && Boolean(formik.errors.breakStartTime)}
                                                                helperText={formik.touched.breakStartTime && formik.errors.breakStartTime}
                                                            />
                                                        )}
                                                    />
                                                </LocalizationProvider>
                                            </Box>
                                            <Box sx={{ width: '100%' }}>
                                                <CustomFormLabel sx={{ mb: 2, opacity: 0 }} htmlFor="breakEndTime">Break End</CustomFormLabel>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DesktopTimePicker
                                                        label='to'
                                                        disabled={loading}
                                                        value={dayjs(formik.values.breakEndTime, 'hh:mmA')}
                                                        onChange={(value) => formik.setFieldValue('breakEndTime', value)}
                                                        renderInput={(props) => (
                                                            <CustomTextField
                                                                {...props}
                                                                name="breakEndTime"
                                                                fullWidth
                                                                error={formik.touched.breakEndTime && Boolean(formik.errors.breakEndTime)}
                                                                helperText={formik.touched.breakEndTime && formik.errors.breakEndTime}
                                                            />
                                                        )}
                                                    />
                                                </LocalizationProvider>
                                            </Box>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Stack>}
                            <Stack direction="row" mt={5} gap={2} justifyContent="space-between">
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate(-1)}
                                    sx={{ mr: 1, color: 'primary.main !important', bgcolor: '#fff !important' }}
                                >
                                    Back
                                </Button>
                                <Stack direction="row" gap={2}>
                                    {!user.isCompanyProfileCompleted && <Button
                                        variant="outlined"
                                        sx={{ mr: 1, color: 'primary.main !important', bgcolor: '#fff !important' }}
                                        type='submit'
                                    >
                                        Skip
                                    </Button>}
                                    <Button color="primary" variant="contained" type="submit">
                                        Save
                                    </Button>
                                </Stack>
                            </Stack>
                        </Box>}
                    </form >
                </Fade>
            }
        </>
    );
}
