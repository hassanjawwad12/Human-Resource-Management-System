import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Typography, Box } from '@mui/material';
import DashboardCard from '../../shared/DashboardCard';

const YearlyBreakup = () => {
  const theme = useTheme();

  const optionsChart = {
    chart: {
      type: 'treemap',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
    },
    colors: [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.error.main,
    ],
    plotOptions: {
      treemap: {
        distributed: true,
        enableShades: false
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function(text, op) {
        return [text, op.value + ' hrs']
      },
      style: {
        fontSize: '12px',
      }
    },
    legend: {
      show: false
    }
  };

  const seriesChart = [{
    data: [
      {
        x: 'Sales',
        y: 180
      },
      {
        x: 'Marketing',
        y: 165
      },
      {
        x: 'Development',
        y: 200
      },
      {
        x: 'HR',
        y: 140
      },
      {
        x: 'Design',
        y: 170
      }
    ]
  }];

  const totalHours = seriesChart[0].data.reduce((acc, item) => acc + item.y, 0);
  const avgPerDept = totalHours / seriesChart[0].data.length;

  return (
    <DashboardCard title="Hours Worked by Department" subtitle="Hourly Breakdown">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ height: 350, display: 'flex', justifyContent: 'center' }}>
            <Chart
              options={optionsChart}
              series={seriesChart}
              type="treemap"
              height="350"
              width="100%"
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Typography variant="subtitle2" color="textSecondary">
              Total Hours: {totalHours}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Avg. per Dept: {avgPerDept.toFixed(2)}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default YearlyBreakup;