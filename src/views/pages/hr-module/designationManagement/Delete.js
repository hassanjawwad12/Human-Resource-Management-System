import React from 'react';
import { DeleteDesignation } from '../../../../store/hr/DesignationSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import { Dialog, DialogContent, DialogActions, Button,DialogTitle } from '@mui/material';
import { IconButton, Typography } from '@mui/material';
import AlertMessage from '../../../../components/shared/AlertMessage';

const Delete = ({id,count,setCount}) => {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();

  const [alert, setAlert] = useState({
    open: false,
    severity: '',
    message: '',
  });

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const DeleteDesignations = () => {
    dispatch(DeleteDesignation(id))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          setAlert({
            open: true,
            severity: 'success',
            message: 'Designation deleted successfully',
          });
          handleDialogClose();
          setCount(count+1)
        } else {
          setAlert({
            open: true,
            severity: 'error',
            message: 'Designation failed to delete',
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
      <AlertMessage open={alert.open} setAlert={setAlert} severity={alert.severity} message={alert.message} />
      <IconButton onClick={handleDialogOpen}  sx={{ color: 'red' }} aria-label="delete designation">
        <DeleteIcon sx={{ width: 25, height: 25 }} />
      </IconButton>
      <Dialog open={open} onClose={handleDialogClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: 'primary.main', py: 2 }}>
        <Typography variant="h4" className="text-white">
           Confirm Delete
        </Typography>
      </DialogTitle>
        <DialogContent>
          <div className="flex flex-col items-center justify-center w-full h-full gap-4 mt-6 pt-4">   
            <Typography variant="h5" fontWeight={800}>
              Are you sure you want to delete the Designation?</Typography> 
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
          <Button
              onClick={DeleteDesignations}
              variant="outlined"
            sx={{ color: 'white'}}
          >
             Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Delete;

