import { useState, useEffect } from 'react';
import { Box, Stack, minHeight } from "@mui/system";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import CustomFormLabel from "../../../components/forms/theme-elements/CustomFormLabel";
import { DatePicker, DesktopTimePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from 'dayjs'
import CustomTextField from "../../../components/forms/theme-elements/CustomTextField";
import CustomOutlinedButton from "../../../components/forms/theme-elements/CustomOutlinedButton";
import { Dialog, DialogTitle, DialogContent, Button, Grid, Typography, useStepContext, DialogActions, CardContent, Card, TextField, Divider, InputAdornment, Avatar, FormControlLabel, Switch, ToggleButton, Checkbox, Tab, Tabs, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import ShiftTable from './ShiftTable';
import AddIcon from '@mui/icons-material/Add';
import { IconSearch } from '@tabler/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import EditIcon from '@mui/icons-material/Edit';
import { getAllAvailableEmployeesByCompany, saveCompanyShifts, getAllShiftsByCompanyId, UpdateShiftStatusById, updateShiftNameAndDescriptionById, getAllArchivedShiftsByCompanyId, updateShiftArchivedStatusById } from '../../../store/rota/RotaSlice';
import { useDispatch, useSelector } from 'react-redux';
import { dispatch } from 'd3';
import { Check, Close, TransformRounded } from '@mui/icons-material';
import AlertMessage from '../../../components/shared/AlertMessage';
import CustomBackdrop from '../../../components/forms/theme-elements/CustomBackdrop';
import { lighten } from '@mui/system';
import ArchivedShiftTable from './ArchivedShifts';

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Shift name is required'),
    duration: Yup.object().shape({
        start: Yup.string().nullable().required('Workday Start date is required').typeError('Start date is invalid').test('is-valid-time', 'Invalid start time (DD/MM/YY)', value => dayjs(value, 'DD/MM/YY').isValid()),
        // No time format validation needed here
        // .test('is-valid-time', 'Invalid start time (format)', value => dayjs(value, 'HH:mm').isValid()), // Remove this line
        end: Yup.string().nullable().required('End date is required')
        // No time format validation needed here
        // .test('is-valid-time', 'Invalid end time (format)', value => dayjs(value, 'HH:mm').isValid()), // Remove this line
    }),
    workingHours: Yup.object().shape({
        start: Yup.string().nullable().required('Start time is required')
            .test('is-valid-time', 'Invalid start time (hh:mm A)', value => dayjs(value, 'hh:mm A').isValid()), // Adjust format string if needed
        end: Yup.string().nullable().required('End time is required')
            .test('is-valid-time', 'Invalid end time (hh:mm A)', value => dayjs(value, 'hh:mm A').isValid()), // Adjust format string if needed
    }),
    isBreakPaid: Yup.boolean(),
    breakHours: Yup.object().shape({
        start: Yup.string().nullable()
            .when('isBreakPaid', {
                is: true,
                then: Yup.string().required('Break start time is required when break is paid')
                    .test('is-valid-time', 'Invalid break start time (hh:mm A)', value => dayjs(value, 'hh:mm A').isValid()),
                otherwise: Yup.string().nullable()
                    .test('is-valid-time', 'Invalid break start time (hh:mm A)', value => value ? dayjs(value, 'hh:mm A').isValid() : true)
            }),
        end: Yup.string().nullable()
            .when('isBreakPaid', {
                is: true,
                then: Yup.string().required('Break end time is required when break is paid')
                    .test('is-valid-time', 'Invalid break end time (hh:mm A)', value => dayjs(value, 'hh:mm A').isValid()),
                otherwise: Yup.string().nullable()
                    .test('is-valid-time', 'Invalid break end time (hh:mm A)', value => value ? dayjs(value, 'hh:mm A').isValid() : true)
            })
    })

});
const staffImages = [
    'https://www.svgrepo.com/show/382101/male-avatar-boy-face-man-user.svg',
    'https://www.svgrepo.com/show/382097/female-avatar-girl-face-woman-user-9.svg',
    'https://www.svgrepo.com/show/382108/male-avatar-boy-face-man-user-4.svg',
    'https://www.svgrepo.com/show/382107/male-avatar-boy-face-man-user-6.svg',
    'https://www.svgrepo.com/show/382099/female-avatar-girl-face-woman-user-2.svg',
    'https://www.svgrepo.com/show/382112/female-avatar-girl-face-woman-user-8.svg',
];
const firmId = JSON.parse(localStorage.getItem('Exergy HRMData'))?.firmId
function getRandomImage() {
    const randomIndex = Math.floor(Math.random() * staffImages.length);
    return staffImages[randomIndex];
}

