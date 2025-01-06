import React, { useState, useEffect, useRef } from 'react';
import { Card, Box, Typography, CircularProgress, Avatar, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { verifyEmployeeFingerprint } from "../../../../store/attendance/AttendanceSlice";
import AlertMessage from '../../../../components/shared/AlertMessage';
import { AnimatePresence, motion } from 'framer-motion';
import FingerPrintLoader from '../../hr-module/userManagement/FingerPrintLoader';
import DeviceDisconnectStatus from './DeviceDisconnectStatus';
import { logout } from '../../../../store/auth/login/LoginSlice';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

export default function ManualAttendance({ firmId, hideLink = false }) {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.loginReducer);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [currentFormat, setCurrentFormat] = useState(Fingerprint.SampleFormat.Intermediate);
    const [fingerprintData, setFingerprintData] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [message, setMessage] = useState('');
    const [isDeviceConnected, setIsDeviceConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const fingerprintDataRef = useRef(null);
    const [employeeData, setEmployeeData] = useState(null);

    const [alert, setAlert] = useState({
        open: false,
        severity: '',
        message: ''
    });

    const sdkRef = useRef(null);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);

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
        sdkRef.current.onErrorOccurred = handleErrorOccurred;

        readersDropDownPopulate().finally(() => {
            setIsLoading(false);
        });
        setMessage("Place your finger on the scanner.");
        const startScanningTimer = setTimeout(() => {
            startScanning();
        }, 500);

        return () => {
            clearInterval(startScanningTimer)
            clearInterval(timer);
            if (sdkRef.current) {
                sdkRef.current.stopAcquisition();
            }
        };
    }, []);

    const handleDeviceConnected = (e) => {
        setIsDeviceConnected(true);
        if (!isScanning) {
            setTimeout(() => {
                setIsScanning(true)
            }, 100)
        }
        // setMessage("Device connected. Ready to scan.");
    };

    const handleDeviceDisconnected = (e) => {

        setIsDeviceConnected(false);
        setIsScanning(false);
    };

    const handleCommunicationFailed = (e) => {
        setMessage("Communication Failed");
        setIsDeviceConnected(false);
    };

    const handleErrorOccurred = (e) => {
        console.log("Error occurred", e);
        setMessage("Error: " + e.message);
        setIsScanning(false);
    };

    const readersDropDownPopulate = () => {
        return new Promise((resolve) => {
            sdkRef.current.enumerateDevices().then(
                (successObj) => {
                    if (successObj.length > 0) {
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

    const startScanning = () => {
        if (isScanning) return;
        setIsScanning(true);
        sdkRef.current.startAcquisition(currentFormat).then(
            () => {
                setIsScanning(true);
            },
            (error) => {
                console.error("Error starting acquisition", error);
                setMessage(error.message);
                setIsScanning(false);
            }
        );
    };

    const sampleAcquired = (s) => {
        try {
            const samples = JSON.parse(s.samples);
            if (samples && samples.length > 0) {
                const sampleData = Fingerprint.b64UrlTo64(samples[0].Data);
                fingerprintDataRef.current = samples[0].Data;
                setMessage('Verifying fingerprint...')
                verifyFingerprint();
            } else {
                setAlert({
                    open: true,
                    severity: 'error',
                    message: "Error: Invalid sample structure"
                });
                startScanning(); // Restart scanning on error
            }
        } catch (error) {
            setAlert({
                open: true,
                severity: 'error',
                message: "Error processing sample"
            });
            startScanning(); // Restart scanning on error
        }
    };

    const resetForNextEmployee = () => {
        setEmployeeData(null);
        startScanning();
    };

    const verifyFingerprint = () => {
        const fingerprintData = fingerprintDataRef.current;

        if (!fingerprintData) {
            setAlert({
                open: true,
                severity: 'error',
                message: 'No fingerprint data available. Please try scanning again.'
            });
            startScanning(); // Restart scanning if no data
            return;
        }

        const verificationData = {
            companyId: user?.firmId || firmId,
            fingerprintData: fingerprintData,
        };

        dispatch(verifyEmployeeFingerprint(verificationData))
            .then((result) => {
                if (result.payload.SUCCESS === 1) {
                    if (result.payload.DATA.success === "No Fingerprints Exists in database.") {
                        setAlert({
                            open: true,
                            severity: 'warning',
                            message: "No matching employee found. Please verify and try again."
                        });
                        setMessage('No matching employee for this fingerprint.')

                        startScanning(); // Restart scanning for no match
                    } else {
                        setAlert({
                            open: true,
                            severity: 'success',
                            message: 'Attendance recorded successfully!'
                        });
                        setEmployeeData(result.payload.DATA);
                        setIsScanning(false); // Stop scanning on successful match
                        setMessage("Place your finger on the scanner.");

                        // Reset for next employee after 3 seconds
                        setTimeout(resetForNextEmployee, 3000);
                    }
                } else {
                    setAlert({
                        open: true,
                        severity: 'error',
                        message: 'Failed to record attendance. Please try again.'
                    });
                    startScanning(); // Restart scanning on failure
                }
            })
            .catch((error) => {
                console.error('Error verifying fingerprint:', error);
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'An error occurred while verifying the fingerprint.'
                });
                startScanning(); // Restart scanning on error
            });
    };

    if (isLoading) {
        return (
            <Box className="flex justify-center items-center h-96">
                <CircularProgress />
            </Box>
        );
    }

    if (!isDeviceConnected) {
        return (
            <DeviceDisconnectStatus />
        );
    }

    const handleWindowOpen = () => {
        // window.open(`/attendance/standalone/${user.companyId}`, '_blank')
        dispatch(logout())
    }

    return (
        <Box className="pt-5" sx={{ height: hideLink ? '90vh' : '' }}>
            <AlertMessage open={alert.open} setAlert={setAlert} severity={alert.severity} message={alert.message} />
            <Card sx={{ p: 0, pb: 5 }} elevation={9} className=" min-h-full flex flex-col items-center overflow-visible">
                <Box sx={{ borderRadius: 0, background: 'url(https://static.vecteezy.com/system/resources/previews/001/576/504/non_2x/abstract-wavy-green-background-free-vector.jpg)' }} className="w-full h-36 relative">
                    <Box className="absolute left-1/2 top-1/2 transform -translate-x-1/2 translate-y-1/6 bg-white rounded-lg shadow-md w-64 h-40 flex flex-col justify-center items-center">
                        <Typography fontSize={40} fontWeight={700}  >
                            {currentTime.toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric', hour12: true }).toUpperCase()}
                        </Typography>
                        <Typography variant="subtitle1" className="text-sm pt-4">
                            {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </Typography>
                    </Box>
                </Box>
                <Box className='flex items-center justify-between gap-1 w-full p-4'>
                    <Box className='flex items-center gap-1 self-start p-4'>
                        {!hideLink && <Link onClick={handleWindowOpen} to={`/attendance/standalone/${user?.companyId || firmId}`} rel="noopener noreferrer">
                            <Button
                                variant="text"
                                color="primary"
                                endIcon={<OpenInNewIcon fontSize="small" />}
                                sx={{
                                    bgcolor: 'white',
                                    textTransform: 'none',
                                    padding: '6px 8px',
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                        textDecoration: 'underline',
                                    },
                                }}
                            >
                                <Typography variant="body2">
                                    Open Attendance in new tab
                                </Typography>
                            </Button>
                        </Link>}
                    </Box>
                    <Box className='flex items-center gap-2'>
                        <Typography fontSize={12}>Device Status: Connected</Typography>
                        <span class="relative flex h-3 w-3 whitespace-nowrap">
                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                    </Box>
                </Box>


                <Box className="mt-24 p-2 text-center h-[195px]">
                    <AnimatePresence mode='wait'>
                        {isScanning &&
                            <motion.div key={'finger'} className='mt-12 flex flex-col justify-center items-center' initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} >
                                <FingerPrintLoader />
                                <Typography variant="body2" className="mt-2">
                                    {message}
                                </Typography>
                            </motion.div>}
                        {employeeData &&
                            <motion.div key={'card'} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} >
                                <EmployeeCard data={employeeData} />
                            </motion.div>}
                    </AnimatePresence>


                </Box>

            </Card>
        </Box>
    );
}

const EmployeeCard = ({ data }) => (
    <Card sx={{ px: '3rem', width: '30rem' }} elevation={3} className="p-3   mx-auto ">
        <Box className="flex items-center gap-3 mb-2">
            <Avatar sx={{ width: '150px', height: '150px' }} src={`http://122.248.194.140:8081/ExergyHRM/Users/GetProfileImageByFileName?fileName=${data.profileFileName}`} />
            <Box className='w-full'>
                <Box className='flex items-center justify-between w-full'>
                    <Typography variant="h4" className=''>{data.employeeName}</Typography>
                    <Typography fontSize={11} className='bg-green-500 px-2 rounded-md text-white'>Active</Typography>
                </Box>
                <Typography variant="body2" className="text-gray-600 pb-3 text-start">{data.employeeNo}</Typography>
                <Typography fontSize={11} variant="body1" className="flex items-center my-1 text-gray-600">
                    <WorkOutlineIcon fontSize='sm' className="mr-1" /> {data.employeeDesignation}
                </Typography>
                <Typography fontSize={11} variant="body1" className="flex items-center mb-1 text-gray-600">
                    <CalendarTodayIcon fontSize='sm' className="mr-1" /> {data.currentDate}
                </Typography>
                <Typography fontSize={11} variant="body1" className="flex items-center text-gray-600">
                    <AccessTimeIcon fontSize='sm' className="mr-1" /> {`${data?.currentTime[0]}:${data?.currentTime[1]}:${data?.currentTime[2]}`}
                </Typography>
            </Box>
        </Box>

    </Card>
);