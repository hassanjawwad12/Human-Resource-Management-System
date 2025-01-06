import React, { useState } from 'react';
import { Box, Grid, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import TopCards from '../../components/dashboards/modern/TopCards';
import RevenueUpdates from '../../components/dashboards/modern/RevenueUpdates';
import YearlyBreakup from '../../components/dashboards/modern/YearlyBreakup';
import EmployeeSalary from '../../components/dashboards/modern/EmployeeSalary';
import Customers from '../../components/dashboards/modern/Customers';
import Projects from '../../components/dashboards/modern/Projects';
import TopPerformers from '../../components/dashboards/modern/TopPerformers';

const Modern = () => {

  return (
    <Box>
      <Box sx={{ my: 3 }}>
        <Typography variant="h4" sx={{ mb: .5 }}>
          Attendance Overview
        </Typography>
        <Typography color="GrayText" sx={{ mb: 2 }}>
          Track and analyze attendance metrics across your organization.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Rest of your existing code */}
        <Grid item sm={12} lg={12}>
          <TopCards />
        </Grid>
        <Grid item xs={12} container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <RevenueUpdates sx={{ flex: 1 }} />
            </Box>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <YearlyBreakup sx={{ flex: 1 }} />
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={12} lg={6}>
          <EmployeeSalary />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Customers />
            </Grid>
            <Grid item xs={12}>
              <Projects />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <TopPerformers />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Modern;