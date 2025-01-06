import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, Box, Typography, Autocomplete, Avatar } from '@mui/material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';

import { saveNewAttendance } from '../../../../store/attendance/AttendanceSlice';
import { getAllEmployeesData } from '../../../../store/hr/EmployeeSlice';

const CreateAttendanceModal = ({ open, handleClose, setAlert, companyId, setChanges }) => {
    const dispatch = useDispatch();
    const [date, setDate] = useState(dayjs());
    const [startTime, setStartTime] = useState(dayjs().hour(9).minute(0));
    const [endTime, setEndTime] = useState(dayjs().hour(17).minute(0));
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        const formData = new FormData();
        formData.append('companyId', companyId);

        dispatch(getAllEmployeesData(formData))
            .then((result) => {
                if (result.payload.SUCCESS === 1) {
                    const employeesWithImages = result.payload.DATA.map(employee => ({
                        ...employee,
                        imageUrl: `http://122.248.194.140:8081/ExergyHRM/Users/GetProfileImageByFileName?fileName=${employee.profileFileName}`
                    }));
                    setEmployees(employeesWithImages);
                } else {
                    throw new Error(result);
                }
            })
            .catch(err => {
                console.error(err);
                setAlert({
                    open: true,
                    severity: 'error',
                    message: err.USER_MESSAGE || 'Something went wrong fetching employees.'
                });
            });
    }, [companyId, dispatch, setAlert]);

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append('companyId', companyId);
        formData.append('employeeId', selectedEmployee.id);
        formData.append('date', date.format('YYYY-MM-DD'));
        formData.append('startTime', startTime ? startTime.format('HH:mm') : '');
        formData.append('endTime', endTime ? endTime.format('HH:mm') : '');

        dispatch(saveNewAttendance(formData))
            .then(result => {
                if (result.payload.SUCCESS === 1) {
                    setAlert({
                        open: true,
                        severity: 'success',
                        message: 'Attendance created successfully'
                    });
                    setChanges(prev => prev + 1)
                    handleClose();
                } else {
                    throw new Error(result);
                }
            })
            .catch(err => {
                console.error(err);
                setAlert({
                    open: true,
                    severity: 'error',
                    message: err.USER_MESSAGE || 'Something went wrong creating attendance.'
                });
            });
    };

    const disabled = !selectedEmployee || !date || !startTime || !endTime;

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle sx={{ bgcolor: 'primary.main', py: 2 }}>
                <Stack direction='column'>
                    <Typography variant='h5' className='text-white'>New Attendance</Typography>
                    <Typography variant='subtitle1' className='text-white'>{`${date.format('dddd')}, ${date.format('DD MMM YYYY')}`}</Typography>
                </Stack>
            </DialogTitle>
            <DialogContent>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <Autocomplete
                            options={employees}
                            getOptionLabel={(option) => option.fullName}
                            renderOption={(props, option) => (
                                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                    <Avatar src={option.imageUrl} sx={{ width: '35px', height: '35px', mr: 2 }} />
                                    <Box>
                                        <Typography> {option.fullName}</Typography>
                                        <Typography fontSize={10}> {option.employeeNo}</Typography>
                                    </Box>

                                </Box>
                            )}
                            renderInput={(params) => <TextField {...params} label="Select Employee" />}
                            onChange={(event, newValue) => {
                                setSelectedEmployee(newValue);
                            }}
                        />
                        <DatePicker
                            inputFormat='DD/MM/YYYY'
                            label="Date"
                            value={date}
                            onChange={(newValue) => setDate(newValue)}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                        <TimePicker
                            label="Start Time"
                            value={startTime}
                            onChange={(newValue) => setStartTime(newValue)}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                        <TimePicker
                            label="End Time"
                            value={endTime}
                            onChange={(newValue) => setEndTime(newValue)}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                    </Stack>
                </LocalizationProvider>
            </DialogContent>
            <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', px: 3 }}>
                <Box sx={{ ml: 'auto' }}>
                    <Button
                        variant='outlined'
                        onClick={handleClose}
                        sx={{ mr: 1, color: 'primary.main !important', bgcolor: '#fff !important' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={disabled}
                        variant='contained'
                        sx={{ bgcolor: disabled ? '#d8dbdd !important' : undefined }}
                        onClick={handleSubmit}
                    >
                        Add
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default CreateAttendanceModal;