import React, { useState, useEffect } from 'react';
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
    Paper,
    Typography,
    IconButton,
    Collapse,
    Button,
    TextField,
    InputAdornment,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs'
import { Stack } from '@mui/system';
import { IconSearch } from '@tabler/icons';
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
const calculateHoursBetweenTimes = (startTime, endTime) => {
    const start = dayjs(startTime, 'hh:mmA');
    const end = dayjs(endTime, 'hh:mmA');
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




const ArchivedShiftTable = ({ shifts, unarchiveShift, loading }) => {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [search, setSearch] = useState('');
    const [filteredShifts, setFilteredShifts] = useState(shifts);

    useEffect(() => {
        const filtered = shifts.filter((shift) =>
            shift.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredShifts(filtered);
        setPage(0);
    }, [search, shifts]);

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };




    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    const CollapsibleRow = ({ row }) => {
        const [open, setOpen] = useState(false);

        return (
            <>
                <StyledTableRow>
                    <TableCell>
                        <Typography fontWeight={600}>{row.name}</Typography>
                        {/* <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}

                        </IconButton> */}
                    </TableCell>

                    <TableCell>
                        <Typography>
                            {`${row.duration.start} to ${row.duration.end}`}
                        </Typography>
                        <Typography fontSize={'.7rem'} sx={{ color: 'grey' }}>
                            {calculateDaysBetweenDates(row.duration.start, row.duration.end)}d
                        </Typography>
                    </TableCell>

                    <TableCell>
                        <Typography>{`${row.workingHours.start} to ${row.workingHours.end}`}</Typography>
                        <Typography fontSize={'.7rem'} sx={{ color: 'grey' }}>
                            {calculateHoursBetweenTimes(row.workingHours.start, row.workingHours.end)}hrs
                        </Typography>
                    </TableCell>
                    <TableCell>
                        <Typography>
                            {row.breakHours.start !== 'Invalid Date' && Boolean(row.breakHours.start)
                                ? `${row.breakHours.start} to ${row.breakHours.end}`
                                : 'No break'}
                        </Typography>
                        {row.breakHours.start !== 'Invalid Date' && Boolean(row.breakHours.start) && (
                            <Typography fontSize={'.7rem'} sx={{ color: 'grey' }}>
                                {calculateHoursBetweenTimes(row.breakHours.start, row.breakHours.end)}hrs
                            </Typography>
                        )}
                    </TableCell>
                    <TableCell >
                        <Typography className='bg-yellow-400 text-white text-center rounded-lg w-fit px-2'>
                            Archived
                        </Typography>

                    </TableCell>
                    <TableCell>
                        <Button
                            onClick={() => unarchiveShift(row.id)}
                            variant="outlined"
                            size="small"
                            sx={{ backgroundColor: '#fff !important', color: 'primary.main' }}
                            startIcon={<UnarchiveIcon />}
                        >
                            Unarchive
                        </Button>
                    </TableCell>
                </StyledTableRow>
                {/* <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Additional Details
                                </Typography>
                                <Table size="small" aria-label="purchases">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Description</TableCell>
                                            <TableCell>Employee Data</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>{row.description || 'No description'}</TableCell>
                                            <TableCell>

                                                {Object.entries(row.employeeData).map(([employeeId, rate]) => (
                                                    <div key={employeeId}>{`Employee ${employeeId}: ${rate}/hr`}</div>
                                                ))}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow> */}
            </>
        );
    };

    return (
        <>
            <Stack direction="row" justifyContent="space-between" alignItems="end" mb={2}>
                <Typography variant='h5' sx={{ color: 'primary.main', pl: 1 }}>Archived Shifts</Typography>
                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Search by shift name"
                    value={search}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <IconSearch color='gray' size="1.1rem" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ width: 250 }}
                />
            </Stack>

            <Paper variant="outlined">
                <TableContainer>
                    <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size='small'>
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={shifts.length}
                        />
                        <TableBody>
                            {filteredShifts.length === 0 && !loading ? (
                                <TableRow>
                                    <TableCell colSpan={7}>
                                        <Box textAlign="center" py={3}>
                                            <Typography color="textSecondary">
                                                No archived shifts found
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                stableSort(filteredShifts, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => (
                                        <CollapsibleRow key={row.id} row={row} />
                                    ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredShifts.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </>
    );
};

export default ArchivedShiftTable;