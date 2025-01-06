import React, { useEffect } from 'react'
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb'
import { Button, Card, CardActions, CardContent, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyIcon from '@mui/icons-material/Key';
import DomainIcon from '@mui/icons-material/Domain';
import { Box, Stack} from '@mui/system';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getHRFeatures } from '../../../store/hr/HRSlice';
import FingerprintIcon from '@mui/icons-material/Fingerprint';

const HRModule = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const HRFeatures = useSelector((state) => state.hrReducer.features)

    useEffect(() => {
        dispatch(getHRFeatures())
    }, [])

    const managementAreas = [
        {
            name: 'Employee Management',
            description: 'View and edit employee information',
            icon: <AccountCircleIcon sx={{ color: 'primary.main' }} fontSize='large' />,
            to: '/hr/view-employees',
            toList: '/hr/employeesList'
        },
        {
            name: 'Enroll Employee',
            description: 'Enroll employees for secure access.',
            icon: <FingerprintIcon sx={{ color: 'primary.main' }} fontSize='large' />,
            to: '/hr/enrollEmployee'
        },

        {
            name: 'Department Management',
            description: 'Manage Firm Departments',
            icon: <DomainIcon sx={{ color: 'primary.main' }} fontSize='large' />,
            to: '/hr/add-department',
            toList: '/hr/departmentList'

        },
        {
            name: 'Designations Management',
            description: 'Manage Firm Designations',
            icon: <ManageAccountsIcon sx={{ color: 'primary.main' }} fontSize='large' />,
            to: '/hr/add-designation',
            toList: '/hr/designationList'
        },
        // {
        //     name: 'Holiday Management',
        //     description: 'Manage All Holidays',
        //     icon: <WorkOffIcon sx={{ color: 'primary.main' }} fontSize='large' />,
        //     to: '/hr/add-holiday',
        //     toList: '/hr/holidayList'
        // },
        {
            name: 'User Rights Management',
            description: 'Set User Rights',
            icon: <KeyIcon sx={{ color: 'primary.main' }} fontSize='large' />,
            to: '/hr/add-rights',
            toList: '/hr/user-rights'
        },
    ];

    const BCrumb = [
        {
            title: 'HR',
        }
    ];

    return (
        <div>
            {/* <Breadcrumb title="HR Module" items={BCrumb} /> */}

            <Grid sx={{ flexGrow: 1 }} container spacing={3}>
                {managementAreas.map((data, index) =>
                    <Grid key={index} item sm={12} md={6} lg={4}>
                        <Card
                            sx={{ width: '360px' }}
                            variant="elevation"
                            elevation={9}
                        >
                            <CardContent sx={{ padding: 0 }}>
                                <Stack direction="row" spacing={1} alignItems={'start'}>
                                    {data.icon}
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
                                    <Link to={data.to}>
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

export default HRModule