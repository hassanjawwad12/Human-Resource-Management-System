import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '../../shared/DashboardCard';
import CustomSelect from '../../forms/theme-elements/CustomSelect';
import {
  MenuItem,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  TableContainer,
  Stack,
} from '@mui/material';

import img1 from 'src/assets/images/products/s6.jpg';
import img2 from 'src/assets/images/products/s9.jpg';
import img3 from 'src/assets/images/products/s7.jpg';
import img4 from 'src/assets/images/products/s4.jpg';

const ProductPerformances = () => {
  // for select
  const [month, setMonth] = React.useState('1');

  const handleChange = (event) => {
    setMonth(event.target.value);
  };

  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const grey = theme.palette.grey[300];
  const primarylight = theme.palette.primary.light;
  const greylight = theme.palette.grey[100];

  //   // chart 1
  const optionsrow1chart = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 35,
      width: 100,
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
      colors: [primarylight],
      type: 'solid',
      opacity: 0.05,
    },
    markers: {
      size: 0,
    },
    tooltip: {
      enabled: false,
    },
  };
  const seriesrow1chart = [
    {
      name: 'Customers',
      color: primary,
      data: [30, 25, 35, 20, 30],
    },
  ];

  // chart 2
  const optionsrow2chart = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 35,
      width: 100,
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
      colors: [greylight],
      type: 'solid',
      opacity: 0.05,
    },
    markers: {
      size: 0,
    },
    tooltip: {
      enabled: false,
    },
  };
  const seriesrow2chart = [
    {
      name: 'Customers',
      color: grey,
      data: [30, 25, 35, 20, 30],
    },
  ];

  // chart 3
  const optionsrow3chart = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 35,
      width: 100,
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
      colors: [primarylight],
      type: 'solid',
      opacity: 0.05,
    },
    markers: {
      size: 0,
    },
    tooltip: {
      enabled: false,
    },
  };
  const seriesrow3chart = [
    {
      name: 'Customers',
      color: primary,
      data: [30, 25, 35, 20, 30],
    },
  ];

  // chart 4
  const optionsrow4chart = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 35,
      width: 100,
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
      colors: [greylight],
      type: 'solid',
      opacity: 0.05,
    },
    markers: {
      size: 0,
    },
    tooltip: {
      enabled: false,
    },
  };
  const seriesrow4chart = [
    {
      color: grey,
      data: [30, 25, 35, 20, 30],
    },
  ];

  return (
    <DashboardCard
      title="Product Performance"
      action={
        <CustomSelect
          labelId="month-dd"
          id="month-dd"
          size="small"
          value={month}
          onChange={handleChange}
        >
          <MenuItem value={1}>Jan 2023</MenuItem>
          <MenuItem value={2}>Dec 2022</MenuItem>
          <MenuItem value={3}>Nov 2022</MenuItem>
        </CustomSelect>
      }
    >
      <TableContainer>
        <Table
          aria-label="simple table"
          sx={{
            whiteSpace: 'nowrap',
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ pl: 0 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Product
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Progress
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Status
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Sales
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Growth
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ pl: 0 }}>
                <Stack direction="row" spacing={2}>
                  <Avatar src={img1} variant="rounded" alt={img1} sx={{ width: 48, height: 48 }} />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Gaming Console
                    </Typography>
                    <Typography color="textSecondary" fontSize="12px" variant="subtitle2">
                      Electronics
                    </Typography>
                  </Box>
                </Stack>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                  78.5%
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  sx={{
                    bgcolor: (theme) => theme.palette.success.light,
                    color: (theme) => theme.palette.success.main,
                    borderRadius: '6px',
                    width: 80,
                  }}
                  size="small"
                  label="Low"
                />
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2">$3.9k</Typography>
              </TableCell>
              <TableCell>
                <Chart
                  options={optionsrow1chart}
                  series={seriesrow1chart}
                  type="area"
                  height="35px"
                  width="100px"
                />
              </TableCell>
            </TableRow>
            {/* 2 */}
            <TableRow>
              <TableCell sx={{ pl: 0 }}>
                <Stack direction="row" spacing={2}>
                  <Avatar src={img2} variant="rounded" alt={img1} sx={{ width: 48, height: 48 }} />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Leather Purse
                    </Typography>
                    <Typography color="textSecondary" fontSize="12px" variant="subtitle2">
                      Fashion
                    </Typography>
                  </Box>
                </Stack>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                  58.6%
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  sx={{
                    bgcolor: (theme) => theme.palette.warning.light,
                    color: (theme) => theme.palette.warning.main,
                    borderRadius: '6px',
                    width: 80,
                  }}
                  size="small"
                  label="Medium"
                />
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2">$3.5k</Typography>
              </TableCell>
              <TableCell>
                <Chart
                  options={optionsrow2chart}
                  series={seriesrow2chart}
                  type="area"
                  height="35px"
                  width="100px"
                />
              </TableCell>
            </TableRow>
            {/* 3 */}
            <TableRow>
              <TableCell sx={{ pl: 0 }}>
                <Stack direction="row" spacing={2}>
                  <Avatar src={img3} variant="rounded" alt={img1} sx={{ width: 48, height: 48 }} />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Red Velvate Dress
                    </Typography>
                    <Typography color="textSecondary" fontSize="12px" variant="subtitle2">
                      Womens Fashion
                    </Typography>
                  </Box>
                </Stack>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                  25%
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  sx={{
                    bgcolor: (theme) => theme.palette.primary.light,
                    color: (theme) => theme.palette.primary.main,
                    borderRadius: '6px',
                    width: 80,
                  }}
                  size="small"
                  label="Very High"
                />
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2">$3.5k</Typography>
              </TableCell>
              <TableCell>
                <Chart
                  options={optionsrow3chart}
                  series={seriesrow3chart}
                  type="area"
                  height="35px"
                  width="100px"
                />
              </TableCell>
            </TableRow>
            {/* 4 */}
            <TableRow>
              <TableCell sx={{ pl: 0 }}>
                <Stack direction="row" spacing={2}>
                  <Avatar src={img4} variant="rounded" alt={img1} sx={{ width: 48, height: 48 }} />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Headphone Boat
                    </Typography>
                    <Typography color="textSecondary" fontSize="12px" variant="subtitle2">
                      Electronics
                    </Typography>
                  </Box>
                </Stack>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                  96.3%
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  sx={{
                    bgcolor: (theme) => theme.palette.error.light,
                    color: (theme) => theme.palette.error.main,
                    borderRadius: '6px',
                    width: 80,
                  }}
                  size="small"
                  label="High"
                />
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2">$3.5k</Typography>
              </TableCell>
              <TableCell>
                <Chart
                  options={optionsrow4chart}
                  series={seriesrow4chart}
                  type="area"
                  height="35px"
                  width="100px"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </DashboardCard>
  );
};

export default ProductPerformances;
