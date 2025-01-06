import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

import DashboardCard from '../../shared/DashboardCard';
import { Props } from 'react-apexcharts';
import { IconArrowUpRight, IconShoppingCart } from '@tabler/icons';

const SalesTwo = () => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  // chart
  const optionscolumnchart = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 25,
      resize: true,
      barColor: '#fff',
      offsetX: -15,
      sparkline: {
        enabled: true,
      },
    },
    colors: [primary],
    grid: {
      show: false,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '100%',
        borderRadius: 3,
        distributed: true,
    }
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 5,
      colors: ['rgba(0,0,0,0.01)']
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
      responsive: [
        {
            breakpoint: 767,
            options: {
                chart: { height: 60 },
                plotOptions: {
                    bar: { columnWidth: "60%" }
                }
                
            }
        }
    ],
    },
  };
  const seriescolumnchart = [
    {
      name: '',
      data: [100, 60, 35, 90, 35, 100]
    },
  ];

  return (
    <DashboardCard>
      <>
        <Box
          width={38}
          height={38}
          bgcolor="primary.light"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            color="primary.main"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <IconShoppingCart width={22} />
          </Typography>
        </Box>

        <Box mt={3} mb={2}>
          <Chart options={optionscolumnchart} series={seriescolumnchart} type="bar" height="25px" />
        </Box>

        <Typography variant="h4">$16.5k<span><IconArrowUpRight width={18} color="#39B69A" /></span></Typography>
        <Typography variant="subtitle2" color="textSecondary">
          Sales
        </Typography>
      </>
    </DashboardCard>
  );
};

export default SalesTwo;
