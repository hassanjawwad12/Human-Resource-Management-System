import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { CardContent, Typography, Avatar, Grid, Stack } from '@mui/material';
import BlankCard from '../../shared/BlankCard';
import { IconArrowDownRight } from '@tabler/icons';

const PageImpressions = () => {
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
      height: 100,
      sparkline: {
        enabled: true,
      },
    },
    colors: [secondarylight, secondarylight, secondary, secondarylight, secondarylight, secondarylight],
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
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
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
      data: [20, 15, 30, 25, 10],
    },
  ];

  return (
    <BlankCard>
      <CardContent sx={{ p: '30px' }}>
        <Typography variant="h5">Page Impressions</Typography>

        <Grid container spacing={3}>
          <Grid item xs={5}>
            
            <Typography variant="h4" mt={3} fontWeight={600}>$456,120</Typography>
            <Typography variant="subtitle2" fontSize="12px" color="textSecondary">
              (Change Yesterday)
            </Typography>
            <Stack direction="row" spacing={1} mt={1} alignItems="center">
              <Avatar sx={{ bgcolor: 'error.light', width: 20, height: 20 }}>
                <IconArrowDownRight width={16} color="#FA896B" />
              </Avatar>
              <Typography variant="subtitle2" color="textSecondary">
                +9%
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={7}>
            <Chart
              options={optionscolumnchart}
              series={seriescolumnchart}
              type="bar"
              height="100px"
            />
          </Grid>
        </Grid>
      </CardContent>
    </BlankCard>
  );
};

export default PageImpressions;
