import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';

import DashboardCard from '../../shared/DashboardCard';

const Expence = () => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const error = theme.palette.error.main;

  // chart
  const optionsexpencechart = {
    chart: {
      type: 'donut',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",

      toolbar: {
        show: false,
      },
      height: 120,
    },
    labels: ["Profit", "Revenue", "Expance"],
    colors: [primary, error, secondary],
    plotOptions: {
      pie: {
        
        donut: {
          size: '70%',
          background: 'transparent'
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: false,
    },
    legend: {
      show: false,
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
    },
  };
  const seriesexpencechart = [60, 25, 15];

  return (
    <DashboardCard>
      <>
        <Typography variant="h4">$10,230</Typography>
        <Typography variant="subtitle2" color="textSecondary" mb={2}>
          Expense
        </Typography>
        <Chart
          options={optionsexpencechart}
          series={seriesexpencechart}
          type="donut"
          height="120"
        />
      </>
    </DashboardCard>
  );
};

export default Expence;
