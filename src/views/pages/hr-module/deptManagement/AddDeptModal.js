import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Typography,
  Button,
} from '@mui/material';
import { createNewDepartment } from '../../../../store/hr/DepartmentSlice';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import { useDispatch } from 'react-redux';
import AlertMessage from '../../../../components/shared/AlertMessage';

const AddDeptModal = ({ count, setCount }) => {
  const [open, setOpen] = React.useState(false);
  const [dept, setDept] = React.useState('');
  const dispatch = useDispatch();
  const [alert, setAlert] = useState({
    open: false,
    severity: '',
    message: '',
  });

  const handleDeptChange = (event) => {
    setDept(event.target.value);
  };

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const AddDepartmentName = () => {
    let formData = new FormData();
    formData.append('label', dept);
    formData.append('firmId', 52);
    formData.append('id', 0);
    dispatch(createNewDepartment(formData))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          setAlert({
            open: true,
            severity: 'success',
            message: 'Successfully added Department',
          });
          setCount(count + 1);
          handleDialogClose();
        } else {
          setAlert({
            open: true,
            severity: 'error',
            message: 'Error adding department',
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
        <AddIcon fontSize="small" sx={{ mr: 1 }} /> Add New Department
      </Button>
      <Dialog open={open} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', py: 2 }}>
          <Typography variant="h4" className="text-white">
            Add Department
          </Typography>
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col items-center justify-end w-full h-full gap-4 mt-4 pt-8">
            <TextField
              id="outlined-basic"
              variant="outlined"
              sx={{ width: '500px' }}
              value={dept}
              onChange={handleDeptChange}
              size="small"
              placeholder="Department"
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
          <Button onClick={AddDepartmentName} variant="outlined" sx={{ color: 'white' }}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddDeptModal;

/*
  <TextField
                fullWidth
                size="small"
                name="name"
                value={entitlement.name}
                onChange={handleChange}
                variant="outlined"
              />}
                        />
*/
