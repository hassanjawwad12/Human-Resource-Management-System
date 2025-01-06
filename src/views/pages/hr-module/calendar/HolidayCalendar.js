import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  IconButton,
  Stack,
  Box,
  Fab,
  FormControlLabel,
  Switch,
  lighten,
} from '@mui/material';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { motion, AnimatePresence } from 'framer-motion';
import './Calendar.css';
import PageContainer from '../../../../components/container/PageContainer';
import {
  ArrowBackIos,
  ArrowForwardIos,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  Check as IconCheck
} from '@mui/icons-material';
import { getAllCompanyHolidays, saveCompanyHoliday, deleteCompanyHoliday } from '../../../../store/hr/HolidaySlice';
import AlertMessage from '../../../../components/shared/AlertMessage';
import { useDispatch } from 'react-redux';

const localizer = dayjsLocalizer(dayjs);

const CustomToolbar = ({ date, onNavigate, showRemarks, setShowRemarks, toggleFullScreen, isFullScreen }) => {
  const goToBack = () => {
    onNavigate('PREV');
  };

  const goToNext = () => {
    onNavigate('NEXT');
  };

  const goToCurrent = () => {
    onNavigate('TODAY');
  };

  const label = () => {
    return dayjs(date).format('MMMM YYYY');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px',
        bgcolor: (theme) => lighten(theme.palette.primary.main, 0.9),
        borderRadius: '0px',
        marginBottom: '0px',
      }}
    >

      <Box className='flex gap-3 items-center'>
        <Button variant="outlined" size="small" onClick={goToCurrent} sx={{ bgcolor: 'transparent !important' }}>
          Today
        </Button>
        <Box>
          <IconButton onClick={goToBack} sx={{ color: 'primary.main' }}>
            <ArrowBackIos sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton onClick={goToNext} sx={{ color: 'primary.main' }}>
            <ArrowForwardIos sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: '600', color: 'primary.main', width: '12rem' }}>
          {label()}
        </Typography>
      </Box>

      <Stack direction={'row'} alignItems='center'>
        <IconButton onClick={toggleFullScreen} sx={{ mr: 2 }}>
          {!isFullScreen ? <FullscreenIcon color="primary" /> : <FullscreenExitIcon color="primary" />}
        </IconButton>
        <FormControlLabel
          labelPlacement="start"
          control={<Switch checked={showRemarks} onChange={(e) => setShowRemarks(e.target.checked)} />}
          label={
            <Typography variant="body2" color="textSecondary" sx={{ color: (theme) => lighten(theme.palette.primary.main, 0.1) }}>
              Show Remarks
            </Typography>
          }
        />
      </Stack>
    </Box>
  );
};

