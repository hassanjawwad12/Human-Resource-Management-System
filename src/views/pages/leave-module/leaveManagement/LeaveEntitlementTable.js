import React from 'react';
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
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmDeleteModal from '../../hr-module/ConfirmDeleteModal';

function EnhancedTableHead(props) {
  const { data, order, orderBy, onRequestSort } = props;

  const generateLeaveTypeHeadCells = (leaveTypes) => {
    return leaveTypes.slice(0,3).map((leaveType) => ({
      id: `leaveType_${leaveType.leaveTypeLabel}`,
      numeric: true, 
      disablePadding: false,
      label: leaveType.leaveTypeLabel,
    }));
  };

  const staticHeadCells = [
    { id: 'Leave Name', numeric: false, disablePadding: false, label: 'Leave Name' },
    { id: 'description', numeric: false, disablePadding: false, label: 'Description' },
  ];

  const restHeadCells = [

    { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' },
  ];

  const headCells = [
    ...staticHeadCells,
    ...generateLeaveTypeHeadCells( data.length>0 ? data[0]?.leaveTypes: []),
    ...restHeadCells
  ];

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ fontSize: '13px', fontWeight: '500', opacity: 0.7, whiteSpace: 'nowrap' }}
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

//all the api for the editing , adding and deleting are called in the main page
const LeaveEntitlementTable = ({
  entitlements,
  handleEditEntitlement,
  handleDeleteEntitlement,
  search,
  loading,
}) => {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [leaveToDelete, setLeaveToDelete] = React.useState(null);

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

  const filteredEntitlements = entitlements.filter(
    (entitlement) =>
      entitlement.name.toLowerCase().includes(search.toLowerCase()) ||
      entitlement.description.toLowerCase().includes(search.toLowerCase()),
  );

  const openDeleteConfirmationModal = (leaveData) => {
    setLeaveToDelete(leaveData);
    setDeleteModalOpen(true);
  };
  const confirmDeleteEntitlement = () => {
    handleDeleteEntitlement(leaveToDelete.companyLeaveId);
    setDeleteModalOpen(false);
  };

  return (
    <Paper variant="outlined" sx={{ width: '100%', mb: 2 }}>
      <ConfirmDeleteModal
        open={deleteModalOpen}
        handleClose={() => setDeleteModalOpen(false)}
        handleConfirm={confirmDeleteEntitlement}
        title="Confirm Delete Leave Entitlement"
        content={`Are you sure you want to delete the entitlement "${leaveToDelete?.name}"? This action cannot be undone.`}
      />
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
          <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} data={entitlements} />
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Box textAlign="center" py={3}>
                    <CircularProgress />
                  </Box>
                </TableCell>
              </TableRow>
            ) : filteredEntitlements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Box textAlign="center" py={1}>
                    <Typography color="textSecondary">No entitlements found</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              filteredEntitlements
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <StyledTableRow key={row.companyLeaveId}>
                    <TableCell>
                      <Typography fontWeight={600}>{row.name}</Typography>
                    </TableCell>
                    <TableCell>{row.description}</TableCell>
                    {row.leaveTypes.slice(0,3).map((leaveType, index) => (
                      <TableCell textAlign={'end'} key={index}>{leaveType.totalDays}</TableCell>
                    ))}
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => handleEditEntitlement(row)}
                          sx={{ color: 'primary.main' }}
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => {
                            openDeleteConfirmationModal(row);
                          }}
                          sx={{ color: '#FA896B' }}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </StyledTableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredEntitlements.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default LeaveEntitlementTable;
