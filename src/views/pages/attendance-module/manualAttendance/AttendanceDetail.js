import * as React from 'react';
import { Paper, Typography, Avatar } from '@mui/material';
import AttendanceDetailTable from './AttendanceDetailTable';
import { Stack } from '@mui/system';
import {
  getAttendanceById,
  getAttendanceGrapghById,
  getToggleState,
  addToggleState,
} from '../../../../store/attendance/AttendanceSlice';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import { Loader } from '../../../../layouts/full/shared/loadable/Loadable';
import Insights from './Insights';
import {
  FaEnvelope,
  FaCalendarAlt,
  FaHeartbeat,
  FaRegCalendarCheck,
  FaRegClock,
  FaPhoneAlt,
} from 'react-icons/fa';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import { EnhancedTableToolbar } from './EnahanceTableComponent';
import Popover from '@mui/material/Popover';
import { getPendingLeaveQuotaByCompanyId } from '../../../../store/leave/LeaveSlice';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ExpandLess } from '@mui/icons-material';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Survey from './Survey/Survey';
import { formatDate } from './Graphs/helper';
import { FaIdCard, FaExclamationTriangle } from 'react-icons/fa';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FullscreenDialog from '../../../../components/material-ui/dialog/FullscreenDialog';

export default function AttendanceDetail({ id, initialDate, customW = false }) {
  const dispatch = useDispatch();
  const [date, setDate] = useState({ to: initialDate.to, from: initialDate.from });
  const [loading, setLoading] = useState();
  const [tableRows, setTableRows] = useState([]);
  const [employeeData, setEmployeeData] = useState({});
  const [searchTrigger, setSearchTrigger] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [alert, setAlert] = useState({ open: false, message: '' });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [leaveQuota, setLeaveQuota] = useState(null);
  const open = Boolean(anchorEl);
  const [showDOB, setShowDOB] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [show, setShow] = useState(false);

  const handleDialogOpen = () => {
    setShow(true);
  };

  const handleDialogClose = () => {
    setShow(false);
  };

  const handleClick = () => {
    const newExpandedState = !expanded;
    setExpanded(newExpandedState);

    const user = JSON.parse(localStorage.getItem('Exergy HRMData'));
    const formData = new FormData();
    formData.append('employeeId', user.employeeId);
    formData.append('companyId', 52);

    dispatch(addToggleState(formData))
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

  const handleToggleVisibility = () => {
    setShowDOB(!showDOB);
  };

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  var tableData = []

  useEffect(() => {
    if (!date.to || !date.from || !id) return;
    setLoading(true);
    const formdata = new FormData();
    formdata.append('employeeId', id);
    formdata.append('startDate', dayjs(date.from).format('YYYY-MM-DD'));
    formdata.append('endDate', dayjs(date.to).format('YYYY-MM-DD'));

    dispatch(getAttendanceById(formdata))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          const response = result.payload.DATA[0];
          const formattedData = result.payload.DATA[0].employeeDetail.map((item) => ({
            id: id,
            employeeName: response.employeeName,
            employeeId: response.employeeId,
            date: dayjs(item.date, 'DD/MM/YYYY').format('ddd D MMM, YYYY'),
            status: item.status,
            scheduled: `${item.shiftStartTime} - ${item.shiftEndTime}`,
            checkIn: item.checkInTime || '-',
            checkOut: item.checkOutTime || '-',
            checkInStatus: item.checkInStatus,
            checkOutStatus: item.checkOutStatus,
            shift: item.shiftLabel,
            totalWorked: item.totalWorked || '-',
            totalWorkedStatus: item.totalWorkedStatus,
            shiftLabel: item.shiftLabel || '-',
            shiftTotalHours: item.shiftTotalHours,
            workAnniversary: item.workAnniversary
              ? JSON.stringify(dayjs(item.workAnniversary).format('DD-MM-YYYY'))
              : '',
            employeeExperience: item.employeeExperience || '',
            exergylogin: item.employeeLastExergyHrmLogin,
            timesheetlogin: item.employeeLastTimesheetLogin,
            employeeBloodGroup: item.employeeBloodGroup || '',
            employeeDateOfBirth: item.employeeDateOfBirth
              ? JSON.stringify(dayjs(item.employeeDateOfBirth).format('DD-MM-YYYY'))
              : '',
            employeeLeaves: '',
            //this differnce is both for late and early arrival and departure
            latein: item.inDifference,
            earlyout: item.outDifference,
          }));
          setTableRows(formattedData);

          const formattedDetail = {
            ...response,
          };
          setEmployeeData(formattedDetail);
  
          setLoading(false);
          setAlert({
            open: true,
            severity: 'success',
            message: 'Retrieved employees list successfully',
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

    const obj = {
      employeeId: id,
      startDate: dayjs(date.from).format('YYYY-MM-DD'),
      endDate: dayjs(date.to).format('YYYY-MM-DD'),
    };

    dispatch(getAttendanceGrapghById(obj))
      .then((result) => {
        if (result.payload) {
          const response = result.payload;
          setChartData(response);
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
  }, [searchTrigger, id]);

  //leave data fetching is done here and also toggling
  useEffect(() => {
    const transformLeaveData = (data) => {
      const leaveQuota = {
        annualLeaves: 0,
        casualLeaves: 0,
        medicalLeaves: 0,
      };

      const remainingLeaves = {
        annualLeavesRemaining: 0,
        casualLeavesRemaining: 0,
        medicalLeavesRemaining: 0,
      };

      if (data.leaveDetails) {
        data.leaveDetails.forEach((leave) => {
          if (leave.leaveType === 'Annual') {
            leaveQuota.annualLeaves = leave.leaveQuota;
            remainingLeaves.annualLeavesRemaining = leave.remainingLeaves;
          } else if (leave.leaveType === 'Casual') {
            leaveQuota.casualLeaves = leave.leaveQuota;
            remainingLeaves.casualLeavesRemaining = leave.remainingLeaves;
          } else if (leave.leaveType === 'Medical') {
            leaveQuota.medicalLeaves = leave.leaveQuota;
            remainingLeaves.medicalLeavesRemaining = leave.remainingLeaves;
          }
        });

        const transformedData = {
          SUCCESS: 1,
          DATA: [
            {
              annualTotal: leaveQuota.annualLeaves,
              casualTotal: leaveQuota.casualLeaves,
              medicalTotal: leaveQuota.medicalLeaves,
              annualRemainingTotal: remainingLeaves.annualLeavesRemaining,
              casualRemainingTotal: remainingLeaves.casualLeavesRemaining,
              medicalRemainingTotal: remainingLeaves.medicalLeavesRemaining,
            },
          ],
        };

        return transformedData;
      } else {
        const transformedData = {
          SUCCESS: 1,
          DATA: [
            {
              annualTotal: '',
              casualTotal: '',
              medicalTotal: '',
              annualRemainingTotal: '',
              casualRemainingTotal: '',
              medicalRemainingTotal: '',
            },
          ],
        };
        return transformedData;
      }
    };

    const formData = new FormData();
    formData.append('employeeId', id);
    dispatch(getPendingLeaveQuotaByCompanyId(formData))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          const transformedData = transformLeaveData(result.payload.DATA);
          setLeaveQuota(transformedData.DATA[0]);
        } else {
          console.error('Failed to fetch leave quotas:', result.payload.MESSAGE);
        }
      })
      .catch((err) => {
        console.error('An error occurred while fetching leave quotas:', err);
      });

    const formData2 = new FormData();
    formData2.append('employeeId', id);
    formData2.append('companyId', 52);
    dispatch(getToggleState(formData2))
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
        setLoading(false);
        setAlert({
          open: true,
          severity: 'error',
          message: err.USER_MESSAGE || 'Something went wrong.',
        });
      });
  }, [searchTrigger, id]);
useEffect(()=>{
    console.log('table rows is uodated')
},[tableRows])
  return !loading ? (
    <main className={`py-10 w-full ${customW ? 'max-w-full' : 'max-w-[85%]'} mx-auto`}>
      {/*Header info of the employee */}
      <Stack direction={'row'} gap={4} alignItems={'center'} width={'full'}>
        <div>
          <Avatar
            sx={{ width: 160, height: 160 }}
            src={`http://122.248.194.140:8081/ExergyHRM/Users/GetProfileImageByFileName?fileName=${employeeData.profileFileName}`}
          />
        </div>
        <div className="mt-3 w-[34%]">
          <Typography variant="h3">{employeeData.employeeName}</Typography>
          <Typography variant="h5" className="text-zinc-500 mt-3">
            {employeeData.employeeDesignationLabel}
          </Typography>
          <Typography variant="h6" className="text-[#3f50b5] mt-3">
            DOB: {showDOB ? employeeData.employeeDateOfBirth : '*****'}
            <button onClick={handleToggleVisibility}>
              {showDOB ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
            </button>
          </Typography>
          <Typography variant="h6" className="text-[#3f50b5] mt-3">
            <Typography variant="h6" className="text-zinc-800">
              Last Login:
            </Typography>
            {employeeData.employeeLastExergyHrmLogin}
          </Typography>
          <button
            onClick={handleDialogOpen}
            className="mt-1 bg-blue-500 border p-1 text-white rounded-md"
          >
            Complete Details
          </button>

          {show && (
            <FullscreenDialog
              image={employeeData.profileFileName}
              name={employeeData.employeeName}
              open={show}
              setOpen={setShow}
              title="Survey Data"
            >
              <Survey
                id={id}
                image={employeeData.profileFileName}
                designation={employeeData.employeeDesignationLabel}
                email={employeeData.employeeEmail}
              />
            </FullscreenDialog>
          )}
        </div>
        <div className="flex flex-row gap-4 w-full">
          <div className="mt-3 text-zinc-500 flex flex-col gap-3">
            <div className="bg-yellow-50 p-2 flex flex-row items-center justify-start rounded-xl gap-2">
              <div className="rounded-md bg-[#10b981] p-2">
                <FaPhoneAlt className="text-md text-white" />
              </div>
              <div className="flex flex-col items-start">
                <Typography variant="h6" fontWeight={800}>
                  {employeeData.employeeContactNo}
                </Typography>
                <Typography sx={{ color: 'grey' }}>Contact Info</Typography>
              </div>
            </div>
            <div className="bg-yellow-50 p-2 flex flex-row items-center justify-start rounded-xl gap-2">
              <div className="rounded-md bg-[#10b981] p-2">
                <FaEnvelope className="text-md text-white" />
              </div>
              <div className="flex flex-col items-start">
                <Typography variant="h6" fontWeight={800}>
                  {employeeData.employeeEmail}
                </Typography>
                <Typography sx={{ color: 'grey' }}>Email</Typography>
              </div>
            </div>
            {employeeData.cnicNumber && (
              <div className="bg-yellow-50 p-2 flex flex-row items-center justify-start rounded-xl gap-2">
                <div className="rounded-md bg-[#10b981] p-2">
                  <FaIdCard className="text-md text-white" />
                </div>
                <div className="flex flex-col items-start">
                  <Typography variant="h6" fontWeight={800}>
                    {employeeData.cnicNumber}
                  </Typography>
                  <Typography sx={{ color: 'grey' }}>CNIC Number</Typography>
                </div>
              </div>
            )}
          </div>
          <div className=" text-zinc-500 flex flex-col gap-2 w-[28%] mb-3">
            {employeeData.employeeDateOfJoining ? (
              <div className="bg-yellow-50 p-2 mt-2 flex flex-row items-center justify-start rounded-xl gap-2">
                <div className="rounded-md bg-[#facc15] p-2">
                  <FaCalendarAlt className="text-md text-white" />
                </div>
                <div className="flex flex-col items-start">
                  <Typography variant="h7" fontWeight={800}>
                    {customW
                      ? formatDate(employeeData.employeeDateOfJoining)
                      : employeeData.employeeDateOfJoining}
                  </Typography>
                  <Typography sx={{ color: 'grey' }}>Joining Date</Typography>
                </div>
              </div>
            ) : null}

            {employeeData.employeeBloodGroup ? (
              <div className="bg-yellow-50 p-2 flex flex-row items-center justify-start rounded-xl gap-2 mb-2 ">
                <div className="rounded-md bg-[#e11d48] p-2">
                  <FaHeartbeat className="text-md text-white" />
                </div>
                <div className="flex flex-col items-start">
                  <Typography variant="h6" fontWeight={800}>
                    {employeeData.employeeBloodGroup}
                  </Typography>
                  <Typography sx={{ color: 'grey' }}>Blood Group</Typography>
                </div>
              </div>
            ) : null}

            {employeeData.emergencyNumber && (
              <div className="bg-yellow-50 p-2 flex flex-row items-center justify-start rounded-xl gap-2">
                <div className="rounded-md bg-[#10b981] p-2">
                  <FaExclamationTriangle className="text-md text-white" />
                </div>
                <div className="flex flex-col items-start">
                  <Typography variant="h7" fontWeight={800}>
                    {employeeData.emergencyNumber}
                  </Typography>
                  <Typography sx={{ color: 'grey' }}>Emergency No</Typography>
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 text-zinc-500 flex flex-col gap-3  w-[28%]">
            {leaveQuota?.length !== 0 ? (
              <div
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                className="bg-yellow-50 p-2 flex flex-row items-center justify-start rounded-xl gap-2 "
              >
                <div className="rounded-md bg-[#e11d48] p-2">
                  <FaRegCalendarCheck className="text-md text-white" />
                </div>
                <div className="flex flex-col items-start">
                  <Typography variant="h6" fontWeight={800}>
                    {leaveQuota?.medicalRemainingTotal
                      ? leaveQuota?.medicalRemainingTotal +
                        leaveQuota?.casualRemainingTotal +
                        leaveQuota?.annualRemainingTotal
                      : 'N/A'}
                  </Typography>
                  <Typography sx={{ color: 'grey' }}>Leaves</Typography>
                </div>
              </div>
            ) : null}

            {employeeData.employeeExperience ? (
              <div className="bg-yellow-50 p-2 flex flex-row items-center justify-start rounded-xl gap-2 ">
                <div className="rounded-md bg-[#facc15] p-2">
                  <FaRegClock className="text-md text-white" />
                </div>
                <div className="flex flex-col items-start">
                  <Typography variant="h6" fontWeight={800}>
                    {employeeData.employeeExperience}
                  </Typography>
                  <Typography sx={{ color: 'grey' }}>Years of Impact</Typography>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </Stack>

      {/*Attendance Machine Summary */}
      <Paper className="pb-5 mt-10 border">
        {/*The header */}
        <Stack
          pt={2}
          direction={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
          className={`px-10 ${expanded ? 'border-b ' : ''}`}
        >
          <Typography color={'primary.main'} variant="h4" className="mt-2">
            Attendance Insights
          </Typography>
          <div className="bg-blue-50 px-4 py-4 rounded-xl mb-3 w-[28%]">
            <Typography variant="h5" fontWeight={800}>
              {employeeData.totalWorked}
            </Typography>
            <Typography sx={{ color: 'grey' }}>Scheduled</Typography>
          </div>

          {employeeData &&
            employeeData.shiftName &&
            employeeData.employeeDetail.length > 0 && (
              <div className="bg-blue-50 px-4 py-4 rounded-xl mb-3 w-[28%]">
                <Typography variant="h5" fontWeight={800}>
                  {employeeData.shiftName[0]}
                </Typography>
                <Typography sx={{ color: 'grey' }}>Shift Assigned</Typography>
              </div>
            )}
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
        {/*The dropdown content */}
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <div className="px-10">
            <div className="grid grid-cols-4 gap-6 mt-4">
              <div className="bg-gray-50 px-4 py-4 rounded-xl">
                <Typography variant="h5" fontWeight={800}>
                  {employeeData.shiftTotalWorkingTime}
                </Typography>
                <Typography sx={{ color: 'grey' }}>Scheduled Till Date</Typography>
              </div>
              <div className="bg-gray-50 px-4 py-4 rounded-xl">
                <Typography variant="h5" fontWeight={800}>
                  {employeeData.totalWorked}
                </Typography>
                <Typography sx={{ color: 'grey' }}>Worked</Typography>
              </div>
              <div className="bg-gray-50 px-4 py-4 rounded-xl">
                <Typography variant="h5" fontWeight={800}>
                  {employeeData.differnce}
                </Typography>
                <Typography sx={{ color: 'grey' }}>Difference</Typography>
              </div>
              <div className="bg-gray-50 px-4 py-4 rounded-xl">
                <Typography variant="h5" fontWeight={800}>
                  {employeeData.totalAttendenceIncompleteRecords}
                </Typography>
                <Typography sx={{ color: 'grey' }}>Missing Records</Typography>
              </div>
              <div className="bg-gray-50 px-4 py-4 rounded-xl">
                <div className="flex items-center gap-2">
                  <Typography variant="h5" fontWeight={800}>
                    {employeeData.totalDelaysTime}
                  </Typography>
                  <Typography sx={{ color: 'grey' }}>
                    ({employeeData.totalDelays} Late Ins)
                  </Typography>
                </div>
                <Typography sx={{ color: 'grey' }}>Late Arrivals</Typography>
              </div>
              <div className="bg-gray-50 px-4 py-4 rounded-xl">
                <div className="flex items-center gap-2">
                  <Typography variant="h5" fontWeight={800}>
                    {employeeData.totalShortageTime}
                  </Typography>
                  <Typography sx={{ color: 'grey' }}>
                    ({employeeData.totalShortage} early outs)
                  </Typography>
                </div>
                <Typography sx={{ color: 'grey' }}>Early Leaves</Typography>
              </div>

              {employeeData.totalMissedShifts !== 0 ? (
                <>
                  <div className="bg-gray-50 px-4 py-4 rounded-xl">
                    <Typography variant="h5" fontWeight={800}>
                      {employeeData.totalMissedShifts}
                    </Typography>
                    <Typography sx={{ color: 'grey' }}>Missed Shifts</Typography>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6">
                    <div className="bg-gray-50 px-4 py-4 rounded-xl">
                      <Typography variant="h5" fontWeight={800}>
                        {employeeData.totalAttendencePresents}
                      </Typography>
                      <Typography sx={{ color: 'grey' }}>Presents</Typography>
                    </div>
                    <div className="bg-gray-50 px-4 py-4 rounded-xl">
                      <Typography variant="h5" fontWeight={800}>
                        {employeeData.totalAttendenceAbsence}
                      </Typography>
                      <Typography sx={{ color: 'grey' }}>Absence</Typography>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-x-6">
                    <div className="bg-gray-50 px-4 py-4 rounded-xl">
                      <Typography variant="h5" fontWeight={800}>
                        {employeeData.totalAttendencePresents}
                      </Typography>
                      <Typography sx={{ color: 'grey' }}>Presents</Typography>
                    </div>
                    <div className="bg-gray-50 px-4 py-4 rounded-xl">
                      <Typography variant="h5" fontWeight={800}>
                        {employeeData.totalAttendenceAbsence}
                      </Typography>
                      <Typography sx={{ color: 'grey' }}>Absence</Typography>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-4 rounded-xl">
                    <Typography variant="h5" fontWeight={800}>
                      {employeeData.approvedLeaves}
                    </Typography>
                    <Typography sx={{ color: 'grey' }}>Leaves Taken</Typography>
                  </div>
                </>
              )}
            </div>
          </div>
          <Divider className="py-4" />
          <div>{tableRows.length > 0 && <AttendanceDetailTable tableRows={tableRows} />}</div>
        </Collapse>
      </Paper>  

      {/*The insights into the employee data */}
      {chartData && (
        <Insights
          name={employeeData.employeeName}
          time={employeeData.employeeLastTimesheetLogin}
          date={date}
          setDate={setDate}
          setSearchTrigger={setSearchTrigger}
          data={chartData}
          id={employeeData.employeeId}
        />
      )}

      {/*The leave popover for the employee */}
      <Popover
        id="mouse-over-popover"
        sx={{ pointerEvents: 'none', marginRight: 5, marginTop: 1 }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Leave Type</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">Leaves Left</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography>Medical</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography>{leaveQuota?.medicalRemainingTotal}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography>Casual</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography>{leaveQuota?.casualRemainingTotal}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography>Annual</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography>{leaveQuota?.annualRemainingTotal}</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Popover>
    </main>
  ) : (
    <Loader />
  );
}