const HolidayCalendar = () => {
  const [holidays, setHolidays] = useState([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [start, setStart] = useState(dayjs());
  const [end, setEnd] = useState(dayjs());
  const [color, setColor] = useState('default');
  const [remarks, setRemarks] = useState('');
  const [showRemarks, setShowRemarks] = useState(false);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const prevDateRef = useRef(currentDate);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [editingHolidayId, setEditingHolidayId] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    severity: '',
    message: ''
  });
  const firmId = JSON.parse(localStorage.getItem('Exergy HRMData'))?.firmId
  const dispatch = useDispatch();
  console.log(holidays)

  const toggleFullScreen = useCallback(() => {
    setIsFullScreen(prevState => !prevState);
  }, []);

  useEffect(() => {
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement && isFullScreen) {
        setIsFullScreen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isFullScreen) {
        toggleFullScreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullScreen, toggleFullScreen]);

  useEffect(() => {
    if (isFullScreen) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable full-screen mode: ${e.message}`);
      });
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, [isFullScreen]);

  const ColorVariation = [
    { id: 1, eColor: '#1a97f5', value: 'default' },
    { id: 2, eColor: '#39b69a', value: 'green' },
    { id: 3, eColor: '#fc4b6c', value: 'red' },
    { id: 4, eColor: '#615dff', value: 'azure' },
    { id: 5, eColor: '#fdd43f', value: 'warning' },
  ];

  useEffect(() => {
    fetchHolidays();
  }, []);

  const isDateOccupied = (date, editingHolidayId = null) => {
    return holidays.some(holiday =>
      holiday.id !== editingHolidayId && (
        dayjs(holiday.start).isSame(date, 'day') ||
        dayjs(holiday.end).subtract(1, 'day').isSame(date, 'day') || // Subtract 1 day
        (dayjs(date).isAfter(dayjs(holiday.start)) && dayjs(date).isBefore(dayjs(holiday.end).subtract(1, 'day'))) // Subtract 1 day
      )
    );
  };
  const fetchHolidays = () => {
    const formData = new FormData()
    formData.append('companyId', firmId)

    dispatch(getAllCompanyHolidays(formData))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          const formattedHolidays = result.payload.DATA.map(holiday => ({
            id: holiday.id,
            title: holiday.title,
            start: dayjs(holiday.fromDate, 'DD/MM/YYYY').toDate(),
            end: dayjs(holiday.toDate, 'DD/MM/YYYY').toDate(),
            color: holiday.color,
            description: holiday.description,
            holidayIds: holiday.holidayIds
          }));
          setHolidays(formattedHolidays);
        } else {
          console.error('Error fetching holidays:', result.payload);
        }
      })
      .catch((error) => {
        console.error('Error fetching holidays:', error);
      });
  };


  const addNewHoliday = (slotInfo) => {
    setOpen(true);
    setStart(dayjs(slotInfo.start));
    setEnd(dayjs(slotInfo.end));
  };

  const editHoliday = (holiday) => {
    setOpen(true);
    setTitle(holiday.title);
    setStart(dayjs(holiday.start));
    setEnd(dayjs(holiday.end));
    setColor(holiday.color);
    setRemarks(holiday.remarks || '');
    setEditingHolidayId(holiday.id);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    // Check if the date range is already occupied
    let currentDate = start.startOf('day');
    const endDate = end.startOf('day');

    while (currentDate.isSameOrBefore(endDate)) {
      if (isDateOccupied(currentDate, editingHolidayId)) {
        setAlert({
          open: true,
          severity: 'error',
          message: `A holiday already exists on ${currentDate.format('MMMM D, YYYY')}`
        });
        return;
      }
      currentDate = currentDate.add(1, 'day');
    }
    const formData = new FormData();
    formData.append('companyId', firmId);
    formData.append('title', title);
    formData.append('description', remarks);
    formData.append('color', color);
    formData.append('fromDate', start.format('YYYY-MM-DD'));
    formData.append('toDate', end.subtract(1, 'day').format('YYYY-MM-DD'));

    // Dispatch the save action
    dispatch(saveCompanyHoliday(formData))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          setAlert({
            open: true,
            severity: 'success',
            message: 'Holiday saved successfully.'
          });


          fetchHolidays();

          setOpen(false);
          resetForm();
        } else {
          setAlert({
            open: true,
            severity: 'error',
            message: result.payload.USER_MESSAGE || 'Failed to save holiday.'
          });
        }
      })
      .catch((err) => {
        console.error(err);
        setAlert({
          open: true,
          severity: 'error',
          message: 'Something went wrong.'
        });
      });
  };

  const deleteHandler = (holidayId) => {
    // Optimistically update the UI
    setHolidays(prevHolidays => prevHolidays.filter(h => h.id !== holidayId));
    setOpen(false);

    const holidaysToDelete = holidays.find(holiday => holiday.id === holidayId);
    console.log(holidaysToDelete.holidayIds);

    // Loop through each holidayId and dispatch the delete action
    holidaysToDelete.holidayIds.forEach(id => {
      const formData = new FormData();
      formData.append('holidayId', id);

      // Send the delete request to the API for each holidayId
      dispatch(deleteCompanyHoliday(formData))
        .then((result) => {
          if (result.payload.SUCCESS === 1) {
            setAlert({
              open: true,
              severity: 'success',
              message: `Holiday deleted successfully.`
            });
          } else {
            // If the API call fails, revert the change and show an error message
            fetchHolidays(); // This will reset the holidays to their server state
            setAlert({
              open: true,
              severity: 'error',
              message: result.payload.USER_MESSAGE || `Failed to delete holiday with ID ${id}.`
            });
          }
        })
        .catch((err) => {
          console.error(err);
          // If there's an error, revert the change and show an error message
          fetchHolidays();
          setAlert({
            open: true,
            severity: 'error',
            message: `Something went wrong while deleting holiday with ID ${id}.`
          });
        });
    });
  };


  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setStart(dayjs());
    setEnd(dayjs());
    setColor('default');
    setRemarks('');
    setEditingHolidayId(null);
  };

  const handleNavigate = (action) => {
    let newDate;
    switch (action) {
      case 'PREV':
        newDate = currentDate.subtract(1, 'month');
        break;
      case 'NEXT':
        newDate = currentDate.add(1, 'month');
        break;
      case 'TODAY':
        newDate = dayjs();
        break;
      default:
        newDate = currentDate;
    }
    prevDateRef.current = currentDate;
    setCurrentDate(newDate);
  };

  const getAnimationDirection = () => {
    if (currentDate.isAfter(prevDateRef.current)) {
      return 'left';
    } else if (currentDate.isBefore(prevDateRef.current)) {
      return 'right';
    }
    return 'none';
  };

  const slideVariants = {
    enterLeft: {
      x: '50px',
      opacity: 0,
    },
    enterRight: {
      x: '-50px',
      opacity: 0,
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exitLeft: {
      opacity: .5,
    },
    exitRight: {
      opacity: .5,
    },
  };

  const CustomEvent = ({ event }) => (
    <div>
      <strong>{event.title}</strong>
      {showRemarks && event.remarks && (
        <div style={{ fontSize: '0.8em' }}>{event.remarks}</div>
      )}
    </div>
  );

  const handleEventDelete = () => {
    if (selectedEvent) {
      deleteHandler(selectedEvent);
      handleEventDialogClose();
    }
  };

  const isFormValid = () => {
    return !(
      !title.trim() ||
      !start || !start.isValid() ||
      !end || !end.isValid() ||
      !color ||
      (start && end && start.isValid() && end.isValid() && end.isBefore(start))
    );
  };


  const direction = getAnimationDirection();
  const BCrumb = [
    {
      to: '/Hr',
      title: 'Hr module',
    },
    {
      title: 'Holiday Calendar',
    }
  ];

  return (
    <PageContainer title="Holiday Calendar" description="This is the Holiday Calendar page">
      <div className='mt-6'/>
      <AlertMessage open={alert.open} setAlert={setAlert} severity={alert.severity} message={alert.message} />
      <Box
        variant="outlined"
        sx={{
          ...(isFullScreen && {
            position: 'fixed',
            top: 10,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99999,
            maxHeight: 'auto',
            mt: 0,
            overflow: 'auto',
            backgroundColor: 'white',
          }),
        }}
      >
        <Box sx={{ overflow: 'hidden' }}>
          <CustomToolbar
            date={currentDate.toDate()}
            onNavigate={handleNavigate}
            showRemarks={showRemarks}
            setShowRemarks={setShowRemarks}
            toggleFullScreen={toggleFullScreen}
            isFullScreen={isFullScreen}
          />
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentDate.toString()}
              initial={direction === 'left' ? 'enterLeft' : 'enterRight'}
              animate="center"
              exit={direction === 'left' ? 'exitLeft' : 'exitRight'}
              variants={slideVariants}
              transition={{ type: 'tween', duration: 0.1 }}
            >
              <Calendar
                selectable
                events={holidays}
                views={['month']}
                defaultView="month"
                scrollToTime={new Date(1970, 1, 1, 6)}
                date={currentDate.toDate()}
                onNavigate={handleNavigate}
                localizer={localizer}
                style={{
                  height: isFullScreen ? 'calc(100vh - 100px)' : 'calc(100vh - 350px)',
                  transition: 'height 0.3s ease-in-out',
                }}
                onSelectEvent={(holiday) => editHoliday(holiday)}
                onSelectSlot={(slotInfo) => addNewHoliday(slotInfo)}
                eventPropGetter={(event) => ({
                  className: `event-${event.color || 'default'}`,
                })}
                components={{
                  event: (props) => (
                    <CustomEvent
                      {...props}
                      onDeleteEvent={deleteHandler}
                    />
                  ),
                }}

                dayPropGetter={(date) => ({
                  style: {
                    backgroundColor: dayjs(date).isSame(dayjs(), 'day') ? '#e6f7e6' : undefined,
                    borderBottom: 'none',
                  },
                })}
                toolbar={null}
              />
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>

      <Dialog
        open={open}
        maxWidth="sm"
        fullWidth
        onClose={handleClose}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '16px'
          }
        }}
      >
        <form onSubmit={submitHandler}>
          <DialogTitle sx={{ bgcolor: 'primary.main', py: 2 }}>
            <Stack direction='column'>
              <Typography variant='h5' className='text-white'>
                {editingHolidayId ? 'Edit Holiday' : 'New Holiday'}
              </Typography>
              <Typography variant='subtitle1' className='text-white'>
                {`${start ? start?.format('DD MMM YYYY') : ''} - ${end ? end.subtract(1, 'day').format('DD MMM YYYY') : ''}`}
              </Typography>
            </Stack>
          </DialogTitle>
          <DialogContent sx={{ mb: 2 }}>
            <Stack direction='column' gap={2} pt={2}>
              <TextField

                id="Holiday Title"
                placeholder="Enter Holiday Title"
                variant="outlined"
                fullWidth

                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="Start Date"
                  value={start}
                  onChange={(newValue) => setStart(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
                <DesktopDatePicker
                  label="End Date"
                  value={end.subtract(1, 'day')} // Subtract 1 day for display
                  onChange={(newValue) => setEnd(newValue.add(1, 'day'))} // Add 1 day when setting
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
              <TextField
                id="Remarks"
                placeholder="Enter Remarks"
                variant="outlined"
                fullWidth
                label="Remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
              <Typography variant="h6" fontWeight={600}>
                Select Holiday Color
              </Typography>
              <Box>
                {ColorVariation.map((mcolor) => (
                  <Fab
                    color="primary"
                    style={{ backgroundColor: mcolor.eColor }}
                    sx={{
                      marginRight: '3px',
                      transition: '0.1s ease-in',
                      scale: mcolor.value === color ? '0.9' : '0.7',
                    }}
                    size="small"
                    key={mcolor.id}
                    onClick={() => setColor(mcolor.value)}
                  >
                    {mcolor.value === color ? <IconCheck width={16} /> : ''}
                  </Fab>
                ))}
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', px: 3 }}>

            <Button
              variant='outlined'
              onClick={handleClose}
              sx={{ mr: 1, color: 'primary.main !important', bgcolor: '#fff !important' }}
            >
              Cancel
            </Button>
            <Box className='flex gap-2'>
              {editingHolidayId && (
                <Button
                  variant='outlined'
                  color='error'

                  onClick={() => deleteHandler(editingHolidayId)}
                  sx={{ backgroundColor: '#fff !important' }}
                >
                  Delete
                </Button>
              )}
              {!editingHolidayId &&
                < Button type="submit" disabled={!isFormValid()} variant='contained'>
                  {editingHolidayId ? 'Update' : 'Add'} Holiday
                </Button>
              }
            </Box>

          </DialogActions>
        </form>
      </Dialog>
    </PageContainer >
  );
};

export default HolidayCalendar;