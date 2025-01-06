import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

import DashboardCard from '../../shared/DashboardCard';

const Sales = () => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  // chart
  const optionscolumnchart = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 90,
      width:'100%',
      stacked: true,
      stackType: '100%',
      sparkline: {
        enabled: true,
      },
    },
    colors: [primary, secondary, '#EAEFF4'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        borderRadius: [3],
        borderRadiusApplication: 'around',
        borderRadiusWhenStacked: 'around',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: false,
      width: 1,
      colors: ['rgba(0,0,0,0.01)'],
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
      x: {
        show: false,
      },
    },
    responsive: [{ breakpoint: 1025, options: { chart: { height: 150, width: 250 } } }],
  };
  const seriescolumnchart = [
    {
      color: primary,
      name: '',
      data: [25, 35, 20, 25, 40, 25],
    },
    {
      color: secondary,
      name: '',
      data: [35, 40, 20, 35, 40, 35],
    },
    {
      color: '#EAEFF4',
      name: '',
      data: [40, 25, 60, 40, 20, 40],
    },
  ];

  return (
    <DashboardCard>
      <>
        <Typography variant="h4">$65,432</Typography>
        <Typography variant="subtitle2" color="textSecondary" mb={3}>
          Sales
        </Typography>
        <Box className="rounded-bars">
        <Chart options={optionscolumnchart} series={seriescolumnchart} type="bar" height="90px" />
        </Box>
      </>
    </DashboardCard>
  );
};

export default Sales;
