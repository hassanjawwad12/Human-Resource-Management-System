import React from 'react';
import { Box, Radio } from '@mui/material';

const DefaultRadio = () => {
    // 2
    const [checked, setChecked] = React.useState(true);

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    return (
        <Box textAlign="center">
            <Radio
                checked={checked}
                onChange={handleChange}
                inputprops={{ 'aria-label': 'primary checkbox' }}
            />

            <Radio disabled inputprops={{ 'aria-label': 'disabled checked checkbox' }} />
            <Radio color="default" inputprops={{ 'aria-label': 'checkbox with default color' }} />
        </Box>
    );
};

export default DefaultRadio;
