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
    Tooltip,
    FormControlLabel,
    Typography,
    Avatar,
    TextField,
    InputAdornment,
    Paper,
    Chip,
    Stack,
} from '@mui/material';

import { visuallyHidden } from '@mui/utils';
import { styled } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from 'src/store/apps/eCommerce/EcommerceSlice';
import CustomCheckbox from '../../../../components/forms/theme-elements/CustomCheckbox';
import CustomSwitch from '../../../../components/forms/theme-elements/CustomSwitch';
import { IconDotsVertical, IconFilter, IconSearch, IconTrash } from '@tabler/icons';
import { getAllEmployeesData } from '../../../../store/hr/EmployeeSlice';
import AlertMessage from '../../../../components/shared/AlertMessage';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
        id: 'employee',
        numeric: false,
        disablePadding: false,
        label: 'Employee',
    },
    {
        id: 'nationalId',
        numeric: false,
        disablePadding: false,
        label: 'National ID',
    },

    {
        id: 'email',
        numeric: false,
        disablePadding: false,
        label: 'Email',
    },
    {
        id: 'branch',
        numeric: false,
        disablePadding: false,
        label: 'Branch',
    },
    {
        id: 'department',
        numeric: false,
        disablePadding: false,
        label: 'Department',
    },
    {
        id: 'designation',
        numeric: false,
        disablePadding: false,
        label: 'Designation',
    },
    {
        id: 'contact',
        numeric: false,
        disablePadding: false,
        label: 'Contact',
    },
    {
        id: 'isActive',
        numeric: false,
        disablePadding: false,
        label: 'IsActive',
    },
    {
        id: 'isVerified',
        numeric: false,
        disablePadding: false,
        label: 'IsVerified',
    },
    {
        id: 'action',
        numeric: false,
        disablePadding: false,
        label: 'Action',
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
                        sx={{ fontSize: '14px', fontWeight: '600' }}
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
    const { numSelected, handleSearch, search } = props;

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            <Box sx={{ flex: '1 1 100%' }}>
                <TextField
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <IconSearch size="1.1rem" />
                            </InputAdornment>
                        ),
                    }}
                    placeholder="Search Employees"
                    size="small"
                    onChange={handleSearch}
                    value={search}
                />
            </Box>
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

const UserList = () => {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [alert, setAlert] = React.useState({
        open: false,
        severity: '',
        message: ''
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    //Fetch Products
    React.useEffect(() => {
        dispatch(getAllEmployeesData())
            .then((result) => {
                console.log(result, "result")

                if (result.payload.SUCCESS === 1) {
                    setAlert({
                        open: true,
                        severity: 'success',
                        message: 'Retrieved employees list successfully'
                    })
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
    }, [dispatch]);

    const getEmployees = useSelector((state) => state.employeeReducer.employeesList);

    const [rows, setRows] = React.useState(getEmployees);
    const [search, setSearch] = React.useState('');

    React.useEffect(() => {
        setRows(getEmployees);
    }, [getEmployees]);

    const handleSearch = (event) => {
        const filteredRows = getEmployees.filter((row) => {
            return row.firstName?.toLowerCase().includes(event.target.value) ||
                row.lastName?.toLowerCase().includes(event.target.value) ||
                row.cnicNo?.toLowerCase().includes(event.target.value) ||
                row.email?.toLowerCase().includes(event.target.value) ||
                row?.firm?.label?.toLowerCase().includes(event.target.value) ||
                row?.department?.label?.toLowerCase().includes(event.target.value) ||
                row?.designation?.label?.toLowerCase().includes(event.target.value) ||
                row.contactNo?.toLowerCase().includes(event.target.value) ||
                (row?.isAccountNonLocked === 1 ? 'Active' : 'Blocked')?.toLowerCase().includes(event.target.value) ||
                (row?.isEnabled === 1 ? 'Verified' : 'Non-Verified')?.toLowerCase().includes(event.target.value);
        });
        setSearch(event.target.value);
        setRows(filteredRows);
    };

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
            <AlertMessage open={alert.open} setAlert={setAlert} severity={alert.severity} message={alert.message} />

            <Stack p={2}>
                <Box onClick={() => { navigate(-1) }} sx={{ cursor: 'pointer', width: '70px' }} display='flex' flexDirection='row' alignItems='center'>
                    <ArrowBackIcon fontSize='small' sx={{ color: 'primary.main', mr: 1.5 }} />
                    <Typography variant='h6' fontWeight={600}>Back</Typography>
                </Box>
            </Stack>

            <Box>
                <EnhancedTableToolbar
                    numSelected={selected.length}
                    search={search}
                    handleSearch={(event) => handleSearch(event)}
                />
                <Paper variant="outlined" sx={{ mx: 2, mt: 1 }}>
                    <TableContainer>
                        <Table
                            sx={{ minWidth: 750 }}
                            aria-labelledby="tableTitle"
                            size={dense ? 'small' : 'medium'}
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
                                        const isItemSelected = isSelected(row.title);
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
                                                    <Typography>
                                                        {`${row.firstName} ${row.lastName}`}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell>
                                                    <Typography>{row.cnicNo}</Typography>
                                                </TableCell>

                                                <TableCell>
                                                    <Typography>{row.email}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>{row.firm.label}</Typography>
                                                </TableCell>

                                                <TableCell>
                                                    <Typography>
                                                        {row?.department?.label}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell>
                                                    <Typography>
                                                        {row?.designation?.label}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell>
                                                    <Typography>
                                                        {row?.contactNo}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell>
                                                    <Chip
                                                        sx={{
                                                            bgcolor:
                                                                row?.isAccountNonLocked === 1
                                                                    ? (theme) => theme.palette.success.light
                                                                    : (theme) => theme.palette.error.light,
                                                            color:
                                                                row?.isAccountNonLocked === 1
                                                                    ? (theme) => theme.palette.success.main
                                                                    : (theme) => theme.palette.error.main,
                                                            borderRadius: "8px"
                                                        }}
                                                        size="small"
                                                        label={row?.isAccountNonLocked === 1 ? 'Active' : 'Blocked'}
                                                    />
                                                </TableCell>

                                                <TableCell>
                                                    <Chip
                                                        sx={{
                                                            bgcolor:
                                                                row?.isEnabled === 1
                                                                    ? (theme) => theme.palette.success.light
                                                                    : (theme) => theme.palette.error.light,
                                                            color:
                                                                row?.isEnabled === 1
                                                                    ? (theme) => theme.palette.success.main
                                                                    : (theme) => theme.palette.error.main,
                                                            borderRadius: "8px"
                                                        }}
                                                        size="small"
                                                        label={row?.isEnabled === 1 ? 'Verified' : 'Non-Verified'}
                                                    />
                                                </TableCell>

                                                <TableCell>
                                                    <IconButton onClick={() => navigate('/hr/add-employee', { state: { id: row.id } })}>
                                                        <EditIcon color='primary' />
                                                    </IconButton>
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
        </Box>
    );
};

export default UserList;
