import React, { useState } from 'react';
import {
    Box,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from '@mui/material';
import DeviceUnknownIcon from '@mui/icons-material/DeviceUnknown';
import DownloadIcon from '@mui/icons-material/Download';

const DeviceDisconnectStatus = () => {
    const [isTroubleshootingGuideOpen, setIsTroubleshootingGuideOpen] = useState(false);

    const handleOpenTroubleshootingGuide = () => {
        console.log('hello')
        setIsTroubleshootingGuideOpen(true);
    };

    const handleCloseTroubleshootingGuide = () => {
        setIsTroubleshootingGuideOpen(false);
    };

    return (
        <>
            <Box className="flex flex-col items-center justify-center gap-3 h-[32rem]">
                <DeviceUnknownIcon style={{ fontSize: 100 }} className='text-gray-500' />
                <Typography variant="h6" className="mt-0 text-gray-700">
                    Device Not Found
                </Typography>
                <Typography variant="body1" className="text-gray-500 text-center">
                    There could be two reasons for this:
                </Typography>
                <ul className="list-disc text-gray-500 pl-6">
                    <li>The device is not connected properly</li>
                    <li>The device drivers are not installed</li>
                </ul>
                <Typography
                    variant="body2"
                    color='primary.main'
                    className="cursor-pointer hover:underline mt-4"
                    onClick={handleOpenTroubleshootingGuide}
                >
                    Need help? View the Device Troubleshooting Guide
                </Typography>
            </Box>

            <Dialog
                open={isTroubleshootingGuideOpen}
                onClose={handleCloseTroubleshootingGuide}
                aria-labelledby="device-troubleshooting-guide"
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle id="device-troubleshooting-guide" className='bg-gray-100' mb={2}>
                    Device Troubleshooting Guide
                </DialogTitle>
                <DialogContent>
                    <Typography variant="h6" className="mt-4 mb-2">1. Check the Connection</Typography>
                    <ul className="list-disc pl-6 mb-4">
                        <li >Ensure the device is properly plugged in</li>
                        <li >Refresh the page and reconnect the device</li>
                        <li>Try using a different USB port</li>
                        <li>Restart your computer and reconnect the device</li>
                    </ul>
                    <Box className='flex items-center gap-3'>
                        <Typography variant="h6" className="mt-4 mb-2">2. Install or Update Drivers</Typography>
                        <Button variant="contained" size='small' color="primary" href="http://35.179.98.1/SDK.zip" className="my-2" startIcon={<DownloadIcon />}>
                            Download Drivers
                        </Button>
                    </Box>
                    <Box component="ol" className="list-decimal pl-6 mb-4">
                        <li>Unzip the downloaded file</li>
                        <li>Choose your system type (64-bit or 86-bit)</li>
                        <li>Run the setup file and follow the on-screen instructions</li>
                        <li>Install the drivers through the setup wizard</li>
                        <li>Restart your PC for the changes to take effect</li>
                    </Box>

                    <Typography variant="body2" className="mt-4">
                        If you're still experiencing issues, please contact our support team.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant='outlined' sx={{ color: 'primary.main !important', bgcolor: '#fff !important', mr: 3 }} onClick={handleCloseTroubleshootingGuide}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DeviceDisconnectStatus;