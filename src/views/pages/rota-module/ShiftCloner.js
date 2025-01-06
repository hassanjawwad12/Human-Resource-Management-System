import { Box, Stack } from "@mui/system";
import Breadcrumb from "../../../layouts/full/shared/breadcrumb/Breadcrumb";
import { Avatar, Button, ClickAwayListener, Dialog, DialogActions, DialogContent, DialogTitle, Grid, InputAdornment, Paper, TextField, Typography, backdropClasses } from "@mui/material";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { getAllShiftsByCompanyId, getAllAvailableEmployeesByCompany, cloneShiftByIdAndEmployeeIds, getAllActiveShiftsByCompanyId } from "../../../store/rota/RotaSlice";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { AnimatePresence, motion } from "framer-motion";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { IconSearch } from "@tabler/icons";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { set } from "lodash";
import CustomBackdrop from "../../../components/forms/theme-elements/CustomBackdrop";
import AlertMessage from "../../../components/shared/AlertMessage";
import CircularProgress from '@mui/material/CircularProgress';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { AddBox, Filter } from "@mui/icons-material";
import CustomTextField from "../../../components/forms/theme-elements/CustomTextField";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const staffImages = [
    'https://www.svgrepo.com/show/382101/male-avatar-boy-face-man-user.svg',
    'https://www.svgrepo.com/show/382097/female-avatar-girl-face-woman-user-9.svg',
    'https://www.svgrepo.com/show/382108/male-avatar-boy-face-man-user-4.svg',
    'https://www.svgrepo.com/show/382107/male-avatar-boy-face-man-user-6.svg',
    'https://www.svgrepo.com/show/382099/female-avatar-girl-face-woman-user-2.svg',
    'https://www.svgrepo.com/show/382112/female-avatar-girl-face-woman-user-8.svg',
];
const shiftColors = {};
const colorPalette = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F06292', '#AED581', '#FFD54F', '#7986CB', '#9575CD',
    '#4DB6AC', '#FF8A65', '#A1887F', '#90A4AE', '#81C784'
];
function getShiftColor(shiftName) {
    if (!shiftColors[shiftName]) {
        // Assign a new color if this shift name hasn't been seen before
        shiftColors[shiftName] = colorPalette[Object.keys(shiftColors).length % colorPalette.length];
    }
    return shiftColors[shiftName];
}


function getRandomImage() {
    const randomIndex = Math.floor(Math.random() * staffImages.length);
    return staffImages[randomIndex];
}

