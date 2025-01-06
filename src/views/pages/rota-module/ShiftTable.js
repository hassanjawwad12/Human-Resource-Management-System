import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import { format } from 'date-fns';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Toolbar,
    IconButton,
    Typography,
    Paper,
    Stack,
    Button,
    TextField,
    InputAdornment,
    Grid,
    Tooltip,
} from '@mui/material';

import { IconEdit } from '@tabler/icons';
import dayjs from 'dayjs'
import { visuallyHidden } from '@mui/utils';
import { styled } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import { IconDotsVertical, IconFilter, IconSearch, IconTrash } from '@tabler/icons';
import GroupsIcon from '@mui/icons-material/Groups';
import { useNavigate } from 'react-router';
import { Switch } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import { AddComment, ConnectingAirportsOutlined, Rowing } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';

import EditScheduleModal from '../multistep-form/addbySearch/EditScheduleModal';

import { width } from '@mui/system';
import CustomCheckbox from '../../../components/forms/theme-elements/CustomCheckbox';
import CustomOutlinedButton from '../../../components/forms/theme-elements/CustomOutlinedButton';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import ArchiveIcon from '@mui/icons-material/Archive';

import ShiftEditModal from './ShiftEditModal';
dayjs.extend(customParseFormat);


function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], a[1]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Shift Name',

    },
    {
        id: 'duration',
        numeric: false,
        disablePadding: false,
        label: 'Duration',

    },
    {
        id: 'workingHours',
        numeric: false,
        disablePadding: false,
        label: 'Working Hours',

    },
    {
        id: 'breakHours',
        numeric: false,
        disablePadding: false,
        label: 'Break Hours',

    },
    {
        id: 'active',
        numeric: false,
        disablePadding: false,
        label: 'Shift Status',
    },
    {
        id: 'actions',
        numeric: false,
        disablePadding: false,
        label: 'Actions',
    }
];

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>

                {headCells.map((headCell) => (
                    <TableCell
                        sx={{ fontSize: '13px', fontWeight: '500', opacity: .7, p: 1, pl: 2, textAlign: headCell.label === 'Actions' ? 'center' : '' }}
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const ShiftTable = ({ showToolbar, title, shifts, setOpenModal, handleAssignShiftModal, toggleShiftActive, loading, setShiftsUpdated, handleArchiveShift }) => {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [search, setSearch] = React.useState('')
    const [alert, setAlert] = React.useState({
        open: false,
        severity: '',
        message: ''
    });
    const [open, setIsOpen] = React.useState(false)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [modalData, setModaldata] = React.useState(null)

    const getCandidates = useSelector((state) => state.candidatesReducer.selectedCandidatesList);

    const [rows, setRows] = React.useState(shifts);
    const [editShiftOpen, setEditShiftOpen] = React.useState(false);
    const [selectedShift, setSelectedShift] = React.useState(null);

    const handleEditShift = (shift) => {
        setSelectedShift(shift);
        setEditShiftOpen(true);
    };

    React.useEffect(() => {
        setRows(shifts)
    }, [shifts])

    // This is for the sorting
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // This is for select all the row
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.title);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const openModal = (id) => {
        setIsOpen(true)
        const candidate = rows.find(a => a.id === id)
        setModaldata(candidate)
    }

    const isSelected = (name) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));
    const calculateHoursBetweenTimes = (startTime, endTime) => {
        const start = dayjs(startTime, 'hh:mmA');
        const end = dayjs(endTime, 'hh:mmA');

        // Handle cases where end time is on the next day
        let duration = end.diff(start, 'hours', true);
        if (duration < 0) {
            duration += 24;
        }
        return Number(duration.toFixed(1));
    };
    const calculateDaysBetweenDates = (startDate, endDate) => {
        const start = dayjs(startDate, 'DD/MM/YY');
        const end = dayjs(endDate, 'DD/MM/YY');

        return end.diff(start, 'days');
    };
    const handleSearchChange = (event) => {
        console.log(event)
        setSearch(event.target.value);
    };

    React.useEffect(() => {
        let filteredShifts = [...shifts];
        if (search.trim() !== '') {
            const searchValue = search.toLowerCase();
            filteredShifts = shifts.filter((shift) => {
                const shiftName = shift.name.toLowerCase();
                return shiftName.includes(searchValue);
            });
        }
        setRows(filteredShifts)
    }, [search]);

    return (
        <Box>
            {open && <EditScheduleModal open={open} setIsOpen={setIsOpen} row={modalData} />}
            {editShiftOpen && selectedShift && (
                <ShiftEditModal
                    open={editShiftOpen}
                    setOpen={setEditShiftOpen}
                    shift={selectedShift}
                    setShiftsUpdated={setShiftsUpdated}
                    alert={alert}
                    setAlert={setAlert}
                />
            )}

            <Box>
                <Grid item xs={12} mb={2}>
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'end'}>
                        <Stack direction={'row'} spacing={2} alignItems={'center'}>
                            <Typography variant='h5' sx={{ color: 'primary.main', pl: 1 }}>Shift Schedule</Typography>
                        </Stack>
                        <Stack direction={'row'} spacing={2}>
                            <TextField
                                onChange={handleSearchChange}
                                value={search}
                                color='primary'
                                sx={{
                                    width: '250px',
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
                                placeholder="Search by shift name"
                                size="small"

                            />
                            <Box >
                                <Button sx={{ bgcolor: 'primary.main', color: 'white' }} size='large' onClick={() => setOpenModal(true)}>
                                    Create New Shift <AddIcon fontSize='small' sx={{ ml: 1 }} />
                                </Button>
                            </Box>
                        </Stack>
                    </Stack>
                </Grid>
                <Paper variant="outlined">



                    <TableContainer >
                        <Table
                            sx={{ minWidth: 750 }}
                            aria-labelledby="tableTitle"
                            size={'small'}
                        >
                            <EnhancedTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={rows.length}
                            />
                            <TableBody>
                                {rows.length === 0 && !loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6}>
                                            <Box textAlign="center" py={3}>
                                                <Typography color="textSecondary">
                                                    No records found
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ) :
                                    stableSort(rows, getComparator(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            const isItemSelected = isSelected(row.name);
                                            const labelId = `enhanced-table-checkbox-${index}`;

                                            return (
                                                <StyledTableRow
                                                    hover
                                                    role="checkbox"
                                                    aria-checked={isItemSelected}
                                                    tabIndex={-1}
                                                    key={index}
                                                    selected={isItemSelected}
                                                >
                                                    <TableCell sx={{ width: headCells[0].width }}>

                                                        <Typography fontWeight={600} sx={{ opacity: row.isActive ? 1 : 0.7 }}>{row.name}</Typography>
                                                    </TableCell>
                                                    <TableCell sx={{ width: headCells[1].width }}>

                                                        <Typography sx={{ opacity: row.isActive ? 1 : 0.7 }}>{`${row.duration.start} to ${row.duration.end}`}</Typography>
                                                        <Typography fontSize={'.7rem'} sx={{ color: 'grey', opacity: row.isActive ? 1 : 0.7 }}>
                                                            {calculateDaysBetweenDates(row.duration.start, row.duration.end)}d
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell sx={{ width: headCells[2].width }}>
                                                        <Typography sx={{ opacity: row.isActive ? 1 : 0.7 }}>{`${row.workingHours.start} to ${row.workingHours.end}`}</Typography>
                                                        <Typography fontSize={'.7rem'} sx={{ color: 'grey', opacity: row.isActive ? 1 : 0.7 }}>
                                                            {calculateHoursBetweenTimes(row.workingHours.start, row.workingHours.end)}hrs
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell sx={{ width: headCells[3].width }}>
                                                        <Typography sx={{ opacity: row.isActive ? 1 : 0.7 }}>
                                                            {row.breakHours.start !== 'Invalid Date' && Boolean(row.breakHours.start) ? `${row.breakHours.start} to ${row.breakHours.end}` : 'empty'}
                                                        </Typography>
                                                        {row.breakHours.start !== 'Invalid Date' && Boolean(row.breakHours.start) && (
                                                            <Typography fontSize={'.7rem'} sx={{ color: 'grey', opacity: row.isActive ? 1 : 0.7 }}>
                                                                {calculateHoursBetweenTimes(row.breakHours.start, row.breakHours.end)}hrs
                                                            </Typography>
                                                        )}
                                                    </TableCell>
                                                    <TableCell sx={{ width: headCells[4].width }}>
                                                        {/* <CustomSwitch/> */}
                                                        <Switch checked={row.isActive} onChange={() => toggleShiftActive(row.id)} />
                                                    </TableCell>
                                                    <TableCell sx={{ width: headCells[4].width, pl: 1 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexDirection: 'row-reverse', justifyContent: 'center' }}>
                                                            <Tooltip title="Archive Shift">
                                                                <IconButton
                                                                    sx={{
                                                                        color: 'grey.700',
                                                                    }}
                                                                    onClick={() => handleArchiveShift(row.id)}
                                                                    size="small"
                                                                >
                                                                    <ArchiveIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Assign Shift">
                                                                <IconButton
                                                                    sx={{ color: 'primary.main' }}
                                                                    onClick={() => handleAssignShiftModal(row.id)}
                                                                    size="small"
                                                                >
                                                                    <GroupsIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Edit Shift">
                                                                <IconButton
                                                                    sx={{ color: 'primary.main' }}
                                                                    onClick={() => handleEditShift(row)}
                                                                    size="small"
                                                                >
                                                                    <EditIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    </TableCell>
                                                </StyledTableRow>

                                            );
                                        })}
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{
                                            height: (dense ? 33 : 53) * emptyRows,
                                        }}
                                    >
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Box>
        </Box >
    );
};

export default ShiftTable;