export default function ShiftManager() {
    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.rotaReducer);
    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [alert, setAlert] = useState({
        open: false,
        severity: '',
        message: ''
    });
    const [selectedShift, setSelectedShift] = useState(null);
    const [shiftsUpdated, setShiftsUpdated] = useState(0);
    const [shifts, setShifts] = useState([]);
    const [archivedShifts, setArchivedShifts] = useState([]);
    const [tabValue, setTabValue] = useState(0);

    const BCrumb = [
        {
            to: '/rota',
            title: 'Rota',
        },
        {
            title: 'Shift Manager',
        }
    ];

    useEffect(() => {
        fetchShifts();
        fetchArchivedShifts();
    }, [shiftsUpdated]);

    const fetchShifts = () => {
        let formdata = new FormData();
        formdata.append('companyId', firmId);
        dispatch(getAllShiftsByCompanyId(formdata))
            .then((result) => {
                if (result.payload.SUCCESS === 1) {
                    const transformedShifts = result.payload.DATA.map(normalizeShiftData);
                    setShifts(transformedShifts);
                } else {
                    setAlert({
                        open: true,
                        severity: 'error',
                        message: result.payload
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                setAlert({
                    open: true,
                    severity: 'error',
                    message: err.USER_MESSAGE || 'Something went wrong.'
                });
            });
    };

    const fetchArchivedShifts = () => {
        let formdata = new FormData();
        formdata.append('companyId', firmId);
        dispatch(getAllArchivedShiftsByCompanyId(formdata))
            .then((result) => {
                if (result.payload.SUCCESS === 1) {
                    const transformedShifts = result?.payload.DATA.map(normalizeShiftData);
                    setArchivedShifts(transformedShifts);
                } else {
                    setAlert({
                        open: true,
                        severity: 'error',
                        message: result.payload
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                setAlert({
                    open: true,
                    severity: 'error',
                    message: err.USER_MESSAGE || 'Something went wrong.'
                });
            });
    };

    const handleAssignShiftModal = (id) => {
        setOpen(true);
        setSelectedShift(id);
    };

    const toggleShiftActive = (shiftId) => {
        const shift = shifts.find(s => s.id === shiftId);
        if (!shift) return;

        const newActiveStatus = shift.isActive ? 0 : 1;
        updateShiftStatusBackend(shiftId, newActiveStatus)
            .then(success => {
                if (success) {
                    setShifts(prevShifts => prevShifts.map(shift => {
                        if (shift.id === shiftId) {
                            return { ...shift, isActive: newActiveStatus === 1 };
                        }
                        return shift;
                    }));
                }
            });
        if (newActiveStatus) {
            setShiftsUpdated(prev => prev + 1);
        }
    };

    const updateShiftStatusBackend = (shiftId, isActive) => {
        let formData = new FormData();
        formData.append('shiftId', shiftId);
        formData.append('isActive', isActive);

        return dispatch(UpdateShiftStatusById(formData))
            .then(result => {
                if (result.payload.SUCCESS === 1) {
                    setAlert({
                        open: true,
                        severity: 'success',
                        message: 'Shift status updated successfully'
                    });
                    return true;
                } else {
                    throw new Error(result);
                }
            })
            .catch(err => {
                console.error(err);
                setAlert({
                    open: true,
                    severity: 'error',
                    message: err.USER_MESSAGE || 'Something went wrong updating shift status.'
                });
                return false;
            });
    };

    const handleArchiveShift = (shiftId) => {
        let formData = new FormData();
        formData.append('shiftId', shiftId);
        formData.append('isArchived', 1);

        dispatch(updateShiftArchivedStatusById(formData))
            .then(result => {
                if (result.payload.SUCCESS === 1) {
                    setAlert({
                        open: true,
                        severity: 'success',
                        message: 'Shift archived successfully'
                    });
                    setShiftsUpdated(prev => prev + 1);
                } else {
                    throw new Error(result);
                }
            })
            .catch(err => {
                console.error(err);
                setAlert({
                    open: true,
                    severity: 'error',
                    message: err.USER_MESSAGE || 'Something went wrong archiving shift.'
                });
            });
    };

    const handleUnarchiveShift = (shiftId) => {
        let formData = new FormData();
        formData.append('shiftId', shiftId);
        formData.append('isArchived', 0);

        dispatch(updateShiftArchivedStatusById(formData))
            .then(result => {
                if (result.payload.SUCCESS === 1) {
                    setAlert({
                        open: true,
                        severity: 'success',
                        message: 'Shift unarchived successfully'
                    });
                    setShiftsUpdated(prev => prev + 1);
                } else {
                    throw new Error(result);
                }
            })
            .catch(err => {
                console.error(err);
                setAlert({
                    open: true,
                    severity: 'error',
                    message: err.USER_MESSAGE || 'Something went wrong unarchiving shift.'
                });
            });
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <>
            <CustomBackdrop loading={loading} />
            <AlertMessage open={alert.open} setAlert={setAlert} severity={alert.severity} message={alert.message} />
            {/* <Breadcrumb title="Rota Module" items={BCrumb} /> */}
            <Box sx={{ pt: 0 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="shift tabs">
                        <Tab label="Active Shifts" />
                        <Tab label="Archived Shifts" />
                    </Tabs>
                </Box>

                {tabValue === 0 && (
                    <>

                        <ShiftTable
                            shifts={shifts}
                            setOpenModal={setOpenModal}
                            handleAssignShiftModal={handleAssignShiftModal}
                            toggleShiftActive={toggleShiftActive}
                            loading={loading}
                            setShiftsUpdated={setShiftsUpdated}
                            handleArchiveShift={handleArchiveShift}
                        />
                    </>
                )}

                {tabValue === 1 && (
                    <ArchivedShiftTable
                        shifts={archivedShifts}
                        unarchiveShift={handleUnarchiveShift}
                        loading={loading}
                    />
                )}

                {openModal && (
                    <AddnewShiftDialog
                        open={openModal}
                        setOpen={setOpenModal}
                        setShiftsUpdated={setShiftsUpdated}
                        shifts={shifts}
                        setShifts={setShifts}
                        alert={alert}
                        setAlert={setAlert}
                    />
                )}

                {open && (
                    <AssignShiftsDialog
                        open={open}
                        setOpen={setOpen}
                        shifts={shifts}
                        setShiftsUpdated={setShiftsUpdated}
                        handleAssignShiftModal={handleAssignShiftModal}
                        selectedShift={selectedShift}
                        alert={alert}
                        setAlert={setAlert}
                    />
                )}
            </Box>
        </>
    );
}

function normalizeShiftData(backendData) {
    const employeeRates = {};

    backendData?.shiftEmployeeDetail?.forEach(employee => {
        employeeRates[employee.employeeId] = employee.hourlyRate;
    });

    return {
        id: backendData.id,
        isActive: backendData.isActive,
        name: backendData.name,
        employeeData: employeeRates,
        duration: {
            start: dayjs(backendData.startDate).format('DD/MM/YY'),
            end: dayjs(backendData.endDate).format('DD/MM/YY')
        },
        workingHours: {
            start: dayjs(backendData.startTime.join(':'), 'HH:mm').format('hh:mmA'),
            end: dayjs(backendData.endTime.join(':'), 'HH:mm').format('hh:mmA')
        },
        breakHours: {
            start: backendData.breakStartTime ? dayjs(backendData.breakStartTime.join(':'), 'HH:mm').format('hh:mmA') : null,
            end: backendData.breakEndTime ? dayjs(backendData.breakEndTime.join(':'), 'HH:mm').format('hh:mmA') : null
        },
        description: backendData.description
    };
}



const AddnewShiftDialog = ({ open, setOpen, shifts, setShifts, alert, setAlert, setShiftsUpdated }) => {
    const [steps, setSteps] = useState(1)
    const [allEmployees, setAllEmployees] = useState([])
    const dispatch = useDispatch()


    const formik = useFormik({
        initialValues: {
            name: '',
            duration: { start: dayjs().format('DD/MM/YY'), end: dayjs().add(1, 'week').format('DD/MM/YY'), },
            workingHours: { start: '9:00AM', end: '5:00PM' },
            breakHours: { start: null, end: null },
            description: '',
            isBreakPaid: false
        },
        validationSchema,
        onSubmit: (values, actions) => {
            if (steps === 1) {
                if (values.isBreakPaid && (!values.breakHours.start || !values.breakHours.end)) {
                    actions.setFieldError('breakHours.start', 'Required for paid break');
                    actions.setFieldError('breakHours.end', 'Required for paid break');
                    return;
                }
                handleNext(actions);
                return;
            }


            const transformedShiftData = {
                name: values.name.trim(),
                description: values.description,
                companyId: firmId,
                startDate: dayjs(values.duration.start, 'DD/MM/YY').format('YYYY-MM-DD'),
                endDate: dayjs(values.duration.end, 'DD/MM/YY').format('YYYY-MM-DD'),
                startTime: dayjs(values.workingHours.start, 'hh:mmA').format('HH:mm'),
                endTime: dayjs(values.workingHours.end, 'hh:mmA').format('HH:mm'),
                breakStartTime: values.breakHours.start ? dayjs(values.breakHours.start, 'hh:mmA').format('HH:mm') : '',
                breakEndTime: values.breakHours.end ? dayjs(values.breakHours.end, 'hh:mmA').format('HH:mm') : '',
                employeeIds: allEmployees.filter(emp => emp.added).map(emp => emp.id),
                employeeHourlyRates: allEmployees.filter(emp => emp.added).map(emp => emp.ratePerHour),
                shiftId: 0,
                isBreakPaid: values.isBreakPaid ? 1 : 0,
            };

            // Create a form data object
            const formdata = new FormData();
            for (const key in transformedShiftData) {
                formdata.append(key, transformedShiftData[key]);
            }

            dispatch(saveCompanyShifts(formdata))
                .then((result) => {
                    if (result.payload.SUCCESS === 1) {
                        setAlert({
                            open: true,
                            severity: 'success',
                            message: `'${transformedShiftData.name}' has been added successfully.`
                        })
                        setShiftsUpdated(prev => prev + 1);
                    } else {
                        // Handle error case
                    }
                })
                .catch((err) => {
                    console.error(err);
                    // Handle error case
                });
            setOpen(false)
        }
    });
    console.log(formik.values)
    useEffect(() => {
        let formdata = new FormData();
        formdata.append('companyId', firmId);
        dispatch(getAllAvailableEmployeesByCompany(formdata))
            .then((result) => {
                if (result.payload.SUCCESS === 1) {
                    const newData = result.payload.DATA.map(item => ({ ...item, added: false, img: `http://122.248.194.140:8081/ExergyHRM/Users/GetProfileImageByFileName?fileName=${item.profileFileName}` }))
                    setAllEmployees(newData);
                } else {
                    // Handle error case
                }
            })
            .catch((err) => {
                console.error(err);
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Could not add a new shift.'
                })
                // Handle error case
            });
    }, []);
    function handleChange(id, action) {
        console.log(id, action)
        if (action === 'add') {

            setAllEmployees(allEmployees.map((item) => {
                if (item.id === id) {
                    return { ...item, added: true }
                } else {
                    return item
                }
            })
            )
        } else {
            setAllEmployees(allEmployees.map((item) => {
                if (item.id === id) {
                    return { ...item, added: false }
                } else {
                    return item
                }
            })
            )
        }
    }

    const handleRateChange = (id, event) => {
        const { value } = event.target;

        setAllEmployees((prevEmployees) =>
            prevEmployees.map((employee) =>
                employee.id === id ? { ...employee, 'ratePerHour': value } : employee
            )
        );
    };

    //basically sets the end date to be always one day ahead of start date
    useEffect(() => {
        const startDate = dayjs(formik.values.duration.start, 'DD/MM/YY');
        const endDate = dayjs(formik.values.duration.end, 'DD/MM/YY');

        // Find the end of the week (Sunday) for the start date
        const endOfWeek = startDate.endOf('week');

        // Check if the current end date is different from the end of the week
        if (!endDate.isSame(endOfWeek, 'day')) {
            // Set the end date to the end of the week
            formik.setFieldValue('duration.end', endOfWeek.format('DD/MM/YY'));
        }
    }, [formik.values.duration.start]);
    function handleNext(actions) {
        if (formik.isValid && steps === 1) {
            actions.setSubmitting(false);
            setSteps(2)
        }
    }

    return (
        <>
            <AlertMessage open={alert.open} setAlert={setAlert} severity={alert.severity} message={alert.message} />

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{
                    sx: {
                        width: 'auto',
                        maxWidth: 'none',
                        transition: 'all'
                    },
                }}
                scroll='body'
            >
                <AnimatePresence mode='wait'>
                    {steps === 1 ?
                        <motion.div key={'1'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .2 }}>
                            <Stack sx={{ backgroundColor: 'primary.main' }}>
                                <DialogTitle id="alert-dialog-title" variant="h4" sx={{ color: 'white' }}>
                                    Create New Shift
                                </DialogTitle>
                            </Stack>
                            <DialogContent className='flex flex-col' sx={{ height: 'auto', }}>
                                <form onSubmit={formik.handleSubmit}>
                                    <Stack direction={'row'} spacing={5} mb={5}>
                                        <Stack spacing={2} sx={{ width: '100%' }}>
                                            <Box sx={{ width: '100%' }}>
                                                <Typography sx={{ mb: 1, fontWeight: 800 }}>Name
                                                    <span style={{ color: "red", fontSize: "15px" }}>
                                                        *
                                                    </span>
                                                </Typography>

                                                <TextField
                                                    size='small'
                                                    fullWidth
                                                    placeholder='e.g shift 1'
                                                    id="name"
                                                    name="name"
                                                    value={formik.values.name}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                                    helperText={formik.touched.name && formik.errors.name}
                                                />
                                            </Box>
                                            <Box sx={{ width: '100%', mt: 2 }}>
                                                <Typography sx={{ mb: 1, fontWeight: 800 }}>Description</Typography>
                                                <TextField
                                                    multiline
                                                    rows={1}
                                                    fullWidth
                                                    placeholder='Enter shift description'
                                                    id="description"
                                                    name="description"
                                                    value={formik.values.description}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                                    helperText={formik.touched.description && formik.errors.description}
                                                />
                                            </Box>
                                            <Typography sx={{ mb: 1, fontWeight: 800 }}>Define working duration:</Typography>
                                            <Stack direction={'row'} alignItems={'center'} sx={{ width: '100%' }} spacing={2}>
                                                <Stack direction="row" alignItems="center" gap={1}>
                                                    <Typography sx={{ minWidth: '40px', fontSize: '.8rem' }}>Start:</Typography>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DatePicker
                                                            disablePast
                                                            inputFormat="DD/MM/YY"
                                                            value={dayjs(formik.values.duration.start, 'DD/MM/YY')}
                                                            onChange={(value) => formik.setFieldValue('duration.start', value)}
                                                            renderInput={(props) => (
                                                                <TextField
                                                                    {...props}
                                                                    fullWidth
                                                                    size='small'
                                                                    error={formik.touched.duration?.start && Boolean(formik.errors.duration?.start)}
                                                                    helperText={formik.touched.duration?.start && formik.errors.duration?.start}
                                                                />
                                                            )}
                                                        />
                                                    </LocalizationProvider>
                                                </Stack>
                                                <Stack direction="row" alignItems="center">
                                                    <Typography sx={{ minWidth: '40px', fontSize: '.8rem' }}>End:</Typography>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DatePicker
                                                            minDate={dayjs(formik.values.duration.start, 'DD/MM/YY').add(1, 'day').toDate()}
                                                            inputFormat="DD/MM/YY"
                                                            value={dayjs(formik.values.duration.end, 'DD/MM/YY')}
                                                            onChange={(value) => formik.setFieldValue('duration.end', value)}
                                                            renderInput={(props) => (
                                                                <TextField
                                                                    {...props}
                                                                    fullWidth
                                                                    size='small'
                                                                    error={formik.touched.duration?.end && Boolean(formik.errors.duration?.end)}
                                                                    helperText={formik.touched.duration?.end && formik.errors.duration?.end}
                                                                />
                                                            )}
                                                        />
                                                    </LocalizationProvider>
                                                </Stack>
                                            </Stack>
                                            <Typography sx={{ mb: 1, fontWeight: 800 }}>Define working hours:</Typography>
                                            <Stack direction={'row'} alignItems={'center'} sx={{ width: '100%' }} spacing={2}>
                                                <Stack direction="row" alignItems="center" gap={1}>
                                                    <Typography sx={{ minWidth: '40px', fontSize: '.8rem' }}>Start:</Typography>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <TimePicker
                                                            inputFormat="hh:mmA"
                                                            value={dayjs(formik.values.workingHours.start, 'hh:mmA')}
                                                            onChange={(value) => formik.setFieldValue('workingHours.start', value)}
                                                            onBlur={formik.handleBlur}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    size='small'
                                                                    fullWidth
                                                                    error={formik.touched.workingHours?.start && Boolean(formik.errors.workingHours?.start)}
                                                                    helperText={formik.touched.workingHours?.start && formik.errors.workingHours?.start}
                                                                />
                                                            )}
                                                        />
                                                    </LocalizationProvider>
                                                </Stack>
                                                <Stack direction="row" alignItems="center">
                                                    <Typography sx={{ minWidth: '40px', fontSize: '.8rem' }}>End:</Typography>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <TimePicker
                                                            inputFormat="hh:mmA"
                                                            value={dayjs(formik.values.workingHours.end, 'hh:mmA')}
                                                            onChange={(value) => formik.setFieldValue('workingHours.end', value)}
                                                            onBlur={formik.handleBlur}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    size='small'
                                                                    fullWidth
                                                                    error={formik.touched.workingHours?.end && Boolean(formik.errors.workingHours?.end)}
                                                                    helperText={formik.touched.workingHours?.end && formik.errors.workingHours?.end}
                                                                />
                                                            )}
                                                        />
                                                    </LocalizationProvider>
                                                </Stack>
                                            </Stack>


                                            <Box className='flex items-center gap-4 justify-between'>
                                                <Typography sx={{ fontWeight: 800 }}>Define break hours:</Typography>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={formik.values.isBreakPaid}
                                                            onChange={() => formik.setFieldValue('isBreakPaid', !formik.values.isBreakPaid)}
                                                            color="primary"
                                                        />
                                                    }
                                                    label={
                                                        <Typography variant="body2" color="primary">
                                                            Paid Break
                                                        </Typography>
                                                    }
                                                    sx={{
                                                        m: 0,
                                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                                            color: 'primary.main',
                                                        },
                                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                            backgroundColor: 'primary.main',
                                                        },
                                                    }}
                                                />
                                            </Box>
                                            <Stack direction={'row'} alignItems={'center'} sx={{ width: '100%' }} spacing={2}>
                                                <Stack direction="row" alignItems="center" gap={1}>
                                                    <Typography sx={{ minWidth: '40px', }}>Start:</Typography>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <TimePicker
                                                            inputFormat="hh:mmA"
                                                            value={formik.values.breakHours.start ? dayjs(formik.values.breakHours.start, 'hh:mmA') : null}
                                                            onChange={(value) => formik.setFieldValue('breakHours.start', value)}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    size='small'
                                                                    fullWidth
                                                                    error={formik.touched.breakHours?.start && Boolean(formik.errors.breakHours?.start)}
                                                                    helperText={formik.touched.breakHours?.start && formik.errors.breakHours?.start}
                                                                />
                                                            )}
                                                        />
                                                    </LocalizationProvider>
                                                </Stack>
                                                <Stack direction="row" alignItems="center">
                                                    <Typography sx={{ minWidth: '40px' }}>End:</Typography>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <TimePicker
                                                            inputFormat="hh:mmA"
                                                            value={formik.values.breakHours.end ? dayjs(formik.values.breakHours.end, 'hh:mmA') : null}
                                                            onChange={(value) => formik.setFieldValue('breakHours.end', value)}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    size='small'
                                                                    fullWidth
                                                                    error={formik.touched.breakHours?.end && Boolean(formik.errors.breakHours?.end)}
                                                                    helperText={formik.touched.breakHours?.end && formik.errors.breakHours?.end}
                                                                />
                                                            )}
                                                        />
                                                    </LocalizationProvider>
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                    <DialogActions sx={{ justifyContent: 'space-between' }}>
                                        <Stack sx={{ width: '100%' }} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                            <Button onClick={() => setOpen(false)} variant="outlined" sx={{ mr: 1, color: 'primary.main !important', bgcolor: '#fff !important' }}>
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                sx={{ ml: 1 }}
                                            >
                                                Next
                                            </Button>
                                        </Stack>
                                    </DialogActions>
                                </form>
                            </DialogContent>
                        </motion.div>
                        :
                        <motion.div key={'2'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .2 }}>
                            <Stack sx={{ backgroundColor: 'primary.main' }}>
                                <DialogTitle id="alert-dialog-title" variant="h4" sx={{ color: 'white' }}>
                                    Assign Shift
                                    <Typography sx={{ color: 'white' }}>Click on the employee to assign them to this schedule.</Typography>
                                </DialogTitle>
                            </Stack>
                            <DialogContent sx={{ pb: 0 }}>
                                <div className='flex flex-col' >
                                    <EmployeeTable allEmployees={allEmployees} handleRateChange={handleRateChange} handleChange={handleChange} />
                                    <DialogActions sx={{ justifyContent: 'space-between', mt: 'auto' }}>
                                        <Stack sx={{ width: '100%' }} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                            <Button onClick={() => setSteps(1)} variant="outlined" sx={{ mr: 1, color: 'primary.main !important', bgcolor: '#fff !important' }}>
                                                Back
                                            </Button>
                                            <div>
                                                <Button
                                                    onClick={formik.handleSubmit}
                                                    variant="contained"
                                                    color="primary"
                                                    sx={{ ml: 1 }}
                                                >
                                                    Save
                                                </Button>
                                            </div>
                                        </Stack>

                                    </DialogActions>
                                </div>
                            </DialogContent>
                        </motion.div>}

                </AnimatePresence>
            </Dialog>
        </>
    )
}

