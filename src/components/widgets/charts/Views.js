import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { CardContent, Typography, Stack } from '@mui/material';
import BlankCard from '../../shared/BlankCard';

const Views = () => {
  // chart color
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;
  const secondarylight = theme.palette.secondary.light;

  // chart
  const optionscolumnchart = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 80,
      sparkline: {
        enabled: true,
      },
    },
    colors: [
      secondarylight,
      secondarylight,
      secondary,
      secondarylight,
      secondarylight,
      secondarylight,
      secondarylight,
      secondarylight,
    ],
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '50%',
        distributed: true,
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      show: false,
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    xaxis: {
      categories: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
  };
  const seriescolumnchart = [
    {
      name: '',
      data: [20, 15, 30, 25, 10, 18, 20],
    },
  ];

  return (
    <BlankCard>
      <CardContent sx={{ p: '30px' }}>
        <Typography variant="h4">15,480</Typography>
        <Stack direction="row" spacing={2} justifyContent="space-between" mb={2}>
          <Typography variant="subtitle2" color="textSecondary">
            Views
          </Typography>
          <Typography variant="subtitle2" color="error.main">
            -4.150%
          </Typography>
        </Stack>
        <Chart options={optionscolumnchart} series={seriescolumnchart} type="bar" height="80px" />
      </CardContent>
    </BlankCard>
  );
};

export default Views;
