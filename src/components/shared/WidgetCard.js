import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Stack, Box } from '@mui/material';

const WidgetCard = ({ title, subtitle, children, action }) => (
    <Card sx={{ padding: 0 }} variant="outlined">
        <CardContent>
            <Stack direction="row" spacing={2} justifyContent="space-between" mb={3.}>
                <Box>
                    {title ? (
                        <Typography variant="h5">{title}</Typography>
                    ) : ("")}

                    {subtitle ? (
                        <Typography variant="subtitle2" color="textSecondary">{subtitle}</Typography>
                    ) : ("")}
                </Box>
                {action}
            </Stack>

            {children}
        </CardContent>
    </Card>
);

WidgetCard.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    children: PropTypes.node,
    action: PropTypes.node,
};

export default WidgetCard;
