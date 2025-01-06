import { Autocomplete, TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getAllEmployeesData, setSelectedEmployeeId } from '../../../../../store/hr/EmployeeSlice'; 

const SearchEmployee = () => {
  const [employee, setEmployees] = useState([]);
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('Exergy HRMData'));

  const hasLeaveApprovalFeature = (userFeatures) => {
    return userFeatures.some((feature) => feature.featureLabel === 'Employee Management');
  };
  const hasLeaveApproval = hasLeaveApprovalFeature(user.userFeatures);

  useEffect(() => {
    const formData = new FormData();
    formData.append('companyId', 52);
    dispatch(getAllEmployeesData(formData))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          setEmployees(result.payload.DATA);
        } else {
          console.error('Failed to fetch leave quotas:', result.payload.MESSAGE);
        }
      })
      .catch((err) => {
        console.error('An error occurred while fetching leave quotas:', err);
      });
  }, []);

  const handleEmployeeChange = (event, newValue) => {
    if (newValue) {
      dispatch(setSelectedEmployeeId(newValue.employeeNo));
      console.log('Selected Employee ID:', newValue.employeeNo);
    }
  };

  return (
    <>
      {hasLeaveApproval && (
        <div className="pr-2">
          <Autocomplete
            options={employee}
            className='w-56 bg-white text-white rounded-lg'
            getOptionLabel={(option) => option.fullName}  
            onChange={handleEmployeeChange}
            renderInput={(params) => (
              <TextField {...params} className='px-2 w-full' placeholder='Search Employee' variant="outlined" />
            )}
          />
        </div>
      )}
    </>
  );
};

export default SearchEmployee;
