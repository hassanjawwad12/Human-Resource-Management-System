import React, { useState } from 'react';
import { Box, Card, CardContent, Divider, Grid, Stack, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { getCompany, getAllByFirm } from '../../../../store/admin/FirmSlice';
import AlertMessage from '../../../../components/shared/AlertMessage';

const FirmDetails = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { firmData, allFirmData } = useSelector((state) => state.firmReducer);
    const [alert, setAlert] = useState({
        open: false,
        severity: '',
        message: ''
    });

    React.useEffect(() => {
        dispatch(getCompany())
            .then((result => {
                console.log(result, "result")

                if (result.payload.SUCCESS === 1) {

                    setAlert({
                        open: true,
                        severity: 'success',
                        message: result.payload.USER_MESSAGE || 'Successfully retrieved Firm data'
                    })
                }
                else {
                    setAlert({
                        open: true,
                        severity: 'error',
                        message: result.payload
                    })
                }
            }))
            .catch((error) => {
                setAlert({
                    open: true,
                    severity: 'error',
                    message: error.USER_MESSAGE || 'Something went wrong.'
                })
            });

        dispatch(getAllByFirm())
            .then((result => {
                console.log(result, "result")

                if (result.payload.SUCCESS === 1) {

                    setAlert({
                        open: true,
                        severity: 'success',
                        message: result.payload.USER_MESSAGE || 'Successfully retrieved Firm data'
                    })
                }
                else {
                    setAlert({
                        open: true,
                        severity: 'error',
                        message: result.payload
                    })
                }
            }))
            .catch((error) => {
                setAlert({
                    open: true,
                    severity: 'error',
                    message: error.USER_MESSAGE || 'Something went wrong.'
                })
            });
    }, [])

    return (
        <div>
            <AlertMessage open={alert.open} setAlert={setAlert} severity={alert.severity} message={alert.message} />

            <Stack py={2}>
                <Box onClick={() => { navigate(-1) }} sx={{ cursor: 'pointer', width: '70px' }} display='flex' flexDirection='row' alignItems='center'>
                    <ArrowBackIcon fontSize='small' sx={{ color: 'primary.main', mr: 1.5 }} />
                    <Typography variant='h6' fontWeight={600}>Back</Typography>
                </Box>
            </Stack>

            <Card
                sx={{ mt: 3 }}
                variant="elevation"
                elevation={9}
            >
                <CardContent>
                    <Typography variant='h4'>Firm Details</Typography>

                    <Grid container spacing={3} sx={{ pt: 5 }}>
                        <Grid item sm={6}>
                            <Stack direction="column" spacing={2}>
                                <Stack direction="row">
                                    <Typography variant="h6" sx={{ width: '130px' }}>Organization:</Typography>
                                    <Typography>{allFirmData[0]?.label}</Typography>
                                </Stack>
                                <Stack direction="row">
                                    <Typography variant="h6" sx={{ width: '130px' }}>Business Type:</Typography>
                                    <Typography>{firmData?.businessType}</Typography>
                                </Stack>
                                <Stack direction="row">
                                    <Typography variant="h6" sx={{ width: '130px' }}>Website URL:</Typography>
                                    <Typography>{firmData?.webUrl}</Typography>
                                </Stack>
                                <Stack direction="row">
                                    <Typography variant="h6" sx={{ width: '130px' }}>Address:</Typography>
                                    <Typography>{allFirmData[0]?.address}</Typography>
                                </Stack>
                            </Stack>
                        </Grid>
                        <Divider orientation="vertical" flexItem />
                        <Grid item sm={5}>
                            <Stack direction="column" spacing={2}>
                                <Stack direction="row">
                                    <Typography variant="h6" sx={{ width: '130px' }}>City:</Typography>
                                    <Typography>{allFirmData[0]?.cityLabel}</Typography>
                                </Stack>
                                <Stack direction="row">
                                    <Typography variant="h6" sx={{ width: '130px' }}>Country:</Typography>
                                    <Typography>{allFirmData[0]?.countryLabel}</Typography>
                                </Stack>
                                <Stack direction="row">
                                    <Typography variant="h6" sx={{ width: '130px' }}>Contact:</Typography>
                                    <Typography>{allFirmData[0]?.contactNo}</Typography>
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </div>
    )
}

export default FirmDetails