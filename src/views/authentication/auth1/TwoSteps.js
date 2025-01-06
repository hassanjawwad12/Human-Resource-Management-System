import React from 'react';
import { Grid, Box, Typography } from '@mui/material';

import PageContainer from 'src/components/container/PageContainer';
import img1 from 'src/assets/images/backgrounds/auth-bg.jpeg';
import Logo from 'src/layouts/full/shared/logo/Logo';

import AuthTwoSteps from '../authForms/AuthTwoSteps';
import ColoredOverlay from './ColoredOverlay';

const TwoSteps = () => (
  <PageContainer title="Two Steps" description="this is Two Steps page">
    <Grid container spacing={0} justifyContent="center" sx={{ overflowX: 'hidden' }}>
      <Grid
        item
        xs={12}
        sm={12}
        lg={8}
        xl={7.5}
        sx={{
          display: {
            xs: 'none',
            lg: 'block',
          },
          position: 'relative',
          background: { img1 },
          height: '100vh',
          '&:before': {
            content: '""',
            background: `url(${img1})`,
            backgroundSize: 'cover',
            animation: 'gradient 45s ease infinite',
            position: 'absolute',
            height: '100%',
            width: '100%',
            opacity: '1',
          },
        }}
      >
        <ColoredOverlay />

        <Box position="relative">
          {/* <Box px={3}>
            <Logo />
          </Box> */}

          <Box
            alignItems="center"
            justifyContent="center"
            height={'100%'}
            sx={{
              display: {
                xs: 'none',
                lg: 'flex',
              },
            }}
          >
            {/* <img
              src={img1}
              alt="bg"
              style={{
                width: '100%',
                maxWidth: '500px',
              }}
            /> */}
          </Box>
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        lg={4}
        xl={4.5}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box sx={{
          p: {
            xs: 7,
            lg: '0 96px 0 96px'
          },
          mt: {
            xs: '8rem'
          }

        }}>
          <Typography variant="h4" fontWeight="700">
            Two Step Verification
          </Typography>

          <Typography variant="subtitle1" color="textSecondary" mt={2} mb={1}>
            A verification code has been sent to your email address. Check your email and enter the code in the field below.
          </Typography>
          <Typography variant="subtitle1" fontWeight="700" mb={1}>
            ******@mail.com
          </Typography>
          <AuthTwoSteps />
        </Box>
      </Grid>
    </Grid>
  </PageContainer >
);

export default TwoSteps;
