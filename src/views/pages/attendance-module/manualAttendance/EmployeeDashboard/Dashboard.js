import * as React from 'react';
import AttendanceDetail from '../AttendanceDetail';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { getSurveyDetails } from '../../../../../store/attendance/AttendanceSlice';
import {useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [show,setShow]=React.useState(true)
  const [date, setDate] = React.useState({
    from: dayjs().startOf('month'),
    to: dayjs().endOf('month'),
  });
  const user = JSON.parse(localStorage.getItem('Exergy HRMData'));
  const selectedEmployeeId = useSelector((state) => state.employeeReducer.selectedEmployeeId);
    const [id, setId] = React.useState(user?.employeeId);

    // React.useEffect(() => {
    //   const formData = new FormData();
    //   formData.append('employeeId', user.employeeId);
    //   formData.append('companyId', '52');
    //   dispatch(getSurveyDetails(formData))
    //     .then((result) => {
    //       if (result.payload.SUCCESS === 1) {
    //         setShow(true);
    //       } else {
    //         setShow(false);
    //         //navigate('/ExergyHRM#/dashboards/employee-profiling');
    //       }
    //     }
    //   )
    //     .catch((err) => {
    //       navigate('/dashboards/employee-profiling');
    //     });
    // }, []);

  React.useEffect(() => {
    if (selectedEmployeeId) {
      setId(selectedEmployeeId);
    } else {
      setId(user?.employeeId);
    }
  }, [selectedEmployeeId, user?.employeeId]);



  return (
    <div>
      {(show && user.id) && <AttendanceDetail id={id} initialDate={date} customW={true} />}
    </div>
  );
};

export default Dashboard;
