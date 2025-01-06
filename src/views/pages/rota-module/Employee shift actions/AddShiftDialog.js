import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Stack, Typography, TextField, Box, Button, InputAdornment, FormControlLabel, Switch } from '@mui/material';
import dayjs from 'dayjs';
import TimeDropdown from '../TimeDropdown';

const AddShiftDialog = ({ open, handleClose, shiftDetails, handleChange, onSave }) => {
    const { startTime, endTime, breakStartTime, breakEndTime, hourlyRate, isBreakPaid } = shiftDetails;

    const isShiftValid = startTime && endTime;
    const isBreakValid = (!breakStartTime && !breakEndTime) || (breakStartTime && breakEndTime);
    const isFormValid = isShiftValid && isBreakValid;

    const calculateShiftHours = () => {
        if (!startTime || !endTime) return 0;

        const start = dayjs(startTime, 'h:mm A');
        let end = dayjs(endTime, 'h:mm A');

        // If end time is before start time, assume it's the next day
        if (end.isBefore(start)) {
            end = end.add(1, 'day');
        }

        let totalMinutes = end.diff(start, 'minute');

        // Subtract break time if it exists and is not paid
        if (breakStartTime && breakEndTime && !isBreakPaid) {
            const breakStart = dayjs(breakStartTime, 'h:mm A');
            let breakEnd = dayjs(breakEndTime, 'h:mm A');

            // If break end is before break start, assume it's the next day
            if (breakEnd.isBefore(breakStart)) {
                breakEnd = breakEnd.add(1, 'day');
            }

            const breakMinutes = breakEnd.diff(breakStart, 'minute');
            totalMinutes -= breakMinutes;
        }

        return Math.max(totalMinutes / 60, 0).toFixed(1);
    };

    const calculateCost = (hours) => {
        const rate = hourlyRate || 0;
        return (hours * rate).toFixed(2);
    };

    const hoursWorked = calculateShiftHours();
    const cost = calculateCost(hoursWorked);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            sx={{
                '& .MuiDialog-paper': {
                    borderRadius: '16px'
                }
            }}
        >
            <DialogTitle sx={{ bgcolor: 'primary.main', py: 2 }}>
                <Stack direction='column'>
                    <Typography variant='h5' className='text-white'>New Shift</Typography>
                    <Typography variant='subtitle1' className='text-white'>{`${dayjs(shiftDetails.date).format('dddd, DD MMM YYYY')}`}</Typography>
                </Stack>
            </DialogTitle>
            <DialogContent sx={{ my: 2 }}>
                <Stack direction='column'>
                    <Stack sx={{ px: '0px !important' }} direction='row' justifyContent='space-between' alignItems={'center'} spacing={2} p={1}>
                        <Typography fontWeight={'600'} variant='body1' className='text-black'>Shift start:</Typography>
                        <TimeDropdown name="startTime" value={startTime} onChange={handleChange} variant='outlined' size="small" />
                    </Stack>
                    <Stack sx={{ px: '0px !important' }} direction='row' justifyContent='space-between' alignItems={'center'} spacing={2} p={1}>
                        <Typography fontWeight={'600'} variant='body1' className='text-black'>Shift end:</Typography>
                        <TimeDropdown name="endTime" value={endTime} onChange={handleChange} variant='outlined' size="small" />
                    </Stack>
                    <Stack sx={{ px: '0px !important' }} direction='row' justifyContent='space-between' alignItems={'center'} spacing={2} p={1}>
                        <Typography fontWeight={'600'} variant='body1' className='text-black'>Break start:</Typography>
                        <TimeDropdown name="breakStartTime" value={breakStartTime} onChange={handleChange} variant='outlined' size="small" />
                    </Stack>
                    <Stack sx={{ px: '0px !important' }} direction='row' justifyContent='space-between' alignItems={'center'} spacing={2} p={1}>
                        <Typography fontWeight={'600'} variant='body1' className='text-black'>Break end:</Typography>
                        <TimeDropdown name="breakEndTime" value={breakEndTime} onChange={handleChange} variant='outlined' size="small" />
                    </Stack>
                    <Stack sx={{ px: '0px !important' }} direction='row' alignItems={'center'} spacing={1} p={1}>
                        <Typography fontWeight={'600'} variant='body1' className='text-black'>
                            Break Paid:
                        </Typography>
                        <Switch
                            checked={isBreakPaid}
                            onChange={(e) => handleChange({ target: { name: 'isBreakPaid', value: e.target.checked } })}
                            name="isBreakPaid"
                            disabled={!breakStartTime || !breakEndTime}
                        />
                    </Stack>
                    <Stack sx={{ px: '0px !important' }} direction='row' justifyContent='space-between' alignItems={'center'} spacing={2} p={1}>
                        <Typography fontWeight={'600'} variant='body1' className='text-black'>Hourly rate:</Typography>
                        <TextField
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <strong>£</strong>
                                    </InputAdornment>
                                ),
                            }}
                            name="hourlyRate"
                            type="number"
                            value={hourlyRate}
                            onChange={handleChange}
                            variant='outlined'
                            size="small"
                            inputProps={{ min: 0 }}
                            sx={{ width: '180px' }}
                        />
                    </Stack>
                    <Stack py={1} direction='row' alignItems='center' spacing={1} >
                        <Typography fontWeight='600' variant='body1'>Hours Worked:</Typography>
                        <Typography variant='body1'>{hoursWorked} hrs (£{cost})</Typography>
                    </Stack>
                </Stack>
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
                    <Button disabled={!isFormValid} variant='contained' sx={{ bgcolor: !isFormValid && '#d8dbdd !important' }} onClick={onSave}>Add</Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
}

export default AddShiftDialog;