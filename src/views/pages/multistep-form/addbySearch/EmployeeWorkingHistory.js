import AvailableEmployees from "./AvailableEmployees";
import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import { format, previousSaturday } from 'date-fns';
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
    Tooltip,
    FormControlLabel,
    Typography,
    Avatar,
    TextField,
    InputAdornment,
    Paper,
    Stack,
    Button,
    CardContent,
    Card,
    Grid,
} from '@mui/material';

import { visuallyHidden } from '@mui/utils';
import { styled } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import { IconSearch } from '@tabler/icons';
import AlertMessage from '../../../../components/shared/AlertMessage';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { work as data } from './workingHistoryData'
import { setSelectedCandidate } from '../../../../store/candidates/CandidatesSlice';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CustomCheckbox from '../../../../components/forms/theme-elements/CustomCheckbox';
import EmployeeDetailCard from './EmployeeDetailCard';

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
        id: 'companyName',
        numeric: false,
        disablePadding: false,
        label: 'Company Name',
    },
    {
        id: 'occupation',
        numeric: false,
        disablePadding: false,
        label: 'Occupation',
    },
    {
        id: 'hourlyRate',
        numeric: false,
        disablePadding: false,
        label: 'Hourly Rate',
    },

    {
        id: 'startDate',
        numeric: false,
        disablePadding: false,
        label: 'Start date',
    },
    {
        id: 'endDate',
        numeric: false,
        disablePadding: false,
        label: 'End date',
    },
    {
        id: 'location',
        numeric: false,
        disablePadding: false,
        label: 'Location',
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
                {headCells.map((headCell) => (
                    <TableCell
                        sx={{ fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap' }}
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

const EnhancedTableToolbar = (props) => {
    return (
        <Toolbar
            disableGutters
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}
        >
            <Typography variant='h5' sx={{ color: 'primary.main', pl: 1 }}>Employee past occupations</Typography>
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

const EmployeeWorkingHistory = ({ toggle, setToggle, selected, setSelected, candidateId }) => {
    //selected candidate ireceives the id of the candidate whose detail needs to be shown
    const candidate = useSelector((state) => state.candidatesReducer.selectedCandidate);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [alert, setAlert] = React.useState({
        open: false,
        severity: '',
        message: ''
    });
    const rows = data.filter(item => item.id === candidateId.id)[0]?.pastCompanies


    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getHolidays = useSelector((state) => state.holidayReducer.holidayList);


    const [search, setSearch] = React.useState('');


    // React.useEffect(() => {
    //     setRows(previousCompanies)
    // }, [candidateId.id])

    React.useEffect(() => {
        if (toggle && selected.length === 0) {
            setAlert({
                open: true,
                severity: 'error',
                message: 'Please Select at least one employee'
            })
        }
    }, [toggle]);

    // This is for the sorting
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // This is for select all the row
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            setToggle(false)
            const newSelecteds = rows.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    // const handleClick = (event, name) => {
    //     setToggle(false)
    //     const selectedIndex = selected.indexOf(name);
    //     let newSelected = [];

    //     if (selectedIndex === -1) {
    //         newSelected = newSelected.concat(selected, name);
    //     } else if (selectedIndex === 0) {
    //         newSelected = newSelected.concat(selected.slice(1));
    //     } else if (selectedIndex === selected.length - 1) {
    //         newSelected = newSelected.concat(selected.slice(0, -1));
    //     } else if (selectedIndex > 0) {
    //         newSelected = newSelected.concat(
    //             selected.slice(0, selectedIndex),
    //             selected.slice(selectedIndex + 1),
    //         );
    //     }

    //     setSelected(newSelected);
    // };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
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
        <Box mt=".5rem">
            <AlertMessage open={alert.open} setAlert={setAlert} severity={alert.severity} message={alert.message} />

            <Grid container spacing={1} alignItems="start">
                <Grid item xs={12}>
                    <Toolbar
                        disableGutters
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <Typography variant='h5' sx={{ color: 'primary.main', pl: 1 }}>Employee past occupations</Typography>
                    </Toolbar>
                </Grid>

                <Grid item xs={12}>
                    <Box>
                        <Paper variant="outlined">
                            <TableContainer>
                                <Table
                                    sx={{ width: '100%' }}
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


                                    {
                                        <TableBody >
                                            {rows
                                                .map((row, index) => {
                                                    const isItemSelected = isSelected(row.id);
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
                                                            <TableCell>
                                                                <Typography>{row.companyName}</Typography>
                                                            </TableCell>

                                                            <TableCell>
                                                                <Typography>{row.occupation}</Typography>
                                                            </TableCell>
                                                            <TableCell >
                                                                <Typography sx={{ pl: 3 }}>£ {row.hourlyRate}</Typography>
                                                            </TableCell>

                                                            <TableCell>
                                                                <Typography>{row.startDate}</Typography>
                                                            </TableCell>

                                                            <TableCell>
                                                                <Typography>{row.endDate}</Typography>
                                                            </TableCell>

                                                            <TableCell>
                                                                <Typography>{row.location}</Typography>
                                                            </TableCell>
                                                        </StyledTableRow>
                                                    );
                                                })}
                                            {emptyRows > 0 && (
                                                <TableRow
                                                    key={'empty'}
                                                    style={{
                                                        height: (dense ? 33 : 53) * emptyRows,
                                                    }}
                                                >
                                                    No Data to display
                                                    <TableCell colSpan={6} />
                                                </TableRow>
                                            )}
                                        </TableBody>}
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

                </Grid>


            </Grid>
        </Box>
    );
};


export default EmployeeWorkingHistory;