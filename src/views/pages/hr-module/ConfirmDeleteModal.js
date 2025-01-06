import React from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from '@mui/material';

const ConfirmDeleteModal = ({ open, handleClose, handleConfirm, title, content }) => {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth='xs'
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {content}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    variant='outlined'
                    sx={{ mr: 1, color: 'primary.main !important', bgcolor: '#fff !important' }}
                    onClick={handleClose}>
                    Cancel
                </Button>
                <Button onClick={handleConfirm} color="primary" autoFocus variant='contained'>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDeleteModal;