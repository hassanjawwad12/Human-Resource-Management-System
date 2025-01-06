import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Drawer,
  Avatar,
  Typography,
  Box,
  Switch,
  TablePagination,
  TextField,
  InputAdornment,
  CircularProgress,
  Tooltip,
  IconButton,
  Skeleton,
  Fade,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllFeatures,
  getAllFeaturesByEmployeeId,
  saveEmployeeFeatures,
} from '../../../../store/admin/AdminSlice';
import { getAllEmployeesData } from '../../../../store/hr/EmployeeSlice';
import { styled } from '@mui/material/styles';
import { Stack } from '@mui/system';
import {
  RoomPreferences as RoomPreferencesIcon,
  TableRows as TableRowsIcon,
  CalendarMonth as CalendarMonthIcon,
  CopyAll as CopyAllIcon,
  Fingerprint as FingerprintIcon,
  PendingActions as PendingActionsIcon,
  DateRange as DateRangeIcon,
  AccountCircle as AccountCircleIcon,
  Search as SearchIcon,
  Info as InfoIcon,
  Dashboard as IconLayoutDashboard,
  Key as KeyIcon,
  Domain as DomainIcon,
  ManageAccounts as ManageAccountsIcon,
  PersonRemove as PersonRemoveIcon,
  Schema as SchemaIcon,
  EditCalendar as EditCalendarIcon,
} from '@mui/icons-material';
import Breadcrumb from '../../../../layouts/full/shared/breadcrumb/Breadcrumb';
import { IconLoader2, IconSearch } from '@tabler/icons';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useTheme } from '@mui/system';
import AlertMessage from '../../../../components/shared/AlertMessage';