const AssignShiftsDialog = ({ open, setOpen, alert, setAlert, selectedShift, shifts, setShiftsUpdated }) => {
    const dispatch = useDispatch();
    const shift = shifts.find(item => item.id === selectedShift)
    console.log(shift)


    const [allEmployees, setAllEmployees] = useState([]);

    console.log(allEmployees)

    useEffect(() => {
        let formdata = new FormData();
        formdata.append('companyId', firmId);
        dispatch(getAllAvailableEmployeesByCompany(formdata))
            .then((result) => {
                if (result.payload.SUCCESS === 1) {
                    const newData = result.payload.DATA.map(item => ({
                        ...item,
                        added: shift.employeeData.hasOwnProperty(item.id),
                        ratePerHour: shift.employeeData[item.id] || item.ratePerHour,
                        img: `http://122.248.194.140:8081/ExergyHRM/Users/GetProfileImageByFileName?fileName=${item.profileFileName}`
                    }));

                    setAllEmployees(newData);
                } else {
                    // Handle error case
                }
            })
            .catch((err) => {
                console.error(err);
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Could not assign employees.'
                })
            });
    }, []);
    function handleChange(id, action) {
        console.log(id, action)
        if (action === 'add') {

            setAllEmployees(allEmployees.map((item) => {
                if (item.id === id) {
                    return { ...item, added: true }
                } else {
                    return item
                }
            })
            )
        } else {
            setAllEmployees(allEmployees.map((item) => {
                if (item.id === id) {
                    return { ...item, added: false }
                } else {
                    return item
                }
            })
            )
        }
    }

    const handleRateChange = (id, event) => {
        const { value } = event.target;

        setAllEmployees((prevEmployees) =>
            prevEmployees.map((employee) =>
                employee.id === id ? { ...employee, 'ratePerHour': value } : employee
            )
        );
    };

    const handleUpdateAssignedEmployees = () => {
        const transformedShiftData = {
            name: shift.name,
            companyId: firmId,
            startDate: dayjs(shift.duration.start, 'DD/MM/YY').format('YYYY-MM-DD'),
            endDate: dayjs(shift.duration.end, 'DD/MM/YY').format('YYYY-MM-DD'),
            startTime: dayjs(shift.workingHours.start, 'hh:mmA').format('HH:mm'),
            endTime: dayjs(shift.workingHours.end, 'hh:mmA').format('HH:mm'),
            breakStartTime: shift.breakHours.start ? dayjs(shift.breakHours.start, 'hh:mmA').format('HH:mm') : '',
            breakEndTime: shift.breakHours.end ? dayjs(shift.breakHours.end, 'hh:mmA').format('HH:mm') : '',
            employeeIds: allEmployees.filter(emp => emp.added).map(emp => emp.id),
            employeeHourlyRates: allEmployees.filter(emp => emp.added).map(emp => emp.ratePerHour),
            shiftId: selectedShift,
            description: shift.description
        };

        const formdata = new FormData();
        for (const key in transformedShiftData) {
            formdata.append(key, transformedShiftData[key]);
        }

        dispatch(saveCompanyShifts(formdata))
            .then((result) => {
                if (result.payload.SUCCESS === 1) {
                    setAlert({
                        open: true,
                        severity: 'success',
                        message: `Changes saved.`
                    })
                    setOpen(false)
                    setShiftsUpdated(prev => prev + 1)
                } else {
                    // Handle error case
                }
            })
            .catch((err) => {
                console.error(err);
                setAlert({
                    open: true,
                    severity: 'error',
                    message: `Couldnt save changes.`
                })
                setOpen(false)
                // Handle error case
            });

    };

    return (
        <>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{
                    sx: {
                        width: 'auto',
                        maxWidth: 'none',
                        transition: 'all'
                    },
                }}
            >
                <Stack sx={{ backgroundColor: 'primary.main' }}>
                    <DialogTitle id="alert-dialog-title" variant="h4" sx={{ color: 'white' }}>
                        Assign Shift
                        <Typography sx={{ color: 'white' }}>Click on the employee to assign them to this schedule.</Typography>
                    </DialogTitle>
                </Stack>
                <DialogContent className='flex flex-col'>
                    <EmployeeTable allEmployees={allEmployees} handleChange={handleChange} handleRateChange={handleRateChange} getRandomImage={getRandomImage} />
                    <DialogActions sx={{ justifyContent: 'space-between', mt: 'auto' }}>
                        <Stack sx={{ width: '100%' }} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                            <Button onClick={() => setOpen(false)} variant="outlined" sx={{ mr: 1, color: 'primary.main', bgcolor: '#fff !important' }}>
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleUpdateAssignedEmployees}
                            >
                                Update
                            </Button>
                        </Stack>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </>
    );
};


