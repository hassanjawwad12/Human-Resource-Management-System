import React, { useEffect, useState, useCallback } from 'react';
import dayjs from 'dayjs';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Tooltip,
    Typography,
    Box,
    Avatar,
    Divider,
    FormControl,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
    IconButton,
    Fade,
    Menu,
    Autocomplete,
    TextField,
    Chip,
    Button,
    Popover,
    Badge
} from '@mui/material';
import { useDispatch } from 'react-redux';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import { getAllMonthlyAttendances } from '../../../../store/attendance/AttendanceSlice';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import duration from 'dayjs/plugin/duration';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isToday from "dayjs/plugin/isToday"
import { filter } from 'lodash';
import CustomBackdrop from '../../../../components/forms/theme-elements/CustomBackdrop';
import FullscreenDialog from '../../../../components/material-ui/dialog/FullscreenDialog';
import AttendanceDetail from './AttendanceDetail';
import { IconLoader2 } from '@tabler/icons';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import { saveAs } from 'file-saver';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Breadcrumb from '../../../../layouts/full/shared/breadcrumb/Breadcrumb';
// import ExportMenu from '../../components/ExportMenu.js';

dayjs.extend(isToday);
dayjs.extend(duration);
dayjs.extend(customParseFormat);

const images = [
    'https://thumbs.dreamstime.com/b/profile-picture-caucasian-male-employee-posing-office-happy-young-worker-look-camera-workplace-headshot-portrait-smiling-190186649.jpg',
    'https://www.achievers.com/wp-content/uploads/2020/05/05-27-20-2.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpd7IcLjL3A0TuorAD99SbAjf4iAlMRr__AA&s',
    'https://www.shutterstock.com/image-photo/happy-motivated-asian-female-employee-260nw-1498344446.jpg',
    'https://thumbs.dreamstime.com/b/businessman-profile-icon-male-portrait-flat-style-business-man-vector-illustration-92058266.jpg',
];