const iconMap = {
  RoomPreferencesIcon,
  TableRowsIcon,
  CalendarMonthIcon,
  CopyAllIcon,
  FingerprintIcon,
  PendingActionsIcon,
  DateRangeIcon,
  AccountCircleIcon,
  IconLayoutDashboard,
  KeyIcon,
  DomainIcon,
  ManageAccountsIcon,
  PersonRemoveIcon,
  SchemaIcon,
  EditCalendarIcon,
};
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function FeatureAssignmentTable() {
  const [employees, setEmployees] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [allFeatures, setAllFeatures] = useState([]);
  const [employeeFeatures, setEmployeeFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [drawerSearch, setDrawerSearch] = useState('');
  const theme = useTheme();
  const [alert, setAlert] = React.useState({
    open: false,
    severity: '',
    message: '',
  });

  const dispatch = useDispatch();
  const firmId = JSON.parse(localStorage.getItem('Exergy HRMData'))?.firmId;
  const { user } = useSelector((state) => state.loginReducer);
  useEffect(() => {
    setLoading(true);
    const formData = new FormData();
    formData.append('companyId', firmId);

    Promise.all([dispatch(getAllEmployeesData(formData)), dispatch(getAllFeatures(formData))])
      .then(([employeesResult, featuresResult]) => {
        if (employeesResult.payload.SUCCESS === 1) {
          const employeesWithImages = employeesResult.payload.DATA.map((employee) => ({
            ...employee,
            imageUrl: `http://122.248.194.140:8081/ExergyHRM/Users/GetProfileImageByFileName?fileName=${employee.profileFileName}`,
          }));
          setEmployees(employeesWithImages);
        }
        if (featuresResult.payload.SUCCESS === 1) {
          setAllFeatures(featuresResult.payload.DATA);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const handleAssignRoles = (employee) => {
    setSelectedEmployee(employee);
    setDrawerLoading(true);
    const formData = new FormData();
    formData.append('employeeId', employee.id);
    formData.append('companyId', firmId);

    dispatch(getAllFeaturesByEmployeeId(formData))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          const transformedEmployee = result.payload.DATA.map((item) => ({
            ...item,
            id: item.featureId,
          }));
          setEmployeeFeatures(transformedEmployee);
        }
        setDrawerLoading(false);
      })
      .catch(() => {
        setDrawerLoading(false);
      });
    setDrawerOpen(true);
  };

  const handleFeatureChange = (featureId) => {
    setEmployeeFeatures((prev) => {
      if (prev.some((f) => f.id === featureId)) {
        return prev.filter((f) => f.id !== featureId);
      } else {
        return [...prev, allFeatures.find((f) => f.id === featureId)];
      }
    });
  };

  const handleSave = () => {
    const featureIds = employeeFeatures.map((f) => f.id).join(',');
    const formData = new FormData();
    formData.append('companyId', firmId);
    formData.append('employeeId', selectedEmployee.id);
    formData.append('featureIds', featureIds);

    dispatch(saveEmployeeFeatures(formData))
      .then(() => {
        setAlert({
            open: true,
            severity: 'success',
            message: 'Features saved successfully'
        })
        setDrawerOpen(false);
      })
      .catch((error) => {
        setAlert({
            open: true,
            severity: 'error',
            message: err.USER_MESSAGE || 'Failed to save features. Please try again.',
          });
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleDrawerSearchChange = (event) => {
    setDrawerSearch(event.target.value);
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.designationLabel.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredFeatures = allFeatures.filter(
    (feature) =>
      feature.featureLabel.toLowerCase().includes(drawerSearch.toLowerCase()) ||
      feature.featureGroupLabel.toLowerCase().includes(drawerSearch.toLowerCase()),
  );

  const paginatedEmployees = filteredEmployees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <>
      <AlertMessage
        open={alert.open}
        setAlert={setAlert}
        severity={alert.severity}
        message={alert.message}
      />

      <Box sx={{ mb: 2 }} className="mt-5">
        <Stack direction={'row'} justifyContent={'space-between'} spacing={2} alignItems={'center'}>
          <Typography variant="h5" sx={{ color: 'primary.main', pl: 1 }}>
            Employees List
          </Typography>
          <TextField
            color="primary"
            sx={{
              width: '350px',
              '& .MuiInputBase-root': {
                border: 'none !important',
                // borderRadius: '30px !important'
              },
              '& .MuiOutlinedInput-input': {
                pl: 0,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                // border: 'none',
              },
            }}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch color="gray" size="1.1rem" />
                </InputAdornment>
              ),
            }}
            placeholder="Search by name, occupation"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Stack>
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Designation</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      color: 'primary.main',
                      alignItems: 'center',
                      height: '100px',
                    }}
                  >
                    <IconLoader2 className="animate-spin" size={30} />
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              paginatedEmployees.map((employee) => {
                return (
                  <StyledTableRow key={employee.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          src={employee.imageUrl}
                          sx={{ marginRight: 2, width: '35px', height: '35px' }}
                        />
                        <Box>
                          <Typography fontWeight={600}>{employee.fullName}</Typography>
                          <Typography fontSize={10} color="textSecondary">
                            {employee.employeeNo}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.designationLabel}</TableCell>
                    <TableCell>
                      <Chip
                        label={employee.isActive ? 'Active' : 'Inactive'}
                        sx={{
                          bgcolor: employee.isActive
                            ? 'rgba(16, 169, 69, 0.05)'
                            : 'rgba(255, 0, 0, 0.05)',
                          color: employee.isActive ? 'green' : 'red',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleAssignRoles(employee)}
                        variant="outlined"
                        size="small"
                        sx={{ color: 'primary.main', bgcolor: '#fff !important' }}
                        startIcon={<RoomPreferencesIcon />}
                      >
                        Assign Roles
                      </Button>
                    </TableCell>
                  </StyledTableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredEmployees.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {selectedEmployee && (
          <Box sx={{ width: 500, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto', scrollbarWidth: 'thin' }}>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar src={selectedEmployee.imageUrl} />
                <Box ml={2}>
                  <Box>
                    <Typography variant="h6" className="flex items-center gap-2">
                      {selectedEmployee.fullName}
                      {user.id === selectedEmployee.userId && (
                        <Tooltip
                          title="Feature changes made to yourself will only be reflected the next time you login."
                          arrow
                        >
                          <IconButton size="small" sx={{ ml: 1, padding: 0 }}>
                            <InfoIcon
                              className="motion-safe:animate-pulse mb-[1px]"
                              fontSize="small"
                              color="action"
                            />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    {selectedEmployee.email}
                  </Typography>
                </Box>
              </Box>
              <TextField
                color="primary"
                sx={{
                  mb: 2,
                  '& .MuiInputBase-root': {
                    border: 'none !important',
                  },
                  '& .MuiOutlinedInput-input': {
                    pl: 0,
                  },
                }}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                placeholder="Search feature or group name"
                size="small"
                value={drawerSearch}
                onChange={handleDrawerSearchChange}
              />

              {drawerLoading ? (
                [...Array(10)].map((_, index) => (
                  <Box
                    key={index}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    borderRadius={0}
                    py={1}
                    className="border-b"
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <Skeleton variant="rounded" width={55} height={55} />
                      <Box>
                        <Skeleton variant="text" width={150} />
                        <Skeleton variant="text" width={200} />
                      </Box>
                    </Box>
                    <Skeleton variant="rectangular" width={40} height={20} />
                  </Box>
                ))
              ) : (
                <Fade in>
                  <Box>
                    {filteredFeatures.map((feature) => (
                      <Box
                        key={feature.id}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        borderRadius={0}
                        py={1}
                        className="border-b"
                      >
                        <Box display="flex" alignItems="center" gap={2}>
                          <Box
                            sx={{ bgcolor: `${theme.palette.primary.main}20` }}
                            className="flex items-center justify-center p-4"
                          >
                            {React.createElement(iconMap[feature.featureIcon] || 'span', {
                              fontSize: 'medium',
                              style: { color: theme.palette.primary.main },
                            })}
                          </Box>
                          <Box>
                            <Typography fontSize={16} fontWeight={600}>
                              {feature.featureLabel}
                            </Typography>
                            <Typography fontSize={10} pb={0.6} lineHeight={'1rem'}>
                              {feature.featureGroupLabel}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {feature.featureDescription}
                            </Typography>
                          </Box>
                        </Box>
                        <Switch
                          checked={employeeFeatures.some((f) => f.id === feature.id)}
                          onChange={() => handleFeatureChange(feature.id)}
                        />
                      </Box>
                    ))}
                  </Box>
                </Fade>
              )}
            </Box>

            <Box sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={drawerLoading}
              >
                Save
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>
    </>
  );
}
