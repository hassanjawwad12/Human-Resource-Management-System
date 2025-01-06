import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

import DashboardCard from '../../shared/DashboardCard';

const TotalEarning = () => {
  // chart color
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;

  // chart
  const optionscolumnchart: any = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 55,
      resize: true,
      barColor: '#fff',
      sparkline: {
        enabled: true,
      },
    },
    colors: [secondary],
    grid: {
      show: false,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        startingShape: 'flat',
        endingShape: 'flat',
        columnWidth: '60%',
        barHeight: '20%',
        borderRadius: 3,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2.5,
      colors: ['rgba(0,0,0,0.01)'],
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    axisBorder: {
      show: false,
    },
    fill: {
      opacity: 1,
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
      name: '',
      data: [4, 10, 9, 7, 9, 10, 11, 8, 10],
    },
  ];

  return (
    <DashboardCard>
      <>
        <Typography variant="subtitle2" color="textSecondary">
          Total Earning
        </Typography>
        <Typography variant="h4">$78,298</Typography>
        <Box mt={5}>
          <Chart options={optionscolumnchart} series={seriescolumnchart} type="bar" height="55px" />
        </Box>
      </>
    </DashboardCard>
  );
};

export default TotalEarning;
