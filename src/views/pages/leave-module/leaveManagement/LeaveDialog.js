import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Stack,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Skeleton,
  Tooltip,
  IconButton,
  Alert,
  Autocomplete,
} from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import InfoIcon from '@mui/icons-material/Info';
import { getPendingLeaveQuotaByCompanyId } from '../../../../store/leave/LeaveSlice';
import { motion } from 'framer-motion';

const leaveTypes = [
  { id: 1, label: 'Full Day' },
  { id: 2, label: 'Half Day' },
  { id: 3, label: 'Short Leave' },
];

const leaveQuotaTypes = [
  { id: 1, label: 'Medical' },
  { id: 2, label: 'Casual' },
  { id: 3, label: 'Annual' },
];

const LeaveDialog = ({
  open,
  handleClose,
  onSave,
  onDelete,
  initialData,
  slotInfo,
  checkOverlappingLeaves,
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.loginReducer);
  const [selectedEmployee, setSelectedEmployee] = useState(user || null);
  const [leaveType, setLeaveType] = useState(
    initialData?.leaveType ? initialData?.leaveTypeLabel : '',
  );
  const [leaveQuota, setLeaveQuota] = useState(
    initialData?.leaveQuota
      ? leaveQuotaTypes.find((quota) => quota.id === initialData?.leaveQuota)?.label
      : '',
  );
  const [start, setStart] = useState(initialData?.start ? dayjs(initialData.start) : dayjs());
  const [end, setEnd] = useState(initialData?.end ? dayjs(initialData.end) : dayjs());
  const [remarks, setRemarks] = useState(initialData?.remarks || '');
  const [color, setColor] = useState(initialData?.color || 'default');
  const [leaveDuration, setLeaveDuration] = useState(0);
  const [leaveQuotas, setLeaveQuotas] = useState([]);
  const [isLoadingQuotas, setIsLoadingQuotas] = useState(false);
  const [balanceError, setBalanceError] = useState('');
  const [originalQuota, setOriginalQuota] = useState({});
  const [originalLeaveDuration, setOriginalLeaveDuration] = useState(0);
  const [overlapWarning, setOverlapWarning] = useState('');

  const [outStation, setOutStation] = useState();
  //this will be used for outstation and toil

  const calculateLeaveDuration = (start, end, leaveType) => {
    const daysDiff = end.diff(start, 'day') + 1;
    const multipliers = { 'Full Day': 1, 'Half Day': 0.5, 'Short Leave': 0.25 };
    return daysDiff * multipliers[leaveType];
  };
  const calculateLeaveChanges = () => {
    const leaveQuotaName = leaveQuota.leaveType;
    if (!selectedEmployee || !leaveQuota || leaveQuotas.length === 0) {
      return { deducted: {}, balance: {}, availableBalance: 0 };
    }

    // const quota = leaveQuota.remainingLeaves;
    const initialBalance = leaveQuotas.reduce((acc, type) => {
      acc[type.leaveType.toLowerCase()] = type.remainingLeaves;
      return acc;
    }, {});

    const deducted = {
      [leaveQuotaName.toLowerCase()]: -leaveDuration,
    };

    // if (initialData) {
    //   const originalQuotaLower = originalQuota.toLowerCase();
    //   if (originalQuotaLower === leaveQuotaName.toLowerCase()) {
    //     deducted[originalQuotaLower] += originalLeaveDuration;
    //   } else {
    //     deducted[originalQuotaLower] = originalLeaveDuration;
    //   }
    // }

    const balance = leaveQuotas.reduce((acc, type) => {
      acc[type.leaveType.toLowerCase()] =
        initialBalance[type.leaveType.toLowerCase()] +
        (deducted[type.leaveType.toLowerCase()] || 0);
      return acc;
    }, {});

    // Calculate available balance for the selected leave quota
    let availableBalance = initialBalance[leaveQuotaName.toLowerCase()];
    if (initialData && originalQuota.toLowerCase() === leaveQuotaName.toLowerCase()) {
      availableBalance += originalLeaveDuration;
    }
    return { deducted, balance, availableBalance };
  };

  useEffect(() => {
    const { availableBalance } = calculateLeaveChanges();

    if (leaveDuration > availableBalance && !isLoadingQuotas && leaveQuota && leaveType) {
      setBalanceError(
        `Insufficient ${leaveQuota} leave balance. Available: ${availableBalance} days`,
      );
    } else {
      setBalanceError('');
    }
  }, [
    selectedEmployee,
    leaveQuota,
    leaveDuration,
    leaveQuotas,
    originalLeaveDuration,
    originalQuota,
  ]);
  useEffect(() => {
    if (open) {
      if (initialData) {
        setSelectedEmployee(initialData.employee);
        setLeaveType(initialData.leaveQuotaLabel);
        setLeaveQuota({
          companyLeaveTypeId: 36,
          leaveQuota: 30,
          leaveType: 'Hajj Leave',
          remainingLeaves: 29.5,
        });
        setOriginalQuota(
          leaveQuotaTypes.find((quota) => quota.id === initialData?.leaveQuota)?.label,
        );
        setStart(dayjs(initialData.start));
        setEnd(dayjs(initialData.end));
        setRemarks(initialData.remarks);
        setColor(initialData.color);
        fetchLeaveQuotas(initialData.employeeId);
        console.log(initialData.employeeId)
        setOriginalLeaveDuration(
          calculateLeaveDuration(
            dayjs(initialData.start),
            dayjs(initialData.end),
            initialData.leaveTypeLabel,
          ),
        );
      } else if (slotInfo) {
        setStart(dayjs(slotInfo.start));
        setEnd(dayjs(slotInfo.end).subtract(1, 'day'));
      } else {
        resetForm();
      }
    } else {
      setTimeout(() => {
        resetForm();
      }, 200);
    }
  }, [open, initialData, slotInfo]);

  useEffect(() => {
    if (selectedEmployee) {
      fetchLeaveQuotas(selectedEmployee.id);
    }
  }, [selectedEmployee]);

  useEffect(() => {
    if (start && end && leaveType) {
      setLeaveDuration(calculateLeaveDuration(start, end, leaveType));
    }
  }, [start, end, leaveType]);

  useEffect(() => {
    if (selectedEmployee && start && end) {
      const isOverlapping = checkOverlappingLeaves(selectedEmployee.id, start, end);
      if (isOverlapping) {
        setOverlapWarning('Warning: This employee already has a leave during the selected period.');
      } else {
        setOverlapWarning('');
      }
    }
  }, [selectedEmployee, start, end, checkOverlappingLeaves]);

  const fetchLeaveQuotas = (employee) => {
    setIsLoadingQuotas(true);
    const formData = new FormData();
    formData.append('employeeId', employee);
    dispatch(getPendingLeaveQuotaByCompanyId(formData))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          setLeaveQuotas(result.payload.DATA.leaveDetails);
        } else {
          console.error('Failed to fetch leave quotas:', result.payload.MESSAGE);
        }
      })
      .catch((err) => {
        console.error('An error occurred while fetching leave quotas:', err);
      })
      .finally(() => {
        setIsLoadingQuotas(false);
      });
  };

  const grayLabelSx = {
    '& .MuiInputLabel-root:not(.Mui-focused)': {
      color: 'gray',
    },
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (outStation === 'TOIL' || outStation === 'Out Station') {
      const leaveData = {
        employee: selectedEmployee,
        leaveTypeId: 1,
        leaveQuotaId: leaveQuota.companyLeaveTypeId,
        start: start.toDate(),
        end: end.toDate(),
        remarks,
        color,
      };
      onSave(leaveData);
      handleClose();
    } else {
      if (balanceError || overlapWarning) {
        return;
      }
      const leaveData = {
        employee: selectedEmployee,
        leaveTypeId: leaveTypes.find((quota) => quota.label === leaveType)?.id,
        leaveQuotaId: leaveQuota.companyLeaveTypeId,
        start: start.toDate(),
        end: end.toDate(),
        remarks,
        color,
      };
      onSave(leaveData);
      handleClose();
    }
  };

  const isFormValid = () => {
    if (outStation === 'TOIL' || outStation === 'Out Station') {
      return selectedEmployee && leaveQuota && start && end && color;
    } else {
      return (
        selectedEmployee &&
        leaveType &&
        leaveQuota &&
        start &&
        end &&
        color &&
        !balanceError &&
        !overlapWarning
      );
    }
  };
  const resetForm = () => {
    setSelectedEmployee(null);
    setLeaveType('');
    setLeaveQuota('');
    setOriginalQuota('');
    setStart(dayjs());
    setEnd(dayjs());
    setRemarks('');
    setColor('default');
    setLeaveQuotas([]);
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '16px',
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ bgcolor: 'primary.main', py: 2 }}>
          <Stack direction="column">
            <Typography variant="h5" className="text-white">
              {initialData ? 'Leave Details' : 'New Leave'}
            </Typography>
            <Typography variant="subtitle1" className="text-white">
              {`${start.format('DD MMM YYYY')} - ${end.format('DD MMM YYYY')}`}
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ mb: 2 }}>
          {balanceError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {balanceError}
            </Alert>
          )}
          {overlapWarning && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              {overlapWarning}
            </Alert>
          )}
          <Stack direction="column" gap={2} pt={2}>
            {selectedEmployee && (
              <motion.div>
                {isLoadingQuotas ? (
                  <QuotaTableSkeleton />
                ) : (
                  leaveQuotas?.length > 0 &&
                  outStation !== 'TOIL' &&
                  outStation !== 'Out Station' && (
                    <TableContainer
                      component={Paper}
                      sx={{ borderRadius: '10px', border: '1px solid #e0e0e0' }}
                      elevation={0}
                    >
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Leave Type</TableCell>
                            <TableCell align="center">Total Leaves</TableCell>
                            <TableCell align="center">Leaves Left</TableCell>
                            <TableCell align="center">Change</TableCell>
                            <TableCell align="center">New Balance</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {leaveQuotas?.slice(0, 3).map((leaveData) => {
                            const type = leaveData.leaveType;
                            const lowerType = type;
                            const { deducted, balance } = calculateLeaveChanges();
                            const quota = leaveData.leaveQuota;
                            const totalEntitlement = leaveData.leaveQuota;
                            const currentBalance = leaveData.remainingLeaves;
                            const change = deducted[lowerType.toLowerCase()] || 0;
                            return (
                              <TableRow key={type} selected={leaveQuota === type}>
                                <TableCell>{type}</TableCell>
                                <TableCell align="center">{totalEntitlement}</TableCell>
                                <TableCell align="center">{currentBalance}</TableCell>
                                <TableCell
                                  align="center"
                                  sx={{
                                    color:
                                      change > 0
                                        ? 'success.main'
                                        : change < 0
                                        ? 'error.main'
                                        : 'inherit',
                                  }}
                                >
                                  {change !== 0 ? (change > 0 ? `+${change}` : change) : '-'}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  sx={{ fontWeight: leaveQuota === type ? 'bold' : 'normal' }}
                                >
                                  {balance[lowerType.toLowerCase()]}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )
                )}
              </motion.div>
            )}

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack direction="row" spacing={2}>
                <DesktopDatePicker
                  label="Start Date"
                  value={start}
                  maxDate={end}
                  onChange={(newValue) => setStart(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth sx={grayLabelSx} />}
                />
                <DesktopDatePicker
                  label="End Date"
                  minDate={start}
                  value={end}
                  onChange={(newValue) => setEnd(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth sx={grayLabelSx} />}
                />
              </Stack>
            </LocalizationProvider>

            {selectedEmployee && (
              <Stack direction={'row'} spacing={2} sx={grayLabelSx}>
                <FormControl fullWidth sx={grayLabelSx}>
                  <InputLabel>Leave Quota</InputLabel>
                  <Select
                    value={leaveQuota}
                    onChange={(event) => {
                      const selectedValue = event.target.value;
                      setLeaveQuota(selectedValue);
                      if (
                        selectedValue.leaveType
                         !== 'TOIL' &&
                        selectedValue.leaveType
                         !== 'Out Station'
                      ) {
                        setOutStation(selectedValue.leaveType);
                      } else {
                        setOutStation(selectedValue.leaveType);
                        setLeaveType('');
                      }
                    }}
                    label="Leave Quota"
                  >
                    {leaveQuotas?.map((quota) => (
                      <MenuItem key={quota.companyLeaveTypeId} value={quota}>
                        {quota.leaveType}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={grayLabelSx}>
                  <InputLabel>Leave Type</InputLabel>
                  <Select
                    value={leaveType}
                    disabled={outStation === 'TOIL' || outStation === 'Out Station'}
                    label="Leave Type"
                    onChange={(e) => setLeaveType(e.target.value)}
                    startAdornment={
                      <Tooltip title={leaveTypeTooltip} placement="top-end">
                        <IconButton size="small" sx={{ mr: 1 }}>
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    }
                  >
                    <MenuItem value="" disabled>
                      Select Leave Type
                    </MenuItem>
                    <MenuItem value="Full Day">Full Day</MenuItem>
                    <MenuItem value="Half Day">Half Day</MenuItem>
                    <MenuItem value="Short Leave">Short Leave</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            )}

            {selectedEmployee && (
              <TextField
                id="Remarks"
                placeholder="Enter Remarks"
                variant="outlined"
                fullWidth
                label="Remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                sx={grayLabelSx}
              />
            )}
          </Stack>
          <div className="flex w-full items-center justify-center">
            {' '}
            {initialData?.status === 'Accepted' || initialData?.status === 'Declined' ? (
              <>
                <Typography
                  variant="h4"
                  sx={{ color: initialData.status === 'Accepted' ? 'green' : 'red' ,mt: '12px'}}
                  className='pt-4'
                >
                  Leave Status: {initialData?.status}
                </Typography>
              </>
            ) : null}
          </div>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', px: 3 }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{ mr: 1, color: 'primary.main !important', bgcolor: '#fff !important' }}
          >
            Close
          </Button>

          <Box className="flex items-center gap-2">
            {initialData &&
              (initialData.status !== 'Approved' && initialData.status !== 'Declined' ? (
                <Button
                  variant="outlined"
                  color="error"
                  sx={{ backgroundColor: '#fff !important' }}
                  onClick={() => onDelete(initialData.id)}
                >
                  Delete
                </Button>
              ) : null)}
            {initialData?.status !== 'Approved' && initialData?.status !== 'Declined' ? (
              <>
                <Button type="submit" disabled={!isFormValid()} variant="contained">
                  Add Leave
                </Button>
              </>
            ) : null}
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LeaveDialog;

const QuotaTableSkeleton = () => (
  <TableContainer
    component={Paper}
    sx={{ borderRadius: '10px', border: '1px solid #e0e0e0' }}
    elevation={0}
  >
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Leave Type</TableCell>
          <TableCell align="center">Total Leaves</TableCell>
          <TableCell align="center">Leaves Left</TableCell>
          <TableCell align="center">Change</TableCell>
          <TableCell align="center">New Balance</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {['Medical', 'Casual', 'Annual'].map((type) => (
          <TableRow key={type}>
            <TableCell>{type}</TableCell>
            <TableCell align="center">
              <Skeleton animation="wave" />
            </TableCell>
            <TableCell align="center">
              <Skeleton animation="wave" />
            </TableCell>
            <TableCell align="center">
              <Skeleton animation="wave" />
            </TableCell>
            <TableCell align="center">
              <Skeleton animation="wave" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const leaveTypeTooltip = (
  <>
    <Typography variant="body2">Leave type calculations:</Typography>
    <ul>
      <li>Full Day: 1 day</li>
      <li>Half Day: 0.5 day</li>
      <li>Short Leave: 0.25 day</li>
    </ul>
    <Typography variant="caption">
      Note: For multiple days, the value is multiplied by the number of days selected.
    </Typography>
  </>
);

//
