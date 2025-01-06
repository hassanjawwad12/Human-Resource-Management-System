import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Box, Button, CardContent, Grid, Typography, Stack } from '@mui/material';
import BlankCard from '../../shared/BlankCard';

const CurrentValue = () => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.primary.light;
  const secondary = theme.palette.secondary.main;
  const textColor = theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.8)' : '#2A3547';

  // chart
  const optionscolumnchart = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 200,
      stacked: true,
      sparkline: {
        enabled: true,
      },
    },
    colors: [primary, primary],
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: '60%',
        columnWidth: '20%',
        borderRadius: [6],
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'all',
      },
    },
    stroke: {
      show: false,
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
    yaxis: {
      min: -5,
      max: 5,
      tickAmount: 4,
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      axisTicks: {
        show: false,
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
    },
  };
  const seriescolumnchart = [
    {
      name: '',
      data: [2.5, 3.7, 3.2, 2.6, 1.9, 2.5],
    },
    {
      name: '',
      data: [-2.8, -1.1, -3.0, -1.5, -1.9, -2.8],
    },
  ];

  //   chart 2
  const optionscolumn2chart = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 200,
      stacked: true,
      sparkline: {
        enabled: true,
      },
    },
    colors: [secondary, secondary],
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: '60%',
        columnWidth: '20%',
        borderRadius: [6],
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'all',
      },
    },
    stroke: {
      show: false,
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
    yaxis: {
      min: -5,
      max: 5,
      tickAmount: 4,
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      axisTicks: {
        show: false,
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
    },
  };
  const seriescolumn2chart = [
    {
      name: '',
      data: [2.5, 3.7, 3.2, 2.6, 1.9, 2.5],
    },
    {
      name: '',
      data: [-2.8, -1.1, -3.0, -1.5, -1.9, -2.8],
    },
  ];

  //   chart 3
  const optionscolumn3chart = {
    chart: {
      type: 'donut',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",

      toolbar: {
        show: false,
      },
      height: 220,
    },
    labels: ['Income', 'Current', 'Expance'],
    colors: [primary, primarylight, secondary],
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: '89%',
          background: 'transparent',

          labels: {
            show: true,
            name: {
              show: true,
              offsetY: 7,
            },
            value: {
              show: false,
            },
            total: {
              show: true,
              color: textColor,
              fontSize: '20px',
              fontWeight: '600',
              label: '$98,260',
            },
          },
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
  const seriescolumn3chart = [55, 55, 55];

  return (
    <BlankCard>
      <CardContent sx={{ p: '30px' }}>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Typography variant="h5">Current Value</Typography>
          <Stack spacing={1} direction="row">
            <Button color="primary" variant="contained">
              Buy
            </Button>
            <Button color="primary" variant="outlined">
              Sell
            </Button>
          </Stack>
        </Stack>

        <Grid container spacing={3} mt={2}>
          {/* 1 */}
          <Grid item xs={12} sm={4}>
            <BlankCard>
              <CardContent sx={{ p: '30px' }}>
                <Box>
                  <Chart
                    options={optionscolumnchart}
                    series={seriescolumnchart}
                    type="bar"
                    height="200px"
                  />
                </Box>
                <Box mt={4}>
                  <Typography variant="h6" fontWeight={400} mb={1}>
                    Income
                  </Typography>
                  <Stack direction="row" spacing={2} justifyContent="space-between">
                    <Typography variant="h4">$25,260</Typography>
                    <Typography variant="subtitle1" color="success.main">
                      +1.25%
                    </Typography>
                  </Stack>
                </Box>
              </CardContent>
            </BlankCard>
          </Grid>
          {/* 2 */}
          <Grid item xs={12} sm={4}>
            <BlankCard>
              <CardContent sx={{ p: '30px' }}>
                <Box>
                  <Chart
                    options={optionscolumn2chart}
                    series={seriescolumn2chart}
                    type="bar"
                    height="200px"
                  />
                </Box>
                <Box mt={4}>
                  <Typography variant="h6" fontWeight={400} mb={1}>
                    Expance
                  </Typography>
                  <Stack direction="row" spacing={2} justifyContent="space-between">
                    <Typography variant="h4">$12,260</Typography>
                    <Typography variant="subtitle1" color="success.main">
                      +4.25%
                    </Typography>
                  </Stack>
                </Box>
              </CardContent>
            </BlankCard>
          </Grid>
          {/* 3 */}
          <Grid item xs={12} sm={4}>
            <BlankCard>
              <CardContent sx={{ p: '30px' }}>
                <Box>
                  <Chart
                    options={optionscolumn3chart}
                    series={seriescolumn3chart}
                    type="donut"
                    height="220px"
                  />
                </Box>
                <Box mt={4}>
                  <Typography variant="h6" fontWeight={400} mb={1}>
                    Current Year
                  </Typography>
                  <Stack direction="row" spacing={2} justifyContent="space-between">
                    <Typography variant="h4">$98,260</Typography>
                    <Typography variant="subtitle1" color="success.main">
                      +2.5%
                    </Typography>
                  </Stack>
                </Box>
              </CardContent>
            </BlankCard>
          </Grid>
        </Grid>
      </CardContent>
    </BlankCard>
  );
};

export default CurrentValue;
