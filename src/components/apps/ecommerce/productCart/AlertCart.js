import * as React from 'react';
import { Snackbar, Alert } from '@mui/material';

const AlertCart = ({ handleClose, openCartAlert }) => {
  return (
    <React.Fragment>
      <Snackbar
        open={openCartAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={1000}
        onClose={handleClose}
      >
        <Alert severity="success" variant="filled" sx={{ width: '100%', color: 'white' }}>
          Item Added to the Cart!!!
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default AlertCart;
