import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, CircularProgress, Paper, Avatar, Fade, Stepper, Step, StepLabel } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PendingIcon from '@mui/icons-material/Pending';
import DeviceUnknownIcon from '@mui/icons-material/DeviceUnknown';
import PanToolAltIcon from '@mui/icons-material/PanToolAlt';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import success from 'src/assets/images/icons/accept.png'
import pending from 'src/assets/images/icons/clock.png'
import error from 'src/assets/images/icons/error.png'
import loading from 'src/assets/images/icons/loading.png'
import FingerPrintLoader from './FingerPrintLoader';
import DeviceDisconnectStatus from '../../attendance-module/manualAttendance/DeviceDisconnectStatus';

export default function ScanFingerSDK({ employee, onFingerComplete, onEnrollmentComplete }) {
    const [myVal, setMyVal] = useState("");
    const [currentFormat, setCurrentFormat] = useState(Fingerprint.SampleFormat.Intermediate);
    const [acquisitionStarted, setAcquisitionStarted] = useState(false);
    const [quality, setQuality] = useState("");
    const [message, setMessage] = useState("");
    const [readers, setReaders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeviceConnected, setIsDeviceConnected] = useState(false);
    const [currentFinger, setCurrentFinger] = useState(1);
    const [fingerScans, setFingerScans] = useState({});
    const [activeStep, setActiveStep] = useState(0);
    const [fingersToEnroll, setFingersToEnroll] = useState(0);
    const currentFingerRef = useRef(1);
    const fingersToEnrollRef = useRef(0);
    const sdkRef = useRef(null);

    const steps = ['Select Fingers', ...Array(fingersToEnroll).fill(0).map((_, i) => `Scan Finger ${i + 1}`)];

    useEffect(() => {
        if (typeof Fingerprint === 'undefined') {
            setIsLoading(false);
            console.error('Fingerprint SDK not loaded');
            return;
        }

        sdkRef.current = new Fingerprint.WebApi();
        sdkRef.current.onDeviceConnected = handleDeviceConnected;
        sdkRef.current.onDeviceDisconnected = handleDeviceDisconnected;
        sdkRef.current.onCommunicationFailed = handleCommunicationFailed;
        sdkRef.current.onSamplesAcquired = sampleAcquired;
        sdkRef.current.onQualityReported = (e) => setQuality(Fingerprint.QualityCode[e.quality]);
        sdkRef.current.onErrorOccurred = handleErrorOccurred;

        readersDropDownPopulate().finally(() => {
            setIsLoading(false);
        });

        return () => {
            if (sdkRef.current) {
                sdkRef.current.stopAcquisition();
            }
        };
    }, []);

    useEffect(() => {
        if (activeStep > 0 && activeStep <= fingersToEnroll) {
            startAcquisition();
        }
    }, [activeStep]);

    const handleDeviceConnected = (e) => {
        console.log("Device connected", e);
        setIsDeviceConnected(true);
        setMessage("Device connected. Ready to scan.");
    };

    const handleDeviceDisconnected = (e) => {
        console.log("Device disconnected", e);
        setIsDeviceConnected(false);
        setMessage("Device disconnected.");
        setAcquisitionStarted(false);
    };

    const handleCommunicationFailed = (e) => {
        console.log("Communication failed", e);
        setMessage("Communication Failed");
        setIsDeviceConnected(false);
    };

    const handleErrorOccurred = (e) => {
        console.log("Error occurred", e);
        setMessage("Error: " + e.message);
        setAcquisitionStarted(false);
    };

    const readersDropDownPopulate = () => {
        return new Promise((resolve) => {
            sdkRef.current.enumerateDevices().then(
                (successObj) => {
                    console.log("Devices found", successObj);
                    setReaders(successObj);
                    if (successObj.length > 0) {
                        setMyVal(successObj[0]);
                        setIsDeviceConnected(true);
                    }
                    resolve();
                },
                (error) => {
                    console.error("Error enumerating devices", error);
                    setMessage(error.message);
                    resolve();
                }
            );
        });
    };

    const startAcquisition = () => {
        if (acquisitionStarted) return;

        if (currentFormat === "") {
            setMessage("Please select a format.");
            return;
        }

        sdkRef.current.startAcquisition(currentFormat, myVal).then(
            () => {
                setAcquisitionStarted(true);
                setMessage(`Place finger ${currentFinger} on the scanner.`);
            },
            (error) => {
                console.error("Error starting acquisition", error);
                setMessage(error.message);
            }
        );
    };

    const stopAcquisition = () => {
        sdkRef.current.stopAcquisition().then(
            () => {
                setAcquisitionStarted(false);
            },
            (error) => {
                console.error("Error stopping acquisition", error);
                setMessage(error.message);
            }
        );
    };

    const sampleAcquired = (s) => {
        console.log("Sample acquired", s);
        try {
            const samples = JSON.parse(s.samples);
            if (samples && samples.length > 0) {
                const data = samples[0].Data;
                console.log("Extracted FMD Data: ", data);

                setFingerScans(prevScans => {
                    const currentFinger = currentFingerRef.current;
                    const newScans = {
                        ...prevScans,
                        [currentFinger]: [...(prevScans[currentFinger] || []), data]
                    };

                    if (newScans[currentFinger].length === 4) {
                        onFingerComplete(currentFinger, newScans[currentFinger]);
                        if (currentFinger < fingersToEnrollRef.current) {
                            const nextFinger = currentFinger + 1;
                            currentFingerRef.current = nextFinger;
                            setCurrentFinger(nextFinger);
                            setActiveStep(prevStep => prevStep + 1);
                            setMessage(`Finger ${currentFinger} completed. Please prepare for finger ${nextFinger}.`);
                            stopAcquisition();
                            setTimeout(() => startAcquisition(), 1000); // Restart acquisition for next finger
                        } else {
                            setMessage("All fingers scanned successfully!");
                            setActiveStep(fingersToEnrollRef.current + 1);
                            stopAcquisition();
                            onEnrollmentComplete();
                        }
                    } else {
                        setMessage(`Scan ${newScans[currentFinger].length} for finger ${currentFinger} successful. Please prepare for the next scan.`);
                    }

                    return newScans;
                });
            }
        } catch (error) {
            console.error("Error processing sample:", error);
            setMessage("Error processing sample");
        }
    };

    const renderScanStatus = (index) => {
        const scanNumber = index + 1;
        const currentScanIndex = fingerScans[currentFinger]?.length || 0;

        if (index < currentScanIndex) {
            return (
                <Box className='border-r-2 rounded-none' sx={{ p: 2, py: 5, textAlign: 'center', height: '100%', borderRadius: 0 }}>
                    <Fade in>
                        <Box className='w-full flex flex-col items-center'>
                            <img src={success} className='w-[60px] h-[60px]' />
                            <Typography color={'primary.main'} fontSize={20} my={.5}>Successful</Typography>
                            <Typography className='text-gray-500' variant="body2">Scan {scanNumber} was successful</Typography>
                        </Box>
                    </Fade>
                </Box>
            );
        } else if (index === currentScanIndex && acquisitionStarted) {
            return (
                <Box className='border-r-2 rounded-none flex flex-col items-center' sx={{ p: 2, py: 5, textAlign: 'center', height: '100%', borderRadius: 0 }}>
                    <FingerPrintLoader />
                    <Typography variant="subtitle1" my={.5}>Processing</Typography>
                    <Typography className='text-gray-500' variant="body2">Scan {scanNumber} in progress...</Typography>
                </Box>
            );
        } else {
            return (
                <Box className='border-r rounded-none flex flex-col items-center' sx={{ p: 2, py: 5, textAlign: 'center', height: '100%', borderRadius: 0 }}>
                    <img src={pending} className='w-[60px] h-[60px] animate-pulse' />
                    <Typography variant="subtitle1" my={.5}>Pending</Typography>
                    <Typography className='text-gray-500' variant="body2">Awaiting scan {scanNumber}</Typography>
                </Box>
            );
        }
    };

    const handleFingerSelection = (count) => {
        setFingersToEnroll(count);
        fingersToEnrollRef.current = count;
        setActiveStep(1);
        startAcquisition();
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="25rem">
                <CircularProgress />
            </Box>
        );
    }

    if (!isDeviceConnected) {
        return <DeviceDisconnectStatus />;
    }

    return (
        <Fade in>
            <Box p={4} pb={0}>
                <Box display="flex" alignItems="center" gap={3} mb={4}>
                    <Avatar src={employee.imageUrl} sx={{ width: 100, height: 100 }} />
                    <Box className='flex flex-col gap-1'>
                        <Typography variant="h4">{employee.fullName}</Typography>
                        <Typography variant="body2" className='text-gray-500'>{employee.employeeNo}</Typography>
                        {employee.designationLabel !== '' && <Typography variant="body2" className='text-gray-500'>< WorkOutlineIcon sx={{ fontSize: '1rem', mr: .3 }} /> {employee.designationLabel}</Typography>}
                        <Typography variant="body2" className='text-gray-500'> <EmailOutlinedIcon sx={{ fontSize: '1rem', mr: .3 }} /> {employee.email}</Typography>
                    </Box>
                </Box>
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {steps.map((label, index) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                {activeStep === 0 ? (
                    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                        <Typography fontSize={20} mb={1}>How many fingers do you want to enroll?</Typography>
                        <Box display="flex" gap={2}>
                            {[1, 2, 3].map((count) => (
                                <Button
                                    key={count}
                                    variant="contained"
                                    onClick={() => handleFingerSelection(count)}
                                >
                                    {count} {count === 1 ? 'Finger' : 'Fingers'}
                                </Button>
                            ))}
                        </Box>
                    </Box>
                ) : (
                    <>
                        <Box display="flex" justifyContent="center" mb={2} className='border'>
                            {[0, 1, 2, 3].map((index) => (
                                <Box key={index} width="25%" height={200}>
                                    {renderScanStatus(index)}
                                </Box>
                            ))}
                        </Box>
                        <Typography textAlign={'center'} variant="body1" gutterBottom>
                            {message}
                        </Typography>
                    </>
                )}
            </Box>
        </Fade>
    );
}