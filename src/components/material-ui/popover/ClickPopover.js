import React from 'react';
import { Popover, Typography, Button, Box } from '@mui/material';

const ClickPopover = () => {

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (

        <>
            <Button aria-describedby={id} variant="contained" onClick={handleClick}>
                Open Popover
            </Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Box p={2}>
                    <Typography variant="h6" mb={1}>Basic Popover</Typography>
                    <Typography color="textSecondary">The component is built on top of the Modal component.</Typography>
                </Box>
            </Popover>
        </>
    );
}
export default ClickPopover;
