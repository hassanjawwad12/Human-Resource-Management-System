import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Slider, Grid, FormControlLabel, TextField, Avatar, Select, MenuItem } from "@mui/material";
import { Box, fontSize, Stack } from "@mui/system";
import { useState, useEffect } from "react";
import './timerange.css'
import CustomCheckbox from "../../../components/forms/theme-elements/CustomCheckbox";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { IconLoader2 } from "@tabler/icons";
import { color } from "d3";

export default function EmployeeShiftsEdit({ open, toggle, employee, defaultShifts, onUpdate, shifts, fetchedSchedule, status }) {
    //This modal is responsible for bulk crud operations. 

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const [dayShifts, setDayShifts] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [selectedShift, setSelectedShift] = useState(shifts[0].id);
    const selectedShiftData = shifts.find(shift => shift.id === selectedShift);
    const selectedShiftStartTime = dayjs().hour(selectedShiftData.startTime[0]).minute(selectedShiftData.startTime[1])
    const selectedShiftEndTime = dayjs().hour(selectedShiftData.endTime[0]).minute(selectedShiftData.endTime[1]);



    useEffect(() => {
        if (!selectedShift) return;

        const initialDayShifts = daysOfWeek.reduce((acc, day) => {
            const defaultShift = defaultShifts.find(shift =>
                dayjs(shift.start).format('dddd') === day &&
                shift.shiftId === selectedShift
            );

            acc[day] = {
                checked: defaultShift ? true : false,
                // start: defaultShift ? dayjs(defaultShift.start) : dayjs().set('hour', 9).set('minute', 0),
                // end: defaultShift ? dayjs(defaultShift.end) : dayjs().set('hour', 17).set('minute', 0),
                start: defaultShift ? dayjs(defaultShift.start) : dayjs(selectedShiftStartTime),
                end: defaultShift ? dayjs(defaultShift.end) : dayjs(selectedShiftEndTime),
                sliderValue: defaultShift ? [
                    timeToSliderValue(dayjs(defaultShift.start).format('HH:mm')),
                    timeToSliderValue(dayjs(defaultShift.end).format('HH:mm'))
                ] : [timeToSliderValue(dayjs(selectedShiftStartTime).format('HH:mm')), timeToSliderValue(dayjs(selectedShiftEndTime).format('HH:mm'))],
                shiftId: selectedShift
            };
            return acc;
        }, {});
        setDayShifts(initialDayShifts);
    }, [defaultShifts, selectedShift]);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000); // 1 second delay

        return () => clearTimeout(timer); // Cleanup function to prevent memory leaks
    }, []);

    const handleShiftChange = (event) => {
        setSelectedShift(event.target.value);
    };

    const timeToSliderValue = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 2 + Math.floor(minutes / 30);
    };

    const sliderValueToTime = (value) => {
        const hours = Math.floor(value / 2);
        const minutes = (value % 2) * 30;
        return dayjs().hour(hours).minute(minutes);
    };


    const handleDayToggle = (day) => {
        setDayShifts(prev => ({
            ...prev,
            [day]: { ...prev[day], checked: !prev[day].checked }
        }));
    };

    const handleTimeChange = (day, type, newValue) => {
        setDayShifts(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                [type]: newValue,
                sliderValue: type === 'start'
                    ? [timeToSliderValue(newValue.format('HH:mm')), prev[day].sliderValue[1]]
                    : [prev[day].sliderValue[0], timeToSliderValue(newValue.format('HH:mm'))]
            }
        }));
    };
    const handleSliderChange = (day, newValue) => {
        setDayShifts(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                start: sliderValueToTime(newValue[0]),
                end: sliderValueToTime(newValue[1]),
                sliderValue: newValue
            }
        }));
    };
    const handleUpdate = () => {
        // Find the selected shift
        if (!selectedShiftData) {
            console.error('Selected shift not found');
            return;
        }

        const startDate = dayjs(selectedShiftData.startDate.join('-'));
        const endDate = dayjs(selectedShiftData.endDate.join('-'));
        console.log(startDate, endDate)

        const updatedShifts = Object.entries(dayShifts)
            .filter(([_, shift]) => shift.checked)
            .flatMap(([day, shift]) => {
                const existingShifts = defaultShifts.filter(defaultShift =>
                    dayjs(defaultShift.start).format('dddd') === day &&
                    defaultShift.shiftId === selectedShift &&
                    dayjs(defaultShift.start).isBetween(startDate, endDate, 'day', '[]')
                );

                if (existingShifts.length > 0) {
                    return existingShifts.map(existingShift => ({
                        id: existingShift.id,
                        day,
                        start: shift.start.format('HH:mm'),
                        end: shift.end.format('HH:mm'),
                        shiftId: selectedShift
                    }));

                } else {
                    const newShifts = [];
                    let currentDate = startDate.clone();
                    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
                        if (currentDate.format('dddd') === day) {
                            newShifts.push({
                                day,
                                date: currentDate.format('YYYY-MM-DD'),
                                start: shift.start.format('HH:mm'),
                                end: shift.end.format('HH:mm'),
                                isNew: true,
                                shiftId: selectedShift
                            });
                        }
                        currentDate = currentDate.add(1, 'day');
                    }
                    return newShifts;
                }
            });

        const deletedShifts = defaultShifts
            .filter(defaultShift =>
                defaultShift.shiftId === selectedShift &&
                !dayShifts[dayjs(defaultShift.start).format('dddd')]?.checked &&
                dayjs(defaultShift.start).isBetween(startDate, endDate, 'day', '[]')
            )
            .map(shift => shift.id);

        onUpdate(employee.id, updatedShifts, deletedShifts, selectedShift);
        // toggle();
    };


    return (
        <Dialog open={open} onClose={toggle} fullWidth maxWidth={'md'}>
            <Stack>
                <DialogTitle id="alert-dialog-title" variant="h4" sx={{ backgroundColor: 'primary.main', color: 'white' }}>
                    {`Edit ${employee.name}'s schedule`}
                    <Typography sx={{ color: 'white', pt: .5 }}>Changes made here will apply to the selected days. Unchecked days will be deleted from the schedule.</Typography>
                </DialogTitle>
            </Stack>

            <DialogContent sx={{ pt: .3, px: 7, height: '40rem' }}>
                {!isLoading ? <Box>
                    <Grid item xs={1} className='border-b'>
                        <Box className="p-2 flex flex-row justify-start space-x-2 items-center">
                            <Avatar src={employee.img} sx={{ width: 64, height: 64 }} />

                            <Stack sx={{ width: '100%', pb: 1 }}>
                                <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ width: '100%' }}>
                                    <Stack sx={{ width: '100%' }}>
                                        <Typography sx={{ fontSize: '19px', fontWeight: 600, width: '100%' }}>{employee.name}</Typography>
                                        <Typography sx={{ fontSize: '12px', fontWeight: 600 }} className='text-overflow-ellipsis '>{employee.title}</Typography>
                                    </Stack>

                                    <Box className='flex justify-end items-center space-between gap-2 w-full'>
                                        <Typography fontWeight={600} >Selected shift:</Typography>
                                        <Select

                                            value={selectedShift}
                                            onChange={handleShiftChange}

                                            displayEmpty
                                            sx={{ width: '40%' }}
                                        >

                                            {shifts.map((shift) => (
                                                <MenuItem key={shift.id} value={shift.id}>{shift.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </Box>
                                </Stack>

                            </Stack>
                        </Box>
                    </Grid>
                    {daysOfWeek.map(day => (
                        <Box key={day} className='grid grid-cols-4 place-content-center py-2'>
                            <FormControlLabel
                                control={
                                    <CustomCheckbox
                                        checked={dayShifts[day]?.checked || false}
                                        onChange={() => handleDayToggle(day)}
                                        disabled={!selectedShift}
                                    />
                                }
                                label={<span style={{ fontWeight: '800' }}>{day}</span>}
                            />
                            <Box className='flex flex-col w-full col-span-3'>
                                <Box className='flex items-center gap-2'>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <TimePicker
                                            disableOpenPicker
                                            size="small"
                                            value={dayShifts[day]?.start}
                                            onChange={(newValue) => handleTimeChange(day, 'start', newValue)}
                                            renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                            disabled={!selectedShift}
                                        />
                                    </LocalizationProvider>
                                    <Typography>to</Typography>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <TimePicker
                                            disableOpenPicker
                                            value={dayShifts[day]?.end}
                                            onChange={(newValue) => handleTimeChange(day, 'end', newValue)}
                                            renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                            disabled={!selectedShift}
                                        />
                                    </LocalizationProvider>
                                </Box>
                                <Slider
                                    disableSwap
                                    value={dayShifts[day]?.sliderValue || [18, 34]}
                                    onChange={(_, newValue) => handleSliderChange(day, newValue)}
                                    min={0}
                                    max={48}
                                    step={1}
                                    marks={[
                                        { value: 0, label: '12 AM' },
                                        { value: 24, label: '12 PM' },
                                        { value: 48, label: '12 AM' }
                                    ]}
                                    disabled={!selectedShift}
                                />
                            </Box>
                        </Box>
                    ))}
                </Box> :
                    <Box color={'primary.main'} className='w-full min-h-full flex justify-center items-center'>
                        <IconLoader2 sx={{ fontSize: '2rem' }} className='animate-spin' />
                    </Box>
                }
            </DialogContent >
            <DialogActions sx={{ justifyContent: 'space-between', p: 0, py: 1.5 }} className='flex items-center justify-between mx-[24px]'>
                <Button variant="outlined" onClick={toggle} sx={{ mr: 1, color: 'primary.main', bgcolor: '#fff !important' }}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ ml: 1 }}
                    onClick={handleUpdate}
                >
                    {status === 'updating' ? <IconLoader2 className='animate-spin text-white' /> : 'Add'}
                </Button>

            </DialogActions>
        </Dialog >
    );
}