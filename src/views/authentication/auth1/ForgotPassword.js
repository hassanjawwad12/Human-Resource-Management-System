import React from 'react';
import { Grid, Box, Typography } from '@mui/material';

import Logo from 'src/layouts/full/shared/logo/Logo';
import PageContainer from 'src/components/container/PageContainer';


import img1 from 'src/assets/images/backgrounds/auth-bg.jpeg';
import AuthForgotPassword from '../authForms/AuthForgotPassword';
import ColoredOverlay from './ColoredOverlay';

const ForgotPassword = () => (
  <PageContainer title="Forgot Password" description="this is Forgot Password page">
    <Grid container justifyContent="center" spacing={0} sx={{ overflowX: 'hidden' }}>
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
            height={'calc(100vh - 75px)'}
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
            xs: '5rem'
          }

        }}>
          <Typography variant="h4" fontWeight="700">
            Forgot your password?
          </Typography>

          <Typography color="textSecondary" variant="subtitle2" fontWeight="400" mt={2}>
            To reset your password, enter the email address associated with your account. A link to create a new password will be sent to that address.
          </Typography>
          <AuthForgotPassword />
        </Box>
      </Grid>
    </Grid>
  </PageContainer >
);

export default ForgotPassword;
