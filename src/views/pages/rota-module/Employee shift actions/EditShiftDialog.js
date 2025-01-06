import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Stack, Typography, TextField, Box, Button, FormControlLabel, Switch } from '@mui/material';
import dayjs from 'dayjs';
import TimeDropdown from '../TimeDropdown'; // Ensure you have this component available

const EditShiftDialog = ({ open, handleClose, shiftDetails, handleChange, shiftHours, editShift, disabled, calculateHours }) => {
    const calculateShiftHours = () => {
        if (!shiftDetails.start || !shiftDetails.end) return 0;

        const start = dayjs(shiftDetails.start, 'h:mm A');
        let end = dayjs(shiftDetails.end, 'h:mm A');

        // If end time is before start time, assume it's the next day
        if (end.isBefore(start)) {
            end = end.add(1, 'day');
        }

        let totalMinutes = end.diff(start, 'minute');

        // Subtract break time if it exists and is not paid
        if (shiftDetails.breakStartTime && shiftDetails.breakEndTime && !shiftDetails.isBreakPaid) {
            const breakStart = dayjs(shiftDetails.breakStartTime, 'h:mm A');
            let breakEnd = dayjs(shiftDetails.breakEndTime, 'h:mm A');

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
        const hourlyRate = shiftDetails.staff?.rate || 0;
        return (hours * hourlyRate).toFixed(2);
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
                    <Typography variant='h5' className='text-white'>{shiftDetails.title === '' ? 'New Shift' : 'Edit schedule'}</Typography>
                    <Typography variant='subtitle1' className='text-white'>{`${shiftDetails.day}, ${dayjs(shiftDetails.date).format('DD MMM YYYY')}`}</Typography>
                </Stack>
            </DialogTitle>
            <DialogContent
                sx={{
                    my: 2
                }}
            >
                <Stack direction='column'>
                    <Stack sx={{ px: '0px !important' }} direction='row' justifyContent='space-between' alignItems={'center'} spacing={2} p={1}>
                        <Typography fontWeight={'600'} variant='body1' className='text-black'>Shift start:</Typography>
                        <TimeDropdown slot={shiftDetails.slot} name="start" value={shiftDetails.start} onChange={handleChange} variant='outlined' size="small" />
                    </Stack>
                    <Stack sx={{ px: '0px !important' }} direction='row' justifyContent='space-between' alignItems={'center'} spacing={2} p={1}>
                        <Typography fontWeight={'600'} variant='body1' className='text-black'>Shift end:</Typography>
                        <TimeDropdown slot={shiftDetails.slot} name="end" value={shiftDetails.end} onChange={handleChange} variant='outlined' size="small" />
                    </Stack>

                    <Stack sx={{ px: '0px !important' }} direction='row' justifyContent='space-between' alignItems={'center'} spacing={2} p={1}>
                        <Typography fontWeight={'600'} variant='body1' className='text-black'>Break start:</Typography>
                        <TimeDropdown name="breakStartTime" value={shiftDetails.breakStartTime} onChange={handleChange} variant='outlined' size="small" />
                    </Stack>
                    <Stack sx={{ px: '0px !important' }} direction='row' justifyContent='space-between' alignItems={'center'} spacing={2} p={1}>
                        <Typography fontWeight={'600'} variant='body1' className='text-black'>Break end:</Typography>
                        <TimeDropdown name="breakEndTime" value={shiftDetails.breakEndTime} onChange={handleChange} variant='outlined' size="small" />
                    </Stack>
                    <Stack sx={{ px: '0px !important' }} direction='row' alignItems={'center'} spacing={1} p={1}>
                        <Typography fontWeight={'600'} variant='body1' className='text-black'>
                            Break Paid:
                        </Typography>
                        <Switch
                            checked={shiftDetails.isBreakPaid}
                            onChange={(e) => handleChange({ target: { name: 'isBreakPaid', value: e.target.checked } })}
                            name="isBreakPaid"
                            disabled={!shiftDetails.breakStartTime || !shiftDetails.breakEndTime}
                        />
                    </Stack>
                    <Stack py={1} direction='row' alignItems='center' spacing={1} >
                        <Typography fontWeight='600' variant='body1'>Hours Worked:</Typography>
                        <Typography variant='body1'>{hoursWorked} hrs (£{cost})</Typography>
                    </Stack>

                    {shiftDetails.title !== '' &&
                        <Stack sx={{ px: '0px !important' }} direction='row' justifyContent='space-between' alignItems='center' spacing={2} p={1}>
                            <Typography fontWeight={'600'} variant='body1' className='text-black'>Remarks:</Typography>
                            <TextField />
                        </Stack>}
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
                    <Button disabled={disabled} variant='contained' sx={{ bgcolor: disabled && '#d8dbdd !important' }} onClick={editShift}>{shiftDetails.title ? 'Update' : 'Add'}</Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
}

export default EditShiftDialog;
