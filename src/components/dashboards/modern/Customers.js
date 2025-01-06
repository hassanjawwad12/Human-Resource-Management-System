import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar } from '@mui/material';
import { IconArrowDownRight, IconArrowUpRight } from '@tabler/icons';

import DashboardCard from '../../shared/DashboardCard';

const Customers = () => {
  // chart color
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;
  const secondarylight = theme.palette.secondary.light;
  const errorlight = theme.palette.error.light;
  const successlight = theme.palette.success.light;

  // chart
  const optionscolumnchart = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 80,
      sparkline: {
        enabled: true,
      },
      group: 'sparklines',
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      colors: [secondarylight],
      type: 'solid',
      opacity: 0.05,
    },
    markers: {
      size: 0,
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      x: {
        show: false,
      },
    },
  };
  const seriescolumnchart = [
    {
      name: 'Employees',
      color: secondary,
      data: [5, -3, 7, -2, 6, -4, 8], // positive values for added, negative for left
    },
  ];

  const totalEmployees = 102;
  const employeesAdded = 26;
  const employeesLeft = 18;
  const netChange = employeesAdded - employeesLeft;
  const netChangePercentage = ((netChange / totalEmployees) * 100).toFixed(2);

  return (
    <DashboardCard
      footer={
        <>
          <Chart
            options={optionscolumnchart}
            series={seriescolumnchart}
            type="area"
            height="80px"
          />
        </>
      }
    >
      <>
        <Typography variant="subtitle2" color="textSecondary">
          Total Employees
        </Typography>
        <Typography variant="h4">{totalEmployees}</Typography>
        <Stack direction="row" spacing={1} mt={1} alignItems="center">
          <Avatar sx={{ bgcolor: netChange > 0 ? successlight : errorlight, width: 24, height: 24 }}>
            {netChange > 0 ? (
              <IconArrowUpRight width={18} color="#69F0AE" />
            ) : (
              <IconArrowDownRight width={18} color="#FA896B" />
            )}
          </Avatar>
          <Typography variant="subtitle2" className='flex items-center gap-3' fontWeight="600">
            {netChange > 0 ? '+' : ''}
            {netChangePercentage}%
            <Typography variant="body2" color="textSecondary">
              {employeesAdded} added, {employeesLeft} left this month
            </Typography>
          </Typography>
        </Stack>

      </>
    </DashboardCard>
  );
};

export default Customers;