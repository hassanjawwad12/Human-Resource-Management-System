import React from 'react';
import { createNewDesignation } from '../../../../store/hr/DesignationSlice';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  DialogTitle,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import { useDispatch } from 'react-redux';
import AlertMessage from '../../../../components/shared/AlertMessage';

const AddDesignationModal = ({ count, setCount }) => {
  const [open, setOpen] = React.useState(false);
  const [des, setDes] = React.useState('');
  const dispatch = useDispatch();
  const [alert, setAlert] = useState({
    open: false,
    severity: '',
    message: '',
  });

  const handleDesignationChange = (event) => {
    setDes(event.target.value);
  };

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const AddDesignation = () => {
    let formData = new FormData();
    formData.append('label', des);
    formData.append('firmId', 52);
    formData.append('id', 0);
    dispatch(createNewDesignation(formData))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          setAlert({
            open: true,
            severity: 'success',
            message: 'Sucessfully added designation',
          });
          setCount(count + 1);
          handleDialogClose();
        } else {
          setAlert({
            open: true,
            severity: 'error',
            message: 'An error has occurred',
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
        <AddIcon fontSize="small" sx={{ mr: 1 }} /> Add New Designation
      </Button>
      <Dialog open={open} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', py: 2 }}>
          <Typography variant="h4" className="text-white">
            Add Designation
          </Typography>
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col items-center justify-end w-full h-full gap-4 pt-6 mt-6">
            <TextField
              id="outlined-basic"
              placeholder="Description"
              variant="outlined"
              sx={{ width: '400px' }}
              value={des}
              onChange={handleDesignationChange}
            />
          </div>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', px: 3 }}>
          <Button
            variant="outlined"
            onClick={handleDialogClose}
            sx={{ color: 'primary.main', bgcolor: '#fff !important', borderColor: 'primary.main' }}
          >
            Cancel
          </Button>
          <Button onClick={AddDesignation} variant="outlined" sx={{ color: 'white' }}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddDesignationModal;