const MonthlyAttendanceCalendar = () => {
    const firmId = JSON.parse(localStorage.getItem('Exergy HRMData'))?.firmId
    const [selectedMonth, setSelectedMonth] = useState(dayjs());
    const [availableMonths, setAvailableMonths] = useState([]);
    const dispatch = useDispatch()
    const [date, setDate] = useState({
        from: selectedMonth.startOf('month').format('YYYY-MM-DD'),
        to: selectedMonth.endOf('month').format('YYYY-MM-DD')
    });
    const [loading, setLoading] = useState(false);
    const [attendanceData, setAttendanceData] = useState([]);
    const [viewDetail, setViewDetail] = useState(false);
    const [employeeId, setEmployeeId] = useState(null)
    const [isFullScreen, setIsFullScreen] = useState(false)
    const [open, setOpen] = useState(false)
    const [selectedDesignations, setSelectedDesignations] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedWeek, setSelectedWeek] = useState(null);

    const openFilter = Boolean(anchorEl);
    const id = openFilter ? 'filter-popover' : undefined;


    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setAnchorEl(null);
    };


    const getWeeksOfMonth = useCallback(() => {
        const startOfMonth = selectedMonth.startOf('month');
        const endOfMonth = selectedMonth.endOf('month');
        const weeks = [];
        let currentWeekStart = startOfMonth.startOf('week');

        while (currentWeekStart.isBefore(endOfMonth)) {
            const weekEnd = currentWeekStart.endOf('week');
            weeks.push({
                start: currentWeekStart,
                end: weekEnd,
                label: `${currentWeekStart.format('MMM D')} - ${weekEnd.format('MMM D')}`,
            });
            currentWeekStart = currentWeekStart.add(1, 'week');
        }

        return weeks;
    }, [selectedMonth]);

    const weeks = getWeeksOfMonth();

    useEffect(() => {
        setSelectedWeek(null); // Reset selected week when month changes
    }, [selectedMonth]);

    const generateMonthsForYear = (year) => {
        return Array.from({ length: 12 }, (_, i) =>
            dayjs().year(year).month(i).format('MMMM YYYY')
        );
    };
    useEffect(() => {
        const currentYear = selectedMonth.year();
        const nextYear = currentYear + 1;
        const months = [
            ...generateMonthsForYear(currentYear),
            ...generateMonthsForYear(nextYear)
        ];
        setAvailableMonths(months);
    }, [selectedMonth]);

    const handlePreviousMonth = () => {
        setSelectedMonth(prev => prev.subtract(1, 'month'));
    };

    const handleNextMonth = () => {
        setSelectedMonth(prev => prev.add(1, 'month'));
    };

    const handleWeekChange = (e) => {
        const selectedWeekData = weeks.find(week => week.label === e.target.value);
        setSelectedWeek(selectedWeekData);
        if (selectedWeekData) {
            setDate({
                from: selectedWeekData.start.format('YYYY-MM-DD'),
                to: selectedWeekData.end.format('YYYY-MM-DD')
            });
        } else {
            // If "All Weeks" is selected, set date to full month
            setDate({
                from: selectedMonth.startOf('month').format('YYYY-MM-DD'),
                to: selectedMonth.endOf('month').format('YYYY-MM-DD')
            });
        }
    };

    const openEmployeeDetailModal = (id) => {
        setEmployeeId(id)
        setOpen(true)
    }

    const toggleFullScreen = useCallback(() => {
        setIsFullScreen(prevState => !prevState);
    }, []);

    useEffect(() => {
        const handleFullScreenChange = () => {
            if (!document.fullscreenElement && isFullScreen) {
                setIsFullScreen(false);
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && isFullScreen) {
                toggleFullScreen();
            }
        };

        document.addEventListener('fullscreenchange', handleFullScreenChange);
        document.addEventListener('keydown', handleKeyDown);

        // Cleanup function
        return () => {
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isFullScreen, toggleFullScreen]);

    useEffect(() => {
        if (isFullScreen) {
            document.documentElement.requestFullscreen().catch((e) => {
                console.error(`Error attempting to enable full-screen mode: ${e.message}`);
            });
        } else if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }, [isFullScreen]);


    useEffect(() => {
        setDate({
            from: selectedMonth.startOf('month').format('YYYY-MM-DD'),
            to: selectedMonth.endOf('month').format('YYYY-MM-DD')
        });
    }, [selectedMonth]);

    useEffect(() => {
        if (!date.to || !date.from) return;
        setLoading(true);

        const formdata = new FormData();
        formdata.append('companyId', firmId);
        formdata.append('startDate', dayjs(date.from).format('YYYY-MM-DD'));
        formdata.append('endDate', dayjs(date.to).format('YYYY-MM-DD'));

        dispatch(getAllMonthlyAttendances(formdata))
            .then((result) => {
                if (result.payload.SUCCESS === 1) {
                    setAttendanceData(result.payload.DATA);
                    setLoading(false);
                } else {
                    // Handle error
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
                // Handle error
            });
    }, [date.to, date.from]);



    const getDatesInRange = (start, end) => {
        const dates = [];
        let currentDate = dayjs(start);
        const endDate = dayjs(end);

        while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
            dates.push(currentDate);
            currentDate = currentDate.add(1, 'day');
        }

        return dates;
    };

    const dates = getDatesInRange(date.from, date.to);

    const getStatusColor = (status) => {
        switch (status) {
            case 'P':
                return { backgroundColor: '#e0ffe9', color: 'green' };
            case 'A':
                return { backgroundColor: '#ffc7c7', color: 'red' };
            case 'L':
                return { backgroundColor: '#fff0d6', color: 'black' };
            case 'CDO':
                return { backgroundColor: '#e3efff', color: '#0197f6' };
            case 'PH':
                return { backgroundColor: '#ececf9', color: 'purple' };
            default:
                return { backgroundColor: 'inherit', color: 'inherit' };
        }
    };

    const isToday = (date) => dayjs(date, 'DD/MM/YYYY').isToday();

    const employeeNames = [...new Set(attendanceData.map(employee => employee.employeeName))];
    const designations = [...new Set(attendanceData.map(employee => employee.employeeDesignationLabel))];

    const filteredData = attendanceData.filter(employee =>
        (selectedEmployees.length === 0 || selectedEmployees.includes(employee.employeeName)) &&
        (selectedDesignations.length === 0 || selectedDesignations.includes(employee.employeeDesignationLabel))
    );
    const filteredDates = selectedWeek
        ? getDatesInRange(selectedWeek.start, selectedWeek.end)
        : dates;

    const exportToCSV = (data) => {
        const dateRange = getDatesInRange(date.from, date.to);

        // Create header rows
        const dateHeaders = ['Employee Name', 'Employee ID', 'Designation'];
        const subHeaders = ['', '', ''];

        dateRange.forEach(d => {
            dateHeaders.push('');
            dateHeaders.push(d.format('D MMM ddd'));
            dateHeaders.push('');
            subHeaders.push('Time In');
            subHeaders.push('Time Out');
            subHeaders.push('Total');
        });
        dateHeaders.push('Total Hours Worked');
        subHeaders.push('');

        // Create rows for each employee
        const rows = data.map(employee => {
            const row = [
                employee.employeeName,
                employee.employeeNo,
                employee.employeeDesignationLabel
            ];

            let totalMinutesWorked = 0;

            // Add attendance details for each date
            dateRange.forEach(date => {
                const detail = employee.employeeDetail.find(d =>
                    dayjs(d.date, 'DD/MM/YYYY').isSame(date, 'day')
                );
                if (detail) {
                    row.push(detail.checkInTime || '-');
                    row.push(detail.checkOutTime || '-');
                    row.push(detail.totalWorked || '-');

                    // Sum up total minutes worked
                    if (detail.totalWorked) {
                        const [hours, minutes] = detail.totalWorked.split('hr ');
                        totalMinutesWorked += parseInt(hours) * 60 + parseInt(minutes);
                    }
                } else {
                    row.push('-');
                    row.push('-');
                    row.push('-');
                }
            });

            // Add total hours worked for the employee
            const totalHours = Math.floor(totalMinutesWorked / 60);
            const totalMinutes = totalMinutesWorked % 60;
            row.push(`${totalHours}hr ${totalMinutes}m`);

            return row;
        });

        // Combine headers and rows
        const csvContent = [
            dateHeaders.join(','),
            subHeaders.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        // Create and save the file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `attendance_${selectedMonth.format('MMMM_YYYY')}.csv`);
    };

    const activeFilterCount = selectedDesignations.length + selectedEmployees.length;
    const BCrumb = [
        {
            to: '/attendance',
            title: 'Attendance',
        },
        {
            title: 'Monthly Wise Attendance',
        }
    ];
    
    return (
        <>
        <div className='mt-5'></div>
        
            {
                open &&
                <FullscreenDialog open={open} setOpen={setOpen} title='Employee Attendance Details' >
                    <AttendanceDetail id={employeeId} initialDate={date} />
                </FullscreenDialog>
            }

            <TableContainer component={Paper}
             
                sx={{
                    maxHeight: '600px',
                    scrollbarWidth: 'thin',
                    mt: 0,
                    ...(isFullScreen && {
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 99999,
                        maxHeight: 'auto',
                        mt: 0,
                        overflow: 'auto',
                        backgroundColor: 'white',
                    }),
                }}>
                <Box sx={{ width: '100%' }} className='py-5 border-t flex justify-center items-center sticky left-0 top-0'>
                    <Box sx={{ width: '100%' }} className='flex justify-between items-center px-5 w-full'>
                        <Box className='flex items-center gap-5'>
                            <Typography color={'primary.main'} variant='h6' fontWeight={600}>{filteredData.length} Employee(s)</Typography>
                            <Divider flexItem orientation='vertical' />
                            <Box className='flex items-center justify-between border '>
                                <IconButton onClick={handlePreviousMonth} >
                                    <KeyboardArrowLeftIcon sx={{ color: 'primary.main' }} />
                                </IconButton>
                                <FormControl size="">
                                    <Select
                                        id="monthSelector"
                                        name="monthSelector"
                                        sx={{
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                border: 'none',
                                            },
                                            '& .MuiSelect-select': {
                                                pr: '5px !important',
                                                pl: '5px !important'
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                border: 'none',
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                border: 'none',
                                            },
                                            '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
                                                border: 'none',
                                            },
                                        }}
                                        disabled={loading}
                                        value={selectedMonth.format('MMMM YYYY')}
                                        IconComponent={() => { }}
                                        onChange={(e) => setSelectedMonth(dayjs(e.target.value, 'MMMM YYYY'))}
                                        displayEmpty
                                        inputProps={{ 'aria-label': 'Without label' }}
                                    >
                                        {availableMonths.map((month) => (
                                            <MenuItem key={month} value={month}>
                                                {month}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <IconButton onClick={handleNextMonth}>
                                    <KeyboardArrowRightIcon sx={{ color: 'primary.main' }} />
                                </IconButton>
                            </Box>
                            <FormControl size="">
                                <Select
                                    id="weekSelector"
                                    value={selectedWeek ? selectedWeek.label : ''}
                                    onChange={handleWeekChange}
                                    displayEmpty
                                    disabled={loading}
                                >
                                    <MenuItem value="">All Weeks</MenuItem>
                                    {weeks.map((week) => (
                                        <MenuItem key={week.label} value={week.label}>
                                            {week.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        <Box className='flex items-center gap-5'>
                            <Badge
                                badgeContent={activeFilterCount}
                                color="primary"
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                sx={{
                                    '& .MuiBadge-badge': {
                                        right: 5,
                                        top: 5,
                                        padding: '0 4px',
                                        height: '18px',
                                        minWidth: '18px',
                                    },
                                }}
                            >
                                <Button
                                    aria-describedby={id}
                                    variant="outlined"
                                    onClick={handleFilterClick}

                                    className="flex items-center gap-2 w-[6.6rem] h-[2.8rem]"
                                    sx={{
                                        color: true ? 'gray !important' : 'gray !important',
                                        border: true ? '1px solid #e5e7eb' : '1px solid lightgray',
                                        backgroundColor: 'white !important'
                                    }}
                                >
                                    Filters
                                    <FilterAltIcon />
                                </Button>
                            </Badge>

                            <Popover
                                id={id}
                                open={openFilter}
                                anchorEl={anchorEl}

                                onClose={handleFilterClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                            >
                                <Box sx={{ p: 2, pb: 4, width: 400 }}>
                                    <Box className='flex justify-end' onClick={() => {
                                        setSelectedDesignations([])
                                        setSelectedEmployees([])
                                        setAnchorEl(null)
                                    }}>
                                        <Typography
                                            color={'primary.main'}
                                            className='w-fit pb-1 underline cursor-pointer'>Clear</Typography>
                                    </Box>

                                    <Typography fontWeight={600} gutterBottom sx={{ mb: 1 }}>
                                        Designations
                                    </Typography>
                                    <Autocomplete
                                        multiple
                                        id="designationFilter"
                                        options={designations}
                                        value={selectedDesignations}
                                        onChange={(event, newValue) => setSelectedDesignations(newValue)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                size="small"
                                                placeholder="All Designations"
                                            />
                                        )}
                                    />
                                    <Typography fontWeight={600} gutterBottom sx={{ mt: 2, mb: 1 }}>
                                        Employees
                                    </Typography>
                                    <Autocomplete
                                        multiple
                                        id="employeeFilter"
                                        options={employeeNames}
                                        value={selectedEmployees}
                                        onChange={(event, newValue) => setSelectedEmployees(newValue)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                size="small"
                                                placeholder="All Employees"
                                            />
                                        )}
                                    />
                                </Box>
                            </Popover>
                            <FormControlLabel
                                value="start"
                                control={<Switch color="primary" checked={viewDetail} onChange={(e) => setViewDetail(e.target.checked)} />}
                                label="View Detail"
                                labelPlacement="start"
                            />
                            <IconButton onClick={toggleFullScreen}>
                                {!isFullScreen ? <FullscreenIcon color='primary' /> : <FullscreenExitIcon color='primary' />}
                            </IconButton>
                            <ExportMenu exportToCSV={exportToCSV} attendanceData={filteredData} />
                        </Box>
                    </Box>
                </Box>
                <Table padding='normal' header={'true'} stickyHeader sx={{ width: '100%', }}>
                    <TableHead >

                        <TableRow >
                            <TableCell sx={{ zIndex: 12 }} className='min-w-[15rem] w-[15rem] sticky left-0 bg-white border-r border-t'>
                                <Typography fontWeight={600}> Employee Name</Typography>
                            </TableCell>
                            {filteredDates.map(date => (
                                <TableCell sx={{ backgroundColor: isToday(date) ? 'primary.main' : '', color: isToday(date) ? 'white' : '' }} key={date.valueOf()} align="center" className='min-w-[4rem] border-r border-t'>
                                    <Box >
                                        <Typography color={isToday(date) ? 'white' : 'gray'}>{date.format('MMM')}</Typography>
                                        <Typography fontWeight={800}>{date.format('DD')} </Typography>
                                        <Typography color={isToday(date) ? 'white' : 'gray'}>{date.format('ddd')}</Typography>
                                    </Box>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading && <TableRow key={'loading'}>
                            <TableCell colSpan={15} width={'100%'} align="center">
                                <Box color={'primary.main'} className='text-center flex justify-center '>
                                    <div className='animate-spin'>
                                        <IconLoader2 size={30} />
                                    </div>
                                </Box>
                            </TableCell>
                        </TableRow>}

                        {!loading && filteredData.map((employee, index) => (

                            <Fade key={employee.employeeId} in>

                                <TableRow key={employee.employeeId}>

                                    {console.log(employee)}
                                    <TableCell component="th" scope="row" sx={{ zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} className='sticky left-0 border-r min-w-[10rem] bg-white '>
                                        <Box className='flex items-center gap-2'>
                                            <Avatar src={`http://122.248.194.140:8081/ExergyHRM/Users/GetProfileImageByFileName?fileName=${employee?.profileFileName}`} sx={{ width: 35, height: 35 }} />
                                            <Typography fontWeight={600} className='whitespace-nowrap text-ellipsis'> {employee.employeeName}</Typography>
                                        </Box>
                                        <IconButton onClick={() => openEmployeeDetailModal(employee.employeeId)}>
                                            <AccessAlarmIcon sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
                                        </IconButton>
                                    </TableCell>
                                    {filteredDates.map(date => {

                                        const detail = employee.employeeDetail.find(d => dayjs(d.date, 'DD/MM/YYYY').isSame(date, 'day'));
                                        return (
                                            <TableCell sx={{ maxWidth: selectedWeek ? '4.3rem' : '' }} key={date.valueOf()} align="center" className='border-r' padding='none'>
                                                <Box className='flex justify-center items-center mx-2 '>
                                                    {detail ? (
                                                        <Tooltip title={`In: ${detail.checkInTime || '-'}, Out: ${detail.checkOutTime || '-'}`}>
                                                            <Box className='flex items-center justify-center w-full' sx={{ color: getStatusColor(detail.statusSymbol).color, backgroundColor: getStatusColor(detail.statusSymbol).backgroundColor, minWidth: '3rem', minHeight: '3rem', borderRadius: 0, transition: 'ease-in' }}>
                                                                <Box fontWeight={800} sx={{ width: '100%', }}>
                                                                    {viewDetail && detail.statusSymbol === 'P' ? (
                                                                        <Fade in>
                                                                            <Box textAlign={'start'} className='px-2'>
                                                                                <Box className='grid grid-cols-[auto,1fr] gap-x-3 items-center'>
                                                                                    <Typography fontSize={11} className='flex items-center gap-1 whitespace-nowrap' variant="caption">
                                                                                        <span className='p-1 max-h-1 max-w-1 bg-green-500 rounded-full' />
                                                                                        IN:
                                                                                    </Typography>
                                                                                    <Typography fontSize={11} className='whitespace-nowrap text-right' variant="caption">
                                                                                        {detail.checkInTime || '-'}
                                                                                    </Typography>

                                                                                    <Typography fontSize={11} className='flex items-center gap-1 whitespace-nowrap' variant="caption">
                                                                                        <span className='p-1 max-h-1 max-w-1 bg-red-500 rounded-full' />
                                                                                        OUT:
                                                                                    </Typography>
                                                                                    <Typography fontSize={11} className='whitespace-nowrap text-right' variant="caption">
                                                                                        {detail.checkOutTime || '-'}
                                                                                    </Typography>

                                                                                    <Typography fontSize={11} className='flex items-center gap-1 whitespace-nowrap' variant="caption">
                                                                                        <span className='p-1 max-h-1 max-w-1 bg-blue-500 rounded-full' />
                                                                                        TW:
                                                                                    </Typography>
                                                                                    <Typography fontSize={11} className='whitespace-nowrap text-right' variant="caption">
                                                                                        {detail.totalWorked}
                                                                                    </Typography>
                                                                                </Box>
                                                                            </Box>
                                                                        </Fade>
                                                                    ) : detail.statusSymbol}
                                                                </Box>
                                                            </Box>
                                                        </Tooltip>
                                                    ) : (
                                                        <Box className='flex items-center justify-center w-full' sx={{ minWidth: '3rem', minHeight: '3rem', borderRadius: 0 }}>
                                                            <Typography>-</Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            </Fade>
                        ))}

                    </TableBody>
                </Table>
            </TableContainer >
        </>
    );
};

export default MonthlyAttendanceCalendar;


function ExportMenu({ exportToCSV, attendanceData }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleExport = () => {
        exportToCSV(attendanceData);
        handleClose();
    };

    return (
        <Box>
            <IconButton
                aria-label="more"
                aria-controls={open ? 'export-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="export-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'export-button',
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={handleExport} sx={{ color: 'primary.main' }}>
                    <FileOpenIcon fontSize='small' sx={{ color: 'primary.main', marginRight: 1 }} />
                    Export to CSV
                </MenuItem>
            </Menu>
        </Box>
    );
}
