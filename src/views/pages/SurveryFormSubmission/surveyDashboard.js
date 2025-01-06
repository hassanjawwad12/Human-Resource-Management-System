import * as React from 'react';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import SurveyForm from './surveyForm';
const Dashboard = () => {
  const [date, setDate] = React.useState({
    from: dayjs().startOf('month'),
    to: dayjs().endOf('month'),
  });
  const user = JSON.parse(localStorage.getItem('Exergy HRMData'));
  const selectedEmployeeId = useSelector((state) => state.employeeReducer.selectedEmployeeId);
  const [id, setId] = React.useState(user?.employeeId);

  React.useEffect(() => {
    if (selectedEmployeeId) {
      setId(selectedEmployeeId);
    } else {
      setId(user?.employeeId);
    }
  }, [selectedEmployeeId, user?.employeeId]);

  return <div>{user.id && <SurveyForm id={id} initialDate={date} customW={true} />}</div>;
};

export default Dashboard;
