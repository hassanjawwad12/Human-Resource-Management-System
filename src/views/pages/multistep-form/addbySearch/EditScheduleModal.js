import { useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";
import { Box } from "@mui/system";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, TextField } from "@mui/material";
import { FormControlLabel, Checkbox } from "@mui/material";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker, DesktopTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from 'dayjs';
import CustomCheckbox from "../../../../components/forms/theme-elements/CustomCheckbox";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import CustomTextField from "../../../../components/forms/theme-elements/CustomTextField";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

// 

export default function EditScheduleModal({ open, setIsOpen, row }) {
    const dispatch = useDispatch();
    const [months, setMonths] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(dayjs().format('MMMM YYYY'));
    const [schedule, setSchedule] = useState({});
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    const [selectedWeeks, setSelectedWeeks] = useState(weeks);
    const [selectedDays, setSelectedDays] = useState(daysOfWeek);

    const [isManualAttendance, setIsManualAttendance] = useState(false)


    useEffect(() => {
        const generateMonths = () => {
            const monthsArray = [];
            for (let i = 0; i < 24; i++) {
                monthsArray.push(dayjs().add(i, 'month').format('MMMM YYYY'));
            }
            setMonths(monthsArray);
        };
        generateMonths();
    }, []);

    useEffect(() => {
        const initialSchedule = {};
        daysOfWeek.forEach(day => {
            initialSchedule[day] = {
                timeIn: dayjs(row.startTime.join(':'), 'HH:mm').format('hh:mmA'), //i am populating the fields here with default data. Might need to refactor.
                breakTime: dayjs('1:00', 'hh:mm'),
                timeOut: dayjs(row.endTime.join(':'), 'HH:mm').format('hh:mmA'),
            };
        });
        setSchedule({ [selectedMonth]: initialSchedule });
    }, [selectedMonth]);

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const handleWeekChange = (event) => {
        const { target: { value } } = event;
        setSelectedWeeks(typeof value === 'string' ? value.split(',') : value); //???
    };

    const handleDayToggle = (day) => {
        const index = selectedDays.indexOf(day);
        if (index === -1) {
            setSelectedDays([...selectedDays, day]);
        } else {
            setSelectedDays(selectedDays.filter(d => d !== day));
        }
    };

    const handleTimeChange = (day, field, value) => {
        setSchedule(prev => ({
            ...prev,
            [selectedMonth]: {
                ...prev[selectedMonth],
                [day]: {
                    ...prev[selectedMonth]?.[day],
                    [field]: value
                }
            }
        }));
    };

    const handleSubmit = () => {
        // Logic to dispatch updated schedule to Redux store or API
        console.log(schedule);
        toggle();
    };

    const toggle = () => {
        setIsOpen(!open);
    };

    return (
        <Dialog open={open} onClose={toggle} fullWidth maxWidth={'md'}>
            <DialogTitle id="alert-dialog-title" variant="h6" sx={{ backgroundColor: 'primary.main', color: 'white' }}>
                {`Edit ${row.name}'s schedule`}
            </DialogTitle>
            <DialogContent sx={{ padding: 0, scrollbarWidth: 'thin', position: 'relative', opacity: isManualAttendance ? '.5' : null }}>
                {/* an overlay to disable clicks */}
                {isManualAttendance && <Box sx={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 5, cursor: 'not-allowed' }}>

                </Box>}
                <Box>
                    <Box className='grid grid-cols-2 gap-x-5 gap-y-2 py-2 px-[24px]'>
                        <Box className='flex items-center justify-between w-full'>
                            <Typography sx={{ fontWeight: '800 ' }}>Start date:</Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    // value={formik.values.startOnDate}
                                    // onChange={(newValue) => formik.setFieldValue('startOnDate', newValue)}
                                    renderInput={(props) =>
                                        <CustomTextField
                                            {...props}
                                            sx={{ width: '250px' }}
                                            size='small'

                                        // error={formik.touched.startOnDate && Boolean(formik.errors.startOnDate)}
                                        // helperText={formik.touched.startOnDate && formik.errors.startOnDate}
                                        />
                                    }

                                />
                            </LocalizationProvider>
                        </Box>

                        <Box className='flex items-center justify-between'>
                            <Typography sx={{ fontWeight: '800 ' }}>End date:</Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker

                                    // value={formik.values.endOnDate}
                                    // onChange={(newValue) => formik.setFieldValue('endOnDate', newValue)}
                                    renderInput={(props) =>
                                        <CustomTextField
                                            {...props}
                                            sx={{ width: '250px' }}
                                            size='small'

                                        // error={formik.touched.endOnDate && Boolean(formik.errors.endOnDate)}
                                        // helperText={formik.touched.endOnDate && formik.errors.endOnDate}

                                        />
                                    }

                                />
                            </LocalizationProvider>
                        </Box>

                        <Box className='flex items-center justify-between'>
                            <Typography sx={{ fontWeight: '800 ' }}>Month:</Typography>
                            <FormControl sx={{ width: '250px' }}>
                                <Select
                                    size='small'
                                    labelId="month-select-label"
                                    id="month-select"
                                    value={selectedMonth}
                                    onChange={handleMonthChange}
                                    MenuProps={MenuProps}
                                >
                                    {months.map((month) => (
                                        <MenuItem key={month} value={month}>
                                            {month}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box className='flex items-center justify-between'>
                            <Typography sx={{ fontWeight: '800 ' }}>Week:</Typography>
                            <FormControl sx={{ width: '250px' }} >
                                <Select
                                    size='small'
                                    labelId="week-select-label"
                                    id="week-select"
                                    multiple
                                    value={selectedWeeks}
                                    onChange={handleWeekChange}
                                    renderValue={(selected) => selected.join(', ')}
                                    MenuProps={MenuProps}
                                >
                                    {weeks.map((week) => (
                                        <MenuItem key={week} value={week}>
                                            <Checkbox checked={selectedWeeks.indexOf(week) > -1} />
                                            <ListItemText primary={week} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                    {/* <FormControlLabel sx={{ my: 2, width: 'fit-content' ,ml:2}}
                        control={
                            <CustomCheckbox

                            />
                        }
                        label={<span style={{ fontWeight: '800' }}>Machine-Based Attendance Tracking</span>}
                    /> */}
                    <Box className='grid grid-cols-4 py-4 items-center bg-green-100 gap-5 text-center px-[24px]'>
                        <Typography sx={{ fontWeight: '800 ' }}>Days</Typography>
                        <Typography sx={{ fontWeight: '800 ' }}>Time In</Typography>
                        <Typography sx={{ fontWeight: '800 ' }}>Break Time</Typography>
                        <Typography sx={{ fontWeight: '800 ' }}>Time Out</Typography>
                    </Box>
                    <Box className='grid grid-cols-1 py-4 gap-x-5 gap-y-2 mt-2 text-center px-[24px]'>
                        {daysOfWeek.map((day, i) => (
                            <React.Fragment key={day}>
                                <div className={`grid grid-cols-4 items-center gap-5 text-center`}>

                                    <FormControlLabel
                                        control={
                                            <CustomCheckbox
                                                checked={selectedDays.includes(day)}
                                                onChange={() => handleDayToggle(day)}
                                            />
                                        }
                                        label={<span style={{ fontWeight: '800' }}>{day}</span>}
                                    />
                                    <div className={`${!selectedDays.includes(day) && 'opacity-50'}`}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DesktopTimePicker

                                                disabled={!selectedDays.includes(day)}
                                                value={dayjs(row.startTime.join(':'), 'HH:mm')}
                                                onChange={(value) => handleTimeChange(day, 'timeIn', value)}
                                                renderInput={(params) => <TextField {...params} size='small' />}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                    <div className={`${!selectedDays.includes(day) && 'opacity-50'}`}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DesktopTimePicker


                                                disabled={!selectedDays.includes(day)}
                                                value={schedule[selectedMonth]?.[day]?.breakTime || dayjs('1:00', 'h:mm')}
                                                onChange={(value) => handleTimeChange(day, 'breakTime', value)}
                                                renderInput={(params) => <TextField {...params} size='small' />}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                    <div className={`${!selectedDays.includes(day) && 'opacity-50'}`}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DesktopTimePicker

                                                disabled={!selectedDays.includes(day)}
                                                value={dayjs(row.endTime.join(':'), 'HH:mm')}
                                                onChange={(value) => handleTimeChange(day, 'timeOut', value)}
                                                renderInput={(params) => <TextField {...params} size='small' />}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                </div>
                                {i !== daysOfWeek.length - 1 && <hr />}
                            </React.Fragment>
                        ))}
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between', p: 0, py: 1.5 }} className='flex items-center justify-between mx-[24px]'>
                <FormControlLabel sx={{ width: 'fit-content' }}
                    control={
                        <CustomCheckbox
                            checked={isManualAttendance}
                            onChange={() => setIsManualAttendance(!isManualAttendance)}
                        />
                    }
                    label={<span style={{ fontWeight: '800' }}>Machine-Based Attendance Tracking</span>}
                />
                <Box className='flex items-center gap-3'>
                    <Button onClick={toggle} variant="outlined" sx={{ mr: 1, color: 'primary.main !important', bgcolor: '#fff !important' }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ ml: 1 }}
                        onClick={handleSubmit}
                    >
                        Update
                    </Button>
                </Box>
            </DialogActions>
        </Dialog >
    );
}


