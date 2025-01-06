import React from 'react';
import { CardContent, Typography, Button, Box } from '@mui/material';
import oopsBg from 'src/assets/images/backgrounds/maintenance.svg';
import BlankCard from '../../shared/BlankCard';

const Banner4 = () => {
  return (
    <BlankCard>
      <CardContent sx={{ p: '30px' }}>
        <Box textAlign="center">
          <img src={oopsBg} alt="star" width={200} />

          <Typography variant="h5" mt={3}>
            Oops something went wrong!
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" mt={1} mb={2}>
            Trying again to bypasses these
            <br /> temporary error.
          </Typography>

          <Button color="error" variant="contained" size="large">
            Retry
          </Button>
        </Box>
      </CardContent>
    </BlankCard>
  );
};

export default Banner4;
