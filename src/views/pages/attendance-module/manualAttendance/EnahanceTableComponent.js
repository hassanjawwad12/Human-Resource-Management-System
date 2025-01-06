import { useState } from 'react';
import dayjs from 'dayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import {
    Paper,
    Typography,
    Avatar,
    ClickAwayListener,
    Toolbar,
    Button,
    IconButton,
  } from '@mui/material';
import { Box } from '@mui/system';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CustomTextField from '../../../../components/forms/theme-elements/CustomTextField';


export const EnhancedTableToolbar = (props) => {
    const {
    
      date,
      setDate,
  
      setSearchTrigger,
    } = props;
    const [open, setOpen] = useState(false);
  
    const handleToday = () => {
      const today = dayjs();
      setDate({ from: today, to: today });
      setOpen(false);
      setSearchTrigger((prev) => prev + 1);
    };
    const handleDateSearch = () => {
      if (date.from && date.to) {
        setSearchTrigger((prev) => prev + 1);
        setOpen(false);
      }
    };
  
    const handleThisMonth = () => {
      const from = dayjs().startOf('month');
      const to = dayjs().endOf('month');
      setDate({ from: from, to: to });
      setOpen(false);
      setSearchTrigger((prev) => prev + 1);
    };
  
    const handlePreviousMonth = () => {
      const from = dayjs().subtract(1, 'month').startOf('month');
      const to = dayjs().subtract(1, 'month').endOf('month');
      setDate({ from: from, to: to });
      setOpen(false);
      setSearchTrigger((prev) => prev + 1);
    };
  
    const handlePreviousThreeMonths = () => {
      const from = dayjs().subtract(3, 'months').startOf('month');
      const to = dayjs().subtract(1, 'month').endOf('month');
      setDate({ from: from, to: to });
      setOpen(false);
      setSearchTrigger((prev) => prev + 1);
    };
  
    const handleClick = (event) => {
      setOpen(!open);
    };
    const handleClear = () => {
      setDate({
        to: '',
        from: '',
      });
      setOpen(false);
    };
    return (
      <Toolbar
        disableGutters
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Paper
            elevation={0}
            sx={{ borderRadius: '', display: 'flex', alignItems: 'center', gap: 3 }}
          >
            <ClickAwayListener onClickAway={() => setOpen(false)}>
              <Box className="relative">
                <Box
                  onClick={handleClick}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 2,
                    py: 0.7,
                    cursor: 'pointer',
                    bgcolor: date.from !== '' ? 'primary.main' : '',
                    border: date.from === '' || date.to === '' ? '1px solid #DFE5EF' : '',
                  }}
                >
                  <CalendarMonthIcon
                    sx={{ color: date.from === '' ? 'gray' : 'white', fontSize: '1.1rem' }}
                  />
                  <Typography
                    sx={{
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      color: date.from === '' ? '' : 'white',
                    }}
                  >
                    {date.from === '' || date.to === ''
                      ? 'Select date'
                      : `${dayjs(date.from).format('DD/MM/YYYY')}-${dayjs(date.to).format(
                          'DD/MM/YYYY',
                        )}`}
                  </Typography>
                  <ArrowDropDownIcon
                    sx={{ color: date.from === '' ? 'primary.main' : 'white' }}
                    className={`transition-transform ${!open ? 'rotate-180 ' : ''}`}
                  />
                </Box>
                {open && (
                  <Box className="absolute top-full right-0 z-[1000] w-[26rem] py-3  px-3 gap-4 bg-white drop-shadow-lg flex items-center flex-col justify-center">
                    <Typography
                      color={'primary.main'}
                      onClick={handleClear}
                      className="self-end cursor-pointer"
                    >
                      Clear
                    </Typography>
                    <Box className="flex items-end gap-2">
                      <Box>
                        <Typography fontSize={'.8rem'} className="self-start text-gray-500">
                          From:
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            inputFormat="DD/MM/YYYY"
                            value={date.from ? dayjs(date.from, 'DD/MM/YYYY') : null}
                            onChange={(newValue) => {
                              setDate((prev) => ({ ...prev, from: newValue }));
                            }}
                            renderInput={(params) => (
                              <CustomTextField
                                {...params}
                                sx={{
                                  svg: { color: 'primary.main', fontSize: '1.5rem', p: 0 },
                                  input: { color: '' },
  
                                  '& .MuiInputBase-root': {
                                    outline: 'none',
                                    flexDirection: 'row-reverse',
                                  },
  
                                  '& .MuiOutlinedInput-notchedOutline': {},
                                }}
                                size="small"
                              />
                            )}
                          />
                        </LocalizationProvider>
                      </Box>
                      <Box>
                        <Typography fontSize={'.8rem'} className="self-start text-gray-500">
                          To:
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            inputFormat="DD/MM/YYYY"
                            value={date.to ? dayjs(date.to, 'DD/MM/YYYY') : null}
                            onChange={(newValue) => {
                              setDate((prev) => ({ ...prev, to: newValue }));
                            }}
                            minDate={dayjs(date.from, 'DD/MM/YYYY').subtract(1, 'day')}
                            renderInput={(params) => (
                              <CustomTextField
                                {...params}
                                sx={{
                                  svg: { color: 'primary.main', fontSize: '1.5rem' },
                                  input: { color: '' },
                                  '& .MuiInputBase-root': {
                                    outline: 'none',
                                    flexDirection: 'row-reverse',
                                  },
  
                                  '& .MuiOutlinedInput-notchedOutline': {},
                                }}
                                size="small"
                              />
                            )}
                          />
                        </LocalizationProvider>
                      </Box>
                      <IconButton onClick={handleDateSearch}>
                        <ManageSearchIcon sx={{ color: 'primary.main' }} />
                      </IconButton>
                    </Box>
                    <Button
                      onClick={handleToday}
                      sx={{
                        width: '100%',
                        color: 'primary.main',
                        border: (theme) => `1px solid ${theme.palette.primary.main}`,
                        bgcolor: '#fff !important',
                        '&:hover': {
                          backgroundColor: (theme) => `${theme.palette.primary.main} !important`,
                          color: 'white',
                        },
                      }}
                    >
                      Today
                    </Button>
                    <Button
                      onClick={handleThisMonth}
                      sx={{
                        width: '100%',
                        color: 'primary.main',
                        border: (theme) => `1px solid ${theme.palette.primary.main}`,
                        bgcolor: '#fff !important',
                        '&:hover': {
                          backgroundColor: (theme) => `${theme.palette.primary.main} !important`,
                          color: 'white',
                        },
                      }}
                    >
                      This Month
                    </Button>
  
                    <Button
                      onClick={handlePreviousMonth}
                      sx={{
                        width: '100%',
                        color: 'primary.main',
                        border: (theme) => `1px solid ${theme.palette.primary.main}`,
                        bgcolor: '#fff !important',
                        '&:hover': {
                          backgroundColor: (theme) => `${theme.palette.primary.main} !important`,
                          color: 'white',
                        },
                      }}
                    >
                      Last Month
                    </Button>
  
                    <Button
                      onClick={handlePreviousThreeMonths}
                      sx={{
                        width: '100%',
                        color: 'primary.main',
                        border: (theme) => `1px solid ${theme.palette.primary.main}`,
                        bgcolor: '#fff !important',
                        '&:hover': {
                          backgroundColor: (theme) => `${theme.palette.primary.main} !important`,
                          color: 'white',
                        },
                      }}
                    >
                      Last 3 Months
                    </Button>
                  </Box>
                )}
              </Box>
            </ClickAwayListener>
          </Paper>
        </Box>
      </Toolbar>
    );
  };
  