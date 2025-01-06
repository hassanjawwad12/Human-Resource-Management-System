import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Typography, Box, Avatar, Grid, Checkbox, TextField,
    Slider, Stack
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { calculateHours, calculateBreakDuration, calculateTotalCost } from './scheduleUtils';
import { IconGridDots } from '@tabler/icons';

const DateShiftEdit = ({ open, onClose, shiftData, employees, onUpdate, defaultShifts, selectedDate }) => {
    const [employeeShifts, setEmployeeShifts] = useState({});
    const theme = useTheme();

    useEffect(() => {
        if (open && shiftData) {
            const initialEmployeeShifts = employees.reduce((acc, emp) => {
                const existingShift = defaultShifts.find(s =>
                    s.shiftId === shiftData.id &&
                    s.resource === emp.id &&
                    dayjs(s.start).isSame(selectedDate, 'day')
                );

                acc[emp.id] = {
                    selected: !!existingShift,
                    startTime: existingShift ? dayjs(existingShift.start) : dayjs().hour(shiftData.startTime[0]).minute(shiftData.startTime[1]),
                    endTime: existingShift ? dayjs(existingShift.end) : dayjs().hour(shiftData.endTime[0]).minute(shiftData.endTime[1]),
                    breakStartTime: existingShift && existingShift.breakStartTime ?
                        dayjs(selectedDate).hour(parseInt(existingShift.breakStartTime.split(':')[0])).minute(parseInt(existingShift.breakStartTime.split(':')[1])) :
                        null,
                    breakEndTime: existingShift && existingShift.breakEndTime ?
                        dayjs(selectedDate).hour(parseInt(existingShift.breakEndTime.split(':')[0])).minute(parseInt(existingShift.breakEndTime.split(':')[1])) :
                        null,
                    isBreakPaid: existingShift ? existingShift.isBreakPaid : false,
                };
                console.log(acc[emp.id])
                return acc;
            }, {});
            setEmployeeShifts(initialEmployeeShifts);
        }
    }, [open, shiftData, employees, defaultShifts, selectedDate]);

    const handleEmployeeToggle = (employeeId) => {
        setEmployeeShifts(prev => ({
            ...prev,
            [employeeId]: { ...prev[employeeId], selected: !prev[employeeId].selected }
        }));
    };

    const handleTimeChange = (employeeId, field, newValue) => {
        setEmployeeShifts(prev => ({
            ...prev,
            [employeeId]: { ...prev[employeeId], [field]: newValue }
        }));
    };

    const handleUpdate = () => {
        const updatedShifts = [];
        const deletedShiftIds = [];

        Object.entries(employeeShifts).forEach(([empId, data]) => {
            const existingShift = defaultShifts.find(s =>
                s.shiftId === shiftData.id &&
                s.resource === parseInt(empId) &&
                dayjs(s.start).isSame(selectedDate, 'day')
            );

            if (data.selected) {
                updatedShifts.push({
                    id: existingShift ? existingShift.id : null,
                    employeeId: parseInt(empId),
                    shiftId: shiftData.id,
                    start: data.startTime.format('HH:mm'),
                    end: data.endTime.format('HH:mm'),
                    breakStartTime: data.breakStartTime ? data.breakStartTime.format('HH:mm') : null,
                    breakEndTime: data.breakEndTime ? data.breakEndTime.format('HH:mm') : null,
                    isBreakPaid: data.isBreakPaid,
                    date: selectedDate.format('YYYY-MM-DD')
                });
            } else if (existingShift) {
                deletedShiftIds.push(existingShift.id);
            }
        });

        onUpdate(updatedShifts, deletedShiftIds);
        onClose();
    };

    const timeToSliderValue = (time) => {
        if (!time || !dayjs.isDayjs(time)) return 0;
        return time.hour() * 2 + Math.floor(time.minute() / 30);
    };

    const sliderValueToTime = (value) => {
        const hours = Math.floor(value / 2);
        const minutes = (value % 2) * 30;
        return dayjs().hour(hours).minute(minutes);
    };

    const getChartData = () => {
        console.log("Initial employeeShifts:", employeeShifts);

        const employeeData = Object.entries(employeeShifts)
            .filter(([_, data]) => data.selected)
            .map(([empId, data]) => {
                console.log(`Processing employee ${empId}:`, data);

                const employee = employees.find(e => e.id === parseInt(empId));
                console.log("Employee data:", employee);

                // Format times as strings in 'HH:mm' format
                const startTime = data.startTime.format('HH:mm');
                const endTime = data.endTime.format('HH:mm');
                const breakStartTime = data.breakStartTime ? data.breakStartTime.format('HH:mm') : null;
                const breakEndTime = data.breakEndTime ? data.breakEndTime.format('HH:mm') : null;

                console.log("Formatted times:", { startTime, endTime, breakStartTime, breakEndTime });

                const hours = calculateHours(
                    `2000-01-01T${startTime}`,
                    `2000-01-01T${endTime}`,
                    breakStartTime,
                    breakEndTime,
                    data.isBreakPaid
                );
                console.log("Calculated hours:", hours);

                let breakDuration = 0;
                if (breakStartTime && breakEndTime) {
                    breakDuration = calculateBreakDuration(breakStartTime, breakEndTime);
                }
                console.log("Break duration:", breakDuration);

                const cost = parseFloat(calculateTotalCost(hours, employee?.rate || 0, breakDuration, data.isBreakPaid));
                console.log("Calculated cost:", cost);

                return {
                    name: employee?.name || 'Unknown',
                    hours: isNaN(hours) ? 0 : parseFloat(hours.toFixed(2)),
                    rate: employee?.rate || 0,
                    cost: isNaN(cost) ? 0 : parseFloat(cost.toFixed(2))
                };
            });

        console.log("Final employeeData:", employeeData);

        const totalHours = employeeData.reduce((sum, emp) => sum + emp.hours, 0);
        const totalCost = employeeData.reduce((sum, emp) => sum + emp.cost, 0);
        const mostCostlyEmployee = employeeData.length > 0
            ? employeeData.reduce((prev, current) =>
                (prev.cost > current.cost) ? prev : current
            )
            : null;

        console.log("Total hours:", totalHours);
        console.log("Total cost:", totalCost);
        console.log("Most costly employee:", mostCostlyEmployee);

        return {
            employeeData,
            totalHours: parseFloat(totalHours.toFixed(2)),
            totalCost: parseFloat(totalCost.toFixed(2)),
            mostCostlyEmployee
        };
    };
    const chartData = getChartData();
    console.log(chartData)

    const pieChartOptions = {
        chart: {
            width: 380,
            type: 'pie',
        },
        labels: chartData.employeeData.map(emp => emp.name),
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }],
        colors: [
            theme.palette.primary.main,
            theme.palette.secondary.main,
            theme.palette.success.main,
            theme.palette.warning.main,
            theme.palette.error.main
        ],
        tooltip: {
            y: {
                formatter: function (value, { seriesIndex, dataPointIndex, w }) {
                    const employee = chartData.employeeData[seriesIndex];
                    const percentage = ((employee.cost / chartData.totalCost) * 100).toFixed(1);
                    return `${employee.hours.toFixed(2)} hours (£${employee.cost.toFixed(2)}) - ${percentage}%`;
                }
            }
        },
        dataLabels: {
            formatter: function (val, opts) {
                const employee = chartData.employeeData[opts.seriesIndex];
                const percentage = ((employee.cost / chartData.totalCost) * 100).toFixed(1);
                return `${percentage}%`;
            }
        }
    };

    const pieSeries = chartData.employeeData.map(emp => emp.cost);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <DialogTitle sx={{ bgcolor: 'primary.main', py: 2 }}>
                <Stack direction='column'>
                    <Typography variant='h5' className='text-white'>Edit {shiftData?.name}</Typography>
                    <Typography variant='subtitle1' className='text-white'>{`${selectedDate.format('dddd')}, ${selectedDate.format('DD MMM YYYY')}`}</Typography>
                </Stack>
            </DialogTitle>
            <DialogContent>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="h6" my={2} gutterBottom>Employees</Typography>
                            <Box sx={{ maxHeight: '60vh', overflowY: 'auto', scrollbarWidth: 'thin', pr: 1 }}>
                                {employees.map(emp => (
                                    <Box key={emp.id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', width: '30%', minWidth: '200px' }}>
                                            <Checkbox
                                                checked={employeeShifts[emp.id]?.selected || false}
                                                onChange={() => handleEmployeeToggle(emp.id)}
                                            />
                                            <Avatar src={emp.img} sx={{ width: 40, height: 40, mr: 2 }} />
                                            <Box>
                                                <Typography fontSize={15} fontWeight={600} noWrap>
                                                    {emp.name}
                                                </Typography>
                                                <Typography fontSize={12} color={'GrayText'}>
                                                    £{emp.rate}/hr
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', ml: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <TimePicker
                                                    disableOpenPicker
                                                    value={employeeShifts[emp.id]?.startTime}
                                                    onChange={(newValue) => handleTimeChange(emp.id, 'startTime', newValue)}
                                                    renderInput={(params) => <TextField {...params} size="small" sx={{ width: '45%' }} />}
                                                    disabled={!employeeShifts[emp.id]?.selected}
                                                />
                                                <Typography sx={{ mx: 1 }}>-</Typography>
                                                <TimePicker
                                                    disableOpenPicker
                                                    value={employeeShifts[emp.id]?.endTime}
                                                    onChange={(newValue) => handleTimeChange(emp.id, 'endTime', newValue)}
                                                    renderInput={(params) => <TextField {...params} size="small" sx={{ width: '45%' }} />}
                                                    disabled={!employeeShifts[emp.id]?.selected}
                                                />
                                            </Box>
                                            <Slider
                                                disableSwap
                                                value={[
                                                    timeToSliderValue(employeeShifts[emp.id]?.startTime),
                                                    timeToSliderValue(employeeShifts[emp.id]?.endTime)
                                                ]}
                                                onChange={(_, newValue) => {
                                                    handleTimeChange(emp.id, 'startTime', sliderValueToTime(newValue[0]));
                                                    handleTimeChange(emp.id, 'endTime', sliderValueToTime(newValue[1]));
                                                }}
                                                min={0}
                                                max={48}
                                                step={1}
                                                disabled={!employeeShifts[emp.id]?.selected}
                                                valueLabelDisplay="auto"
                                                valueLabelFormat={(value) => sliderValueToTime(value).format('HH:mm')}
                                            />
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box sx={{ p: '30px' }}>
                                <Typography variant="h5">Shift Statistics</Typography>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Employee hours and costs
                                </Typography>
                                {chartData.employeeData.length > 0 && chartData.totalCost > 0 ? (
                                    <>
                                        <Chart
                                            options={pieChartOptions}
                                            series={pieSeries}
                                            type="pie"
                                            height={300}
                                        />
                                        <Stack direction="row" spacing={2} justifyContent="space-between" mt={2}>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Box
                                                    width={38}
                                                    height={38}
                                                    bgcolor="primary.light"
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                >
                                                    <IconGridDots width={22} color={theme.palette.primary.main} />
                                                </Box>
                                                <Box>
                                                    <Typography variant="subtitle2" color="textSecondary">
                                                        Total Hours
                                                    </Typography>
                                                    <Typography variant="h6" fontWeight="600">
                                                        {chartData.totalHours.toFixed(2)}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Box
                                                    width={38}
                                                    height={38}
                                                    bgcolor="grey.200"
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                >
                                                    <IconGridDots width={22} color={theme.palette.grey[400]} />
                                                </Box>
                                                <Box>
                                                    <Typography variant="subtitle2" color="textSecondary">
                                                        Total Cost
                                                    </Typography>
                                                    <Typography variant="h6" fontWeight="600">
                                                        £{chartData.totalCost.toFixed(2)}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </Stack>
                                    </>
                                ) : (
                                    <Typography variant="body1">No cost data available. Please select employees and ensure they have shifts assigned.</Typography>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </LocalizationProvider>
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={onClose} sx={{ mr: 1, color: 'primary.main', bgcolor: '#fff !important' }}>
                    Cancel
                </Button>
                <Button onClick={handleUpdate} color="primary" variant="contained">
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DateShiftEdit;