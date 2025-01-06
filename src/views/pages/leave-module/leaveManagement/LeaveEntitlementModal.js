import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Stack,
  Box,
  Autocomplete,
} from '@mui/material';
import AddLeaveType from './AddLeaveType';
import { getLeaveType } from '../../../../store/leave/LeaveSlice';
import { useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LeaveEntitlementModal = ({ open, handleClose, initialData, designation, onSave }) => {
  const [alert, setAlert] = useState({
    open: false,
    severity: '',
    message: '',
  });
  const [entitlement, setEntitlement] = useState(
    initialData || {
      name: '',
      description: '',
    },
  );
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    let formData = new FormData();
    formData.append('companyId', 52);
    dispatch(getLeaveType(formData))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          setAlert({
            open: true,
            severity: 'success',
            message: result.payload.USER_MESSAGE,
          });
          if (!initialData) {
            setLeaveTypes(result.payload.DATA);
          }
        } else {
          setAlert({
            open: true,
            severity: 'error',
            message: result.payload,
          });
        }
      })
      .catch((err) => {
        setAlert({
          open: true,
          severity: 'error',
          message: err.USER_MESSAGE || 'Something went wrong.',
        });
      });
  }, [count]);

  useEffect(() => {
    if (initialData) {
      setSelectedDesignation(
        designation.find((a) => a.id === initialData?.DesignationList[0].designationId),
      );
      const transformedData = initialData.leaveTypes.map(
        ({ companyLeaveTypeId, leaveTypeLabel, totalDays, ...leave }, index) => ({
          ...leave,
          Id: index + 1,
          commonLeaveTypeLabel: leaveTypeLabel,
          leaveValue: totalDays,
        }),
      );
      initialData.leaveTypes = transformedData;
      setEntitlement(initialData);
      setLeaveTypes(transformedData);
    } else {
      setEntitlement({
        name: '',
        description: '',
      });
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEntitlement((prev) => ({ ...prev, [name]: value }));
  };
  const handleSave = () => {
    if (entitlement.name.length < 1 || entitlement.description.length < 1) {
      toast.error('please fill the name and description');
      return;
    }

    onSave(entitlement, selectedDesignation, leaveTypes);
    handleClose();
  };

  const newHandleChange = (e, id) => {
    setLeaveTypes((prev) => {
      return prev.map((j) => {
        console.log(j);
        if (j.Id === id) {
          return {
            ...j,
            leaveValue: e.target.value,
          };
        } else {
          return j;
        }
      });
    });
  };

  return (
    <>
      <ToastContainer />

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', py: 2 }}>
          <Typography variant="h4" className="text-white">
            {initialData ? 'Edit Leave Entitlement' : 'New Leave Entitlement'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ my: 2, pb: 0 }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Autocomplete
              options={designation}
              value={selectedDesignation}
              sx={{
                '& .MuiInputLabel-root:not(.Mui-focused)': {
                  color: 'lightgray',
                },
                flexGrow: 1
              }}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderOption={(props, option) => (
                <Box
                  sx={{ height: '50px' }}
                  className="px-2 mt-4 flex flex-row justify-start space-x-2"
                  {...props}
                >
                  <Stack sx={{ width: '100%' }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>
                      {option.label}
                    </Typography>
                    <Typography
                      sx={{ fontSize: '11px', fontWeight: 600 }}
                      className="text-overflow-ellipsis whitespace-nowrap"
                    >
                      {option.id}
                    </Typography>
                  </Stack>
                </Box>
              )}
              renderInput={(params) => <TextField {...params} label="Select Designation" />}
              onChange={(event, newValue) => {
                setSelectedDesignation(newValue);
              }}
              size="medium"
            />
            <Box>
              <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                Leave Name:
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="name"
                value={entitlement.name}
                onChange={handleChange}
                variant="outlined"
                placeholder="e.g., Standard, Default"
              />
            </Box>
            <Box>
              <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                Description:
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="description"
                value={entitlement.description}
                onChange={handleChange}
                variant="outlined"
                multiline
                rows={2}
                placeholder="Enter description"
              />
            </Box>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
              Leave Allocations
            </Typography>
            <Stack spacing={2}>
              <div>
                {leaveTypes.length > 0 && (
                  <>
                    {leaveTypes.slice(0, 3).map((leave, index) => (
                      <div key={leave.id}>
                        <label htmlFor={`leave-${leave.Id}`}>
                          <Typography variant="body2" fontWeight="medium" sx={{ mb: 1, mt: 2 }}>
                            {leave.commonLeaveTypeLabel}
                          </Typography>
                        </label>
                        <TextField
                          fullWidth
                          type="number"
                          id={`leave-${leave.Id}`}
                          value={leave.leaveValue}
                          onChange={(e) => newHandleChange(e, leave.Id)}
                          variant="outlined"
                          size="small"
                          InputProps={{
                            endAdornment: <Typography variant="body2">days</Typography>,
                          }}
                        />
                      </div>
                    ))}
                  </>
                )}
              </div>
              <Box>
                <AddLeaveType count={count} setCount={setCount} />
              </Box>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', px: 3, py: 2 }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{ color: 'primary.main', bgcolor: '#fff !important', borderColor: 'primary.main' }}
          >
            Cancel
          </Button>
          <Button variant="contained" sx={{ bgcolor: 'primary.main' }} onClick={handleSave}>
            {initialData ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LeaveEntitlementModal;
