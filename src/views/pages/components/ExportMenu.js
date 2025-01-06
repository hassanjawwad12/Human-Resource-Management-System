import React, { useState } from 'react';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FileOpenIcon from '@mui/icons-material/FileOpen';

export default function ExportMenu({ exportToCSV, withRatesOption = false, attendanceData = null }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleExport = (includeRates = null) => {
        if (withRatesOption) {
            exportToCSV(includeRates)
        } else {
            exportToCSV(includeRates)
        }
        handleClose();
    };

    return (
        <Box>
            <IconButton
                aria-label="more"
                aria-controls={open ? 'export-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="export-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'export-button',
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                {withRatesOption ? (
                    [
                        <MenuItem key="with-rates" onClick={() => handleExport(true)} sx={{ color: 'primary.main' }}>
                            <FileOpenIcon fontSize='small' sx={{ color: 'primary.main', marginRight: 1 }} />
                            Export to CSV (with rates)
                        </MenuItem>,
                        <MenuItem key="without-rates" onClick={() => handleExport(false)} sx={{ color: 'primary.main' }}>
                            <FileOpenIcon fontSize='small' sx={{ color: 'primary.main', marginRight: 1 }} />
                            Export to CSV (without rates)
                        </MenuItem>
                    ]
                ) : (
                    <MenuItem onClick={() => handleExport()} sx={{ color: 'primary.main' }}>
                        <FileOpenIcon fontSize='small' sx={{ color: 'primary.main', marginRight: 1 }} />
                        Export to CSV
                    </MenuItem>
                )}
            </Menu>
        </Box>
    );
}
