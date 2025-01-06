import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Divider, Grid, MenuItem, Select, Stack, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { getCompany, getAllByFirm } from '../../../../store/admin/FirmSlice';
import AlertMessage from '../../../../components/shared/AlertMessage';
import { getUserFeatures, getUsers } from '../../../../store/hr/UserRightsSlice';
import CustomFormLabel from '../../../../components/forms/theme-elements/CustomFormLabel';

const RightsDetails = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const users = useSelector((state) => state.userRightsReducer.usersList)
    const userFeatures = useSelector((state) => state.userRightsReducer.userFeatures)

    const [selectedUser, setSelectedUser] = useState('');
    const [alert, setAlert] = useState({
        open: false,
        severity: '',
        message: ''
    });

    useEffect(() => {
        dispatch(getUsers())
            .then((result => {
                console.log(result, "result")

                if (result.payload.SUCCESS === 1) {

                    setAlert({
                        open: true,
                        severity: 'success',
                        message: result.payload.USER_MESSAGE || 'Successfully retrieved Users data'
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
    }, []);

    const fetchUserRights = async (id) => {

        let formData = new FormData();
        formData.append('userId', id)

        dispatch(getUserFeatures(formData))
            .then((result) => {

                if (result.payload.SUCCESS === 1) {
                    setAlert({
                        open: true,
                        severity: 'success',
                        message: 'Features retrieved successfully.'
                    })
                }
                else {
                    setAlert({
                        open: true,
                        severity: 'error',
                        message: result.payload
                    })
                }
            })
            .catch((err) => {
                setAlert({
                    open: true,
                    severity: 'error',
                    message: err.USER_MESSAGE || 'Something went wrong.'
                })
            });
    }

    const handleChange = (e) => {
        setSelectedUser(e.target.value)
        fetchUserRights(e.target.value)
    }

    console.log(userFeatures)

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
                    <Typography variant='h4'>Rights Detail</Typography>

                    <Box sx={{ width: "100%" }}>
                        <CustomFormLabel htmlFor="userId">
                            Select User
                        </CustomFormLabel>
                        <Select
                            id="userId"
                            name="userId"
                            value={selectedUser}
                            onChange={handleChange}
                            sx={{ width: '400px' }}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                        >
                            <MenuItem value="" disabled>
                                <em>Select...</em>
                            </MenuItem>
                            {users && users.length > 0
                                ? users.map((obj, index) => (
                                    <MenuItem key={obj.id} value={obj.id}>
                                        {obj.label}
                                    </MenuItem>
                                ))
                                : null}
                        </Select>
                    </Box>

                    <Grid container spacing={3} sx={{ pt: 5 }}>
                        {selectedUser && userFeatures && userFeatures.length > 0 ?
                            userFeatures.map((obj, index) => (
                                <Grid key={index} item sm={6} md={4} lg={3}>
                                    <Stack direction="column" spacing={2}>
                                        <Typography variant="h6" sx={{ width: '250px', color: 'primary.main' }}>{obj.label}</Typography>
                                        {obj.features.map((obj2, index2) => (
                                            obj2.isChecked === 1 && <Typography key={index2}>{obj2.label}</Typography>
                                        ))}
                                    </Stack>
                                </Grid>
                            ))
                            :
                            null
                        }
                    </Grid>
                </CardContent>
            </Card>
        </div>
    )
}

export default RightsDetails