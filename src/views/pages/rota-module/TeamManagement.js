import React, { useState, useCallback, useEffect, useRef } from 'react';
import './managementStyles.css';
import { OrgChart } from 'd3-org-chart';
import * as d3 from 'd3';
import {
  Box,
  Button,
  Divider,
  IconButton,
  TextField,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Avatar,
  Grid,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ViewCompactIcon from '@mui/icons-material/ViewCompact';
import ViewComfyIcon from '@mui/icons-material/ViewComfy';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import DateRangeIcon from '@mui/icons-material/DateRange';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import dayjs from 'dayjs';
import { getEmployeeHierarchy, saveEmployeeHierarchy } from '../../../store/hr/EmployeeSlice';


import { useDispatch } from 'react-redux';
import AlertMessage from '../../../components/shared/AlertMessage';
import AttendanceDetail from '../attendance-module/manualAttendance/AttendanceDetail';
import FullscreenDialog from '../../../components/material-ui/dialog/FullscreenDialog';


export default function TeamManagement() {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState({
    open: false,
    severity: '',
    message: '',
  });
  const dragEnabled = useRef(false);
  const [showActions, setShowActions] = useState(false);
  const [undoActions, setUndoActions] = useState([]);
  const [redoActions, setRedoActions] = useState([]);
  const [isCompact, setIsCompact] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);


  const chartContainerRef = useRef();
  const dataRef = useRef();
  const chartRef = useRef();
  const dragNodeRef = useRef(null);
  const dropNodeRef = useRef(null);
  const dragStartXRef = useRef(0);
  const dragStartYRef = useRef(0);
  const isDragStartingRef = useRef(false);


  useEffect(() => {
    dispatch(getEmployeeHierarchy())
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          const transformedResult = result.payload.employees.map(
            ({ parent_id: parentId, id, ...rest }) => ({
              ...rest,
              parentId: parentId ? parentId : '',
              id: id.toString(),
              imageUrl: rest.profile_file_name?`http://122.248.194.140:8081/ExergyHRM/Users/GetProfileImageByFileName?fileName=${rest.profile_file_name}`:''
            }),
          );
          setData(transformedResult);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [dispatch]);


  console.log(data);
  const openEmployeeDialog = useCallback(
    (employeeId) => {
      const employee = data.find((e) => e.id === employeeId);
      setSelectedEmployee(employee);
      setDialogOpen(true);
    },
    [data],
  );


  useEffect(() => {
    if (data.length > 0) {
      initializeChart();
    }
  }, [data, openEmployeeDialog]);


  useEffect(() => {
    if (chartRef.current) {
      filterChart(searchTerm);
    }
  }, [searchTerm]);


  function initializeChart() {
    const chart = new OrgChart()
      .nodeHeight((d) => 110)
      .nodeWidth((d) => 222)
      .childrenMargin((d) => 50)
      .compactMarginBetween((d) => 35)
      .compactMarginPair((d) => 30)
      .neighbourMargin((d) => 20)
      .nodeContent((d) => generateContent(d))
      .nodeEnter(function (node) {
        d3.select(this).call(
          d3
            .drag()
            .filter(function (x, node) {
              return dragEnabled.current && this.classList.contains('draggable');
            })
            .on('start', function (d, node) {
              onDragStart(this, d, node);
            })
            .on('drag', function (dragEvent, node) {
              onDrag(this, dragEvent);
            })
            .on('end', function (d) {
              onDragEnd(this, d);
            }),
        );
      })
      .nodeUpdate(function (d) {
        if (d.id === '101') {
          d3.select(this).classed('droppable', false);
        } else {
          d3.select(this).classed('droppable', true);
        }


        if (d.id === '100' || d.id === '101') {
          d3.select(this).classed('draggable', false);
        } else {
          d3.select(this).classed('draggable', true);
        }
      })
      .linkUpdate(function (d) {
        // Hide the link if hideLink is true
        d3.select(this)
          .attr('stroke', '#E4E2E9')
          .attr('stroke-width', (d) => 1)
          .attr('opacity', d.data.id === '101' ? 0 : 1);
      })
      .container(chartContainerRef.current)
      .data(data)
      .onNodeClick((d) => {
        const excludedEmployeeIds = ['101', '100'];
        if (!excludedEmployeeIds.includes(d.data.id)) {
          openEmployeeDialog(d.data.id);
        }
      })
      .render();


    chartRef.current = chart;
  }


  const filterChart = (value) => {
    if (!chartRef.current) return;


    chartRef.current.clearHighlighting();


    const data = chartRef.current.data();
    data.forEach((d) => {
      d._expanded = false;
      if (value !== '' && d.full_name.toLowerCase().includes(value.toLowerCase())) {
        d._highlighted = true;
        d._expanded = true;
      } else {
        d._highlighted = false;
      }
    });


    chartRef.current.data(data).render().fit();
  };


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const toggleCompactMode = () => {
    setIsCompact(!isCompact);
    if (chartRef.current) {
      chartRef.current.compact(!isCompact).render();
    }
  };
  const onDragStart = (element, event, node) => {
    dragNodeRef.current = node;
    const width = node.width;
    const half = width / 2;
    const x = event.x - half;
    dragStartXRef.current = x;
    dragStartYRef.current = event.y;
    isDragStartingRef.current = true;


    d3.select(element).classed('dragging', true);
  };


  function onDrag(element, event) {
    if (!dragNodeRef.current) return;


    const chartState = chartRef.current.getChartState();
    const g = d3.select(element);


    if (isDragStartingRef.current) {
      isDragStartingRef.current = false;
      document.querySelector('.chart-container').classList.add('dragging-active');
      g.raise();


      const descendants = dragNodeRef.current.descendants();
      const linksToRemove = [...descendants, dragNodeRef.current];
      const nodesToRemove = descendants.filter((x) => x.data.id !== dragNodeRef.current.id);


      chartState.linksWrapper
        .selectAll('path.link')
        .data(linksToRemove, (d) => chartState.nodeId(d))
        .remove();
      chartState.nodesWrapper
        .selectAll('g.node')
        .data(nodesToRemove, (d) => chartState.nodeId(d))
        .remove();
    }
    dropNodeRef.current = null;
    const allNodes = d3.selectAll('g.node:not(.dragging)');


    // Reset fill color for all nodes
    allNodes.select('rect').attr('fill', 'none');


    allNodes
      .filter((d2) => {
        const cP = {
          left: event.x,
          right: event.x + dragNodeRef.current.width,
          top: event.y,
          bottom: event.y + dragNodeRef.current.height,
          midX: event.x + dragNodeRef.current.width / 2,
          midY: event.y + dragNodeRef.current.height / 2,
        };
        const cPInner = {
          left: d2.x,
          right: d2.x + d2.width,
          top: d2.y,
          bottom: d2.y + d2.height,
        };


        if (
          cP.midX > cPInner.left &&
          cP.midX < cPInner.right &&
          cP.midY > cPInner.top &&
          cP.midY < cPInner.bottom
        ) {
          dropNodeRef.current = d2;
          return d2;
        }
      })
      .each(function (d) {
        // Check if the node is droppable before changing its color
        if (this.classList.contains('droppable')) {
          d3.select(this).select('rect').attr('fill', '#e4e1e1');
        }
      });


    dragStartXRef.current += event.dx;
    dragStartYRef.current += event.dy;
    g.attr('transform', `translate(${dragStartXRef.current}, ${dragStartYRef.current})`);
  }


  const onDragEnd = (element, event, node) => {
    document.querySelector('.chart-container').classList.remove('dragging-active');
    if (!dragNodeRef.current) return;


    d3.select(element).classed('dragging', false);


    if (!dropNodeRef.current || dragNodeRef.current.parent.id === dropNodeRef.current.id) {
      chartRef.current.render();
      return;
    }
    //here i check for ids that i specifically marke as not droppable. so i would have to change code in two places
    if (dropNodeRef.current.data.id === '101') {
      chartRef.current.render();
      return;
    }


    d3.select(element).remove();


    const data = chartRef.current.getChartState().data;
    const draggedNode = data.find((x) => x.id === dragNodeRef.current.id);
    const oldParentId = draggedNode.parentId;
    draggedNode.parentId = dropNodeRef.current.id;


    setUndoActions((prev) => [...prev, { id: dragNodeRef.current?.id, parentId: oldParentId }]);
    setRedoActions([]);
    dropNodeRef.current = null;
    dragNodeRef.current = null;
    chartRef.current.render();
  };


  const enableDrag = () => {
    dragEnabled.current = true;
    document.querySelector('.chart-container').classList.add('drag-enabled');
  };
  const saveHierarchy = () => {
    const updatedData = data.map((node) => ({
      ...node,
      id: Number(node.id), // Convert id to a number
      parent_id: node.parentId ? Number(node.parentId) : null, // Rename parentId to parent_id and convert to number or null
    }));
    console.log(updatedData);


    dispatch(saveEmployeeHierarchy(updatedData)) // Use updatedData instead of data
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          setAlert({
            open: true,
            severity: 'success',
            message: 'Employee hierarchy saved successfully',
          });
        } else {
          setAlert({
            open: true,
            severity: 'error',
            message: 'Failed to save hierarchy',
          });
        }
      })
      .catch((err) => {
        console.error(err);
        setAlert({
          open: true,
          severity: 'error',
          message: 'Failed to save hierarchy',
        });
      });


    disableDrag();
  };


  const disableDrag = () => {
    dragEnabled.current = false;
    dataRef.current = data;
    document.querySelector('.chart-container').classList.remove('drag-enabled');
    setUndoActions([]);
    setRedoActions([]);
  };


  const cancelDrag = () => {
    if (undoActions.length === 0) {
      disableDrag();
      return;
    }


    const data = chartRef.current.getChartState().data;
    undoActions.reverse().forEach((action) => {
      const node = data.find((x) => x.id === action.id);
      node.parentId = action.parentId;
    });


    disableDrag();
    chartRef.current.render();
  };


  const undo = () => {
    const action = undoActions.pop();
    if (action) {
      const node = chartRef.current.getChartState().data.find((x) => x.id === action.id);
      const currentParentId = node.parentId;
      const previousParentId = action.parentId;
      action.parentId = currentParentId;
      node.parentId = previousParentId;


      setRedoActions((prev) => [...prev, action]);
      chartRef.current.render();
      updateDragActions();
    }
  };


  const redo = () => {
    const action = redoActions.pop();
    if (action) {
      const node = chartRef.current.getChartState().data.find((x) => x.id === action.id);
      const currentParentId = node.parentId;
      const previousParentId = action.parentId;
      action.parentId = currentParentId;
      node.parentId = previousParentId;
      setUndoActions((prev) => [...prev, action]);
      chartRef.current.render();
      updateDragActions();
    }
  };


  const displayActions = () => {
    setShowActions(true);
    enableDrag();
  };


  const hideActions = (action) => {
    setShowActions(false);
    if (action === 'done') {
      saveHierarchy();
    }
    if (action === 'cancel') {
      cancelDrag();
    }
  };


  const updateDragActions = () => {
    // Implementation left as is
  };


  const generateContent = (d) => {
    const defaultImage =
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2TgOv9CMmsUzYKCcLGWPvqcpUk6HXp2mnww&s';
    const imageDiffVert = 25 + 2;
    const isUnassignedParent = d.data.id === '101'; // 101 is the hardcoded value for the unassigned parent node
    const isUnassignedChild = d.data.parentId === '101'; // Children of the unassigned parent


    const containerStyle = `
      width:${d.width}px;
      height:${d.height}px;
      padding-top:${imageDiffVert - 2}px;
      padding-left:1px;
      padding-right:1px;
    `;


    const contentStyle = `
      font-family: 'Inter', sans-serif;
      margin-left:-1px;
      width:${d.width - 2}px;
      height:${d.height - imageDiffVert}px;
      border-radius:10px;
      border: ${
        d.data._highlighted || d.data._upToTheRootHighlighted
          ? '5px solid #E27396'
          : '1px solid #E4E2E9'
      };
      background-color: ${isUnassignedParent ? '#FFFDE7' : 'white'};
    `;


    const nameStyle = `
      font-size:15px;
      color:${isUnassignedParent ? '#555' : '#3f50b5'};
      margin-left:20px;
      margin-top:${isUnassignedParent ? '0px' : '10px'};
      font-weight: ${isUnassignedParent ? 'bold' : 'normal'};
    `;


    const designationStyle = `
      color:${isUnassignedParent ? '#777' : '#716E7B'};
      margin-left:20px;
      margin-top:3px;
      font-size:${isUnassignedParent ? '12px' : '10px'};
    `;


    const imageContent = !isUnassignedParent
      ? `
      <div style="margin-top:${
        -imageDiffVert - 20
      }px;margin-left:${15}px;border-radius:100px;width:50px;height:50px;"></div>
      <div style="margin-top:${-imageDiffVert - 20}px;">
        <img src="${
          d.data.imageUrl || defaultImage
        }" style="margin-left:${20}px;border-radius:100px;width:40px;height:40px;" />
      </div>
      `
      : '';


    let content;
    if (isUnassignedParent) {
      content = `
        <div style="${nameStyle}">Unassigned Employees</div>
        <div style="${designationStyle}">Newly added employees will appear here</div>
      `;
    } else {
      content = `
        ${imageContent}
        <div style="${nameStyle}">${d.data.full_name}</div>
        <div style="${designationStyle}">
          ${isUnassignedChild ? 'Newly added - Pending assignment' : d.data.designation_label || ''}
        </div>
      `;
    }


    return `
      <div class="node-container" style="${containerStyle}">
        <div class="content-container" style="${contentStyle}">
          <div style="display:flex;justify-content:flex-end;margin-top:5px;margin-right:8px">
            #${d.data.employee_no}
          </div>
          ${content}
        </div>
      </div>
    `;
  };


  return (
    <>
      <AlertMessage
        open={alert.open}
        setAlert={setAlert}
        severity={alert.severity}
        message={alert.message}
      />
      {dialogOpen && (
        <FullscreenDialog open={dialogOpen} setOpen={setDialogOpen} title="Employee Dashboard">
          <AttendanceDetail
            id={selectedEmployee.id}
            initialDate={{
              from: dayjs().startOf('month'),
              to: dayjs().endOf('month'),
            }}
          />
        </FullscreenDialog>
      )}
      {/* <EmployeeDialog
        employee={selectedEmployee}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      /> */}


      <div className="app">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3, mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by name"
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: <SearchIcon color="action" />,
              }}
            />
            <Tooltip title={isCompact ? 'Disable Compact Mode' : 'Enable Compact Mode'}>
              <IconButton onClick={toggleCompactMode} color="primary">
                {isCompact ? <ViewComfyIcon /> : <ViewCompactIcon />}
              </IconButton>
            </Tooltip>
            {!showActions ? (
              <Button
                size="small"
                variant="contained"
                startIcon={<EditIcon />}
                onClick={displayActions}
              >
                Organize
              </Button>
            ) : (
              <Button
                size="small"
                variant="contained"
                color="success"
                startIcon={<DoneIcon />}
                onClick={() => hideActions('done')}
              >
                Done
              </Button>
            )}
            {showActions && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Tooltip title="Undo">
                  <span>
                    <IconButton color="primary" disabled={undoActions.length === 0} onClick={undo}>
                      <UndoIcon />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Redo">
                  <span>
                    <IconButton color="primary" disabled={redoActions.length === 0} onClick={redo}>
                      <RedoIcon />
                    </IconButton>
                  </span>
                </Tooltip>
                <Divider orientation="vertical" flexItem />
                <Button
                  sx={{ bgcolor: '#fff !important' }}
                  size="small"
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={() => hideActions('cancel')}
                >
                  Cancel
                </Button>
              </Box>
            )}
          </Box>
        </Box>
        <div className="chart-container" ref={chartContainerRef}></div>
      </div>
    </>
  );
}


