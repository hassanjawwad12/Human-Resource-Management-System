import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  Typography,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { getAllLeaveRequests } from '../../../../store/leave/LeaveSlice';
import Allowed from './LeaveApproval/Allowed';
import Details from './LeaveApproval/Details'

const headCells = [
  { id: 'id', numeric: false, disablePadding: false, label: 'ID' },
  { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'Leave Reason', numeric: false, disablePadding: false, label: 'Leave Reason' },
  { id: 'Start Date', numeric: false, disablePadding: false, label: 'Start Date' },
  { id: 'End Date', numeric: false, disablePadding: false, label: 'End Date' },
  { id: 'Status', numeric: false, disablePadding: false, label: 'Status' },
  { id: 'Actions', numeric: false, disablePadding: false, label: 'Actions' },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            sx={{ fontSize: '13px', fontWeight: '500', opacity: 0.7, whiteSpace: 'nowrap' }}
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const Approval = () => {
  const [count, setCount] = useState(0);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [alert, setAlert] = useState({
    open: false,
    severity: '',
    message: '',
  });

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const formData = new FormData();
    formData.append('companyId', 52);
    dispatch(getAllLeaveRequests(formData))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          setData(result.payload.DATA);
          setLoading(false);
        } else {
          setAlert({
            open: true,
            severity: 'error',
            message: result.payload.MESSAGE || 'Failed to fetch employees.',
          });
        }
      })
      .catch((err) => {
        console.error(err);
        setAlert({
          open: true,
          severity: 'error',
          message: 'An error occurred while fetching employees.',
        });
      });
  }, [count]);

  return (
    <div className="flex flex-col gap-6 mt-5">
      <Typography variant="h4" fontWeight={800} className='text-[#3f50b5]'>
        Leave Applied by Employees
      </Typography>
      <Paper variant="outlined" sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
            <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Box textAlign="center" py={3}>
                      <CircularProgress />
                    </Box>
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Box textAlign="center" py={1}>
                      <Typography color="textSecondary">No pending leave requests</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <StyledTableRow key={row.companyLeaveId}>
                       <TableCell>
                        {row.employeeId}
                      </TableCell>
                      <TableCell>
                        {row.employeeFullName}
                      </TableCell>
                      <TableCell>{row.commonLeaveTypeLabel}</TableCell>
                      <TableCell>{row.fromDate}</TableCell>
                      <TableCell>{row.toDate}</TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            color:
                              row.status === 'Pending'
                                ? '#3f50b5'
                                : row.status === 'Approved'
                                ? '#10b981'
                                : '#e11d48',
                                fontSize: '16px'
                          }}
                          className=" font-bold"
                        >
                          {row.status}
                        </Typography>
                      </TableCell>

                      {row.status === 'Pending'  ? 
                      <>
                        <TableCell>
                          <div className="flex flex-row">
                            <Tooltip title="Approve">
                              <Allowed count={count} setCount={setCount} flag={1}  data={row} />
                            </Tooltip>
                            <Tooltip title="Delete">
                              <Allowed count={count} setCount={setCount} flag={0} data={row} />
                            </Tooltip>
                          </div>
                        </TableCell>
                      </>: <>
                      <TableCell>
                     
                        <Details data={row} />
                      </TableCell>
                      </>
                       
                      }
                    </StyledTableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default Approval;
