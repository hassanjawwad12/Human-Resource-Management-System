import React from 'react';
import { Box, FormControlLabel } from '@mui/material';
// custom
import CustomCheckbox from "../../theme-elements/CustomCheckbox";

const ColorsCheckbox = () => (
    <Box textAlign="center">
        <FormControlLabel control={<CustomCheckbox defaultChecked />} label="Primary" />
        <FormControlLabel
            control={
                <CustomCheckbox
                    defaultChecked
                    bgcolor="#3DD9EB"
                    inputprops={{ 'aria-label': 'checkbox with default color' }}
                />
            }
            label="Secondary"
        />
        <FormControlLabel
            control={
                <CustomCheckbox
                    defaultChecked
                    bgcolor="#39B69A"
                    inputprops={{ 'aria-label': 'checkbox with default color' }}
                />
            }
            label="Success"
        />
        <FormControlLabel
            control={
                <CustomCheckbox
                    defaultChecked
                    bgcolor="#FFAE1F"
                    inputprops={{ 'aria-label': 'checkbox with default color' }}
                />
            }
            label="Warning"
        />
        <FormControlLabel
            control={
                <CustomCheckbox
                    defaultChecked
                    bgcolor="#FA896B"
                    inputprops={{ 'aria-label': 'checkbox with default color' }}
                />
            }
            label="Error"
        />
    </Box>
);

export default ColorsCheckbox;
