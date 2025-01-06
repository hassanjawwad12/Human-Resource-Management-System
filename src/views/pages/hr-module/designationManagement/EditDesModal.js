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
import { useDispatch } from 'react-redux';
import { createNewDesignation } from '../../../../store/hr/DesignationSlice';
import AlertMessage from '../../../../components/shared/AlertMessage';

const EditDesModal = ({ id, name, count, setCount }) => {
  const [open, setOpen] = React.useState(false);
  const [des, setDes] = React.useState(name);
  const dispatch = useDispatch();

  const [alert, setAlert] = useState({
    open: false,
    severity: '',
    message: '',
  });

  const handleDesChange = (event) => {
    setDes(event.target.value);
  };

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const EditDesignation = () => {
    let formData = new FormData();
    formData.append('label', des);
    formData.append('firmId', 52);
    formData.append('id', id);
    dispatch(createNewDesignation(formData))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          setAlert({
            open: true,
            severity: 'success',
            message: 'Designation edited successfully',
          });
          setCount(count + 1);
          handleDialogClose();
        } else {
          setAlert({
            open: true,
            severity: 'error',
            message:'Failed to edit designation',
          });
        }
      })
      .catch((err) => {
        setAlert({
          open: true,
          severity: 'error',
          message:  'Something went wrong.',
        });
      });
  };

  return (
    <div>
      <AlertMessage open={alert.open} setAlert={setAlert} severity={alert.severity} message={alert.message} />
      <IconButton onClick={handleDialogOpen} color="primary" aria-label="edit department">
        <EditIcon sx={{ width: 25, height: 25 }} />
      </IconButton>
      <Dialog open={open} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', py: 2 }}>
          <Typography variant="h4" className="text-white">
            Edit Designation
          </Typography>
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col items-center justify-end w-full h-full gap-4 pt-6 mt-6">
            <TextField
              id="outlined-basic"
              variant="outlined"
              sx={{ width: '400px' }}
              value={des}
              onChange={handleDesChange}
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
          <Button onClick={EditDesignation} variant="outlined" sx={{ color: 'white' }}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditDesModal;
