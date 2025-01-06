import React from 'react';
import { Card, CardContent, Typography, Button, Box, Grid } from '@mui/material';
import trackBg from 'src/assets/images/backgrounds/login-bg.svg';

const Banner1 = () => {
  return (
    <Card
      elevation={0}
      sx={{
        backgroundColor: (theme) => theme.palette.secondary.light,
        py: 0,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <CardContent sx={{ p: '30px' }}>
        <Grid container spacing={3} justifyContent="space-between">
          <Grid item sm={6} display="flex" alignItems="center">
            <Box
              sx={{
                textAlign: {
                  xs: 'center',
                  sm: 'left',
                },
              }}
            >
              <Typography variant="h5">Track your every Transaction Easily</Typography>
              <Typography variant="subtitle1" color="textSecondary" my={2}>
                Track and record your every income and expence easily to control your balance
              </Typography>
              <Button variant="contained" color="secondary">
                Download
              </Button>
            </Box>
          </Grid>
          <Grid item sm={4}>
            <Box mb="-90px">
              <img src={trackBg} alt={trackBg} />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Banner1;
