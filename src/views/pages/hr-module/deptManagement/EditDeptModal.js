import React, { useState } from 'react';
import { IconButton, TextField } from '@mui/material';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  DialogTitle,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch } from 'react-redux';
import { createNewDepartment } from '../../../../store/hr/DepartmentSlice';
import AlertMessage from '../../../../components/shared/AlertMessage';

const EditDeptModal = ({ id, name, count, setCount }) => {
  const [open, setOpen] = React.useState(false);
  const [dept, setDept] = React.useState(name);
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

  const EditDepartment = () => {
    let formData = new FormData();
    formData.append('label', dept);
    formData.append('firmId', 52);
    formData.append('id', id);
    dispatch(createNewDepartment(formData))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          setAlert({
            open: true,
            severity: 'success',
            message: 'Edited Department successfully',
          });
          setCount(count + 1);
          handleDialogClose();
        } else {
          setAlert({
            open: true,
            severity: 'error',
            message: 'Error editing department',
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

      <IconButton onClick={handleDialogOpen} color="primary" aria-label="edit department">
        <EditIcon sx={{ width: 25, height: 25 }} />
      </IconButton>
      <Dialog open={open} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', py: 2 }}>
          <Typography variant="h4" className="text-white">
            Edit Department
          </Typography>
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col text-zinc-800 items-center justify-end w-full h-full gap-4 pt-8 mt-6">
            <TextField
              id="outlined-basic"
              variant="outlined"
              sx={{ width: '400px' }}
              value={dept}
              onChange={handleDeptChange}
              className="mt-20"
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
          <Button onClick={EditDepartment} variant="outlined" sx={{ color: 'white' }}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditDeptModal;
