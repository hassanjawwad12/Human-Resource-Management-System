import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Typography,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import { useDispatch } from 'react-redux';
import { saveLeaveType } from '../../../../store/leave/LeaveSlice';
import AlertMessage from '../../../../components/shared/AlertMessage';

const AddLeaveType = ({ count, setCount }) => {
  const [open, setOpen] = React.useState(false);
  const [leaveType, setLeaveType] = React.useState('');
  const dispatch = useDispatch();
  const [alert, setAlert] = useState({
    open: false,
    severity: '',
    message: '',
  });

  const handleLeaveChange = (event) => {
    setLeaveType(event.target.value);
  };

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const AddLeaveName = () => {
    let formData = new FormData();
    formData.append('companyId', 52);
    formData.append('label', leaveType);

    if (leaveType.length < 1) {
      setAlert({
        open: true,
        severity: 'success',
        message: 'Please fill label',
      });
    }
    dispatch(saveLeaveType(formData))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          setAlert({
            open: true,
            severity: 'success',
            message: 'Leave type was successfully added',
          });
          handleDialogClose();
          setCount(count + 1);
        } else {
          setAlert({
            open: true,
            severity: 'error',
            message: 'Failed adding leave type',
          });
        }
      })
      .catch((err) => {
        setAlert({
          open: true,
          severity: 'error',
          message: 'Something went wrong.',
        });
      });
  };

  return (
    <div>
      <AlertMessage
        open={alert.open}
        setAlert={setAlert}
        severity={alert.severity}
        message={alert.message}
      />
      <Button
        onClick={handleDialogOpen}
        variant="outlined"
        sx={{ width: '100%', px: 1, pr: 2, color: 'white' }}
      >
        <AddIcon fontSize="small" sx={{ mr: 1 }} />
        Add New Leave Allocation Type
      </Button>
      <Dialog
        open={open}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
        className="overflow-y-auto"
      >
        <DialogTitle sx={{ bgcolor: 'primary.main', py: 2 }}>
          <Typography variant="h4" className="text-white">
            Add New Leave Allocation Type
          </Typography>
        </DialogTitle>
        <DialogContent className="overflow-y-auto">
          <div className="flex flex-col items-center justify-center w-full h-full gap-4 mt-4 pt-8">
            <TextField
              id="outlined-basic"
              placeholder="Leave type (Hajj etc)"
              variant="outlined"
              sx={{ width: '500px' }}
              value={leaveType}
              onChange={handleLeaveChange}
            />
          </div>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', px: 3, py: 2 }}>
          <Button
            variant="outlined"
            onClick={handleDialogClose}
            sx={{ color: 'primary.main', bgcolor: '#fff !important', borderColor: 'primary.main' }}
          >
            Cancel
          </Button>
          <Button onClick={AddLeaveName} variant="outlined" sx={{ color: 'white' }}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddLeaveType;
