import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import { format } from 'date-fns';
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
  Toolbar,
  IconButton,
  Typography,
  Paper,
  Stack,
  Button,
  Avatar,
} from '@mui/material';
import { IconEdit } from '@tabler/icons';
import dayjs from 'dayjs'
import { visuallyHidden } from '@mui/utils';
import { styled } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import { IconDotsVertical, IconFilter, IconSearch, IconTrash } from '@tabler/icons';
import { useNavigate } from 'react-router';
import EditIcon from '@mui/icons-material/Edit';
import { AddComment, Rowing } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import ContactAdd from '../../../../components/apps/contacts/ContactAdd';
import EditScheduleModal from './EditScheduleModal';
import EnhancedTableToolbar from './EnhancedTableToolbar';
import { width } from '@mui/system';
import { data } from './Data';


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
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Name',

  },
  // {
  //   id: 'email',
  //   numeric: false,
  //   disablePadding: false,
  //   label: 'Email',
  //   width: '1rem'
  // },
  {
    id: 'contactNo',
    numeric: false,
    disablePadding: false,
    label: 'Contact',

  },
  {
    id: 'occupation',
    numeric: false,
    disablePadding: false,
    label: 'Occupation',

  },
  {
    id: 'cnicNo',
    numeric: false,
    disablePadding: false,
    label: 'National ID',

  },
  {
    id: 'workingDays',
    numeric: false,
    disablePadding: false,
    label: 'Working Days',

  },
  {
    id: 'workingHours',
    numeric: false,
    disablePadding: false,
    label: 'Working Hours',

  },
  {
    id: 'hourlyRate',
    numeric: false,
    disablePadding: false,
    label: 'Hourly Rate',

  },
  // {
  //   id: 'actions',
  //   numeric: false,
  //   disablePadding: false,
  //   label: 'Edit Schedule',
  //   width: '.2rem'
  // }
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
            sx={{ fontSize: '13px', fontWeight: '500', opacity: .7, whiteSpace: 'nowrap', width: headCell.width }}
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



const SelectedEmployees = ({ showToolbar, title }) => {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [alert, setAlert] = React.useState({
    open: false,
    severity: '',
    message: ''
  });
  const [open, setIsOpen] = React.useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modalData, setModaldata] = React.useState(null)


  const getCandidates = useSelector((state) => state.candidatesReducer.selectedCandidatesList);


  const [rows, setRows] = React.useState([]);

  const [search, setSearch] = React.useState('');


  const [date, setDate] = React.useState({
    from: '',
    to: ''
  });


  React.useEffect(() => {
    setRows(getCandidates);
  }, []);

  React.useEffect(() => {
    let filteredRows = [...getCandidates] // Start with the original data

    if (date.from !== '' && date.to !== '') {
      const fromDate = dayjs(date.from, 'DD/MM/YYYY');
      const toDate = dayjs(date.to, 'DD/MM/YYYY');

      filteredRows = filteredRows.filter((row) => {
        const workdayStart = dayjs(row.workdayStart, 'DD/MM/YYYY');
        const workdayEnd = dayjs(row.workdayEnd, 'DD/MM/YYYY');

        return (workdayStart.isBetween(fromDate, toDate, null, '[]') || workdayEnd.isBetween(fromDate, toDate, null, '[]') ||
          (workdayStart.isBefore(fromDate) && workdayEnd.isAfter(toDate)));
      });
    }

    if (search.trim() !== '') {
      const searchValue = search.toLowerCase();
      filteredRows = filteredRows.filter((row) => {
        const rowValues = Object.values(row).join(' ').toLowerCase(); //??????
        return rowValues.includes(searchValue);
      });
    }

    setRows(filteredRows);
    setPage(0)
  }, [date.to, date.from, search]);


  const handleSearchChange = (event) => {
    setSearch(event.target.value);
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

  const openModal = (id) => {
    setIsOpen(true)
    const candidate = rows.find(a => a.id === id)
    setModaldata(candidate)
  }

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));


  return (
    <Box>
      {open && <EditScheduleModal open={open} setIsOpen={setIsOpen} row={modalData} />}
      <Box>
        {showToolbar &&
          <EnhancedTableToolbar
            title={title}
            numSelected={selected.length}
            search={search}
            handleSearch={(event) => handleSearchChange(event)}
            date={date}
            setDate={setDate}
          />}
        <Paper variant="outlined">
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={'small'}
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
                    const isItemSelected = isSelected(row.title);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <StyledTableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={index}
                        selected={isItemSelected}
                      >
                        <TableCell>
                          <Box className='flex gap-2 w-full items-center'>
                            <Avatar sx={{ width: '35px', height: '35px' }} />



                            <Typography sx={{ whiteSpace: 'nowrap', fontWeight: 600 }}>{row.fullName}</Typography>
                          </Box>
                        </TableCell>

                        {/* <TableCell sx={{ width: headCells[1].width }}>
                          <Typography>{row.email}</Typography>
                        </TableCell> */}

                        <TableCell>
                          <Typography>{row.contactNo || '3213847233'}</Typography>
                        </TableCell>

                        <TableCell >
                          <Typography>{row.occupationLabel || '-'}</Typography>
                        </TableCell>

                        <TableCell>
                          <Typography>{row.cnicNo || '34201-3233-1'}</Typography>
                        </TableCell>
                        <TableCell >
                          <Typography>{row.startDate} to {row.endDate}</Typography>
                        </TableCell>

                        <TableCell>
                          <Typography>
                            {`${dayjs(row.startTime.join(':'), 'HH:mm').format('hh:mmA')}
                             to 
                            ${dayjs(row.endTime.join(':'), 'HH:mm').format('hh:mmA')}`}</Typography>
                        </TableCell>


                        <TableCell sx={{ width: headCells[6].width, pl: '1.7rem' }}>
                          <Typography>£{row.hourlyRate}</Typography>
                        </TableCell>
                        {/* <TableCell sx={{ pl: 4, width: headCells[7].width }}>
                          <Typography>
                            <IconButton onClick={() => openModal(row.id)}>
                              <EditIcon color='primary' size='small' />
                            </IconButton></Typography>
                        </TableCell> */}
                      </StyledTableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
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
      </Box>

    </Box>
  );
};

export default SelectedEmployees;