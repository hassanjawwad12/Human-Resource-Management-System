import React from 'react';
import { CardContent, Typography, Button, Avatar, Badge, Box, Stack } from '@mui/material';
import userBg from 'src/assets/images/profile/user-1.jpg';
import BlankCard from '../../shared/BlankCard';

const Banner3 = () => {
  return (
    <BlankCard>
      <CardContent sx={{ p: '30px' }}>
        <Typography variant="h5" textAlign="center" mb={3}>
          Mutual Friend Revealed
        </Typography>
        <Box textAlign="center">
          <Badge badgeContent={1} color="error" overlap="circular">
            <Avatar src={userBg} alt="userBg" sx={{ width: 140, height: 140 }} />
          </Badge>

          <Typography variant="h5" mt={3}>
            Tommoie Henderson
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" mt={1} mb={2}>
            Accept the request and <br/> type a message
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center">
            <Button color="primary" variant="contained" size="large">
              Accept
            </Button>
            <Button color="error" variant="outlined" size="large">
              Remove
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </BlankCard>
  );
};

export default Banner3;
