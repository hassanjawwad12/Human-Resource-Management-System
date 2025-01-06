import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Paper, TextField, Typography, Tooltip, Menu, MenuItem } from '@mui/material';
import { Box, fontSize, Stack } from '@mui/system'
import React, { useEffect, useState, useCallback } from 'react';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomCheckbox from '../../../components/forms/theme-elements/CustomCheckbox';
import dayjs from 'dayjs';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import TimeDropdown from './TimeDropdown';
import duration from 'dayjs/plugin/duration';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { getAllActiveShiftsByCompanyId, updateShiftById, deleteEmployeeShiftById, saveShiftEmployee, updateAndDeleteShiftEmployee } from '../../../store/rota/RotaSlice';
import {
    daysOfWeek,
    getNextDateOfWeek,
    getActiveDays,
    mapShiftsToDays,
    calculateHours,
    calculateTotalCost,
    totalHoursAndCost,
    totalHoursWeekly,
    calculateTotalWeeklyCost,
    getRandomHexColorCode,
    parseDate,
    exportToCSV,
    calculateBreakDuration
} from './scheduleUtils';
import { getFirmSchedule } from '../../../store/admin/FirmSlice';
import { useDispatch, useSelector } from 'react-redux';
import CustomBackdrop from '../../../components/forms/theme-elements/CustomBackdrop';
import AlertMessage from '../../../components/shared/AlertMessage';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import EditScheduleModal from '../multistep-form/addbySearch/EditScheduleModal';
import EditShiftDialog from './Employee shift actions/EditShiftDialog';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EmployeeShiftsEdit from './EmployeeShiftsEdit';
import AddShiftDialog from './Employee shift actions/AddShiftDialog';
import { AnimatePresence, motion } from 'framer-motion';
import { lighten } from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';
import DateShiftEdit from './DateShiftEdit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import FreeBreakfastIcon from '@mui/icons-material/FreeBreakfast';
import { saveAs } from 'file-saver';
import ExportMenu from '../components/ExportMenu.js';

import CurrencyPoundIcon from '@mui/icons-material/CurrencyPound';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore)

dayjs.extend(duration);
dayjs.extend(customParseFormat);

const employeeColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F06292', '#AED581', '#7E57C2', '#FFD54F', '#4DB6AC',
    '#FF7043', '#9CCC65', '#5C6BC0', '#FFF176', '#4DD0E1',
    '#F8BBD0', '#C5E1A5', '#9575CD', '#FFE082', '#80CBC4',
    '#FFAB91', '#DCE775', '#7986CB', '#FFD180', '#80DEEA',
    '#F48FB1', '#A5D6A7', '#BA68C8', '#FFB74D', '#4FC3F7',
    '#81C784', '#64B5F6', '#FFB300', '#4DB6AC', '#FF8A65',
    '#AED581', '#7986CB', '#FFF59D', '#4DD0E1', '#F06292',
    '#9CCC65', '#5C6BC0', '#FFE082', '#26A69A', '#FF7043',
    '#C5E1A5', '#3F51B5', '#FFD54F', '#26C6DA', '#EC407A'
];
const Schedule = () => {
    const firmId = JSON.parse(localStorage.getItem('Exergy HRMData'))?.firmId
    const dispatch = useDispatch()
    const [open, setOpen] = React.useState(false);
    const [direction, setDirection] = useState(0);

    //to set monday as the start of the week instead of sunday lol
    const [currentWeek, setCurrentWeek] = React.useState(dayjs().startOf('week').add(1, 'day').toDate());
    const [employeeShiftsEditOpen, setEmployeeShiftsEditOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [shifts, setShifts] = React.useState([

    ]);
    const [fetchedSchedule, setFetchedSchedule] = useState(null)
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [hoveredSlot, setHoveredSlot] = useState(null);
    const [alert, setAlert] = useState({
        open: false,
        severity: '',
        message: ''
    });
    const [addShiftOpen, setAddShiftOpen] = useState(false);

    const [staff, setStaff] = useState([])
    const [defaultShifts, setDefaultShifts] = React.useState([]);
    const [shiftDetails, setShiftDetails] = React.useState({
        date: '',
        day: '',
        start: '',
        end: '',
        title: '',
        notes: '',
        breakStartTime: '',
        breakEndTime: '',
        isBreakPaid: false,
    });
    const [newShiftDetails, setNewShiftDetails] = useState({
        date: '',
        startTime: '',
        endTime: '',
        breakStartTime: '',
        breakEndTime: '',
        employeeId: '',
        shiftId: '',
        isBreakPaid: false,
    });

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [changes, setChanges] = useState(0)
    const todayRef = React.useRef(null);
    const containerRef = React.useRef(null);
    // const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState('loading')
    const [selectedShift, setSelectedShift] = useState(null);


    const dayColors = [
        '#FFF0F0', // Light Red
        '#F0FFF0', // Light Green
        '#F0F0FF', // Light Blue
        '#FFFFF0', // Light Yellow
        '#FFF0FF', // Light Magenta
        '#F0FFFF', // Light Cyan
        '#FFF5E6', // Light Gray
    ];

    const toggleFullScreen = useCallback(() => {
        setIsFullScreen(prevState => !prevState);
    }, []);

    const handleDoubleClick = (date, employeeId, shiftId) => {
        setNewShiftDetails({
            date,
            employeeId,
            shiftId,
            startTime: '',
            endTime: '',
            breakStartTime: '',
            breakEndTime: '',
            isBreakPaid: false,
        });
        setAddShiftOpen(true);
    };

    const handleAddShiftClose = () => {
        setAddShiftOpen(false);
    };
    const handleAddShiftChange = (e) => {
        setNewShiftDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleDateClick = (date) => {

        setSelectedDate(date);
        setIsEditModalOpen(true);
    };

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


    function processBackendData(response) {
        const shiftDataArray = response.payload.DATA;
        // console.log(shiftDataArray)

        // const targetShiftData = shiftDataArray[0]?.shiftDetail?.filter(shiftData =>
        //     shiftData.employeeId === 94
        // );

        // Create shifts array
        const shifts = shiftDataArray.map(shiftData => ({
            id: shiftData.id,
            name: shiftData.name,
            startDate: shiftData.startDate,
            endDate: shiftData.endDate,
            startTime: shiftData.startTime,
            endTime: shiftData.endTime
        }));



        // Create staff array

        const staffArray = shiftDataArray.flatMap(shiftData =>
            shiftData.shiftEmployeeDetail.map(employee => {
                const employeeShifts = shiftData.shiftDetail.filter(shift => shift.employeeId === employee.employeeId);
                const rates = employeeShifts.map(shift => shift.hourlyRate).filter(rate => rate > 0);
                const minRate = rates.length > 0 ? Math.min(...rates) : 0;
                const maxRate = rates.length > 0 ? Math.max(...rates) : 0;

                return {
                    id: employee.employeeId,
                    name: employee.employeeName,
                    color: employeeColors[employee.employeeId % employeeColors.length],
                    title: employee.employeeDesignation,
                    img: `http://122.248.194.140:8081/ExergyHRM/Users/GetProfileImageByFileName?fileName=${employee.profileFileName}`,
                    rate: minRate === maxRate ? (minRate || 0) : { min: minRate, max: maxRate },
                    shifts: employeeShifts.map(shift => ({
                        name: shift.title,
                        hourlyRate: shift.hourlyRate
                    }))
                };
            })
        );
        // Remove duplicate staff entries

        const uniqueStaffArray = Array.from(new Map(staffArray.map(item => [item.id, item])).values());

        // Process shift details
        const processedShifts = shiftDataArray.flatMap(shiftData =>
            shiftData.shiftDetail.map(detail => ({
                start: detail.start,
                end: detail.end,
                title: detail.title,
                resource: detail.employeeId,
                shiftId: detail.shiftId,
                id: detail.id || null,
                breakStartTime: detail.breakStartTime ? `${detail.breakStartTime[0].toString().padStart(2, '0')}:${detail.breakStartTime[1].toString().padStart(2, '0')}` : null,
                breakEndTime: detail.breakEndTime ? `${detail.breakEndTime[0].toString().padStart(2, '0')}:${detail.breakEndTime[1].toString().padStart(2, '0')}` : null,
                isBreakPaid: detail.isBreakPaid === 1,
            }))
        );
        return { shifts, staffArray: uniqueStaffArray, processedShifts };
    }
    const scrollToToday = () => {
        if (containerRef.current && todayRef.current) {
            const container = containerRef.current;
            const todayElement = todayRef.current;

            const containerRect = container.getBoundingClientRect();
            const todayRect = todayElement.getBoundingClientRect();

            const offsetLeft = todayRect.left - containerRect.left + container.scrollLeft;
            const offsetTop = todayRect.top - containerRect.top + container.scrollTop;

            container.scrollTo({
                left: offsetLeft,
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        scrollToToday()
    }, [currentWeek, shifts])

    useEffect(() => {
        let formdata = new FormData();
        formdata.append('companyId', firmId)
        dispatch(getFirmSchedule(formdata))
            .then((result) => {
                if (result.payload.SUCCESS === 1 && result.payload.DATA.length > 0) {
                    setFetchedSchedule(result.payload.DATA[0])
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
                setStatus('init')
                console.log(err)
                setAlert({
                    open: true,
                    severity: 'error',
                    message: err.USER_MESSAGE || 'Couldnt fetch schedule. Make sure it exists.'
                })
            });
        dispatch(getAllActiveShiftsByCompanyId(formdata))
            .then((result) => {
                if (result.payload.SUCCESS === 1) {
                    const { shifts, staffArray, processedShifts } = processBackendData(result);
                    setShifts(shifts);
                    setStaff(staffArray);
                    setDefaultShifts(processedShifts);
                    setStatus('init')
                }
                else {
                    setStatus('init')
                    setAlert({
                        open: true,
                        severity: 'error',
                        message: result.payload
                    })
                }
            })
            .catch((err) => {
                console.log(err)
                setStatus('init')
                setAlert({
                    open: true,
                    severity: 'error',
                    message: err.USER_MESSAGE || 'Something went wrong.'
                })
            });

    }, [changes])

    const handleClickOpen = (slotData, shiftData) => {
        console.log(slotData, shiftData)
        setShiftDetails(prevState => ({
            ...prevState,
            ...slotData,
            start: dayjs(slotData.title.split(' - ')[0], 'h:mm').format('h:mm A'),
            end: dayjs(slotData.title.split(' - ')[1], 'h:mm').format('h:mm A'),
            shiftId: slotData.shiftId,
            date: shiftData.date,
            day: shiftData.day,
            id: slotData.id,
            breakStartTime: slotData.breakStartTime ? dayjs(slotData.breakStartTime, 'h:mm').format('h:mm A') : '',
            breakEndTime: slotData.breakEndTime ? dayjs(slotData.breakEndTime, 'h:mm').format('h:mm A') : '',
            isBreakPaid: slotData.isBreakPaid || false,
        }));

        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSaveNewShift = () => {
        const { date, startTime, endTime, breakStartTime, breakEndTime, employeeId, shiftId, hourlyRate, isBreakPaid } = newShiftDetails;

        const formattedDate = dayjs(date).format('YYYY-MM-DD');

        let newShift = {
            end: `${formattedDate}T${dayjs(endTime, 'h:mm A').format('HH:mm')}`,
            resource: parseInt(employeeId),
            shiftId: parseInt(shiftId),
            start: `${formattedDate}T${dayjs(startTime, 'h:mm A').format('HH:mm')}`,
            title: `${dayjs(startTime, 'h:mm A').format('HH:mm')} - ${dayjs(endTime, 'h:mm A').format('HH:mm')}`,
            breakStartTime: breakStartTime ? dayjs(breakStartTime, 'h:mm A').format('HH:mm') : null,
            breakEndTime: breakEndTime ? dayjs(breakEndTime, 'h:mm A').format('HH:mm') : null,
            isBreakPaid: isBreakPaid
        };


        handleAddShiftClose()
        // Update local state
        const formData = new FormData();
        formData.append('companyId', firmId);
        formData.append('date', formattedDate);
        formData.append('startTime', dayjs(startTime, 'h:mm A').format('HH:mm'));
        formData.append('endTime', dayjs(endTime, 'h:mm A').format('HH:mm'));
        formData.append('breakStartTime', breakStartTime ? dayjs(breakStartTime, 'h:mm A').format('HH:mm') : ''); // Formatted break start time
        formData.append('breakEndTime', breakEndTime ? dayjs(breakEndTime, 'h:mm A').format('HH:mm') : ''); // Formatted break end time
        formData.append('employeeId', employeeId);
        formData.append('employeeHourlyRate', hourlyRate || staff.find(s => s.id === employeeId).rate);
        formData.append('shiftId', shiftId);
        formData.append('isBreakPaid', isBreakPaid ? 1 : 0);

        dispatch(saveShiftEmployee(formData))
            .then((result) => {
                if (result.payload.SUCCESS === 1) {
                    setAlert({
                        open: true,
                        severity: 'success',
                        message: 'Shift added successfully'
                    });

                    newShift = { ...newShift, id: result.payload.shiftEmployeeId, }
                    setDefaultShifts(prevShifts => [...prevShifts, newShift]);
                    setAddShiftOpen(false);
                } else {
                    throw new Error(result.payload);
                }
            })
            .catch((err) => {
                console.error(err);
                setAlert({
                    open: true,
                    severity: 'error',
                    message: err.USER_MESSAGE || 'Error adding shift'
                });
            });
    };


    const editShift = () => {
        const backendData = {
            shiftEmployeeId: shiftDetails.id,
            startTime: dayjs(shiftDetails.start, 'hh:mmA').format('HH:mm'),
            endTime: dayjs(shiftDetails.end, 'hh:mmA').format('HH:mm'),
            breakStartTime: shiftDetails.breakStartTime ? dayjs(shiftDetails.breakStartTime, 'hh:mmA').format('HH:mm') : '',
            breakEndTime: shiftDetails.breakEndTime ? dayjs(shiftDetails.breakEndTime, 'hh:mmA').format('HH:mm') : '',
            isBreakPaid: shiftDetails.isBreakPaid ? 1 : 0,
        }

        let formdata = new FormData();
        for (let key in backendData) {
            formdata.append(key, backendData[key])
        }

        dispatch(updateShiftById(formdata))
            .then((result) => {
                if (result.payload.SUCCESS === 1) {
                    setAlert({
                        open: true,
                        severity: 'success',
                        message: 'Changes Saved.'
                    })
                }
                else {
                    // setAlert({
                    //     open: true,
                    //     severity: 'error',
                    //     message: result.payload
                    // })
                }
            })
            .catch((err) => {
                console.log(err)
                // setAlert({
                //     open: true,
                //     severity: 'error',
                //     message: err.USER_MESSAGE || 'Something went wrong.'
                // })
            });


        setDefaultShifts(prevShifts => {
            const updatedShifts = prevShifts.map(shift => {
                if (shift.resource === shiftDetails.staff.id &&
                    shift.shiftId === shiftDetails.shiftId &&
                    dayjs(shift.start).isSame(dayjs(shiftDetails.date), 'day')) {
                    return {
                        ...shift,
                        start: `${dayjs(shiftDetails.date).format('YYYY-MM-DD')}T${dayjs(shiftDetails.start, 'h:mm A').format('HH:mm')}`,
                        end: `${dayjs(shiftDetails.date).format('YYYY-MM-DD')}T${dayjs(shiftDetails.end, 'h:mm A').format('HH:mm')}`,
                        title: `${dayjs(shiftDetails.start, 'h:mm A').format('HH:mm')} - ${dayjs(shiftDetails.end, 'h:mm A').format('HH:mm')}`,
                        breakStartTime: shiftDetails.breakStartTime ? dayjs(shiftDetails.breakStartTime, 'h:mm A').format('HH:mm') : '',
                        breakEndTime: shiftDetails.breakEndTime ? dayjs(shiftDetails.breakEndTime, 'h:mm A').format('HH:mm') : '',
                        isBreakPaid: shiftDetails.isBreakPaid
                    };
                }
                return shift;
            });

            return updatedShifts;
        });

        setOpen(false);
    };

    const deleteEmployeeShiftFromBE = () => {
        let formData = new FormData();
        formData.append('shiftEmployeeId', shiftDetails.id);
        dispatch(deleteEmployeeShiftById(formData))
            .then(result => {
                if (result.payload.SUCCESS === 1) {
                    // setAlert({
                    //     open: true,
                    //     severity: 'success',
                    //     message: 'Shift deleted successfully'
                    // });
                    return true;
                } else {
                    throw new Error(result.payload);
                }
            })
            .catch(err => {
                console.error(err);
                setAlert({
                    open: true,
                    severity: 'error',
                    message: err.USER_MESSAGE || 'Something went wrong deleting the shift.'
                });
                return false;
            });
    };

    const handleDelete = (shiftId, staffId, date) => {
        setDefaultShifts(prevShifts => prevShifts.filter(shift =>
            !(shift.shiftId === shiftId &&
                shift.resource === staffId &&
                dayjs(shift.start).isSame(dayjs(date), 'day'))
        ));
        deleteEmployeeShiftFromBE()
        if (open) {
            setOpen(false)
        }
        setHoveredSlot(null)
    }

    const handleChange = (e) => {
        setShiftDetails(prevState => ({ ...prevState, [e.target.name]: e.target.value }))
    }

    const handleEmployeeShiftsEdit = (employee) => {
        setSelectedEmployee(employee);
        setEmployeeShiftsEditOpen(true);
    };
    //this function handles the bulk crud shift actions
    const handleEmployeeShiftsUpdate = (employeeId, updatedShifts, deletedShifts, selectedShift) => {
        setStatus('updating')

        // setDefaultShifts(prevShifts => {
        //     // Log the shifts that should be deleted
        //     console.log("Shifts to be deleted:", prevShifts.filter(shift => deletedShifts.includes(shift.id)));

        //     // Remove deleted shifts
        //     let newShifts = prevShifts.filter(shift => !deletedShifts.includes(shift.id));

        //     // Update existing shifts and add new ones
        //     updatedShifts.forEach(updatedShift => {
        //         const shiftDate = dayjs(updatedShift.date).format('YYYY-MM-DD');
        //         const existingShiftIndex = newShifts.findIndex(shift =>
        //             (shift.id === updatedShift.id) ||
        //             (shift.resource === employeeId &&
        //                 shift.shiftId === selectedShift &&
        //                 dayjs(shift.start).format('YYYY-MM-DD') === shiftDate)
        //         );

        //         const processedShift = {
        //             id: updatedShift.id || `new-${employeeId}-${selectedShift}-${shiftDate}`,
        //             resource: employeeId,
        //             shiftId: selectedShift,
        //             start: `${shiftDate}T${updatedShift.start}`,
        //             end: `${shiftDate}T${updatedShift.end}`,
        //             title: `${updatedShift.start} - ${updatedShift.end}`
        //         };

        //         if (existingShiftIndex !== -1) {
        //             // Update existing shift
        //             newShifts[existingShiftIndex] = processedShift;
        //         } else {
        //             // Add new shift
        //             newShifts.push(processedShift);
        //         }
        //     });

        //     console.log("Updated shifts:", newShifts);
        //     return newShifts;
        // });


        // Prepare data for backend update
        const shiftEmployeeIds = [];
        const startTimes = [];
        const endTimes = [];
        const shiftEmployeeDeletionIds = deletedShifts;



        updatedShifts.forEach(shift => {
            if (shift.id) {
                shiftEmployeeIds.push(shift.id);
                startTimes.push(shift.start);
                endTimes.push(shift.end);
            }
        });

        // Call API to update backend
        if (shiftEmployeeIds.length > 0 || shiftEmployeeDeletionIds.length > 0) {
            const formData = new FormData();
            formData.append('shiftEmployeeIds', shiftEmployeeIds);
            formData.append('startTimes', startTimes);
            formData.append('endTimes', endTimes);
            formData.append('shiftEmployeeDeletionIds', shiftEmployeeDeletionIds);

            dispatch(updateAndDeleteShiftEmployee(formData))
                .then(result => {
                    if (result.payload.SUCCESS === 1) {
                        setEmployeeShiftsEditOpen(false)
                        setAlert({
                            open: true,
                            severity: 'success',
                            message: 'Shifts updated successfully'
                        });
                        setStatus('init')

                        setChanges(prev => prev + 1)
                    } else {
                        throw new Error(result.payload);

                    }
                })
                .catch(err => {
                    setStatus('init')
                    setChanges(prev => prev + 1)
                    setEmployeeShiftsEditOpen(!employeeShiftsEditOpen)
                    console.error(err);
                    setAlert({
                        open: true,
                        severity: 'error',
                        message: err.USER_MESSAGE || 'Error updating shifts'
                    });
                });
        }

        // Handle new shifts
        const newShifts = updatedShifts.filter(shift => !shift.id);
        newShifts.forEach(shift => {
            const formData = new FormData();
            formData.append('companyId', firmId);
            formData.append('date', dayjs(shift.date).format('YYYY-MM-DD'));
            formData.append('startTime', shift.start);
            formData.append('endTime', shift.end);
            formData.append('employeeId', employeeId || shift.employeeId);
            formData.append('employeeHourlyRate', staff.find(s => s.id === (employeeId || shift.employeeId)).rate);
            formData.append('shiftId', selectedShift || shift.shiftId);

            dispatch(saveShiftEmployee(formData))
                .then(result => {
                    if (result.payload.SUCCESS === 1) {
                        setDefaultShifts(prevShifts => {
                            const newShift = prevShifts.find(s =>
                                s.resource === (employeeId || shift.employeeId) &&
                                s.shiftId === (selectedShift || shift.shiftId) &&
                                dayjs(s.start).format('YYYY-MM-DD') === dayjs(shift.date).format('YYYY-MM-DD')
                            );
                            if (newShift) {
                                newShift.id = result.payload.shiftEmployeeId;
                            }
                            return [...prevShifts];
                        });
                    } else {
                        throw new Error(result.payload);
                    }
                })
                .catch(err => {
                    console.error(err);
                    setAlert({
                        open: true,
                        severity: 'error',
                        message: err.USER_MESSAGE || 'Error adding new shift'
                    });
                });
        });
    };

    const handleWeekChange = (direction) => {
        setDirection(direction === 'next' ? -1 : 1);
        setCurrentWeek(prevWeek => {
            const newWeek = dayjs(prevWeek).add(direction === 'next' ? 1 : -1, 'week').toDate();
            return newWeek;
        });
    };

    const activeDayIds = fetchedSchedule ? getActiveDays(fetchedSchedule.weekDays) : [1, 2, 3, 4, 5]; // Default to Mon-Fri if no schedule

    const shiftDays = daysOfWeek
        .map((day, index) => ({
            id: index + 1,
            day: day,
            date: getNextDateOfWeek(day, currentWeek),
        }))
        .filter(day => activeDayIds.includes(day.id));


    // Function to compare two dates ignoring the time part
    function isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
    }

    const updatedShiftDays = mapShiftsToDays(shiftDays, defaultShifts, staff, shifts);


    const disabled = !shiftDetails.start || !shiftDetails.end;

    const shiftHours = () => {
        const startTime = dayjs(shiftDetails.start, 'hh:mm A');
        const endTime = dayjs(shiftDetails.end, 'hh:mm A');

        if (!startTime.isValid() || !endTime.isValid()) {
            // console.error('Invalid time format');
            return 0;
        } else {
            // If end time is before start time, assume it's the next day
            const adjustedEndTime = endTime.isBefore(startTime) ? endTime.add(1, 'day') : endTime;
            const difference = dayjs.duration(adjustedEndTime.diff(startTime));
            const hours = difference.asHours();

            return hours.toFixed(1);
        }
    }

    const startOfWeek = dayjs(currentWeek).startOf('week').add(1, 'day').format('D MMMM');
    const endOfWeek = dayjs(currentWeek).endOf('week').add(1, 'day').format('D MMMM');
    const BCrumb = [
        {
            to: '/rota',
            title: 'Rota',
        },
        {
            title: 'Schedule',
        }
    ];
    const handleShiftUpdates = (updatedShifts, deletedShiftIds) => {
        const shiftEmployeeIds = [];
        const startTimes = [];
        const endTimes = [];
        const shiftEmployeeDeletionIds = deletedShiftIds;

        updatedShifts.forEach(shift => {
            if (shift.id) {
                shiftEmployeeIds.push(shift.id);
                startTimes.push(shift.start);
                endTimes.push(shift.end);
            }
        });

        if (shiftEmployeeIds.length > 0 || shiftEmployeeDeletionIds.length > 0) {
            const formData = new FormData();
            formData.append('shiftEmployeeIds', shiftEmployeeIds);
            formData.append('startTimes', startTimes);
            formData.append('endTimes', endTimes);
            formData.append('shiftEmployeeDeletionIds', shiftEmployeeDeletionIds);

            dispatch(updateAndDeleteShiftEmployee(formData))
                .then(result => {
                    if (result.payload.SUCCESS === 1) {
                        setIsEditModalOpen(false);
                        setAlert({
                            open: true,
                            severity: 'success',
                            message: 'Shifts updated successfully'
                        });
                        setChanges(prev => prev + 1);
                    } else {
                        throw new Error(result.payload);
                    }
                })
                .catch(err => {
                    console.error(err);
                    setAlert({
                        open: true,
                        severity: 'error',
                        message: err.USER_MESSAGE || 'Error updating shifts'
                    });
                });
        }

        // Handle new shifts
        const newShifts = updatedShifts.filter(shift => !shift.id);
        newShifts.forEach(shift => {
            const formData = new FormData();
            formData.append('companyId', firmId);
            formData.append('date', shift.date);
            formData.append('startTime', shift.start);
            formData.append('endTime', shift.end);
            formData.append('employeeId', shift.employeeId);
            formData.append('employeeHourlyRate', staff.find(s => s.id === shift.employeeId).rate);
            formData.append('shiftId', shift.shiftId);

            dispatch(saveShiftEmployee(formData))
                .then(result => {
                    if (result.payload.SUCCESS === 1) {
                        setDefaultShifts(prevShifts => {
                            const newShift = {
                                ...shift,
                                id: result.payload.shiftEmployeeId,
                                resource: shift.employeeId,
                                start: `${shift.date}T${shift.start}`,
                                end: `${shift.date}T${shift.end}`,
                                breakStartTime: shift.breakStartTime ? dayjs(shift.breakStartTime).format('HH:mm') : null,
                                breakEndTime: shift.breakEndTime ? dayjs(shift.breakEndTime).format('HH:mm') : null,
                                title: `${shift.start} - ${shift.end}`
                            };
                            return [...prevShifts, newShift];
                        });
                    } else {
                        throw new Error(result.payload);
                    }
                })
                .catch(err => {
                    console.error(err);
                    setAlert({
                        open: true,
                        severity: 'error',
                        message: err.USER_MESSAGE || 'Error adding new shift'
                    });
                });
        });
    };


    const getEmployeeShifts = (employeeId, defaultShifts) => {
        return defaultShifts.filter(shift => shift.resource === employeeId);
    };

    const handleShiftClick = (date, shiftId) => {
        setSelectedDate(dayjs(date));
        setSelectedShift(shifts.find(shift => shift.id === shiftId));
        setIsEditModalOpen(true);
    };
    const getFilteredShiftsForDate = (date) => {
        return shifts.filter(shift => {
            const shiftStart = dayjs(shift.startDate);
            const shiftEnd = dayjs(shift.endDate);
            return dayjs(date).isSameOrAfter(shiftStart, 'day') && dayjs(date).isSameOrBefore(shiftEnd, 'day');
        });
    };
    return (
        <Box pb={3} sx={{

            ...(isFullScreen && {
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 99999,
                overflow: 'auto',
                backgroundColor: 'white',
            }),
        }}>
            <div className='mt-6'></div>
            {/* {!isFullScreen && <Breadcrumb title="Rota Module" items={BCrumb} />} */}

            <AlertMessage open={alert.open} setAlert={setAlert} severity={alert.severity} message={alert.message} />
            <EditShiftDialog
                open={open}
                handleClose={handleClose}
                shiftDetails={shiftDetails}
                handleChange={handleChange}
                calculateHours={calculateHours}
                shiftHours={shiftHours}
                editShift={editShift}
                disabled={disabled}
            />
            {addShiftOpen && <AddShiftDialog
                open={addShiftOpen}
                handleClose={handleAddShiftClose}
                shiftDetails={newShiftDetails}
                handleChange={handleAddShiftChange}
                onSave={handleSaveNewShift}
            />}
            {employeeShiftsEditOpen &&
                <EmployeeShiftsEdit
                    fetchedSchedule={fetchedSchedule}
                    shifts={shifts}
                    open={employeeShiftsEditOpen}
                    toggle={() => setEmployeeShiftsEditOpen(!employeeShiftsEditOpen)}
                    employee={selectedEmployee}
                    defaultShifts={defaultShifts.filter(s => s.resource === selectedEmployee?.id)}
                    onUpdate={handleEmployeeShiftsUpdate}
                    status={status}
                />}
            {isEditModalOpen && <DateShiftEdit
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                shiftData={selectedShift}
                employees={staff}
                onUpdate={handleShiftUpdates}
                defaultShifts={defaultShifts}
                selectedDate={selectedDate}
            />}
            <CustomBackdrop loading={status === 'loading'} />
            {
                status !== 'loading' && <Paper sx={{ scrollbarWidth: 'thin', maxHeight: isFullScreen ? 'auto' : '600px', overflowY: 'auto', overflowX: 'hidden' }} elevation={8} className='w-full relative '>
                    <Box sx={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, bgcolor: (theme) => lighten(theme.palette.primary.main, 0.9) }} className="sticky top-[0] z-[99]">
                        <Stack direction="row" justifyContent="space-between" px={2} py={1}>
                            <Typography mt={1} variant='h4' color='primary'>
                                {`${startOfWeek} - ${endOfWeek}, ${dayjs().format('YYYY')}`}
                            </Typography>
                            <Stack direction='row'>
                                <IconButton onClick={toggleFullScreen}>
                                    {!isFullScreen ? <FullscreenIcon color='primary' /> : <FullscreenExitIcon color='primary' />}
                                </IconButton>
                                <Box className='space-x-2'>
                                    <IconButton onClick={() => handleWeekChange('prev')}>
                                        <KeyboardArrowLeftIcon color='primary' />
                                    </IconButton>

                                    <Button variant="contained" size='small' onClick={() => {
                                        setCurrentWeek(dayjs().startOf('week').add(1, 'day').toDate())

                                    }
                                    }>Current Week</Button>

                                    <IconButton onClick={() => handleWeekChange('next')}>
                                        <KeyboardArrowRightIcon color='primary' />
                                    </IconButton>


                                </Box>

                                <ExportMenu exportToCSV={(includeRates) => exportToCSV(includeRates, updatedShiftDays, currentWeek, shifts, staff, defaultShifts)} withRatesOption={true} />
                            </Stack>
                        </Stack>
                    </Box>
                    {/* <div className='w-full h-10 bg-blue-500 sticky top-[4rem]'></div> */}
                    {/* removed border here. Seems like giving fixed widths to chidlren was causing issues  */}
                    <Grid container sx={{ scrollbarWidth: 'thin' }} flexWrap={'nowrap'} className='relative '>
                        {/* Staff Grid */}
                        <Grid item className='border-r min w-auto sticky left-0 bg-white'>
                            <Typography className='px-2 py-1 border-b border-white text-white'>Employees</Typography>
                            <Grid container >
                                <Grid item >
                                    <Typography className='px-2 py-1 border-b text-white'>Name</Typography>
                                    <Grid container direction='column' columns={2}>
                                        {staff.map((data, idx) => (
                                            <Grid key={idx} item xs={1} className='border-b'>
                                                <Box sx={{ height: '60px' }} className="p-2 flex flex-row justify-start space-x-2 align-top">
                                                    <Avatar src={data.img} sx={{ width: '35px', height: '35px' }} />
                                                    <Stack sx={{ width: '100%' }}>
                                                        <Stack direction='row' justifyContent='space-between' alignItems='start' sx={{ width: '100%' }}>

                                                            <Typography sx={{ fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap' }} >{data.name}</Typography>

                                                            {/* <Tooltip
                                                                title={
                                                                    <React.Fragment>
                                                                        {shifts.map(shift => (
                                                                            <Typography key={shift.id} sx={{ fontSize: '11px' }}>
                                                                                {shift.name}: £{data.shifts.find(s => s.name === shift.name)?.hourlyRate || data.rate}/hr
                                                                            </Typography>
                                                                        ))}
                                                                    </React.Fragment>
                                                                }
                                                                arrow
                                                            > */}
                                                            <Typography
                                                                sx={{
                                                                    fontSize: '11px',
                                                                    fontWeight: 500,
                                                                    // cursor: 'help',
                                                                    whiteSpace: 'nowrap',
                                                                    ml: 2,

                                                                }}
                                                                className='text-gray-400 px-2'
                                                            >
                                                                {(() => {
                                                                    const rates = shifts.map(shift =>
                                                                        data.shifts.find(s => s.name === shift.name)?.hourlyRate || data.rate
                                                                    );
                                                                    const minRate = Math.min(...rates);
                                                                    const maxRate = Math.max(...rates);
                                                                    return `£${minRate}${minRate !== maxRate ? `/${maxRate}` : ''}/hr`;
                                                                })()}
                                                            </Typography>
                                                            {/* </Tooltip> */}

                                                        </Stack>
                                                        <Stack direction={'row'} justifyContent={'space-between'}>
                                                            <Typography sx={{ fontSize: '11px', fontWeight: 600 }} className='whitespace-nowrap '>{data.title}</Typography>
                                                            <ScheduleIcon onClick={() => handleEmployeeShiftsEdit(data)} className='pr-2 pb-1 cursor-pointer' sx={{ fontSize: '1.5rem', color: 'primary.main', ml: 2 }} />
                                                        </Stack>

                                                    </Stack>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                    {/* <Typography className='px-2 py-1 text-white'>Name</Typography> */}
                                    <div className='flex justify-end items-center'>
                                        <Typography fontSize={12} className='px-2 py-1 text-blue text-center w-fit text-gray-500 pt-2'>Daily <br />hrs & cost</Typography>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item container flexWrap={'nowrap'} sx={{ scrollbarWidth: 'thin', overflowX: 'scroll', overflowY: 'hidden' }} ref={containerRef}>
                            {/* Shifts Grid */}
                            <AnimatePresence >
                                <motion.div
                                    className='flex flex-nowrap w-full'
                                // key={currentWeek}
                                // custom={direction}
                                // initial={{ opacity: .5, x: direction > 0 ? -30 : 30 }}
                                // animate={{ opacity: 1, x: 0 }}
                                // exit={{ opacity: 0 }}
                                // transition={{ duration: .2 }}
                                >
                                    {updatedShiftDays.map((shiftData, index) => {
                                        const filteredShifts = getFilteredShiftsForDate(shiftData.date);
                                        return <Grid key={index} item sx={{ backgroundColor: dayColors[index % 7], position: 'relative', flex: 1, minWidth: `${filteredShifts.length > 0 ? filteredShifts.length * 9 : 9}rem` }} >

                                            <Box
                                                sx={{ borderRadius: '0px !important' }}
                                                className={`px-2 py-1  ${updatedShiftDays.length - 1 !== index && 'border-r'} border-b`}
                                            >
                                                <Typography
                                                    // onClick={() => handleDateClick(dayjs(shiftData.date))}
                                                    ref={isSameDay(shiftData.date, new Date()) ? todayRef : null}
                                                    fontWeight={600}
                                                    className={`text-center w-fit ${isSameDay(shiftData.date, new Date()) ? 'px-5 text-white rounded-full' : ''}`}
                                                    sx={{ position: 'sticky', left: '2px', top: '100px', bgcolor: (theme) => isSameDay(shiftData.date, new Date()) && `${theme.palette.primary.main}`, whiteSpace: 'nowrap' }}
                                                >
                                                    {dayjs(shiftData.date).format('D MMM ddd')}

                                                </Typography>
                                            </Box>

                                            <Grid container columns={filteredShifts.length}>
                                                {filteredShifts.map((shift, shiftIndex) => {
                                                    const shiftDataForThisShift = shiftData.shifts.find(s => s.id === shift.id);

                                                    return <Grid item xs={1} key={shift.id}>
                                                        <Typography sx={{ fontWeight: 600, whiteSpace: 'nowrap' }} className={`pl-2 py-1 border-r border-b cursor-pointer`}
                                                        >{shift.name}
                                                            <ScheduleIcon onClick={() => handleShiftClick(shiftData.date, shift.id)} className='pr-2 pb-[3px] cursor-pointer' sx={{ fontSize: '1.5rem', color: 'primary.main', ml: 1 }} />
                                                        </Typography>
                                                        <Grid container direction='column' columns={1} className='border-r'>
                                                            {shiftDataForThisShift?.employees.map((slot, slotIndex) => (
                                                                <Grid key={slotIndex} item xs={1} className='border-b'>
                                                                    <Box
                                                                        sx={{ height: '60px' }}
                                                                        className="p-2 flex items-center justify-center"
                                                                    >
                                                                        {slot.title ? (
                                                                            <Box
                                                                                onMouseEnter={() => {
                                                                                    setHoveredSlot(`${shiftData.id}-${shift.id}-${slot.staff.id}`);
                                                                                    setShiftDetails({
                                                                                        id: slot.id,
                                                                                        staff: slot.staff,
                                                                                        shiftId: shift.id,
                                                                                        date: shiftData.date,
                                                                                        start: slot.start,
                                                                                        end: slot.end,
                                                                                        title: slot.title
                                                                                    });
                                                                                }}
                                                                                onMouseLeave={() => setHoveredSlot(null)}
                                                                                sx={{
                                                                                    fontSize: '10px',
                                                                                    borderLeft: `7px solid ${slot.staff.color}`,
                                                                                    backgroundColor: `white`,
                                                                                    boxSizing: 'border-box',
                                                                                    color: 'black',
                                                                                    fontWeight: 'bold',
                                                                                    borderRadius: '5px',
                                                                                    position: 'relative'
                                                                                }}
                                                                                className='text-center cursor-pointer rounded-sm px-2 w-[6.5rem] flex flex-col'
                                                                            >
                                                                                {slot.title}

                                                                                <Box sx={{ fontSize: '10px', alignSelf: 'start', pl: .85, display: 'flex', alignItems: 'center', gap: .5 }}>
                                                                                    <FreeBreakfastIcon sx={{ fontSize: 13, color: slot.staff.color }} />
                                                                                    <Typography fontSize={'10px'} pb={.2} className='flex items-center gap-1'>
                                                                                        {slot.breakStartTime && slot.breakEndTime ? (
                                                                                            <>
                                                                                                {` ${calculateBreakDuration(slot.breakStartTime, slot.breakEndTime)}m`}
                                                                                                {slot.isBreakPaid && (
                                                                                                    <Tooltip title="Paid break">
                                                                                                        <CurrencyPoundIcon sx={{ fontSize: 12 }} />
                                                                                                    </Tooltip>
                                                                                                )}
                                                                                            </>
                                                                                        ) : (
                                                                                            'No break'
                                                                                        )}
                                                                                    </Typography>
                                                                                </Box>

                                                                                {hoveredSlot === `${shiftData.id}-${shift.id}-${slot.staff.id}` && (
                                                                                    <Box className='absolute bottom-full left-[-.3rem] flex flex-col z-[10] bg-white w-[6.5rem] text-black drop-shadow-lg'>
                                                                                        <Typography sx={{ color: 'primary.main' }} onClick={() => handleClickOpen(slot, shiftData)} className='flex gap-3 py-2 hover:bg-gray-200 px-2 border-b'>
                                                                                            <EditIcon fontSize='small' sx={{ color: 'primary.main' }} /> Edit
                                                                                        </Typography>
                                                                                        {/* <Typography sx={{ color: 'gray' }} className='py-1 px-2 text-xs'>
                                                                                            Break: {slot.breakStartTime} - {slot.breakEndTime}
                                                                                        </Typography> */}
                                                                                        <Typography sx={{ color: 'red' }} onClick={() => handleDelete(shift.id, slot.staff.id, shiftData.date)} className='flex gap-3 py-2 hover:bg-gray-200 px-2'>
                                                                                            <DeleteIcon fontSize='small' sx={{ color: 'red' }} /> Delete
                                                                                        </Typography>
                                                                                    </Box>
                                                                                )}
                                                                            </Box>
                                                                        ) : (
                                                                            <Box
                                                                                sx={{ height: '50px', width: '100%' }}
                                                                                className="p-2 flex items-center justify-center cursor-pointer"
                                                                                onDoubleClick={() => handleDoubleClick(shiftData.date, slot.staff.id, shift.id)}
                                                                            />
                                                                        )}
                                                                    </Box>
                                                                </Grid>
                                                            ))}
                                                            <Grid item xs={1}>
                                                                <Box sx={{ height: '50px' }} className="p-2">
                                                                    {(() => {
                                                                        const { hours, cost } = totalHoursAndCost(shiftData, shift.id);
                                                                        return (
                                                                            <>
                                                                                <Typography sx={{ fontSize: 12 }} className='text-center cursor-pointer rounded-sm'>
                                                                                    {hours > 0 ? `${hours} hrs` : ''}
                                                                                </Typography>
                                                                                <Typography sx={{ fontSize: 12, fontWeight: '600' }} className='text-center cursor-pointer rounded-sm'>
                                                                                    {cost > 0 ? `£${cost}` : ''}
                                                                                </Typography>
                                                                            </>
                                                                        );
                                                                    })()}
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                })}
                                            </Grid>

                                        </Grid>
                                    })}
                                </motion.div>
                            </AnimatePresence>
                        </Grid>


                        {/* Cost grid */}

                        <Grid item xs={1} className='border-l relative  bg-white'>
                            {/* <Typography fontWeight={600} fontSize={12} className='px-2 py-1 border-b border-white text-black text-center'>Weekly</Typography> */}
                            <Grid container columns={2}>
                                <Grid item xs={2}>
                                    <Typography fontWeight={500} fontSize={12} className='px-2 py-2 border-b text-center text-gray-500'>Weekly <br /> <span className='whitespace-nowrap'>Hrs & cost</span>


                                    </Typography>
                                    <Grid container direction='column' columns={2}>
                                        {staff.map((staffData, indx) => (

                                            <Grid key={indx} item xs={1} className='border-b'>

                                                <Box sx={{ height: '60px' }} className="p-2">
                                                    <Typography sx={{ fontSize: 12 }} className='text-center cursor-pointer rounded-sm'>
                                                        {totalHoursWeekly(staffData.id, defaultShifts, currentWeek)}
                                                    </Typography>
                                                    <Typography
                                                        sx={{ fontSize: 12, fontWeight: '600' }}
                                                        className="text-center cursor-pointer rounded-sm"
                                                    >


                                                        {(() => {
                                                            const hoursString = totalHoursWeekly(staffData.id, defaultShifts, currentWeek);
                                                            const hours = parseFloat(hoursString);
                                                            if (isNaN(hours) || hours === 0) return '';
                                                            const cost = hours * staffData.rate;
                                                            return `£${cost.toFixed(2)}`;
                                                        })()}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Grid>
                                <Typography sx={{ fontSize: 12 }} className='px-2 pt-2 text-center text-gray-500 w-full'>
                                    Total:
                                    <br />
                                    <Typography variant='span' style={{ fontWeight: 600, fontSize: 12, color: 'black' }}>

                                        {isNaN(calculateTotalWeeklyCost(staff, defaultShifts, currentWeek)) ? '' : `£${calculateTotalWeeklyCost(staff, defaultShifts, currentWeek).toFixed(2)}`}
                                    </Typography>

                                </Typography>
                            </Grid>
                        </Grid>

                    </Grid>

                </Paper>
            }
        </Box >
    )
}

export default Schedule


