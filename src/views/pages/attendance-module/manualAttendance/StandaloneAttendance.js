import React from 'react';
import { Box, Card, Typography } from "@mui/material";
import ManualAttendance from './ManualAttendance';
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { logout } from '../../../../store/auth/login/LoginSlice';
export default function StandaloneAttendance() {
    const { id } = useParams();
    console.log(id)
    return (
        <Box className="p-4">
            {/* <Card sx={{ p: 4 }} elevation={9}> */}
            <Typography variant="h4" className="mb-4">Attendance</Typography>
            <ManualAttendance firmId={id} hideLink={true}/>
            {/* </Card> */}
        </Box>
    );
}