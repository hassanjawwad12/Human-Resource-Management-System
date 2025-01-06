import React, { useEffect } from 'react'
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb'
import { Button, Card, CardActions, CardContent, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { Box, Stack } from '@mui/system';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getLeaveFeatures } from '../../../store/leave/LeaveSlice';

const LeaveModule = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const LeaveFeatures = useSelector((state) => state.leaveReducer.features);

    useEffect(() => {
        dispatch(getLeaveFeatures())
    }, [])

    const managementAreas = [
        {
            name: 'Leave Management',
            description: 'Manage Leave Basic Module',
            icon: <PersonRemoveIcon sx={{ color: 'primary.main' }} fontSize='large' />,
            to: '/leave/add-leave',
            toList: '/leave/allLeaves',
        },
    ];

    const BCrumb = [
        {
            title: 'Leave',
        }
    ];

    return (
        <div>
            {/* <Breadcrumb title="Leave Module" items={BCrumb} /> */}

            <Grid sx={{ flexGrow: 1 }} container spacing={3}>
                {LeaveFeatures.map((data, index) =>
                    <Grid key={index} item sm={12} md={6} lg={4}>
                        <Card
                            sx={{ width: '360px' }}
                            variant="elevation"
                            elevation={9}
                        >
                            <CardContent sx={{ padding: 0 }}>
                                <Stack direction="row" spacing={1}>
                                    {managementAreas[index].icon}
                                    <Box>
                                        <Typography variant='h4'>{data.featureLabel}</Typography>
                                        <br />
                                        <Typography variant='subtitle1'>{data.featureSubLabel}</Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                            <CardActions disableSpacing={true}>
                                <Stack direction='row' justifyContent='end' spacing={2} sx={{ width: '100%' }}>
                                    <Link to={managementAreas[index].to}>
                                        <Button variant="outlined" sx={{ color: 'primary.main !important', bgcolor: '#fff !important' }} size="small">
                                            Add
                                        </Button>
                                    </Link>

                                    <Link to={managementAreas[index].toList}>
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

export default LeaveModule