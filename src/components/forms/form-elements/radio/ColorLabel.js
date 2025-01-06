import React from 'react';
import { Box, FormControlLabel } from '@mui/material';
import CustomRadio from '../../theme-elements/CustomRadio';

const ColorLabelRadio = () => {
    return (
        <Box textAlign="center">
            <FormControlLabel
                value="end"
                control={<CustomRadio bgcolor="#615DFF" checked />}
                label="Primary"
                labelPlacement="end"
            />
            <FormControlLabel
                value="end"
                control={<CustomRadio bgcolor="#3DD9EB" checked />}
                label="Secondary"
                labelPlacement="end"
            />
            <FormControlLabel
                value="end"
                control={<CustomRadio bgcolor="#39B69A" checked />}
                label="Success"
                labelPlacement="end"
            />

            <FormControlLabel
                value="end"
                control={<CustomRadio bgcolor="#FA896B" checked />}
                label="Danger"
                labelPlacement="end"
            />

            <FormControlLabel
                value="end"
                control={<CustomRadio bgcolor="#FFAE1F" checked />}
                label="Warning"
                labelPlacement="end"
            />
        </Box>
    );
};

export default ColorLabelRadio;
