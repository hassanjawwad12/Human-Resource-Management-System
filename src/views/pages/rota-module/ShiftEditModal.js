import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateShiftNameAndDescriptionById } from '../../../store/rota/RotaSlice';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
    Stack,
    Box
} from '@mui/material';

const ShiftEditModal = ({ open, setOpen, shift, setShiftsUpdated, alert, setAlert }) => {
    const dispatch = useDispatch();
    const [name, setName] = useState(shift.name);
    const [description, setDescription] = useState(shift.description);


    const formIsValid = name.length > 0 && description.length > 0

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('shiftId', shift.id);
        formData.append('name', name);
        formData.append('description', description);

        dispatch(updateShiftNameAndDescriptionById(formData))
            .then((result) => {
                if (result.payload.SUCCESS === 1) {
                    setAlert({
                        open: true,
                        severity: 'success',
                        message: 'Shift updated successfully'
                    });
                    setShiftsUpdated(prev => prev + 1);
                    setOpen(false);
                } else {
                    throw new Error(result.payload);
                }
            })
            .catch((err) => {
                console.error(err);
                setAlert({
                    open: true,
                    severity: 'error',
                    message: err.message || 'Failed to update shift'
                });
            });
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
            <Stack sx={{ backgroundColor: 'primary.main' }}>
                <DialogTitle id="alert-dialog-title" variant="h4" sx={{ color: 'white' }}>
                    Edit Shift
                </DialogTitle>
            </Stack>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2} sx={{ width: '100%', mt: 2 }}>
                        <Box sx={{ width: '100%' }}>
                            <Typography sx={{ mb: 1, fontWeight: 800 }}>Name</Typography>
                            <TextField
                                size='small'
                                fullWidth
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Box>
                        <Box sx={{ width: '100%' }}>
                            <Typography sx={{ mb: 1, fontWeight: 800 }}>Description</Typography>
                            <TextField
                                multiline
                                rows={3}
                                fullWidth
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Box>
                    </Stack>
                    <DialogActions sx={{ justifyContent: 'space-between', mt: 3 }}>
                        <Button onClick={() => setOpen(false)} variant="outlined" sx={{ color: 'primary.main !important', bgcolor: '#fff !important' }}>
                            Cancel
                        </Button>
                        <Button disabled={!formIsValid} type="submit" variant="contained" color="primary" sx={{ bgcolor: !formIsValid && '#d8dbdd !important' }}>
                            Update
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ShiftEditModal;