import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { MenuItem, Grid, Stack, Typography, Button, Avatar, Box } from '@mui/material';
import { IconGridDots } from '@tabler/icons';
import DashboardCard from '../../shared/DashboardCard';
import CustomSelect from '../../forms/theme-elements/CustomSelect';

const RevenueUpdates = () => {
  const [month, setMonth] = React.useState('1');

  const handleChange = (event) => {
    setMonth(event.target.value);
  };

  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const primarylight = '#2bae59';

  const seriescolumnchart = [
    {
      name: 'This Month',
      data: [100, 85, 10, 15, 5, 5],
    },
    {
      name: 'Last Month',
      data: [95, 80, 15, 20, 8, 7],
    }
  ];

  const optionscolumnchart = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 350,
    },
    colors: [primary, secondary],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Present', 'On Time', 'Early In', 'Early Out', 'Late In', 'Late Out'],
    },
    // yaxis: {
    //   title: {
    //     text: 'Number of Employees'
    //   }
    // },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val
        }
      }
    },
    legend: {
      show: true,
    },
  };

  // const seriescolumnchart = [
  //   {
  //     name: 'Eanings this month',
  //     data: [1.5, 2.7, 2.2, 3.6, 1.5, 1.0],
  //   }
  // ];

  return (
    <DashboardCard
      title="Attendance trends"
      subtitle="Overview of Attendance statuses"
      action={
        <CustomSelect
          labelId="month-dd"
          id="month-dd"
          value={month}
          size="small"
          onChange={handleChange}
        >
          <MenuItem value={1}>March 2023</MenuItem>
          <MenuItem value={2}>Feb 2023</MenuItem>
          <MenuItem value={3}>Jan 2023</MenuItem>
        </CustomSelect>
      }
    >
      <Grid container spacing={3}>
        {/* column */}
        <Grid item xs={12}>
          <Box className="">
            <Chart
              options={optionscolumnchart}
              series={seriescolumnchart}
              type="bar"
              height="350px"
            />
          </Box>
        </Grid>
        {/* column */}
        {/* <Grid item xs={12} sm={4}>
          <Stack spacing={3} my={3}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                width={40}
                height={40}
                bgcolor="primary.light"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Typography color="primary" variant="h6" display="flex">
                  <IconGridDots width={21} />
                </Typography>
              </Box>
              <Box>
                <Typography variant="h3" fontWeight="700">
                  95%
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Overall Attendance Rate
                </Typography>
              </Box>
            </Stack>
          </Stack>
          <Button color="primary" variant="contained" fullWidth>
            View Detailed Report
          </Button>
        </Grid> */}
      </Grid>
    </DashboardCard>
  );
};

export default RevenueUpdates;
