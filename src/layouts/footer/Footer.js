import { Box, Typography } from '@mui/material'
import React from 'react'

const Footer = () => {
    return (
        <Box display="flex" flexDirection="row" sx={{ px: 3, position: 'absolute', bottom: '10px' }}>
            <Typography sx={{ letterSpacing: '2px' }}>COPYRIGHT © 2024 <Typography variant='span' color={'primary.main'}>Exergy Systems</Typography>, All rights Reserved</Typography>
        </Box>
    )
}

export default Footer