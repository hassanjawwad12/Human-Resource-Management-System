import * as React from 'react';
import { Dialog, DialogContent,Typography,DialogActions } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { getBackgroundColor } from './helper';
import { getGraphbyProject } from '../../../../../store/attendance/AttendanceSlice';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import TaskPie from './TaskPie';
Chart.register(...registerables);

const Custom = ({itemName,hours,date,id}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [alert, setAlert] = useState({ open: false, message: '' });
  const [data, setData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loading,setLoading] = useState(true);

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

    useEffect(() => {
    if (!date.to || !date.from) return;
    setLoading(true);
    const obj = {
      employeeId: id,
      projectName:itemName,
      startDate: dayjs(date.from).format('YYYY-MM-DD'),
      endDate: dayjs(date.to).format('YYYY-MM-DD'),
    };

    dispatch(getGraphbyProject(obj))
      .then((result) => {
        if (result.payload) {
          const response = result.payload;
          setData(response.barChart);
          setPieData(response.ActivityWisePieChart);
          setLoading(false);
          setAlert({
            open: true,
            severity: 'success',
            message: 'Retrieved employees data successfully',
          });
        } else {
          setAlert({
            open: true,
            severity: 'error',
            message: result.payload,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setAlert({
          open: true,
          severity: 'error',
          message: err.USER_MESSAGE || 'Something went wrong.',
        });
      });
  }, []);
  
  let chartData;
  if (!loading) {
    chartData = {
      labels: data?.dates,
      datasets: [
        {
          label: `Time Spent on ${data?.projects[0]?.name}`,
          data: data?.projects[0]?.hours,
          backgroundColor: getBackgroundColor(0),
        },
      ],
    };
  }
 
  const chartOptions = {
    responsive: true, 
    scales: {
      y: {
        beginAtZero: true,
        max: 8,
        title: {
          display: true,
          text: 'Hours',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Days',
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: `Total Time Spent`,
      },
    },
  };

  return (
    <div>
    <div
      className="bg-gray-50 px-4 py-4 rounded-xl cursor-pointer"
      onClick={handleDialogOpen} 
    >
      <Typography variant="h5" fontWeight={800}>
        {hours} h
      </Typography>
      <Typography sx={{ color: 'grey' }}>Total Work on {itemName}</Typography>
    </div>
    <Dialog
      open={open}
      onClose={handleDialogClose}
      maxWidth="md"
      fullWidth
    >
      <DialogContent>
        <div className='flex flex-col items-center justify-center p-6 w-full h-[40vh]'>
          {chartData && <Bar data={chartData} options={chartOptions} />}
        </div>
        <div className="flex flex-col w-full items-center justify-center ">
          {pieData &&  <TaskPie data={pieData} />
        }
        </div>
      </DialogContent>
      <DialogActions>
          <button onClick={handleDialogClose} className='bg-blue-600 text-white p-2 rounded-lg'>
            Close
          </button>
        </DialogActions>
    </Dialog>
  </div>

  );
};

export default Custom;