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
    IconButton,
    Typography,
    Paper,
    Grid,
    Avatar,
} from '@mui/material';

import { visuallyHidden } from '@mui/utils';
import { styled } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';

import AlertMessage from '../../../../components/shared/AlertMessage';

import { useNavigate } from 'react-router';
import { data } from './Data';
import { setSelectedCandidate } from '../../../../store/candidates/CandidatesSlice';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CustomCheckbox from '../../../../components/forms/theme-elements/CustomCheckbox';
import EmployeeWorkingHistory from './EmployeeWorkingHistory';
import { SelectEmail } from '../../../../store/apps/email/EmailSlice';
import EmployeeDetailModal from './EmployeeDetailModal';
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween';
import EnhancedTableToolbar from './EnhancedTableToolbar';
import { useParams } from 'react-router';
import { getUsersWithUpcomingSchedule, getAllEmployeesByCompany, addAllCandidates } from '../../../../store/candidates/CandidatesSlice';
import CustomBackdrop from '../../../../components/forms/theme-elements/CustomBackdrop';

dayjs.extend(isBetween);

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
        const order = comparator(a[0], b[0]);
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
        label: 'Name',
        width: '20%'

    },
    {
        id: 'contactNo',
        numeric: false,
        disablePadding: false,
        label: 'Contact',
        width: '15%'
    },
    {
        id: 'occupation',
        numeric: false,
        disablePadding: false,
        label: 'Occupation',
        width: '20%'
    },
    {
        id: 'workingDays',
        numeric: false,
        disablePadding: false,
        label: 'Working Days',
        width: '20%'
    },
    {
        id: 'workingHours',
        numeric: false,
        disablePadding: false,
        label: 'Working Hours',
        width: '10%'
    },
    {
        id: 'HourlyRate',
        numeric: false,
        disablePadding: false,
        label: 'Hourly rate',
        width: '10%'
    },
    {
        id: 'detail',
        numeric: false,
        disablePadding: false,
        label: 'Detail',
        width: '20%'
    },
];

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;

    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox" >
                    <CustomCheckbox
                        color="primary"
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputprops={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        sx={{ fontSize: '13px', fontWeight: '500', opacity: .7, whiteSpace: 'nowrap', width: headCell.width }}
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


const AvailableEmployees = ({ toggle, setToggle, selected, setSelected }) => {
    const { selectedCandidate: candidate, loading, allCandidatesList } = useSelector((state) => state.candidatesReducer);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const getHolidays = useSelector((state) => state.holidayReducer.holidayList);

    const { id: firmId } = useParams()


    const [search, setSearch] = React.useState('');
    const [open, setOpen] = React.useState(false)
    const [rows, setRows] = React.useState([...allCandidatesList])
    const [alert, setAlert] = React.useState({
        open: false,
        severity: '',
        message: ''
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [date, setDate] = React.useState({
        from: '',
        to: ''
    });


    //Fetch Products
    React.useEffect(() => {
        dispatch(getUsersWithUpcomingSchedule(firmId))
            .then((result) => {
                console.log(result, "result")

                if (result.payload.SUCCESS === 1) {
                    const rowsWithImages = result.payload.DATA.map((item, i) => ({ ...item, profileImage: data[i].image, id: i + 1 }))
                    dispatch(addAllCandidates(rowsWithImages))
                    // setAlert({
                    //     open: true,
                    //     severity: 'success',
                    //     message: 'Retrieved employees list successfully'
                    // })
                }
                else {
                    setAlert({
                        open: true,
                        severity: 'error',
                        message: result.payload
                    })
                }
            })
            .catch((err) => {
                console.log(err)
                setAlert({
                    open: true,
                    severity: 'error',
                    message: err.USER_MESSAGE || 'Something went wrong.'
                })
            });

    }, []);

    React.useEffect(() => {
        setRows(allCandidatesList);
    }, [allCandidatesList]);

    // React.useEffect(() => {
    //     if (toggle && selected.length === 0) {
    //         setAlert({
    //             open: true,
    //             severity: 'error',
    //             message: 'Please Select at least one candidate'
    //         })
    //     }
    // }, [toggle]);


    React.useEffect(() => {
        let filteredRows = [...allCandidatesList];  // Start with the original data

        if (date.from !== '' && date.to !== '') {
            const fromDate = dayjs(date.from, 'DD/MM/YYYY');
            const toDate = dayjs(date.to, 'DD/MM/YYYY');

            filteredRows = filteredRows.filter((row) => {
                const workdayStart = dayjs(row.startDate, 'DD/MM/YYYY');
                const workdayEnd = dayjs(row.endDate, 'DD/MM/YYYY');

                return (workdayStart.isBetween(fromDate, toDate, null, '[]') || workdayEnd.isBetween(fromDate, toDate, null, '[]') ||
                    (workdayStart.isBefore(fromDate) && workdayEnd.isAfter(toDate)));
            });
        }

        if (search.trim() !== '') {
            const searchValue = search.toLowerCase();
            filteredRows = filteredRows.filter((row) => {
                const rowValues = Object.values(row).join(' ').toLowerCase(); //??????
                return rowValues.includes(searchValue);
            });
        }
        setRows(filteredRows)
        setPage(0)

    }, [date.to, date.from, search]);


    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };


    // This is for the sorting
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // This is to select all the rows
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            setToggle(false)
            const newSelecteds = rows.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        setToggle(false)
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];


        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
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




    return (
        <Box>
            <CustomBackdrop loading={loading} />
            <AlertMessage open={alert.open} setAlert={setAlert} severity={alert.severity} message={alert.message} />

            <Grid container spacing={1} alignItems="start">
                <Grid item xs={12} >
                    <EnhancedTableToolbar
                        title={'Candidates Available On Website'}
                        numSelected={selected.length}
                        search={search}
                        handleSearch={(event) => handleSearchChange(event)}
                        date={date}
                        setDate={setDate}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Box>
                        <Paper variant="outlined">
                            <TableContainer sx={{ maxHeight: '350px', scrollbarWidth: 'thin' }}>
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
                                        {stableSort(rows, getComparator(order, orderBy))
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row, index) => {
                                                const isItemSelected = isSelected(row.id);
                                                const labelId = `enhanced-table-checkbox-${index}`;

                                                return (
                                                    <StyledTableRow
                                                        hover
                                                        role="checkbox"
                                                        aria-checked={isItemSelected}
                                                        tabIndex={-1}
                                                        key={row.id}
                                                        selected={isItemSelected}
                                                    >

                                                        <TableCell padding="checkbox" sx={{ width: '10rem' }}>
                                                            <CustomCheckbox
                                                                onClick={(event) => handleClick(event, row.id)}
                                                                color="primary"
                                                                checked={isItemSelected}
                                                                inputprops={{
                                                                    'aria-labelledby': labelId,
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell sx={{ width: headCells[1].width }} >
                                                            <Box className='flex gap-2 w-full items-center'>

                                                                <Avatar  sx={{ width: '35px', height: '35px' }} />

                                                                <Typography sx={{ whiteSpace: 'nowrap', fontWeight: 600 }}>{row.fullName}</Typography>
                                                            </Box>

                                                        </TableCell>

                                                        <TableCell>
                                                            <Typography>{row.contactNo || '3213847233'}</Typography>
                                                        </TableCell>

                                                        <TableCell>
                                                            <Typography>{row.occupationLabel || 'Student'}</Typography>
                                                        </TableCell>

                                                        <TableCell>
                                                            <Typography>{row.startDate} to {row.endDate}</Typography>
                                                        </TableCell>

                                                        <TableCell>
                                                            <Typography>
                                                                {`${dayjs(row.startTime.join(':'), 'HH:mm').format('hh:mmA')}
                                                                 to 
                                                                ${dayjs(row.endTime.join(':'), 'HH:mm').format('hh:mmA')}`}</Typography>
                                                        </TableCell>

                                                        <TableCell >
                                                            <Typography pl={2}>£{row.hourlyRate}</Typography>
                                                        </TableCell>

                                                        <TableCell>
                                                            <IconButton onClick={() => {
                                                                setOpen(true)
                                                                dispatch(setSelectedCandidate(row))
                                                            }}>
                                                                <VisibilityIcon color='primary' size='small' />
                                                            </IconButton>
                                                        </TableCell>
                                                    </StyledTableRow>
                                                );
                                            })}
                                        {/* {emptyRows > 0 && (
                                            <TableRow
                                                style={{
                                                    height: (dense ? 33 : 53) * emptyRows,
                                                }}
                                            >
                                                <TableCell colSpan={6} />
                                            </TableRow>
                                        )} */}
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
                    {/* <span style={{ marginTop: '10px', color: "#FA896B", fontSize: '0.75rem' }}>{toggle && selected.length === 0 && 'Please Select at least one employee'}</span> */}
                </Grid>
            </Grid>

            {
                open &&
                <EmployeeDetailModal
                    open={open}
                    setOpen={setOpen}
                    candidate={candidate}
                    Comp={() =>
                        <EmployeeWorkingHistory
                            candidateId={candidate}
                            toggle={toggle}
                            setToggle={setToggle}
                            selected={selected}
                            setSelected={setSelected} />
                    } />
            }
        </Box>
    );
};

export default AvailableEmployees;