import React, { useState, useEffect } from 'react';
import {
  getSurveyDetails,
  getSurvey2Details,
  getTechDetails
} from '../../../../../store/attendance/AttendanceSlice';
import { useDispatch } from 'react-redux';
import PersonalData from './PersonalData';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { CircularProgress } from "@mui/material"

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Survey = ({ id, image, designation, email }) => {

  const [surveyCount, setSurveyCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = React.useState('');
  const [data2, setData2] = React.useState([]);
  const [data3, setData3] = React.useState([]);
  const dispatch = useDispatch();
  const [alert, setAlert] = useState({
    open: false,
    severity: '',
    message: '',
  });

  useEffect(() => {
    let formData = new FormData();
    formData.append('employeeId', id);
    formData.append('companyId', 52);
    dispatch(getSurveyDetails(formData))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          setAlert({
            open: true,
            severity: 'success',
            message: result.payload.USER_MESSAGE,
          });
          setLoading(false);
          setData(result.payload[`Survey ${surveyCount} Data`].employee_details || {});
        } else {
          setAlert({
            open: true,
            severity: 'error',
            message: result.payload,
          });
          setLoading(false);
        }
      })
      .catch((err) => {
        setAlert({
          open: true,
          severity: 'error',
          message: err.USER_MESSAGE || 'Something went wrong.',
        });
      });

    //for survey 2 data
    let formData2 = new FormData();
    formData2.append('employee_id', id);
    formData2.append('company_id', 52);
    dispatch(getSurvey2Details(formData2))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          setAlert({
            open: true,
            severity: 'success',
            message: result.payload.USER_MESSAGE,
          });
          setData2(result.payload.Data);
        } else {
          setAlert({
            open: true,
            severity: 'error',
            message: result.payload,
          });
        }
      })
      .catch((err) => {
        setAlert({
          open: true,
          severity: 'error',
          message: err.USER_MESSAGE || 'Something went wrong.',
        });
      });

    dispatch(getTechDetails(formData2))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          setData3(result.payload.Data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  
  }, []);

  return (
    <div className="flex flex-col overflow-y-scroll overflow-x-hidden gap-2 w-full h-full">
     
      {data ? (
        <PersonalData
          data={data}
          newdata={data2}
          data3={data3}
          image={image}
          designation={designation}
          email={email}
        />
      ) : (
        <div className="h-full w-full items-center justify-center flex flex-col">
          <CircularProgress thickness={80} />
          {/* <Typography variant="h1" textAlign="center">
            No data found for this employee
          </Typography> */}
        </div>
      )}
    </div>
  );
};

export default Survey;
