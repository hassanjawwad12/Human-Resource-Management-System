import React, { useEffect } from 'react'
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb'
import { Button, Card, CardActions, CardContent, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import { Box, Stack } from '@mui/system';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminFeatures } from '../../../store/admin/AdminSlice'
import KeyIcon from '@mui/icons-material/Key';

const AdminModule = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const adminFeatures = useSelector((state) => state.adminReducer.features);

    useEffect(() => {
        dispatch(getAdminFeatures())
    }, [])

    const managementAreas = [
        {
            name: 'Firm Management',
            description: 'Setup your company',
            icon: <RoomPreferencesIcon sx={{ color: 'primary.main' }} fontSize='large' />,
            to: '/admin/add-companies',
            toDetails: '/admin/firmDetails'
        },
        {
            name: 'Feature Assignment',
            description: 'Assign Features to employees',
            icon: <KeyIcon sx={{ color: 'primary.main' }} fontSize='large' />,
            to: '/admin/featureAssignment',
            toDetails: '/admin/assignFeatures'
        }
    ]

    const BCrumb = [
        {
            title: 'Admin',
        }
    ];

    return (
        <div>
            {/* <Breadcrumb title="Admin Module" items={BCrumb} /> */}

            {/* <Grid sx={{ flexGrow: 1 }} container spacing={3}> */}
            {/* {adminFeatures.map((data, index) =>
                    <Grid key={index} item sm={12} md={6} lg={4}>
                        <Card
                            sx={{ width: '360px' }}
                            variant="elevation"
                            elevation={9}
                        >
                            <CardContent sx={{ padding: 0 }}>
                                <Stack direction="row" spacing={1}>
                                    <RoomPreferencesIcon sx={{ color: 'primary.main' }} fontSize='large' />
                                    <Box>
                                        <Typography variant='h4'>{data.featureLabel}</Typography>
                                        <br />
                                        <Typography variant='subtitle1'>{data.featureSubLabel}</Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                            <CardActions disableSpacing={true}>
                                <Stack direction='row-reverse' spacing={2} sx={{ width: '100%' }}>
                                    {data.featureLabel === 'Firm Management' ?
                                        <Link to={managementAreas[0].toDetails}>
                                            <Button variant="outlined" sx={{ color: 'primary.main !important', bgcolor: '#fff !important' }} size="small">
                                                View
                                            </Button>
                                        </Link>
                                        :
                                        null
                                    }

                                    {data.featureLabel === 'Firm Management' ?
                                        <Link to={managementAreas[0].to}>
                                            <Button variant="outlined" sx={{ color: 'primary.main !important', bgcolor: '#fff !important' }} size="small">
                                                Edit
                                            </Button>
                                        </Link>
                                        :
                                        null
                                    }
                                </Stack>
                            </CardActions>
                        </Card>
                    </Grid>
                )} */}
            {/* </Grid> */}

            <Grid sx={{ flexGrow: 1 }} container spacing={3}>
                {managementAreas.map((data, index) =>
                    <Grid key={index} item sm={12} md={6} lg={4}>
                        <Card
                            sx={{ width: '360px' }}
                            variant="elevation"
                            elevation={9}
                        >
                            <Stack direction="row" spacing={1}>
                                {data.icon}
                                <Box sx={{ pb: 2, pt: .5 }}>
                                    <Typography variant='h4' >{data.name}</Typography>
                                    <br />
                                    <Typography variant='subtitle1'>{data.description}</Typography>
                                </Box>
                            </Stack>
                            <CardActions disableSpacing={true}>
                                <Stack direction='row-reverse' spacing={2} sx={{ width: '100%' }}>
                                    {/* <Link to={managementAreas[0].toDetails}>
                                        <Button variant="outlined" sx={{ color: 'primary.main !important', bgcolor: '#fff !important' }} size="small">
                                            View
                                        </Button>
                                    </Link> */}
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

export default AdminModule