function EmployeeTable({ staff, allEmployees, handleChange, getRandomImage, handleRateChange, loading }) {
    const [availableSearch, setAvailableSearch] = useState('');
    const [assignedSearch, setAssignedSearch] = useState('');

    const filteredAvailable = allEmployees.filter(employee =>
        !employee.added &&
        (employee.firstName.toLowerCase().includes(availableSearch.toLowerCase()) ||
            (employee.designationLabel && employee.designationLabel.toLowerCase().includes(availableSearch.toLowerCase())))
    );

    const filteredAssigned = allEmployees.filter(employee =>
        employee.added &&
        (employee.firstName.toLowerCase().includes(assignedSearch.toLowerCase()) ||
            (employee.designationLabel && employee.designationLabel.toLowerCase().includes(assignedSearch.toLowerCase())))
    );


    return (
        <Stack direction={'row'} spacing={5} sx={{ overflow: 'hidden' }} >
            <Box sx={{ width: '100%' }}>
                <Box direction={'row'} justifyContent={'space-between'} mb={1} className=' pb-1 grid grid-cols-2'>
                    <Typography sx={{ fontWeight: 'bold' }} className='col-span-1'>Schedule not assigned</Typography>
                    <Typography sx={{ fontWeight: 'bold', pl: 1 }} className='col-span-1'>{filteredAssigned.length} employee(s) assigned </Typography>
                </Box>
                <Stack direction={'row'} spacing={2} mb={1}>
                    <TextField
                        color='primary'
                        sx={{
                            width: '100%',
                            marginBottom: '1rem',
                            '& .MuiInputBase-root': {
                                border: 'none !important',
                                height: '30px',
                            },
                            '& .MuiOutlinedInput-input': {
                                pl: 0
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                            },
                        }}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IconSearch color={`${availableSearch ? 'primary.main' : 'gray'}`} size="1.1rem" />
                                </InputAdornment>
                            ),
                        }}
                        placeholder="name, designation"
                        size="small"
                        value={availableSearch}
                        onChange={(e) => setAvailableSearch(e.target.value)}
                    />
                    <TextField
                        color='primary'
                        sx={{
                            width: '100%',
                            marginBottom: '1rem',
                            '& .MuiInputBase-root': {
                                border: 'none !important',
                                height: '30px',
                            },
                            '& .MuiOutlinedInput-input': {
                                pl: 0
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                            },
                        }}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IconSearch color={`${assignedSearch ? 'primary.main' : 'gray'}`} size="1.1rem" />
                                </InputAdornment>
                            ),
                        }}
                        placeholder="name, designation"
                        size="small"
                        value={assignedSearch}
                        onChange={(e) => setAssignedSearch(e.target.value)}
                    />
                </Stack>

                <Stack pb={'1rem'} direction={'row'} justifyContent={'space-between'} spacing={2} sx={{ height: '23rem', width: '100%' }}>
                    {/* Available Employees */}
                    <Stack sx={{ width: '20rem', overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'thin' }} className=''>
                        <AnimatePresence mode='wait'>
                            {filteredAvailable.length > 0 ?
                                <motion.div key={'available'} className='w-full'>
                                    <AnimatePresence>
                                        {filteredAvailable.map((data, idx) => (
                                            <motion.div key={data.id} layout exit={{ x: 20, opacity: 0 }} transition={{ duration: .2 }} className='w-full'>
                                                <Box item sx={{ width: '100%' }} className={`border-b cursor-pointer hover:bg-zinc-100`} onClick={() => handleChange(data.id, 'add')}>
                                                    <Box sx={{ height: '50px', padding: '8px' }} className="flex items-center">
                                                        <Avatar src={data.img} className='w-8 h-8 flex-shrink-0 mr-2' />
                                                        <Box sx={{ flexGrow: 1, minWidth: 0, mr: 1 }}>
                                                            <Tooltip title={`${data.firstName} ${data.lastName}`} arrow>
                                                                <Typography sx={{ fontSize: '14px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: 'content-fit' }}>
                                                                    {`${data.firstName} ${data.lastName}`}
                                                                </Typography>
                                                            </Tooltip>
                                                            <Typography sx={{ fontSize: '11px', fontWeight: 600 }} className='text-overflow-ellipsis overflow-hidden whitespace-nowrap'>
                                                                {data.designationLabel || 'empty'}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ bgcolor: 'primary.main', flexShrink: 0, alignSelf: 'start' }} className='text-white rounded px-1 text-[12px] flex items-center w-fit gap-1' onClick={(e) => e.stopPropagation()}>
                                                            <input type='number' min={0} className='text-black h-full w-16 pl-[.4rem] border rounded' value={data.ratePerHour} onChange={(e) => handleRateChange(data.id, e)} />
                                                            <Typography className='w-1/2' sx={{ fontSize: '11px', fontWeight: 500, textAlign: 'end' }}>/hr</Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                                :
                                (!loading && <Typography key={'no-available'} sx={{ p: 2, textAlign: 'center', color: 'gray' }}>
                                    No available employees found for "{availableSearch}"
                                </Typography>)
                            }
                        </AnimatePresence>
                    </Stack>

                    {/* Assigned Employees */}
                    <Stack sx={{ width: '20rem', overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'thin' }}>
                        <AnimatePresence mode='wait'>
                            {filteredAssigned.length > 0 ?
                                <motion.div key={'assigned'}>
                                    <AnimatePresence>
                                        {filteredAssigned.map((data, idx) => (
                                            <motion.div key={data.id} layout exit={{ x: -20, opacity: 0 }} transition={{ duration: .2 }}>
                                                <Grid item sx={{
                                                    bgcolor: (theme) => `${theme.palette.primary.main}20`,
                                                }}
                                                    className={`border-b w-full cursor-pointer hover:opacity-70`} onClick={() => handleChange(data.id, 'remove')}>
                                                    <Box sx={{ height: '50px', padding: '8px' }} className="flex items-center">
                                                        <Avatar src={data.img} className='w-8 h-8 flex-shrink-0 mr-2' />
                                                        <Box sx={{ flexGrow: 1, minWidth: 0, mr: 1 }}>
                                                            <Tooltip title={`${data.firstName} ${data.lastName}`} arrow>
                                                                <Typography sx={{ fontSize: '14px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: 'content-fit' }}>
                                                                    {`${data.firstName} ${data.lastName}`}
                                                                </Typography>
                                                            </Tooltip>
                                                            <Typography sx={{ fontSize: '11px', fontWeight: 600 }} className='text-overflow-ellipsis overflow-hidden whitespace-nowrap'>
                                                                {data.designationLabel || 'empty'}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ bgcolor: 'primary.main', flexShrink: 0, alignSelf: 'start' }} className='text-white rounded px-1 text-[12px] flex items-center w-fit gap-1' onClick={(e) => e.stopPropagation()}>
                                                            <input type='number' min={0} className='text-black h-full w-16 pl-[.4rem] border rounded' value={data.ratePerHour} onChange={(e) => handleRateChange(data.id, e)} />
                                                            <Typography className='w-1/2' sx={{ fontSize: '11px', fontWeight: 500, textAlign: 'end' }}>/hr</Typography>
                                                        </Box>
                                                    </Box>
                                                </Grid>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                                :
                                (!loading && <Typography key={'no-assigned'} sx={{ p: 2, textAlign: 'center', color: 'gray' }}>
                                    No assigned employees found for "{assignedSearch}"
                                </Typography>)
                            }
                        </AnimatePresence>
                    </Stack>
                </Stack >
            </Box >
        </Stack >
    );
}