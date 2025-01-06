import React, { useEffect } from 'react'
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb'
import { Button, Card, CardActions, CardContent, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import PersonIcon from '@mui/icons-material/Person';
import { Box, Stack } from '@mui/system';
import { Link } from 'react-router-dom';
import { getAttendanceFeatures } from '../../../store/attendance/AttendanceSlice';
import { useDispatch, useSelector } from 'react-redux';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import DateRangeIcon from '@mui/icons-material/DateRange';
const AttendanceModule = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const AttendanceFeatures = useSelector((state) => state.attendanceReducer.features);

    useEffect(() => {
        dispatch(getAttendanceFeatures())
    }, [])

    const managementAreas = [
        {
            name: 'Mark Attendance',
            description: 'Mark attendance through machine',
            icon: <FingerprintIcon sx={{ color: 'primary.main' }} fontSize='large' />,
            to: '/attendance/add-manualAttendance'
        },
        {
            name: 'Employee Wise Attendance',
            description: 'Track employee work hours.',
            icon: <PendingActionsIcon sx={{ color: 'primary.main' }} fontSize='large' />,
            to: '/attendance/attendanceList'
        },
        {
            name: 'Monthly Wise Attendance',
            description: 'Track employee attendance.',
            icon: <DateRangeIcon sx={{ color: 'primary.main' }} fontSize='large' />,
            to: '/attendance/monthlyAttendance'
        }
    ];

    const BCrumb = [
        {
            title: 'Attendance',
        }
    ];
    useEffect(() => {
        fetch('https://127.0.0.1:52181/get_connection')
            .then(response => response.json())
            .then(data => {
                // Handle the response data here
                console.log(data);
                // You might want to initialize your fingerprint SDK here
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle any errors here
            });
    }, [])


    return (
        <div>
            {/* <Breadcrumb title="Attendance Module" items={BCrumb} /> */}

            <Grid sx={{ flexGrow: 1 }} container spacing={3} >
                {managementAreas.map((data, index) =>
                    <Grid key={index} item sm={12} md={6} lg={4}>
                        <Card
                            sx={{ width: '360px' }}
                            variant="elevation"
                            elevation={9}
                        >
                            <CardContent sx={{ padding: 0 }}>
                                <Stack direction="row" spacing={1} alignItems={'start'}>
                                    {managementAreas[index].icon}
                                    <Box sx={{ pb: 2, pt: .5 }}>
                                        <Stack direction={'row'} alignItems={'center'}>
                                            <Typography variant='h4'>{data.name}</Typography>
                                        </Stack>
                                        <br />
                                        <Typography variant='subtitle1'>{data.description}</Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                            <CardActions disableSpacing={true}>
                                <Stack direction='row' justifyContent='end' spacing={2} sx={{ width: '100%' }}>
                                    <Link to={managementAreas[index].to}>
                                        <Button variant="outlined" sx={{ color: 'primary.main !important', bgcolor: '#fff !important' }} size="small">
                                            View
                                        </Button>
                                    </Link>
                                </Stack>
                            </CardActions>
                        </Card>
                    </Grid>
                )}
            </Grid>
        </div>
    )
}

export default AttendanceModule