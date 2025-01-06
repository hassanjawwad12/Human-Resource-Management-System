import React from 'react';
import { Grid, Box, Card, Typography } from '@mui/material';

import Logo from 'src/layouts/full/shared/logo/Logo';
import PageContainer from 'src/components/container/PageContainer';

import AuthTwoSteps from '../authForms/AuthTwoSteps';

const TwoSteps2 = () => (
  <PageContainer title="Forgot Password" description="this is Forgot Password page">
    <Box
      sx={{
        position: 'relative',
        '&:before': {
          content: '""',
          background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite',
          position: 'absolute',
          height: '100%',
          width: '100%',
          opacity: '0.3',
        },
      }}
    >
      <Grid container spacing={0} justifyContent="center" sx={{ height: '100vh' }}>
        <Grid
          item
          xs={12}
          sm={12}
          lg={5}
          xl={4}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Card elevation={9} sx={{ p: 4, m: 3, zIndex: 1, width: '100%', maxWidth: '450px' }}>
            <Box display="flex" alignItems="center" justifyContent="center">
              <Logo />
            </Box>
            <Typography variant="subtitle1" textAlign="center" color="textSecondary" mb={1}>
              We sent a verification code to your mobile. Enter the code from the mobile in the
              field below.
            </Typography>
            <Typography variant="subtitle1" textAlign="center" fontWeight="700" mb={1}>
              ******1234
            </Typography>
            <AuthTwoSteps />
          </Card>
        </Grid>
      </Grid>
    </Box>
  </PageContainer>
);

export default TwoSteps2;
