import React from 'react'
import { Button, Card, CardActions, Grid, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Breadcrumb from '../layouts/full/shared/breadcrumb/Breadcrumb';
import {
    RoomPreferences as RoomPreferencesIcon,
    TableRows as TableRowsIcon,
    CalendarMonth as CalendarMonthIcon,
    CopyAll as CopyAllIcon,
    Fingerprint as FingerprintIcon,
    PendingActions as PendingActionsIcon,
    DateRange as DateRangeIcon,
    AccountCircle as AccountCircleIcon,
    Key as KeyIcon,
    Domain as DomainIcon,
    ManageAccounts as ManageAccountsIcon,
    PersonRemove as PersonRemoveIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/system';

const iconMap = {
    RoomPreferencesIcon,
    TableRowsIcon,
    CalendarMonthIcon,
    CopyAllIcon,
    FingerprintIcon,
    PendingActionsIcon,
    DateRangeIcon,
    AccountCircleIcon,
    KeyIcon,
    DomainIcon,
    ManageAccountsIcon,
    PersonRemoveIcon,
};

const ModuleFeatures = ({ moduleName }) => {
    const { user } = useSelector((state) => state.loginReducer);
    const theme = useTheme()

    const BCrumb = [
        {
            title: moduleName,
        }
    ];

    const renderFeatures = () => {
        if (!user.userFeatures || user.userFeatures.length === 0) {
            return (
                <Typography variant="h6" className='p-10'>
                    No features available. Please contact your administrator.
                </Typography>
            );
        }

        const moduleFeatures = user.userFeatures.filter(feature => feature.featureGroupLabel === moduleName);

        return moduleFeatures.map((feature, index) => (
            <Grid key={index} item sm={12} md={6} lg={4}>
                <Card
                    sx={{ width: '360px' }}
                    variant="elevation"
                    elevation={9}
                >
                    <Stack direction="row" spacing={1}>
                        {React.createElement(iconMap[feature.featureIcon] || 'span', {
                            fontSize: 'large',
                            style: { color: theme.palette.primary.main }
                        })}
                        <Box sx={{ pb: 2, pt: .5 }}>
                            <Typography variant='h4'>{feature.featureLabel}</Typography>
                            <br />
                            <Typography variant='subtitle1'>{feature.featureDescription}</Typography>
                        </Box>
                    </Stack>
                    <CardActions disableSpacing={true}>
                        <Stack direction='row-reverse' spacing={2} sx={{ width: '100%' }}>
                            <Link to={feature.featureURL}>
                                <Button variant="outlined" sx={{ color: 'primary.main !important', bgcolor: '#fff !important' }} size="small">
                                    View
                                </Button>
                            </Link>
                        </Stack>
                    </CardActions>
                </Card>
            </Grid>
        ));
    };

    return (
        <div>
            {/* <Breadcrumb title={`${moduleName}`} items={BCrumb} /> */}
            <Grid sx={{ flexGrow: 1 }} container spacing={3}>
                {renderFeatures()}
            </Grid>
        </div>
    )
}

export default ModuleFeatures;