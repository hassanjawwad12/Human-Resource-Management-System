import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
  Paper,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { visuallyHidden } from '@mui/utils';
import { styled } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import AlertMessage from '../../../../components/shared/AlertMessage';
import { useNavigate } from 'react-router';
import { deleteById, getAllAttendances } from '../../../../store/attendance/AttendanceSlice';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'date',
    numeric: false,
    disablePadding: false,
    label: 'Date',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Status',
  },
  {
    id: 'scheduled',
    numeric: false,
    disablePadding: false,
    label: 'Scheduled',
  },

  {
    id: 'checkIn',
    numeric: false,
    disablePadding: false,
    label: 'Check In',
  },

  {
    id: 'checkOut',
    numeric: false,
    disablePadding: false,
    label: 'Check Out',
  },
  {
    id: 'difference',
    numeric: false,
    disablePadding: false,
    label: 'Total Worked',
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
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
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const AttendanceDetailTable = ({ tableRows }) => {
  console.log(tableRows)
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [toggle, setToggle] = React.useState(false);
  const [alert, setAlert] = React.useState({
    open: false,
    severity: '',
    message: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Fetch Products

  const getAttendances = useSelector((state) => state.attendanceReducer.attendanceList);

  const [rows, setRows] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setRows(tableRows);
  }, [tableRows]);

  const handleSearch = (event) => {
    const filteredRows = getAttendances.filter((row) => {
      return (
        row.employeeName.toLowerCase().includes(event.target.value.toLowerCase()) ||
        row.date.toLowerCase().includes(event.target.value.toLowerCase()) ||
        row.status.toLowerCase().includes(event.target.value.toLowerCase()) ||
        row.scheduled.toLowerCase().includes(event.target.value.toLowerCase()) ||
        row.checkIn.toLowerCase().includes(event.target.value.toLowerCase()) ||
        row.checkOut.toLowerCase().includes(event.target.value.toLowerCase()) ||
        row.difference.toLowerCase().includes(event.target.value.toLowerCase())
      );
    });
    setSearch(event.target.value);
    setRows(filteredRows);
  };
  // This is for the sorting
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // This is for select all the row
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.title);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      borderBottom: '1px solid #e5eaef',
    },
  }));
  function getBackgroundColor(status) {
    switch (status) {
      case 'Absent':
        return 'bg-red-200 text-[red]';
      case 'Present':
        return 'bg-green-200 text-[green]';
      case 'Company Day Off':
        return 'bg-[#e3efff] text-[#0197f6]';
      case 'Public Holiday':
        return 'bg-[#ececf9] text-[purple]';
      default:
        console.warn(`Unknown status: ${status}`);
        return 'bg-gray-200'; // Or any default color
    }
  }
  const deleteAttendance = async (id) => {
    let formData = new FormData();
    formData.append('id', id);
    dispatch(deleteById(formData))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          setToggle(!toggle);
          setAlert({
            open: true,
            severity: 'success',
            message: result.payload.USER_MESSAGE,
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
        setAlert({
          open: true,
          severity: 'error',
          message: err.USER_MESSAGE || 'Something went wrong.',
        });
      });
  };

  return (
    <Box className="mt-5">
      <AlertMessage
        open={alert.open}
        setAlert={setAlert}
        severity={alert.severity}
        message={alert.message}
      />
      <Paper sx={{ mx: 0, mt: 3 }}>
        <Paper variant="outlined">
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? 'small' : 'medium'}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <StyledTableRow key={row.id}>
                        <TableCell>
                          <Typography fontWeight={600}>{row.date}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            className={`px-1 rounded-md text-center max-w-[5rem] ${getBackgroundColor(
                              row.status,
                            )}`}
                          >
                            {row.status || 'Absent'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box
                            fontSize={12}
                            className={`rounded-md border-l-[1rem] ${
                              row.shiftLabel !== '-' ? 'border-purple-200' : 'border-yellow-200'
                            } bg-gray-100 px-3 py-1 w-[11rem] '`}
                          >
                            <Typography fontSize={12} fontWeight={600}>
                              {row.shiftLabel !== '-' ? row.scheduled : 'No shift Assigned.'}
                            </Typography>
                            <Box
                              className="flex items-center justify-between w-full text-zinc-400"
                              fontSize={11}
                            >
                              <Typography fontSize={11} className="flex items-center gap-1">
                                <AccessTimeIcon sx={{ fontSize: '.8rem' }} />
                                {row.shiftTotalHours}
                              </Typography>
                              {
                                <Typography
                                  fontSize={11}
                                  className={`flex items-center gap-1 ${
                                    row.shiftLabel !== '-' ? '' : 'opacity-0'
                                  }`}
                                >
                                  Shift:
                                  <Tooltip title={row.shiftLabel}>
                                    <span className="bg-purple-200 w-4 h-4 rounded-full flex items-center justify-center text-[.6rem] text-black font-bold">
                                      {row.shiftLabel.charAt(0)}
                                    </span>
                                  </Tooltip>
                                </Typography>
                              }
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box
                            className={`grid max-w-[10rem] items-center ${
                              row.checkIn !== '-' && row.shiftLabel !== '-' ? 'grid-cols-2' : 'pl-2'
                            } gap-1 `}
                          >
                            <Typography>{row.checkIn}</Typography>
                            {row.checkIn !== '-' && (
                              <div
                                className={`px-1 py-1 flex flex-col rounded-md text-center ${
                                  row.checkInStatus === 'Timely In'
                                    ? 'bg-green-200 text-[green]'
                                    : 'bg-red-200 text-[red]'
                                }`}
                              >
                                <Typography variant="h7">{row.checkInStatus}</Typography>
                                {/*this is where the difference will come */}
                                <Typography variant="h8" className=" text-yellow-900">
                                  {row.latein}
                                </Typography>
                              </div>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box
                            className={`grid max-w-[10rem] items-center ${
                              row.checkOut !== '-' && row.shiftLabel !== '-'
                                ? 'grid-cols-2'
                                : 'pl-2'
                            } gap-1 `}
                          >
                            <Typography>{row.checkOut}</Typography>
                            {row.checkOut !== '-' && (
                              <div
                                className={`px-1 py-1 rounded-md text-center ${
                                  row.checkOutStatus === 'Timely Out'
                                    ? 'bg-green-200 text-[green]'
                                    : 'bg-red-200 text-[red]'
                                }`}
                              >
                                <Typography variant="h7">{row.checkOutStatus}</Typography>
                                {/*this is where the difference will come */}
                                <Typography variant="h8" className=" text-yellow-900">
                                  {' '}
                                  {row.earlyout}{' '}
                                </Typography>
                              </div>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box className={`flex flex-col pl-5`}>
                            {row.totalWorked !== '0hr 0m' && (
                              <>
                                <Typography
                                  className={`${
                                    row.totalWorked !== '-' || row.totalWorked !== '0hr 0m'
                                      ? 'text-blue-600'
                                      : ''
                                  }`}
                                >
                                  {row.totalWorked}
                                </Typography>

                                <Typography
                                  fontSize={11}
                                  className={`${
                                    row.totalWorkedStatus?.startsWith('+')
                                      ? 'text-green-600'
                                      : row.totalWorkedStatus?.startsWith('-')
                                      ? 'text-red-600'
                                      : 'text-gray-600'
                                  }`}
                                >
                                  {row.totalWorkedStatus}
                                </Typography>
                              </>
                            )}
                          </Box>
                        </TableCell>
                      </StyledTableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                    <TableCell colSpan={7} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Paper>
    </Box>
  );
};

export default AttendanceDetailTable;
