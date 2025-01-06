import React, { useState, useEffect } from 'react';
import { Paper, Typography, Stack, IconButton } from '@mui/material';
import Report1 from './Graphs/Report1';
import Report2 from './Graphs/Report2';
import Report3 from './Graphs/Report3';
import Report4 from './Graphs/Report4';
import { EnhancedTableToolbar } from './EnahanceTableComponent';
import Custom from './Graphs/Custom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import {
  getTimeToggleState,
  addTimeToggleState,
} from '../../../../store/attendance/AttendanceSlice';
import { useDispatch } from 'react-redux';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';


const Insights = ({ name, time, date, setDate, setSearchTrigger, data, id }) => {
  const key1 = data.barChart;
  const key2 = data.pieChart;
  const key3 = data.stackBarChart;
  const key4 = data.radarChart;
  const key5 = data.LeaveHolidays;
  const [expanded, setExpanded] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '' });
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('Exergy HRMData'));

  useEffect(() => {
    const formData = new FormData();
    formData.append('employeeId', user.id);
    formData.append('companyId', 52);

    dispatch(getTimeToggleState(formData))
      .then((result) => {
        if (result) {
          const response = result.payload;
          const isExpanded = response.State === 1;
          setExpanded(isExpanded);
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
        setAlert({
          open: true,
          severity: 'error',
          message: err.USER_MESSAGE || 'Something went wrong.',
        });
      });
  }, []);

  const handleClick = () => {
    const newExpandedState = !expanded;
    setExpanded(newExpandedState);
    const formData = new FormData();
    formData.append('employeeId', user.id);
    formData.append('companyId', 52);

    dispatch(addTimeToggleState(formData))
      .then((result) => {
        if (result) {
        } else {
          setAlert({
            open: true,
            severity: 'error',
            message: result.payload.message || 'Something went wrong.',
          });
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        setAlert({
          open: true,
          severity: 'error',
          message: err.USER_MESSAGE || 'Something went wrong.',
        });
      });
  };
  let total;
  if (key2) {
    total = key2.reduce((acc, item) => acc + item.hours, 0);
  }

  return (
    <>
      <Paper className="pb-5 mt-10 border h-auto flex flex-col items-start justify-start w-full gap-2 px-2 pt-2">
        <Stack
          py={2}
          direction={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
          className={`px-10 w-full ${expanded ? 'border-b ' : ''}`}
        >
          <Typography color={'primary.main'} variant="h4">
            Time Sheet Insights of {name}
          </Typography>
          <div className="flex gap-2">
            <EnhancedTableToolbar
              setSearchTrigger={setSearchTrigger}
              date={date}
              setDate={setDate}
            />
            <IconButton onClick={handleClick}>
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </div>
        </Stack>
        {time && (
          <div className="flex flex-row gap-2 px-10 mt-[-2px]">
            <Typography variant="h6" className="text-zinc-800">
              Last Login:
            </Typography>
            <Typography variant="h6" className="text-[#3f50b5] mt-3">
              {time}
            </Typography>
          </div>
        )}

        {key1 ? (
          <>
            <Collapse in={expanded} timeout="auto" unmountOnExit className="w-full">
              <div className="flex flex-wrap gap-2 px-5 my-4 w-full border-b pb-2">
                <div className="bg-yellow-50 px-4 py-4 rounded-xl">
                  <Typography variant="h5" fontWeight={800}>
                    {total}h
                  </Typography>
                  <Typography sx={{ color: 'grey' }}>Total Work Logged</Typography>
                </div>
                {key2
                  ?.sort((a, b) => b.hours - a.hours)
                  .map((item) => (
                    <Custom itemName={item.name} hours={item.hours} date={date} id={id} />
                  ))}
                {key5?.map((item, index) => (
                  <div key={index} className="bg-red-50 px-4 py-4 rounded-xl">
                    <Typography variant="h5" fontWeight={800}>
                      {item.hours} h
                    </Typography>
                    <Typography sx={{ color: 'grey' }}>on {item.name}</Typography>
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-center justify-center h-[120vh] w-[100%] px-6 mt-4">
                <div className="flex items-center justify-center gap-2 w-full h-full">
                  <div className="w-1/2">
                    <Report1 data={key1} />
                  </div>
                  <div className="flex items-center justify-center w-1/2">
                    <div className="w-[67%]">
                      <Report2 data={key2} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 w-full h-full mt-4">
                  <div className="w-1/2">
                    <Report3 data={key3} />
                  </div>
                  <div className="flex items-center justify-center w-1/2">
                    <div className="flex items-center justify-center w-[80%] mr-0">
                      <Report4 data={key4} />
                    </div>
                  </div>
                </div>
              </div>
            </Collapse>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <Typography variant="h5" fontWeight={800}>
              No data is available
            </Typography>
          </div>
        )}
      </Paper>
    </>
  );
};

export default Insights;
