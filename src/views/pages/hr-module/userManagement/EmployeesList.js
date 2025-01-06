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
    TextField,
    InputAdornment,
    Avatar,
    ButtonGroup,
    Button,
    Menu,
    MenuItem,
    Switch,
    Checkbox,
} from '@mui/material';

import { visuallyHidden } from '@mui/utils';
import { styled } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';

import AlertMessage from '../../../../components/shared/AlertMessage';

import { useNavigate } from 'react-router';
import { getAllEmployeesData, getDepartmantsByFirm, getDesignationsByFirm } from '../../../../store/hr/EmployeeSlice';
import { addNewEmployee } from '../../../../store/hr/EmployeeSlice';
import { getAllCountries } from '../../../../store/admin/FirmSlice';

import { setSelectedCandidate } from '../../../../store/candidates/CandidatesSlice';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CustomCheckbox from '../../../../components/forms/theme-elements/CustomCheckbox';
import EmployeeWorkingHistory from '../../multistep-form/addbySearch/EmployeeWorkingHistory';
import { SelectEmail } from '../../../../store/apps/email/EmailSlice';
import EmployeeDetailModal from '../../multistep-form/addbySearch/EmployeeDetailModal';
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween';
import EnhancedTableToolbar from '../../multistep-form/addbySearch/EnhancedTableToolbar';
import { useParams } from 'react-router';
import { getUsersWithUpcomingSchedule, getAllEmployeesByCompany, addAllCandidates } from '../../../../store/candidates/CandidatesSlice';
import CustomBackdrop from '../../../../components/forms/theme-elements/CustomBackdrop';
import { Stack, display } from '@mui/system';
import { IconLoader2, IconSearch } from '@tabler/icons';
import { Edit } from '@mui/icons-material';
import EditEmployeeInfoModal from './EditEmployeeInfoModal';
import Breadcrumb from '../../../../layouts/full/shared/breadcrumb/Breadcrumb';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { AddEmployeeActionModal } from '../../addEmployees/AddEmployees';
import ImportEmployeesCsv from '../../addEmployees/ImportEmployeesCsv';

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
        width: '30%'

    },
    {
        id: 'originOfPassportLabel',
        numeric: false,
        disablePadding: false,
        label: 'Nationality',
        width: '20%'

    },
    {
        id: 'contactNo',
        numeric: false,
        disablePadding: false,
        label: 'Contact',
        width: '15%'
    },
    // {
    //     id: 'department',
    //     numeric: false,
    //     disablePadding: false,
    //     label: 'Department',
    //     width: '15%'
    // },

    {
        id: 'designation',
        numeric: false,
        disablePadding: false,
        label: 'Designation',
        width: '15%'
    },

    // {
    //     id: 'occupation',
    //     numeric: false,
    //     disablePadding: false,
    //     label: 'Occupation',
    //     width: '20%'
    // },
    {
        id: 'email',
        numeric: false,
        disablePadding: false,
        label: 'Email',
        width: 'auto'
    },
    // {
    //     id: 'workingDays',
    //     numeric: false,
    //     disablePadding: false,
    //     label: 'Working Days',
    //     width: '20%'
    // },
    // {
    //     id: 'workingHours',
    //     numeric: false,
    //     disablePadding: false,
    //     label: 'Working Hours',
    //     width: '10%'
    // },
    {
        id: 'HourlyRate',
        numeric: false,
        disablePadding: false,
        label: 'Hourly rate',
        width: '10%'
    },
    {
        id: 'Status',
        numeric: false,
        disablePadding: false,
        label: 'Status',
        width: '10%'
    },
    {
        id: 'Actions',
        numeric: false,
        disablePadding: false,
        label: 'Actions',
        width: '20%'
    },
];

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headCells } = props;

    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        sx={{ fontSize: '13px', fontWeight: '500', opacity: .7, whiteSpace: 'nowrap' }}
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
    // numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const EmployeesList = ({
    toggle,
    setToggle,
    selected,
    setSelected,
    rowsToRender,
    AddBtn,
    selectable = false,
    singleSelect = false,
    onSelect,
    selectedEnrollEmployee = null,
    hideEditOptions = false,
    hideAddButton = false,
    hideStatus = false,
    hideBreadCrumb = false,
    hideRatePerHour = false,
    rowsNumber = 25
}) => {
    const firmId = JSON.parse(localStorage.getItem('Exergy HRMData'))?.firmId
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(rowsNumber);

    const [rows, setRows] = React.useState([])
    const [allRows, setAllRows] = React.useState([])
    const [loading, setLoading] = React.useState(false)

    const [selectedEmployee, setSelectedEmployee] = React.useState(null)
    const [search, setSearch] = React.useState('');
    const [open, setOpen] = React.useState(false)
    const [changesCount, setChangesCount] = React.useState(0)
    const [countries, setCountries] = React.useState([])
    const [departments, setDepartments] = React.useState([])
    const [designations, setDesignations] = React.useState([])
    const [openDetailModal, setOpenDetailModal] = React.useState(false)
    const [openModal, setOpenModal] = React.useState(false)
    const [itemAdded, setItemAdded] = React.useState(0)
    const [openImportModal, setOpenImportModal] = React.useState(false)

    const [alert, setAlert] = React.useState({
        open: false,
        severity: '',
        message: ''
    });
    // const rowsToRender = updatedRows.length === 0 ? rows : updatedRows
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [date, setDate] = React.useState({
        from: '',
        to: ''
    });

    React.useEffect(() => {
        let formData = new FormData();
        formData.append('firmId', firmId);

        dispatch(getDepartmantsByFirm(formData))
            .then((result) => {
                if (result.payload.SUCCESS === 1) {
                    setDepartments(result.payload.DATA);
                }
            })
            .catch((error) => {
                console.error('Error fetching departments:', error);
            });

        dispatch(getDesignationsByFirm(formData))
            .then((result) => {
                if (result.payload.SUCCESS === 1) {
                    setDesignations(result.payload.DATA);
                }
            })
            .catch((error) => {
                console.error('Error fetching designations:', error);
            });
    }, [itemAdded])

    React.useEffect(() => {
        setLoading(true)
        const formData = new FormData()
        formData.append('companyId', firmId)

        dispatch(getAllCountries())
            .then((result) => {
                if (result.payload.SUCCESS === 1) {
                    setCountries(result.payload.DATA);
                }
            })
            .catch((error) => {
                console.error('Error fetching countries:', error);
            });
        dispatch(getAllEmployeesData(formData))
            .then((result) => {
                if (result.payload.SUCCESS === 1) {
                    const employeesWithImages = result.payload.DATA.map(employee => ({
                        ...employee,
                        imageUrl: `http://122.248.194.140:8081/ExergyHRM/Users/GetProfileImageByFileName?fileName=${employee.profileFileName}`
                    }));
                    setRows(employeesWithImages);
                    setAllRows(employeesWithImages);
                    setLoading(false);
                }
                else {
                    setAlert({
                        open: true,
                        severity: 'error',
                        message: 'Could not fetch employees.'
                    })

                }

            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
            });

    }, [changesCount])


    React.useEffect(() => {
        let filteredRows = [...allRows];  // Start with the original data

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

    const handleRowClick = (employee) => {
        if (selectable) {
            onSelect(selectedEnrollEmployee?.id === employee.id ? null : employee);
        }

    };


    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    const handleOpenModal = () => setOpenImportModal(true);
    const handleCloseModal = () => setOpenImportModal(false);

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
            const newSelecteds = rowsToRender.map((n) => n.id);
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

    const openEditEmployeeModal = (employeeId) => {
        const employee = rows.find(item => item.id === employeeId)
        setSelectedEmployee(employee)
        setOpen(true)
    }
    const handleOpenDetailModal = (employeeId) => {
        const employee = rows.find(item => item.id === employeeId)
        setSelectedEmployee(employee)
        // setOpenDetailModal(true)
    }

    const changeStatus = (employeeId) => {
        const employee = rows.find(item => item.id === employeeId)
        setRows((prev) => {
            return prev.map(item => {
                if (item.id === employeeId) {
                    return { ...item, isActive: item.isActive ? 0 : 1, }
                } else {
                    return item
                }
            })
        })

        // const transformedValues = {
        //     companyId: firmId,
        //     firstName: employee.firstName,
        //     lastName: employee.lastName || '',
        //     displayName: `${employee.firstName} ${employee.lastName || ''}`,
        //     nickName: employee.nickName || '', // Default for nickName
        //     email: employee.email || '', // Default for email
        //     contactNo: employee.contactNo || '', // Default for contactNo
        //     originOfPassportId: countries.find(a => a.id === employee.originOfPassportId).id, // No change needed
        //     cnicNo: employee.cnicNo || '', // Default for cnicNo
        //     bankAccount: employee.bankAccountNo || '', // Default for bankAccount
        //     departmentId: employee.departmentId || 0, // No change needed
        //     designationId: employee.designationId || 0, // No change needed
        //     hourlyRate: employee.ratePerHour || '', // Default for hourlyRate
        //     userId: employee.userId || 0,
        //     isActive: employee.isActive ? 0 : 1,
        //     password:'Physics@123'
        // }
        const transformedValues = {
            companyId: Number(firmId),
            firstName: employee.firstName,
            lastName: employee.lastName || '',
            displayName: `${employee.firstName} ${employee.lastName || ''}`,
            nickName: employee.nickName || '', // Default for nickName
            email: employee.email || '', // Default for email
            contactNo: employee.contactNo || '', // Default for contactNo
            originOfPassportId: Number(countries.find(a => a.id === employee.originOfPassportId).id), // No change needed
            cnicNo: employee.cnicNo || '', // Default for cnicNo
            bankAccount: employee.bankAccountNo || '', // Default for bankAccount
            departmentId: Number(employee.departmentId || 0), // No change needed
            designationId: Number(employee.designationId || 0), // No change needed
            hourlyRate: Number(employee.ratePerHour || 0), // Default for hourlyRate
            userId: Number(employee.userId || 0),
            isActive: Number(employee.isActive ? 0 : 1),
            password: 'Physics@123',
            genderId:employee.genderId || 1,
        };

        let formdata = new FormData();

        for (const key in transformedValues) {
            formdata.append(key, transformedValues[key]);
        }

        dispatch(addNewEmployee(formdata))
            .then((result) => {
                console.log(result, "result");
                if (result.payload.SUCCESS === 1) {
                    setAlert({
                        open: true,
                        severity: 'success',
                        message: 'Employee status has been updated'
                    });
                    // setChangesCount(prev => prev + 1)

                } else {
                    setAlert({
                        open: true,
                        severity: 'error',
                        message: result.payload
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                setAlert({
                    open: true,
                    severity: 'error',
                    message: err.USER_MESSAGE || 'Couldn\'t edit employee. Please try again.'
                });
            });

    }

    // const isSelected = (name) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const BCrumb = [
        {
            to: '/hr',
            title: 'HR',
        },
        {
            title: 'Employees Management',
        }
    ];
    const handleCardClick = (type) => {
        navigate(`/admin/add-employee-wizard/${'f'}`, { state: { type: type } });
    }
    const filteredHeadCells = React.useMemo(() =>
        headCells.filter(cell => !(
            (hideStatus && cell.id === 'Status') ||
            (hideEditOptions && cell.id === 'Actions') ||
            (hideRatePerHour && cell.id === 'HourlyRate')
        )),
        [hideStatus, hideEditOptions]
    );

    return (
        <Box sx={{ transition: 'all' }} className="mt-5">
            <AlertMessage open={alert.open} setAlert={setAlert} severity={alert.severity} message={alert.message} />
            {/* {!hideBreadCrumb && <Breadcrumb title="Employees Management" items={BCrumb} />} */}
            {openModal && !openImportModal && <AddEmployeeActionModal setOpenModal={setOpenModal} handleCardClick={handleCardClick} handleOpenModal={handleOpenModal} />}
            <ImportEmployeesCsv
                open={openImportModal}
                onClose={handleCloseModal}
            />
            {open && <EditEmployeeInfoModal
                setItemAdded={setItemAdded}
                countryList={countries}
                firmId={firmId}
                setChangesCount={setChangesCount}
                open={open}
                setOpen={setOpen}
                designations={designations}
                departments={departments}
                selectedEmployee={selectedEmployee} />}

            <AlertMessage open={alert.open} setAlert={setAlert} severity={alert.severity} message={alert.message} />

            <Grid container spacing={1} alignItems="start">
                <Grid item xs={12} mb={1} >
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                        <Stack direction={'row'} spacing={2} alignItems={'center'}>
                            <Typography variant='h5' sx={{ color: 'primary.main', pl: 1 }}>All Added Employees</Typography>
                            {!hideAddButton && (
                                <Button
                                    variant='contained'
                                    onClick={() => {
                                        setOpenModal(true)
                                    }}
                                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, px: '.4rem', minWidth: 'auto', fontSize: '1rem' }}>
                                    <AddIcon fontSize='inherit' className='text-white' />
                                </Button>
                            )}
                        </Stack>
                        <TextField
                            color='primary'
                            sx={{
                                width: '350px',
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
                            onChange={handleSearch}
                            value={search}
                        />
                    </Stack>


                </Grid>

                <Grid item xs={12}>
                    <Box>
                        <Paper variant="outlined">
                            <TableContainer sx={{ scrollbarWidth: 'thin' }}>
                                <Table
                                    sx={{ minWidth: 750 }}
                                    aria-labelledby="tableTitle"
                                    size={'small'}
                                >
                                    <EnhancedTableHead
                                        headCells={filteredHeadCells}
                                        order={order}
                                        orderBy={orderBy}
                                        onSelectAllClick={handleSelectAllClick}
                                        onRequestSort={handleRequestSort}
                                        rowCount={rows.length}
                                    />

                                    <TableBody>
                                        {loading ? (
                                            <TableRow key="loading" >
                                                <TableCell colSpan={headCells.length} align="center">
                                                    <Box color={'primary.main'} className='text-center flex justify-center pt-5'>
                                                        <div className='animate-spin'>
                                                            <IconLoader2 size={30} />
                                                        </div>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            stableSort(rows, getComparator(order, orderBy))
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((row, index) => {
                                                    const labelId = `enhanced-table-checkbox-${index}`;

                                                    return (
                                                        <StyledTableRow
                                                            hover
                                                            role="checkbox"
                                                            tabIndex={-1}
                                                            key={row.id}
                                                            onClick={() => handleRowClick(row)}
                                                            sx={{
                                                                cursor: selectable ? 'pointer' : 'default',
                                                                bgcolor: (theme) => selectedEnrollEmployee?.id === row.id ? `${theme.palette.primary.main}40 !important` : 'inherit'
                                                            }}
                                                        >
                                                            <TableCell sx={{ width: headCells[1].width }} >
                                                                <Box className='flex items-center gap-2'>
                                                                    <Avatar loading='lazy' src={row.imageUrl} sx={{ width: '35px', height: '35px' }} />
                                                                    <Box>
                                                                        <Typography fontWeight={600} className='max-w-[10rem] overflow-hidden text-ellipsis whitespace-nowrap'>
                                                                            {row.fullName}
                                                                        </Typography>
                                                                        <Typography fontSize={10} color={'grey'}>
                                                                            {row.employeeNo}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography>{row.originOfPassportLabel || ''}</Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography>{row.contactNo || ''}</Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography>{row.designationLabel || ''}</Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography>{row.email || ''}</Typography>
                                                            </TableCell>
                                                            {!hideRatePerHour &&
                                                                <TableCell>
                                                                    <Typography pl={2}>£{row.ratePerHour || 0.00}</Typography>
                                                                </TableCell>
                                                            }
                                                            {!hideStatus && (
                                                                <TableCell>
                                                                    <Switch onChange={() => changeStatus(row.id)} checked={Boolean(row.isActive)} />
                                                                </TableCell>
                                                            )}
                                                            {!hideEditOptions && <TableCell>
                                                                <Button
                                                                    disabled={!row.isActive}
                                                                    className={`flex items-center gap-2`}
                                                                    onClick={() => openEditEmployeeModal(row.id)}
                                                                    variant="outlined"
                                                                    sx={{ color: 'primary.main', bgcolor: '#fff !important', opacity: row.isActive ? 1 : 0.7 }}
                                                                    size="small"
                                                                >
                                                                    <EditIcon className='cursor-pointer' sx={{ fontSize: 15 }} /> Edit
                                                                </Button>

                                                            </TableCell>}
                                                        </StyledTableRow>
                                                    );
                                                })
                                        )}
                                    </TableBody>

                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={rowsNumber === 5 ? [5, 10, 25] : [25, 50, 100]}
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
                openDetailModal &&
                <EmployeeDetailModal
                    open={openDetailModal}
                    setOpen={setOpenDetailModal}
                    candidate={selectedEmployee}
                    Comp={() =>
                        <EmployeeWorkingHistory
                            candidateId={selectedEmployee}
                        />
                    } />
            }
        </Box>
    );
};


export default EmployeesList;
