import React from 'react';
import {
  Avatar,
  Box,
  CardContent,
  Grid,
  IconButton,
  Typography,
  Button,
  Divider,
  Stack
} from '@mui/material';

// components
import BlankCard from '../../shared/BlankCard';
import { IconDeviceLaptop, IconDeviceMobile, IconDotsVertical } from '@tabler/icons';

const SecurityTab = () => {
  return (
    <>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} lg={8}>
          <BlankCard>
            <CardContent>
              <Typography variant="h4" mb={2}>
                Two-factor Authentication
              </Typography>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="subtitle1" color="textSecondary">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corporis sapiente sunt
                  earum officiis laboriosam ut.
                </Typography>
                <Button variant="contained" color="primary">
                  Enable
                </Button>
              </Stack>

              <Divider />

              {/* list 1 */}
              <Stack direction="row" spacing={2} py={2} alignItems="center">
                <Box>
                  <Typography variant="h6">Authentication App</Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    Google auth app
                  </Typography>
                </Box>
                <Box sx={{ ml: 'auto !important' }}>
                  <Button variant="text" color="primary">
                    Setup
                  </Button>
                </Box>
              </Stack>
              <Divider />
              {/* list 2 */}
              <Stack direction="row" spacing={2} py={2} alignItems="center">
                <Box>
                  <Typography variant="h6">Another e-mail</Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    E-mail to send verification link
                  </Typography>
                </Box>
                <Box sx={{ ml: 'auto !important' }}>
                  <Button variant="text" color="primary">
                    Setup
                  </Button>
                </Box>
              </Stack>
              <Divider />
              {/* list 3 */}
              <Stack direction="row" spacing={2} py={2} alignItems="center">
                <Box>
                  <Typography variant="h6">SMS Recovery</Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    Your phone number or something
                  </Typography>
                </Box>
                <Box sx={{ ml: 'auto !important' }}>
                  <Button variant="text" color="primary">
                    Setup
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </BlankCard>
        </Grid>
        <Grid item xs={12} lg={4}>
          <BlankCard>
            <CardContent>
              <Avatar
                variant="rounded"
                sx={{ bgcolor: 'primary.light', color: 'primary.main', width: 48, height: 48 }}
              >
                <IconDeviceLaptop size="26" />
              </Avatar>

              <Typography variant="h5" mt={2}>
                Devices
              </Typography>
              <Typography color="textSecondary" mt={1} mb={2}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit Rem.
              </Typography>
              <Button variant="contained" color="primary">
                Sign out from all devices
              </Button>

              {/* list 1 */}
              <Stack direction="row" spacing={2} py={2} mt={3} alignItems="center">
                <IconDeviceMobile size="26" />

                <Box>
                  <Typography variant="h6">iPhone 14</Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    London UK, Oct 23 at 1:15 AM
                  </Typography>
                </Box>
                <Box sx={{ ml: 'auto !important' }}>
                  <IconButton>
                    <IconDotsVertical size="22" />
                  </IconButton>
                </Box>
              </Stack>
              <Divider />
              {/* list 2 */}
              <Stack direction="row" spacing={2} py={2} alignItems="center">
                <IconDeviceLaptop size="26" />

                <Box>
                  <Typography variant="h6">Macbook Air </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    Gujarat India, Oct 24 at 3:15 AM
                  </Typography>
                </Box>
                <Box sx={{ ml: 'auto !important' }}>
                  <IconButton>
                    <IconDotsVertical size="22" />
                  </IconButton>
                </Box>
              </Stack>
              <Stack>
                <Button variant="text" color="primary">
                  Need Help ?
                </Button>
              </Stack>
            </CardContent>
          </BlankCard>
        </Grid>
      </Grid>

      <Stack direction="row" spacing={2} sx={{ justifyContent: 'end' }} mt={3}>
        <Button size="large" variant="contained" color="primary">
          Save
        </Button>
        <Button size="large" variant="text" color="error">
          Cancel
        </Button>
      </Stack>
    </>
  );
};

export default SecurityTab;
