import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Typography,
  Button,
  Tooltip,
  Avatar,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import { useDispatch } from 'react-redux';
import { IconButton } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { getPendingLeaveQuotaByCompanyId } from '../../../../../store/leave/LeaveSlice';
import { getAttendanceById } from '../../../../../store/attendance/AttendanceSlice';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import dayjs from 'dayjs';
import { FaCalendarAlt } from 'react-icons/fa';
import { LiaCalendarDaySolid } from 'react-icons/lia';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const Details = ({ data }) => {
  const [open, setOpen] = React.useState(false);
  const [pic, setPic] = React.useState(null);
  const dispatch = useDispatch();
  const [quotas, setQuotas] = React.useState([]);

  const handleDialogOpen = () => {
    setOpen(true);
    const formData = new FormData();
    formData.append('employeeId', data.employeeId);
    dispatch(getPendingLeaveQuotaByCompanyId(formData)).then((result) => {
      if (result.payload.SUCCESS === 1) {
        setQuotas(result.payload.DATA.leaveDetails);
      } else {
        console.error('Failed to fetch leave quotas:', result.payload.MESSAGE);
      }
    });

    const formData2 = new FormData();
    formData2.append('employeeId', data.employeeId);
    formData2.append('startDate', '2024-08-01');
    formData2.append('endDate', '2024-08-20');
    dispatch(getAttendanceById(formData2)).then((result) => {
      if (result.payload.SUCCESS === 1) {
        setPic(result.payload.DATA[0].profileFileName);
      } else {
        console.error('Error fetching Image');
      }
    });
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split('/');
    const date = new Date(`${month}/${day}/${year}`);
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const formattedFromDate = formatDate(data.fromDate);
  const formattedToDate = formatDate(data.toDate);

  const calculateDateDifference = (fromDateStr, toDateStr) => {
    const fromDate = dayjs(fromDateStr, 'DD/MM/YYYY');
    const toDate = dayjs(toDateStr, 'DD/MM/YYYY');

    const differenceInDays = toDate.diff(fromDate, 'day');

    return differenceInDays;
  };

  const formattedFromDatee = data.fromDate;
  const formattedToDatee = data.toDate;

  const differenceInDays = calculateDateDifference(formattedFromDatee, formattedToDatee) + 1;

  return (
    <div>
      <Tooltip title="View Details">
        <IconButton onClick={handleDialogOpen} sx={{ color: 'primary.main' }} size="small">
          <RemoveRedEyeIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', py: 2 }}>
          <Typography variant="h4" className="text-white">
            Leave Details
          </Typography>
        </DialogTitle>
        <DialogContent className="h-full p-6">
          {data && (
            <div className="flex flex-col items-start justify-center w-full h-full gap-6 mt-4">
              <div className="flex flex-row gap-4 items-center w-full">
                <Avatar
                  sx={{ width: 120, height: 120, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)' }}
                  src={`http://122.248.194.140:8081/ExergyHRM/Users/GetProfileImageByFileName?fileName=${pic}`}
                />
                <div className="flex gap-4">
                  <div className="bg-gray-200 border border-slate-200 p-2 rounded-md">
                    <Typography variant="h6" className="text-blue-500 font-bold">
                      Leave Requested by:
                    </Typography>
                    <Typography variant="h6">{data.employeeFullName}</Typography>
                  </div>

                  <div className="bg-gray-200 border border-slate-200 p-2 rounded-md">
                    <Typography variant="h6" className="text-blue-500 font-bold mt-2">
                      Employee ID:
                    </Typography>
                    <Typography variant="h6" className="underline">
                      {data.employeeId}
                    </Typography>
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col items-center justify-center gap-2">
                <Typography variant="h5" className="text-blue-500 font-bold">
                  Date of Leave Requested:
                </Typography>
                <div className="flex items-center gap-4 mt-4 w-[90%]">
                  <div className="bg-yellow-50 py-2 px-4 flex flex-row items-center justify-start rounded-xl gap-2 w-[30%]">
                    <div className="rounded-md bg-[#facc15] p-2">
                      <FaCalendarAlt className="text-md text-white" />
                    </div>
                    <div className="flex flex-col items-start">
                      <Typography variant="h6" fontWeight={800}>
                        {formattedFromDate}
                      </Typography>
                      <Typography sx={{ color: 'grey' }}>From</Typography>
                    </div>
                  </div>
                  <div className="bg-yellow-50 py-2 px-4 flex flex-row items-center justify-start rounded-xl gap-2 w-[30%]">
                    <div className="rounded-md bg-[#facc15] p-2">
                      <FaCalendarAlt className="text-md text-white" />
                    </div>
                    <div className="flex flex-col items-start">
                      <Typography variant="h6" fontWeight={800}>
                        {formattedToDate}
                      </Typography>
                      <Typography sx={{ color: 'grey' }}>To</Typography>
                    </div>
                  </div>
                  <div className="bg-gray-200 py-2 px-4 flex flex-row items-center justify-start rounded-xl gap-2 w-[30%]">
                    <div className="rounded-md bg-[#facc15] p-1">
                      <LiaCalendarDaySolid className="text-[19px] text-white" />
                    </div>
                    <div className="flex flex-col items-start">
                      <Typography variant="h6" fontWeight={800}>
                        {differenceInDays}
                      </Typography>
                      <Typography sx={{ color: 'grey' }}>Days</Typography>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4 w-[90%] ml-8">
                <div className="flex flex-col items-center gap-2 w-[50%]">
                  <Typography variant="h5" className="text-blue-500 font-bold">
                    Leave Demanded:
                  </Typography>
                  <div className="bg-yellow-50 py-2 px-3 flex flex-row items-center justify-start rounded-xl gap-2 w-full">
                    <div className="rounded-md bg-[#facc15] p-2">
                      <FaCalendarAlt className="text-md text-white" />
                    </div>
                    <div className="flex flex-col items-start">
                      <Typography variant="h6" fontWeight={800}>
                        {data.commonLeaveTypeLabel} ({data.leaveType})
                      </Typography>
                      <Typography sx={{ color: 'grey' }}>Leave Type</Typography>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2 w-[50%]">
                  <Typography variant="h5" className="text-blue-500 font-bold">
                    Reason:
                  </Typography>
                  <div className="bg-gray-200 py-2 px-3 flex flex-row items-center justify-start rounded-xl gap-2 w-full h-14">
                    <Typography variant="h6" fontWeight={800}>
                      {data.reason}
                    </Typography>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center w-full gap-4 pt-2">
                <Typography
                  variant="h5"
                  className="text-blue-500 mt-4 align-middle text-center font-bold"
                >
                  Yearly Leave Details of {data.employeeFullName}
                </Typography>
                <TableContainer component={Paper} sx={{ width: '70%' }}>
                  <Table className="border border-blue-100 ">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>
                          Leave Types
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>
                          Total Leaves
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>
                          Remaining Leaves
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody className="w-[70%]">
                      {quotas.slice(0, 3).map((row) => (
                        <TableRow
                          key={row.companyLeaveTypeId}
                          sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}
                        >
                          <TableCell sx={{ fontSize: '14px' }}>{row.leaveType}</TableCell>
                          <TableCell sx={{ fontSize: '14px' }}>{row.leaveQuota}</TableCell>
                          <TableCell sx={{ fontSize: '14px' }}>{row.remainingLeaves}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              <div className="flex flex-col w-full gap-2 mt-4">
                <Typography variant="h5" className="text-blue-500 font-bold">
                  Remarks:
                </Typography>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  sx={{ width: '100%', borderRadius: '8px' }}
                  value={data.remarks}
                />
              </div>
            </div>
          )}
        </DialogContent>

        <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', px: 3, py: 2 }}>
          <Button
            variant="outlined"
            onClick={handleDialogClose}
            sx={{ color: 'primary.main', bgcolor: '#fff !important', borderColor: 'primary.main' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Details;
