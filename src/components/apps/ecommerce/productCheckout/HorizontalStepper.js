import * as React from 'react';
import { Box, Stepper, Step, StepLabel, Button, Stack } from '@mui/material'
import { Link } from 'react-router-dom';

const HorizontalStepper = ({ children, steps, activeStep, handleReset, finalStep }) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => {
          const stepProps = {};
          const labelProps = {};

          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Box>{finalStep}</Box>
          <Stack direction={{ sm: 'column', lg: 'row' }} sx={{ pt: 2 }}>
            <Button variant="contained" color="success" component={Link} to="/apps/ecommerce/shop">
              Continue Shopping
            </Button>
            <Box sx={{ flex: '1 1 auto', mt: { xs: 2, sm: 0 } }} />
            <Stack direction={{ sm: 'column', lg: 'row' }} spacing={2}>
              <Button variant="contained">Download Receipt</Button>
              <Button onClick={handleReset}>Reset</Button>
            </Stack>
          </Stack>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Box sx={{ mt: 2, mb: 1 }}>{children}</Box>
        </React.Fragment>
      )}
    </Box>
  );
};

export default HorizontalStepper;
