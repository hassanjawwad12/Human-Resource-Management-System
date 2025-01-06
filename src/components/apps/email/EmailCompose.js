import React, { useState } from 'react';
import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  Slide,
  TextField,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const EmailCompose = () => {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      {/* ------------------------------------------- */}
      {/* Compose Email */}
      {/* ------------------------------------------- */}
      <Box p={3} pb={1}>
        <Button variant="contained" fullWidth color="primary" onClick={handleClickOpen}>
          Compose
        </Button>
      </Box>
      {/* ------------------------------------------- */}
      {/* Dialog for compose */}
      {/* ------------------------------------------- */}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullWidth
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title" variant="h5">
          Compose Mail
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description" component="div">
            <CustomFormLabel htmlFor="to-text">To</CustomFormLabel>
            <TextField id="to-text" fullWidth size="small" variant="outlined" />
            <CustomFormLabel htmlFor="subject-text">Subject</CustomFormLabel>
            <TextField id="subject-text" fullWidth size="small" variant="outlined" />
            <CustomFormLabel htmlFor="message-text">Message</CustomFormLabel>
            <TextField
              id="message-text"
              placeholder="Write a message"
              multiline
              fullWidth
              rows={4}
              variant="outlined"
            />
            <CustomFormLabel htmlFor="upload-text">Attachment</CustomFormLabel>
            <TextField
              type="file"
              autoFocus
              id="upload-text"
              fullWidth
              size="small"
              variant="outlined"
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
            Send
          </Button>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmailCompose;
