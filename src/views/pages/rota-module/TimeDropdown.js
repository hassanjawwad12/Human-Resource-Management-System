import { MenuItem, Paper, Select } from '@mui/material';
import { Box, styled } from '@mui/system';
import React, { useState } from 'react';

const generateTimeOptions = () => {
    const times = [];
    const start = 0; // Start time in minutes (12:00 AM)
    const end = 1430; // End time in minutes (11:30 PM)
    const interval = 30; // 30 minutes interval

    for (let i = start; i <= end; i += interval) {
        const hours = Math.floor(i / 60);
        const minutes = i % 60;
        const time = `${hours % 12 === 0 ? 12 : hours % 12}:${minutes === 0 ? '00' : minutes} ${hours < 12 ? 'AM' : 'PM'}`;
        times.push(time);
    }
    return times;
};

const StyledPaper = styled(Paper)(({ theme }) => ({
    '&::-webkit-scrollbar': {
        width: '8px',
    },
    '&::-webkit-scrollbar-track': {
        background: '#f1f1f1',
        borderRadius: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'primary.main',
        borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
        background: '#10A999',
    },
}));

const isOptionDisabledMorning = (time) => {
    const [hours, minutes, period] = time.split(/:| /); // Splitting time into hours, minutes, and period (AM/PM)
    const hourValue = parseInt(hours, 10);
    const minuteValue = parseInt(minutes, 10);

    if (period === 'AM') {
        return (hourValue === 12 && minuteValue === 0) || // Disable 12:00 AM
            (hourValue === 12 && minuteValue === 30) || // Disable 12:30 AM
            hourValue < 7; // Disable options before 07:00 AM
    } else {
        return true; // Disable all PM options
    }
};

const isOptionDisabledAfternoon = (time) => {
    const [hours, minutes, period] = time.split(/:| /); // Splitting time into hours, minutes, and period (AM/PM)
    const hourValue = parseInt(hours, 10);
    const minuteValue = parseInt(minutes, 10);

    if (period === 'PM') {
        return (hourValue === 12 && (minuteValue === 0 || 30)) ? false :
            (hourValue >= 1 && hourValue < 6) ? false :
                (hourValue === 6 && minuteValue === 0) ? false : true;
    } else {
        return true; // Disable all AM options
    }
};


const TimeDropdown = ({ slot, name, value, onChange, size }) => {
    const timeOptions = generateTimeOptions();

    return (
        <Box sx={{ width: '180px' }}>
            <Select
                fullWidth
                name={name}
                value={value}
                onChange={onChange}
                size={size}
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight: 200,
                            marginTop: 8,
                        },
                        component: StyledPaper,
                    },
                }}
            >
                {timeOptions.map((time, index) => (
                    <MenuItem key={index} value={time} >

                        {time}
                    </MenuItem>
                ))}
            </Select>
        </Box >
    );
};

export default TimeDropdown;