const EmployeeDialog = ({ employee, open, onClose }) => {
  if (!employee) return null;


  const InfoItem = ({ icon, label, value }) => (
    <Box display="flex" alignItems="center" mb={2}>
      <Box
        mr={2}
        display="flex"
        alignItems="center"
        justifyContent="center"
        width={40}
        height={40}
        bgcolor="primary.main"
        borderRadius="50%"
      >
        {React.cloneElement(icon, { style: { color: '#fff' } })}
      </Box>
      <Box>
        <Typography variant="body2" color="textSecondary">
          {label}
        </Typography>
        <Typography variant="body1" fontWeight="medium">
          {value || 'N/A'}
        </Typography>
      </Box>
    </Box>
  );


  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ style: { borderRadius: 16 } }}
    >
      <DialogTitle sx={{ pb: 0, pt: 3 }}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: 4, pt: 3 }}>
        <Grid container spacing={4}>
          <Grid
            item
            xs={12}
            md={4}
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <Avatar
              src={
                employee.imageUrl ||
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2TgOv9CMmsUzYKCcLGWPvqcpUk6HXp2mnww&s'
              }
              alt={employee.full_name}
              sx={{ width: 180, height: 180, mb: 2, boxShadow: 3 }}
            />
            <Typography variant="h5" align="center" gutterBottom fontWeight="bold">
              {employee.full_name}
            </Typography>
            <Typography variant="subtitle1" color="primary" align="center" fontWeight="medium">
              {employee.designation_label}
            </Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom fontWeight="bold" color="primary" pb={1}>
              Employee Details
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={7}>
                <InfoItem icon={<BadgeIcon />} label="Employee No" value={employee.employee_no} />
                <InfoItem icon={<EmailIcon />} label="Email" value={employee.email} />
                <InfoItem
                  icon={<WorkIcon />}
                  label="Designation"
                  value={employee.designation_label}
                />
                <InfoItem
                  icon={<BusinessIcon />}
                  label="Department"
                  value={employee.department_label}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <InfoItem
                  icon={<DateRangeIcon />}
                  label="Date of Joining"
                  value={new Date(parseInt(employee.date_of_joining)).toLocaleDateString()}
                />
                <InfoItem icon={<PhoneIcon />} label="Contact" value={employee.contact_no} />
                <InfoItem icon={<CreditCardIcon />} label="CNIC" value={employee.cnic} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 4, py: 3 }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
