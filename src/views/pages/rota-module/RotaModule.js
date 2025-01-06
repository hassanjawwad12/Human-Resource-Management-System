import React from 'react'
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb'
import { Button, Card, CardActions, CardContent, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Box, Stack } from '@mui/system';
import { Link } from 'react-router-dom';
import TableRowsIcon from '@mui/icons-material/TableRows';
import CopyAllIcon from '@mui/icons-material/CopyAll';


const RotaModule = () => {
    const navigate = useNavigate();

    const managementAreas = [
        {
            name: 'Shift Manager',
            description: 'Create and assign shifts to employees',
            icon: < TableRowsIcon sx={{ color: 'primary.main' }} fontSize='large' />,
            to: 'manageShift'
        },
        {
            name: 'Rota Schedule',
            description: 'View and edit assigned shifts in detail',
            icon: <CalendarMonthIcon sx={{ color: 'primary.main' }} fontSize='large' />,
            to: 'schedule'
        },
        {
            name: 'Shift Cloner',
            description: 'Clone shift from an employee to another',
            icon: <CopyAllIcon sx={{ color: 'primary.main' }} fontSize='large' />,
            to: 'cloneShift'
        },
    ];

    const BCrumb = [
        {
            title: 'Rota',
        }
    ];

    return (
        <div>
            {/* <Breadcrumb title="Rota Module" items={BCrumb} /> */}

            <Grid sx={{ flexGrow: 1 }} container spacing={3}>
                {managementAreas.map((data, index) =>
                    <Grid key={index} item sm={12} md={6} lg={4}>
                        <Card
                            sx={{ width: '360px' }}
                            variant="elevation"
                            elevation={9}
                        >
                            <CardContent sx={{ padding: 0 }}>
                                <Stack direction="row" spacing={1}>
                                    {data.icon}
                                    <Box sx={{ pb: 2, pt: .5 }}>
                                        <Typography variant='h4'>{data.name}</Typography>
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
        </div >
    )
}

export default RotaModule