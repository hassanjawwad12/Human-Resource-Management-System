import * as React from 'react';
import { Snackbar, Alert, AlertTitle } from '@mui/material';

const AlertMessage = ({ open, setAlert, severity, message }) => {

    const handleClose = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlert({
            open: false,
            severity: '',
            message: ''
        });
    };

    return (
        <React.Fragment>
            <Snackbar
                open={open}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                autoHideDuration={3000}
                onClose={handleClose}
            >
                <Alert
                    onClose={handleClose}
                    severity={severity}
                    variant="filled"
                    sx={{ width: '330px', color: 'white', backgroundColor: severity === 'success' ? '#009F0C' : '' }}
                >
                    <AlertTitle sx={{ mb: 0 }}>{message}</AlertTitle>
                </Alert>
            </Snackbar>
        </React.Fragment>
    );
};

export default AlertMessage;
