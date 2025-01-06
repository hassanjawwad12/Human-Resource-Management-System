import React from 'react';
import {
    Avatar,
    Box,
    CardContent,
    Grid,
    IconButton,
    Typography,
    Tooltip,
    Button,
    Stack
} from '@mui/material';

// components
import BlankCard from '../../shared/BlankCard';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import { IconCirclePlus, IconCreditCard, IconPackage, IconPencilMinus } from '@tabler/icons';

const BillsTab = () => {
    return (
        <>
            <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} lg={9}>
                    <BlankCard>
                        <CardContent>
                            <Typography variant="h4" mb={2}>
                                Billing Information
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <CustomFormLabel sx={{ mt: 0 }} htmlFor="text-bname">
                                        Business Name*
                                    </CustomFormLabel>
                                    <CustomTextField
                                        id="text-bname"
                                        value="Visitor Analytics"
                                        variant="outlined"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <CustomFormLabel sx={{ mt: 0 }} htmlFor="text-bsector">
                                        Business Sector*
                                    </CustomFormLabel>
                                    <CustomTextField
                                        id="text-bsector"
                                        value="Arts, Media & Entertainment"
                                        variant="outlined"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <CustomFormLabel sx={{ mt: 0 }} htmlFor="text-baddress">
                                        Business Address*
                                    </CustomFormLabel>
                                    <CustomTextField id="text-baddress" value="" variant="outlined" fullWidth />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <CustomFormLabel sx={{ mt: 0 }} htmlFor="text-bcy">
                                        Country*
                                    </CustomFormLabel>
                                    <CustomTextField id="text-bcy" value="Romania" variant="outlined" fullWidth />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <CustomFormLabel sx={{ mt: 0 }} htmlFor="text-fname">
                                        First Name*
                                    </CustomFormLabel>
                                    <CustomTextField id="text-fname" value="" variant="outlined" fullWidth />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <CustomFormLabel sx={{ mt: 0 }} htmlFor="text-lname">
                                        Last Name*
                                    </CustomFormLabel>
                                    <CustomTextField id="text-lname" value="" variant="outlined" fullWidth />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </BlankCard>
                </Grid>

                {/* 2 */}
                <Grid item xs={12} lg={9}>
                    <BlankCard>
                        <CardContent>
                            <Typography variant="h4" display="flex" mb={2}>
                                Current Plan :
                                <Typography variant="h4" component="div" ml="2px" color="success.main">
                                    Executive
                                </Typography>
                            </Typography>
                            <Typography color="textSecondary">
                                Thanks for being a premium member and supporting our development.
                            </Typography>

                            {/* list 1 */}
                            <Stack direction="row" spacing={2} mt={4} mb={2}>
                                <Avatar
                                    variant="rounded"
                                    sx={{ bgcolor: 'grey.100', color: 'grey.500', width: 48, height: 48 }}
                                >
                                    <IconPackage size="22" />
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" color="textSecondary">
                                        Current Plan
                                    </Typography>
                                    <Typography variant="h6" mb={1}>
                                        750.000 Monthly Visits
                                    </Typography>
                                </Box>
                                <Box sx={{ ml: 'auto !important' }}>
                                    <Tooltip title="Add">
                                        <IconButton>
                                            <IconCirclePlus size="22" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Stack>

                            <Stack direction="row" spacing={2}>
                                <Button variant="contained" color="primary">
                                    Change Plan
                                </Button>
                                <Button variant="outlined" color="error">
                                    Reset Plan
                                </Button>
                            </Stack>
                        </CardContent>
                    </BlankCard>
                </Grid>

                {/* 3 */}
                <Grid item xs={12} lg={9}>
                    <BlankCard>
                        <CardContent>
                            <Typography variant="h4" mb={2}>
                                Payment Method
                            </Typography>
                            <Typography color="textSecondary">On 26 December, 2023</Typography>
                            {/* list 1 */}
                            <Stack direction="row" spacing={2} mt={4}>
                                <Avatar
                                    variant="rounded"
                                    sx={{ bgcolor: 'grey.100', color: 'grey.500', width: 48, height: 48 }}
                                >
                                    <IconCreditCard size="22" />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" mb={1}>
                                        Visa
                                    </Typography>
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        *****2102
                                    </Typography>
                                </Box>
                                <Box sx={{ ml: 'auto !important' }}>
                                    <Tooltip title="Edit">
                                        <IconButton>
                                            <IconPencilMinus size="22" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Stack>
                            <Typography color="textSecondary" my={1}>
                                If you updated your payment method, it will only be dislpayed here after your next
                                billing cycle.
                            </Typography>
                            <Button variant="outlined" color="error">
                                Cancel Subscription
                            </Button>
                        </CardContent>
                    </BlankCard>
                </Grid>
            </Grid>

            <Stack direction="row" spacing={2} sx={{ justifyContent: 'end' }} mt={3}>
                <Button size="large" variant="contained" color="primary">
                    Save
                </Button>
                <Button size="large" variant="text" color="error">
                    Cancel
                </Button>
            </Stack>
        </>
    );
};

export default BillsTab;