export default function ShiftCloner() {
    const firmId = JSON.parse(localStorage.getItem('Exergy HRMData'))?.firmId
    const dispatch = useDispatch();

    const [shifts, setShifts] = useState([]);
    const [allEmployees, setAllEmployees] = useState([]);
    const [shiftSearchTerm, setShiftSearchTerm] = useState('');
    const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState({})
    const [selectedShift, setSelectedShift] = useState({})
    const [changesCount, setChangesCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)
    const [dateRange, setDateRange] = useState({ start: null, end: null });
    const [selectedShifts, setSelectedShifts] = useState([]);
    const [filtersApplied, setFiltersApplied] = useState(false);
    const handleShiftSelection = (shiftName) => {
        setSelectedShifts(prev => {
            if (prev.includes(shiftName)) {
                return prev.filter(shift => shift !== shiftName);
            } else {
                return [...prev, shiftName];
            }
        });
    };
    console.log(allEmployees)

    const [alert, setAlert] = useState({
        open: false,
        severity: '',
        message: ''
    });
    const [openModal, setOpenModal] = useState(false)

    console.log(shifts)

    function normalizeShiftData(backendData) {
        const employeeData = backendData.shiftEmployeeDetail.map(employee => ({
            ...employee,
            shiftDuration: {
                start: dayjs(backendData.startDate).format('DD/MM/YY'),
                end: dayjs(backendData.endDate).format('DD/MM/YY')
            },
            shiftWorkingHours: {
                start: dayjs(backendData.startTime.join(':'), 'HH:mm').format('hh:mmA'),
                end: dayjs(backendData.endTime.join(':'), 'HH:mm').format('hh:mmA')
            },
            shiftBreakHours: {
                start: backendData.breakStartTime ? dayjs(backendData.breakStartTime.join(':'), 'HH:mm').format('hh:mmA') : null,
                end: backendData.breakEndTime ? dayjs(backendData.breakEndTime.join(':'), 'HH:mm').format('hh:mmA') : null
            },
            shiftName: backendData.name,
            shiftColor: getShiftColor(backendData.name),
            img: `http://122.248.194.140:8081/ExergyHRM/Users/GetProfileImageByFileName?fileName=${employee.profileFileName}`,

        }));

        return employeeData;
    }

    useEffect(() => {
        setLoading(true);

        let formdata = new FormData();
        formdata.append('companyId', firmId);

        dispatch(getAllActiveShiftsByCompanyId(formdata))
            .then((result) => {
                if (result.payload.SUCCESS === 1) {
                    const transformedShifts = result.payload.DATA.map(normalizeShiftData);
                    setShifts(transformedShifts);
                    // Return a success flag or data for chaining
                    return result.payload;
                } else {
                    throw new Error(result.payload);
                }
            })
            .then((payload) => {
                let formdata2 = new FormData();
                formdata2.append('companyId', firmId);

                return dispatch(getAllAvailableEmployeesByCompany(formdata2));
            })
            .then((result) => {
                if (result.payload.SUCCESS === 1) {
                    const newData = result.payload.DATA.map(item => ({
                        ...item,
                        img: `http://122.248.194.140:8081/ExergyHRM/Users/GetProfileImageByFileName?fileName=${item.profileFileName}`,
                    }));
                    setAllEmployees(newData);
                    setLoading(false); // Set loading to false after successful second call
                } else {
                    throw new Error('Could not fetch employees data.');
                }
            })
            .catch((error) => {
                console.error(error);
                setAlert({
                    open: true,
                    severity: 'error',
                    message: error.USER_MESSAGE || 'Something went wrong.'
                });
                setLoading(false); // Set loading to false if any call fails
            });
    }, [changesCount]);



    const BCrumb = [
        {
            to: '/rota',
            title: 'Rota',
        },
        {
            title: 'Shift Clone',
        }
    ];
    const checkFiltersApplied = () => {
        const isDateRangeApplied = dateRange.start !== null || dateRange.end !== null;
        const isShiftFilterApplied = selectedShifts.length > 0;
        const isSearchApplied = shiftSearchTerm.trim() !== '';

        return isDateRangeApplied || isShiftFilterApplied || isSearchApplied;
    };
    useEffect(() => {
        setFiltersApplied(checkFiltersApplied());
    }, [dateRange, selectedShifts]);

    const isEmployeeInShifts = (employeeId) => {
        return shifts.flat().some(shiftEmployee => shiftEmployee.employeeId === employeeId);
    };

    const handleRateChange = (id, event) => {
        const { value } = event.target;

        setAllEmployees((prevEmployees) =>
            prevEmployees.map((employee) =>
                employee.id === id ? { ...employee, 'ratePerHour': value } : employee
            )
        );
    };


    const filteredShifts = shifts.flat().filter(shift => {
        const matchesSearch = shift.employeeName.toLowerCase().includes(shiftSearchTerm.toLowerCase()) ||
            (shift.employeeDesignation && shift.employeeDesignation.toLowerCase().includes(shiftSearchTerm.toLowerCase())) ||
            shift.shiftName.toLowerCase().includes(shiftSearchTerm.toLowerCase());

        const matchesDateRange = (!dateRange.start || dayjs(shift.shiftDuration.start, 'DD/MM/YY').isSameOrAfter(dateRange.start)) &&
            (!dateRange.end || dayjs(shift.shiftDuration.end, 'DD/MM/YY').isSameOrBefore(dateRange.end));

        const matchesSelectedShifts = selectedShifts.length === 0 || selectedShifts.includes(shift.shiftName);

        return matchesSearch && matchesDateRange && matchesSelectedShifts;
    });

    const filteredEmployees = allEmployees.filter(employee =>
        !isEmployeeInShifts(employee.id) &&
        (employee.fullName.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
            (employee.designationLabel && employee.designationLabel.toLowerCase().includes(employeeSearchTerm.toLowerCase())))
    );

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination } = result;

        if (source.droppableId === 'employeesList' && destination.droppableId.startsWith('shift-')) {
            const draggedEmployee = filteredEmployees[source.index];
            const [, shiftId, employeeId] = destination.droppableId.split('-');

            // Find the target shift based on shiftId and employeeId
            const targetShift = filteredShifts.find(shift =>
                shift.shiftId.toString() === shiftId && shift.employeeId.toString() === employeeId
            );

            if (targetShift) {
                setSelectedEmployee(draggedEmployee)
                setSelectedShift(targetShift)
                setOpenModal(true)
                console.log('Dropped employee data:', draggedEmployee);
                console.log('Target shift data:', targetShift);
                // Here you can implement the logic to assign the employee to the shift
            } else {
                console.log('Target shift not found');
            }
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>

            <AlertMessage open={alert.open} setAlert={setAlert} severity={alert.severity} message={alert.message} />
            <CustomBackdrop loading={loading} />
            {openModal && <ConfirmAssignShiftDialog open={openModal} data={selectedEmployee} setOpenModal={setOpenModal} selectedShift={selectedShift} setChangesCount={setChangesCount} dispatch={dispatch} setAlert={setAlert} />}
            {/* <Breadcrumb title="Rota Module" items={BCrumb} /> */}
            <Stack direction={'row'} mb={2} spacing={15} className="mt-6">
                <Typography variant='h6' sx={{ fontWeight: '600', color: 'primary.main', pl: .5 }} className='w-full'>{shifts.length} shifts(s) available</Typography>
                <Typography variant='h6' sx={{ fontWeight: '600', color: 'primary.main', pl: .5 }} className='w-full'>{filteredEmployees.length} employee(s) available</Typography>
            </Stack>
            <Stack direction={'row'} spacing={15} mb={1}>
                <Stack direction={'row'} sx={{ width: '100%' }} gap={2} alignItems={'center'} pr={1.5}>
                    <TextField
                        color='primary'
                        sx={{
                            width: '100%',

                            '& .MuiInputBase-root': {
                                border: 'none !important',
                                height: '34px',
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
                                    <IconSearch color={`${'gray'}`} size="1.1rem" />
                                </InputAdornment>
                            ),
                        }}
                        value={shiftSearchTerm}
                        onChange={(e) => setShiftSearchTerm(e.target.value)}
                        placeholder="Search by shift name, employee name, designation"
                        size="small"
                    />
                    <ClickAwayListener onClickAway={() => setOpen(false)}>
                        <Box className='relative'>
                            <Button
                                onClick={() => setOpen(prev => !prev)}
                                size="small"
                                className="flex items-center w-[5rem]"
                                sx={{
                                    color: filtersApplied ? 'primary.main !important' : 'gray !important',
                                    border: filtersApplied ? '1px solid primary.main' : '1px solid lightgray',
                                    backgroundColor: 'white !important'
                                }}
                            >
                                Filters
                                <FilterAltIcon />
                            </Button>
                            {open && <Box className='absolute top-full right-0 z-[1000] w-[23rem] py-5 px-3 gap-4 bg-white drop-shadow-lg flex items-center flex-col justify-center'>
                                <Typography sx={{ color: 'primary.main' }} className='self-end cursor-pointer' onClick={() => {
                                    setDateRange({ start: null, end: null });
                                    setSelectedShifts([]);
                                    setOpen(false)
                                }}>Clear</Typography>
                                <Box className='flex items-center gap-4'>
                                    <Box>
                                        <Typography fontSize={'.8rem'} className='self-start text-gray-500'>From:</Typography>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                inputFormat="DD/MM/YYYY"
                                                value={dateRange.start}
                                                onChange={(newValue) => setDateRange(prev => ({ ...prev, start: newValue }))}
                                                renderInput={(params) => <CustomTextField {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </Box>
                                    <Box>
                                        <Typography fontSize={'.8rem'} className='self-start text-gray-500'>To:</Typography>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                inputFormat="DD/MM/YYYY"
                                                value={dateRange.end}
                                                onChange={(newValue) => setDateRange(prev => ({ ...prev, end: newValue }))}
                                                renderInput={(params) => <CustomTextField {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </Box>
                                </Box>
                                <Box className='w-full'>
                                    <Typography fontSize={'.8rem'} className='self-start text-gray-500 mb-1'>Shifts</Typography>
                                    <Box className='flex flex-wrap gap-2'>
                                        {[...new Set(shifts.flat().map(shift => shift.shiftName))].map(shiftName => (
                                            <Box
                                                key={shiftName}
                                                borderColor={selectedShifts.includes(shiftName) ? 'primary.main' : ''}
                                                className={`px-3 py-2 flex items-center gap-2 border rounded-3xl cursor-pointer`}
                                                onClick={() => handleShiftSelection(shiftName)}

                                            >
                                                <Box sx={{ backgroundColor: getShiftColor(shiftName) }} className='w-4 h-4 rounded-full'>

                                                </Box>
                                                <Typography>{shiftName}</Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            </Box>}
                        </Box>
                    </ClickAwayListener>
                </Stack>

                <TextField
                    onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                    color='primary'
                    sx={{
                        minWidth: '350px',
                        '& .MuiInputBase-root': {
                            border: 'none !important',
                            // borderRadius: '30px !important'
                        },
                        '& .MuiOutlinedInput-input': {
                            pl: 0
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            // border: 'none',
                        },
                    }}
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <IconSearch color='gray' size="1.1rem" />
                            </InputAdornment>
                        ),
                    }}
                    placeholder="Search by name, occupation, hourly rate"
                    size="small"

                />

            </Stack>
            <Stack direction={'row'} spacing={12} sx={{ height: '500px', overflow: 'hidden' }}>

                <Stack
                    sx={{ width: '100%', maxHeight: '550px', overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'thin', scrollbarGutter: 'stable' }}
                >
                    <AnimatePresence mode="wait">
                        {filteredShifts.length > 0 ? (
                            <motion.div key={'available'}>
                                <AnimatePresence>
                                    {filteredShifts.map((data, idx) => (
                                        <Droppable droppableId={`shift-${data.shiftId}-${data.employeeId}`} key={`${data.shiftId}-${data.employeeId}`}>
                                            {(provided) => (
                                                <motion.div
                                                    {...provided.droppableProps}

                                                    ref={provided.innerRef}
                                                    layout
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ x: 20, opacity: 0 }}
                                                    transition={{ duration: .3 }}
                                                >
                                                    <Grid item xs={1} className={`border-b w-full cursor-pointer hover:bg-zinc-100`}>
                                                        <Box sx={{ height: '' }} className="p-2 flex flex-row justify-start space-x-2 align-top">
                                                            <Stack sx={{ width: '100%' }}>
                                                                <Stack direction='row' justifyContent='space-between' alignItems='center' >
                                                                    <Stack direction={'row'} gap={1} alignItems={'start'}>
                                                                        <Avatar src={data.img} className='w-12 mt-2' sx={{ width: '55px', height: '55px' }} />
                                                                        <Stack justifyContent='space-between'>
                                                                            <Typography sx={{ fontSize: '14px', fontWeight: 600 }} className=''>{data.employeeName}</Typography>
                                                                            <Typography sx={{ fontSize: '11px', fontWeight: 600 }} className='text-overflow-ellipsis whitespace-nowrap'>{data.employeeDesignation || 'empty'}</Typography>
                                                                            <Typography sx={{ fontSize: '11px', fontWeight: 600 }} className='text-overflow-ellipsis whitespace-nowrap text-gray-400'>{data.hourlyRate}/hr</Typography>
                                                                        </Stack>
                                                                    </Stack>
                                                                    <Box sx={{ backgroundColor: data.shiftColor }} className='rounded w-[10rem] text-[12px] flex flex-col px-3 text-white ' >
                                                                        <Typography sx={{ fontWeight: 600 }} className=' text-white py-1 rounded flex justify-between items-center gap-3'>{data.shiftName}  <AccessTimeIcon sx={{ fontSize: '1rem' }} /></Typography>
                                                                        <Typography sx={{ fontSize: '11px' }}>
                                                                            {`${dayjs(data.shiftDuration.start, 'DD/MM/YY').format('MMM D')} - ${dayjs(data.shiftDuration.end, 'DD/MM/YY').format('MMM D')}`}
                                                                        </Typography>
                                                                        <Typography sx={{ fontSize: '11px' }}>
                                                                            {`${dayjs(data.shiftWorkingHours.start, 'hh:mmA').format('HH:mm')} - ${dayjs(data.shiftWorkingHours.end, 'hh:mmA').format('HH:mm')}`}
                                                                        </Typography>
                                                                    </Box>
                                                                </Stack>
                                                            </Stack>
                                                        </Box>
                                                    </Grid>

                                                </motion.div>
                                            )}
                                        </Droppable>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            <Typography key={'no-available'} sx={{ p: 2, textAlign: 'center', color: 'gray' }}>
                                No results found for "{shiftSearchTerm}"
                            </Typography>
                        )}
                    </AnimatePresence>
                </Stack>

                {/* Employee list remains the same */}

                <Droppable droppableId="employeesList">
                    {(provided) => (
                        <Stack
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            sx={{ width: '100%', maxHeight: '550px', overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'thin', scrollbarGutter: 'stable' }}
                        >
                            <AnimatePresence mode="wait">
                                {filteredEmployees.length > 0 ? (
                                    <motion.div key={'available-employees'}>
                                        <AnimatePresence>
                                            {filteredEmployees.map((data, index) => (
                                                <Draggable key={data.id} draggableId={data.id.toString()} index={index}>
                                                    {(provided, snapshot) => (
                                                        <motion.div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={{
                                                                ...provided.draggableProps.style,
                                                                opacity: snapshot.isDropAnimating ? 0 : (snapshot.isDragging ? 0.5 : 1),

                                                            }}
                                                        >
                                                            <Grid item xs={1} className={`border border-dashed w-full cursor-pointer hover:bg-zinc-100 bg-white border-gray-500`}>
                                                                <Box sx={{ height: '' }} className="p-2 flex  flex-row justify-start space-x-2 align-top">
                                                                    <Stack sx={{ width: '100%' }} direction={'row'} alignItems={'center'} gap={3}>
                                                                        <DragIndicatorIcon sx={{ color: 'grey' }} />
                                                                        <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ width: '100%' }}>

                                                                            <Stack direction={'row'} gap={1} alignItems={'start'}>
                                                                                <Stack direction={'row'} gap={1} alignItems={'center'}>

                                                                                    <Avatar src={data.img} className='w-8 mt-1' />
                                                                                </Stack>

                                                                                <Stack justifyContent='space-between'>
                                                                                    <Typography sx={{ fontSize: '14px', fontWeight: 600 }} className=''>{data.fullName}</Typography>
                                                                                    <Typography sx={{ fontSize: '11px', fontWeight: 600 }} className='text-overflow-ellipsis whitespace-nowrap'>{data.designationLabel || 'empty'}</Typography>
                                                                                </Stack>
                                                                            </Stack>
                                                                            <Box sx={{ bgcolor: 'primary.main' }} className=' text-white rounded px-1 text-[12px] flex items-center w-fit gap-1' onClick={(e) => e.stopPropagation()}>
                                                                                <input type='number' min={0} className='text-black h-full w-16 pl-[.4rem] border rounded' value={data.ratePerHour} onChange={(e) => handleRateChange(data.id, e)} />
                                                                                <Typography className='w-1/2' sx={{ fontSize: '11px', fontWeight: 500, textAlign: 'end' }}>/hr</Typography>
                                                                            </Box>
                                                                        </Stack>
                                                                    </Stack>
                                                                </Box>
                                                            </Grid>
                                                        </motion.div>
                                                    )}
                                                </Draggable>
                                            ))}
                                        </AnimatePresence>
                                    </motion.div>
                                ) : (
                                    <Typography key={'no-available-employees'} sx={{ p: 2, textAlign: 'center', color: 'gray' }}>
                                        No results found for "{employeeSearchTerm}"
                                    </Typography>
                                )}
                            </AnimatePresence>
                            {/* {provided.placeholder} */}
                        </Stack>
                    )}
                </Droppable>
            </Stack>
        </DragDropContext >
    );
}


const ConfirmAssignShiftDialog = ({ open, setOpenModal, selectedShift, data, dispatch, setAlert, setChangesCount }) => {
    const [loading, setLoading] = useState(false)
    const handleConfirm = () => {
        setLoading(true)
        let formdata = new FormData()
        formdata.append('shiftId', selectedShift.shiftId)
        formdata.append('employeeIds', [data.id])
        formdata.append('employeeHourlyRates', [data.ratePerHour])
        dispatch(cloneShiftByIdAndEmployeeIds(formdata))
            .then((result) => {
                if (result.payload.SUCCESS === 1) {
                    setChangesCount(prev => prev + 1)
                    setOpenModal(false)

                    setAlert({
                        open: true,
                        severity: 'success',
                        message: `${selectedShift.shiftName} assigned to ${data.fullName} successfully`
                    })
                } else {
                    // Handle error case
                }
            })
            .catch((err) => {
                console.error(err);
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Could not assign shift'
                })
            });
    };

    return (
        <Dialog open={open} onClose={() => setOpenModal(false)} fullWidth maxWidth={'xs'}>
            <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white' }}>
                <Typography variant="h5">Confirm Assign Shift</Typography>
            </DialogTitle>
            <DialogContent sx={{ mt: 3 }}>
                <Typography variant="body1" mb={1}>
                    Are you sure you want to add shift "{selectedShift.shiftName}" to the following employee?
                </Typography>
                <Grid item xs={1} className={`border w-full cursor-pointe bg-white`}>
                    <Box sx={{ height: '' }} className="p-2 flex flex-row justify-start space-x-2 align-top">
                        <Stack sx={{ width: '100%' }}>
                            <Stack direction='row' justifyContent='space-between' alignItems='center' >
                                <Stack direction={'row'} gap={1} alignItems={'start'}>
                                    <Avatar src={data.img} className='w-8' />
                                    <Stack justifyContent='space-between'>
                                        <Typography sx={{ fontSize: '14px', fontWeight: 600 }} className=''>{data.fullName}</Typography>
                                        <Typography sx={{ fontSize: '11px', fontWeight: 600 }} className='text-overflow-ellipsis whitespace-nowrap'>{data.designationLabel || 'empty'}</Typography>
                                    </Stack>
                                </Stack>
                                <Box sx={{ backgroundColor: 'primary.main' }} className=' text-white rounded px-2 text-[12px] flex items-center w-fit gap-1' onClick={(e) => e.stopPropagation()}>
                                    <Typography className='w-1/2' sx={{ fontSize: '11px', fontWeight: 500, textAlign: 'end' }}>{data.ratePerHour}/hr</Typography>
                                </Box>
                            </Stack>
                        </Stack>
                    </Box>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between', mt: 'auto', p: 3 }}>
                <Stack sx={{ width: '100%' }} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                    <Button variant="outlined" sx={{ mr: 1, color: 'primary.main !important', bgcolor: '#fff !important' }} onClick={() => setOpenModal(false)}>
                        Cancel
                    </Button>
                    <div>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            onClick={handleConfirm}
                            sx={{ ml: 1 }}
                        >
                            {loading ? <CircularProgress /> : 'Confirm'}
                        </Button>
                    </div>
                </Stack>

            </DialogActions>
        </Dialog>
    );
};

