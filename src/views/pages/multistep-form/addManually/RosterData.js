import { Box, Stack, fontSize, fontWeight } from '@mui/system'
import React, { useState, useEffect } from 'react'
import CustomFormLabel from '../../../../components/forms/theme-elements/CustomFormLabel'
import CustomTextField from '../../../../components/forms/theme-elements/CustomTextField'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import CustomCheckbox from '../../../../components/forms/theme-elements/CustomCheckbox';
import { FormControlLabel, FormGroup, InputAdornment, Typography } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Checkbox } from "@mui/material"
import dayjs from 'dayjs';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import { getWeeksOfMonth, getUpcomingMonths } from '../../../../store/hr/EmployeeSlice';
import getDayIds from '../util/getDayIds';
import CustomBackdrop from '../../../../components/forms/theme-elements/CustomBackdrop';




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

const RosterData = ({ formik }) => {
    console.log(formik.touched.hourlyRate)
    const dispatch = useDispatch();
    console.log(formik.values)
    const { schedule } = useSelector((state) => state.firmReducer);
    const { weeksOfMonth, upcomingMonths, loading } = useSelector((state) => state.employeeReducer);

    useEffect(() => {
        dispatch(getUpcomingMonths());
    }, []);

    useEffect(() => {
        if (upcomingMonths.length > 0) {
            formik.setFieldValue('selectedMonth', upcomingMonths[0]);
        }
    }, [upcomingMonths]);

    useEffect(() => {
        if (formik.values.selectedMonth) {
            const formData = new FormData();
            formData.append('year', formik.values.selectedMonth.YearLabel);
            formData.append('month', formik.values.selectedMonth.monthId);
            dispatch(getWeeksOfMonth(formData));
        }
    }, [formik.values.selectedMonth]);

    useEffect(() => {
        if (weeksOfMonth.length > 0) {
            formik.setFieldValue('selectedWeeks', weeksOfMonth);
        }
    }, [weeksOfMonth]);

    const handleMonthChange = (event) => {
        const selectedMonth = event.target.value;
        formik.setFieldValue('selectedMonth', selectedMonth);
    };

    const handleWeekChange = (event) => {
        const { target: { value } } = event;
        formik.setFieldValue('selectedWeeks', typeof value === 'string' ? value.split(',') : value);
    };

    return (
        <Box>
            <CustomBackdrop loading={loading} />
            <Stack direction="row" sx={{ width: '100%' }} justifyContent="space-between">
                <Stack sx={{ width: '100%' }}>
                    <Stack direction="row" spacing={3}>
                        <Box sx={{ width: "100%" }}>
                            <CustomFormLabel htmlFor="startOnDate">
                                Start Date <span style={{ color: "red", fontSize: "15px" }}>*</span>
                            </CustomFormLabel>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    value={formik.values.startOnDate}
                                    minDate={dayjs()}
                                    onChange={(newValue) => formik.setFieldValue('startOnDate', newValue)}
                                    renderInput={(props) => (
                                        <CustomTextField
                                            {...props}
                                            fullWidth
                                            error={formik.touched.startOnDate && Boolean(formik.errors.startOnDate)}
                                            helperText={formik.touched.startOnDate && formik.errors.startOnDate}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </Box>

                        <Box sx={{ width: "100%" }}>
                            <CustomFormLabel htmlFor="endOnDate">
                                End Date <span style={{ color: "red", fontSize: "15px" }}>*</span>
                            </CustomFormLabel>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    value={formik.values.endOnDate}
                                    minDate={formik.values.startOnDate}
                                    onChange={(newValue) => formik.setFieldValue('endOnDate', newValue)}
                                    renderInput={(props) => (
                                        <CustomTextField
                                            {...props}
                                            fullWidth
                                            error={formik.touched.endOnDate && Boolean(formik.errors.endOnDate)}
                                            helperText={formik.touched.endOnDate && formik.errors.endOnDate}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </Box>
                    </Stack>
                    <Stack direction="row-reverse" spacing={3}>
                        <Box sx={{ width: '100%' }}>
                            <CustomFormLabel htmlFor="hourlyRate">
                                Hourly rate <span style={{ color: "red", fontSize: "15px" }}>*</span>
                            </CustomFormLabel>
                            <CustomTextField
                                id="hourlyRate"
                                variant="outlined"
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <strong>£</strong>
                                        </InputAdornment>
                                    ),
                                }}
                                type="number"
                                name="hourlyRate"
                                value={formik.values.hourlyRate}
                                onChange={formik.handleChange}
                                error={formik.touched.hourlyRate && Boolean(formik.errors.hourlyRate)}
                                helperText={formik.touched.hourlyRate && formik.errors.hourlyRate}
                            />
                        </Box>
                        <Stack direction="row-reverse" spacing={3} sx={{ width: '100%' }}>
                            <Box sx={{ minWidth: '300px', width: '300px' }}>
                                <CustomFormLabel htmlFor="selectedWeeks">
                                    Weeks <span style={{ color: "red", fontSize: "15px" }}>*</span>
                                </CustomFormLabel>
                                <FormControl sx={{ width: '100%' }}>
                                    <Select
                                        labelId="week-select-label"
                                        id="week-select"
                                        multiple
                                        value={formik.values.selectedWeeks}
                                        onChange={handleWeekChange}
                                        error={formik.touched.selectedWeeks && Boolean(formik.errors.selectedWeeks)}

                                        renderValue={(selected) => selected.map((week) => week.label).join(', ')}
                                        MenuProps={MenuProps}
                                    >
                                        {weeksOfMonth.length > 0 && weeksOfMonth.map((week) => (
                                            <MenuItem key={week.label} value={week}>
                                                <Checkbox checked={formik.values.selectedWeeks.some(selectedWeek => selectedWeek.label === week.label)} />
                                                <ListItemText primary={week.label} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {formik.touched.selectedWeeks && Boolean(formik.errors.selectedWeeks) && <Typography sx={{ color: '#FA896B', ml: '14px', mt: '3px', fontSize: '0.75rem' }}>{formik.errors.selectedWeeks}</Typography>}
                                </FormControl>
                            </Box>
                            <Box sx={{ width: '100%' }}>
                                <CustomFormLabel htmlFor="selectedMonth">
                                    Month <span style={{ color: "red", fontSize: "15px" }}>*</span>
                                </CustomFormLabel>
                                <FormControl sx={{ width: '100%' }}>
                                    <Select
                                        labelId="month-select-label"
                                        id="month-select"
                                        value={formik.values.selectedMonth}
                                        onChange={handleMonthChange}
                                        MenuProps={MenuProps}
                                    >
                                        {upcomingMonths.length > 0 && upcomingMonths.map((data) => (
                                            <MenuItem key={data.monthLabel} value={data}>
                                                {data.monthLabel} {data.YearLabel}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {formik.touched.selectedMonth && Boolean(formik.errors.selectedMonth) && <Typography sx={{ color: '#FA896B', ml: '14px', mt: '3px', fontSize: '0.75rem' }}>{formik.errors.selectedMonth}</Typography>}
                                </FormControl>
                            </Box>
                        </Stack>
                    </Stack>
                    <FormControlLabel
                        sx={{ mt: 3, width: 'fit-content' }}
                        control={
                            <CustomCheckbox
                                checked={formik.values.checked}
                                onChange={() => {
                                    formik.setFieldValue('checked', !formik.values.checked)
                                }}
                            />
                        }
                        label={<span style={{ fontWeight: '800' }}>Machine-Based Attendance Tracking</span>}
                    />
                </Stack>
            </Stack>
            <Box sx={{ position: 'relative', opacity: formik.values.checked ? 0.5 : 1 }}>
                {formik.values.checked &&
                    <Box sx={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 5, cursor: 'not-allowed' }}></Box>
                }
                <EmployeeScheduleSetter firmSchedule={schedule} formik={formik} />
            </Box>
        </Box >
    );
};



function EmployeeScheduleSetter({ firmSchedule, formik }) {
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const dayNameToId = {
        "Monday": 1,
        "Tuesday": 2,
        "Wednesday": 3,
        "Thursday": 4,
        "Friday": 5,
        "Saturday": 6,
        "Sunday": 7
    };
    useEffect(() => {
        const initialSchedule = {};
        daysOfWeek.forEach(day => {
            initialSchedule[day] = {
                id: dayNameToId[day],
                isActive: true, // Add isActive field
                timeIn: firmSchedule.workStartTime ? dayjs(firmSchedule.workStartTime, 'h:mmA') : dayjs('12:00AM', 'h:mmA'),
                breakTime: dayjs('1:00PM', 'h:mmA'),
                timeOut: firmSchedule.workEndTime ? dayjs(firmSchedule.workEndTime, 'h:mmA') : dayjs('12:00PM', 'h:mmA'),
            };
        });
        formik.setFieldValue('schedule', initialSchedule);
    }, []);

    const handleDayToggle = (day) => {
        formik.setFieldValue('schedule', {
            ...formik.values.schedule,
            [day]: {
                ...formik.values.schedule[day],
                isActive: !formik.values.schedule[day].isActive // Toggle isActive field
            }
        });
    };

    const handleTimeChange = (day, field, value) => {
        formik.setFieldValue('schedule', {
            ...formik.values.schedule,
            [day]: {
                ...formik.values.schedule[day],
                [field]: value
            }
        });
    };

    const handleSubmit = () => {
        console.log(formik.values.schedule);
        toggle();
    };


    return (
        <Box mt={5}>
            <Box sx={{ padding: 0, scrollbarWidth: 'thin' }}>
                <Box>
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
                                                checked={formik.values.schedule[day]?.isActive}
                                                onChange={() => handleDayToggle(day)}
                                            />
                                        }
                                        label={<span style={{ fontWeight: '800' }}>{day}</span>}
                                    />
                                    <div className={`${!formik.values.schedule[day]?.isActive && 'opacity-50'}`}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <TimePicker
                                                format=""
                                                disabled={!formik.values.schedule[day]?.isActive}
                                                value={formik.values.schedule[day]?.timeIn}
                                                onChange={(value) => handleTimeChange(day, 'timeIn', value)}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                    <div className={`${!formik.values.schedule[day]?.isActive && 'opacity-50'}`}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <TimePicker
                                                format=""
                                                disabled={!formik.values.schedule[day]?.isActive}
                                                value={formik.values.schedule[day]?.breakTime || dayjs('1:00PM', 'h:mmA')}
                                                onChange={(value) => handleTimeChange(day, 'breakTime', value)}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                    <div className={`${!formik.values.schedule[day]?.isActive && 'opacity-50'}`}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <TimePicker
                                                format=""
                                                disabled={!formik.values.schedule[day]?.isActive}
                                                value={formik.values.schedule[day]?.timeOut}
                                                onChange={(value) => handleTimeChange(day, 'timeOut', value)}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                </div>
                                {i !== daysOfWeek.length - 1 && <hr />}
                            </React.Fragment>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}


export default RosterData