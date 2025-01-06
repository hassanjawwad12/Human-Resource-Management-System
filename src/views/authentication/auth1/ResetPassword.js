import React from 'react';
import { Grid, Box, Typography } from '@mui/material';

import Logo from 'src/layouts/full/shared/logo/Logo';
import PageContainer from 'src/components/container/PageContainer';

import img1 from 'src/assets/images/backgrounds/auth-bg.jpeg';

import AuthResetPassword from '../authForms/AuthResetPassword';
import ColoredOverlay from './ColoredOverlay';

const ResetPassword = () => (
    <PageContainer title="Reset Password" description="this is Reset Password page">
        <Grid container justifyContent="center" spacing={0} sx={{ overflowX: 'hidden' }}>
            <Grid
                item
                xs={12}
                sm={12}
                lg={7}
                xl={7.5}
                sx={{
                    display: {
                        xs: 'none',
                        lg: 'block',
                    },
                    position: 'relative',
                    background: { img1 },
                    minHeight: '100vh',
                    '&:before': {
                        content: '""',
                        background: `url(${img1})`,
                        backgroundSize: 'cover',
                        objectFit: 'cover',
                        animation: 'gradient 15s ease infinite',
                        position: 'absolute',
                        height: '100%',
                        width: '100%',
                        opacity: '1',
                    },
                }}
            >
                <Box
                    position="relative"
                    height={'100%'}>
                      <ColoredOverlay />

                    {/* <Box px={3}>
            <Logo />
          </Box> */}

                    {/* <Box className="absolute top-0 left-0 right-0 bottom-0 bg-[#2ADC68] opacity-60">

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
                            px: {
                                xs: 6
                            }
                        }}
                    >
                        {/* <img
              src={img1}
              alt="bg"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            /> */}
                    </Box>
                </Box>
            </Grid>
            <Grid
                xs={12}
                sm={12}
                lg={5}
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
                        Reset Password
                    </Typography>

                    <Typography color="textSecondary" variant="subtitle2" fontWeight="400" mt={2}>
                        Enter a new password. It should include uppercase and lowercase letters, numbers, and special characters.
                    </Typography>
                    <AuthResetPassword />
                </Box>
            </Grid>
        </Grid>
    </PageContainer>
);

export default ResetPassword;
