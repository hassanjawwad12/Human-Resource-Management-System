import React from 'react';
import {  Button, Stack } from '@mui/material';

const OutlinedDefaultButtons = () => (
  <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }} justifyContent="center">
    <Button variant="outlined" color="primary">
      Primary
    </Button>
    <Button variant="outlined" color="secondary">
      Secondary
    </Button>
    <Button disabled>Disabled</Button>
    <Button href="#text-buttons" variant="outlined" color="primary">
      Link
    </Button>
  </Stack>
);

export default OutlinedDefaultButtons;
