import React from 'react';
import { Box } from '@mui/material';
// custom
import CustomCheckbox from "../../theme-elements/CustomCheckbox";

const CustomEleCheckbox = () => {
    // 2
    const [checked, setChecked] = React.useState(true);

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };
    return (
        <Box textAlign="center">
            <CustomCheckbox
                checked={checked}
                onChange={handleChange}
                inputprops={{ 'aria-label': 'primary checkbox' }}
            />

            <CustomCheckbox
                disabled
                checked
                inputprops={{ 'aria-label': 'disabled checked checkbox' }}
            />
            <CustomCheckbox
                defaultChecked
                indeterminate color="secondary"
                inputprops={{ 'aria-label': 'indeterminate checkbox' }}
            />
            <CustomCheckbox
                defaultChecked
                color="default"
                inputprops={{ 'aria-label': 'checkbox with default color' }}
            />
        </Box>
    );
};

export default CustomEleCheckbox;
