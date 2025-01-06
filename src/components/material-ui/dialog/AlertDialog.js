import React from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';

const AlertDialog = ({ open, setOpen, children }) => {
   
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    return (
        <>
            {/* <Button variant="contained" color="secondary" fullWidth onClick={handleClickOpen}>
                Open Alert Dialog
            </Button> */}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                {children}
            </Dialog>
        </>
    );
}

export default AlertDialog;
