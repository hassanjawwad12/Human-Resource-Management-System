import * as React from 'react';
import PropTypes from 'prop-types';
import { Button, ClickAwayListener, Paper, Toolbar, Typography, InputAdornment, TextField } from "@mui/material";
import { Box, Stack } from "@mui/system";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import isBetween from 'dayjs/plugin/isBetween';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs'
import CustomTextField from "../../../../components/forms/theme-elements/CustomTextField";
import { IconSearch } from '@tabler/icons';

const EnhancedTableToolbar = (props) => {
    const { numSelected, handleSearch, search, date, setDate, title, addBtn } = props;
    const handleToday = () => {
        const today = dayjs().format('DD/MM/YYYY');
        setDate({ from: today, to: today });
        setOpen(false);
    };

    const handleTomorrow = () => {
        const tomorrow = dayjs().add(1, 'day').format('DD/MM/YYYY');
        setDate({ from: tomorrow, to: tomorrow });

        setOpen(false);
    };

    const handleNextMonth = () => {
        const from = dayjs().startOf('month').add(1, 'month').format('DD/MM/YYYY');
        const to = dayjs().endOf('month').add(1, 'month').format('DD/MM/YYYY');
        setDate({ from: from, to: to });
        setOpen(false);
    };

    const handleNextThreeMonths = () => {
        const from = dayjs().startOf('month').add(1, 'month').format('DD/MM/YYYY');
        const to = dayjs().endOf('month').add(3, 'month').format('DD/MM/YYYY');
        console.log(from, to)
        setDate({ from: from, to: to });
        setOpen(false);
    };

    const [open, setOpen] = React.useState(false)
    const handleClick = (event) => {
        setOpen(!open)
    };
    const handleClear = () => {
        setDate({
            to: '',
            from: ''
        })
        setOpen(false)
    }
    return (
        <Toolbar
            disableGutters
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}
        >
            <Stack direction={'row'} spacing={2}>
                <Typography variant='h5' sx={{ color: 'primary.main', pl: 1 }}>{title}</Typography>
            </Stack>
            <Box>
                <Paper elevation={0} sx={{ borderRadius: '', display: 'flex', alignItems: 'center', gap: 3 }}>
                    <ClickAwayListener onClickAway={() => setOpen(false)}>
                        <Box className='relative'>
                            <Box onClick={handleClick} sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: .7, cursor: 'pointer', bgcolor: date.from !== '' ? 'primary.main' : '' }}>
                                <CalendarMonthIcon sx={{ color: date.from === '' ? 'gray' : 'white', fontSize: '1.1rem', }} />
                                <Typography sx={{ whiteSpace: 'nowrap', cursor: 'pointer', color: date.from === '' ? '' : 'white' }}>{date.from === '' || date.to === '' ? 'Any date' : `${dayjs(date.from, 'DD/MM/YYYY').format('DD/MM/YYYY')}-${dayjs(date.to, 'DD/MM/YYYY').format('DD/MM/YYYY')}`}</Typography>
                                <ArrowDropDownIcon sx={{ color: date.from === '' ? 'primary.main' : 'white' }} className={`transition-transform ${!open ? 'rotate-180 ' : ''}`} />
                            </Box>
                            {open && <Box className='absolute top-full left-0 right-0 z-[1000] w-[23rem] py-3  px-3 gap-4 bg-white drop-shadow-lg flex items-center flex-col justify-center'>
                                <Typography color={'primary.main'} onClick={handleClear} className='self-end cursor-pointer'>Clear</Typography>
                                <Box className='flex items-center gap-4'>
                                    <Box>
                                        <Typography fontSize={'.8rem'} className='self-start text-gray-500'>From:</Typography>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                inputFormat='DD/MM/YYYY'
                                                value={date.from ? dayjs(date.from, 'DD/MM/YYYY') : null}

                                                onChange={(newValue) => {
                                                    setDate(prev => ({ ...prev, from: newValue }));
                                                }}
                                                renderInput={(params) => <CustomTextField {...params} sx={{

                                                    svg: { color: 'primary.main', fontSize: '1.5rem', p: 0 },
                                                    input: { color: '' },


                                                    '& .MuiInputBase-root': {

                                                        outline: 'none',
                                                        flexDirection: 'row-reverse'
                                                    },

                                                    '& .MuiOutlinedInput-notchedOutline': {

                                                    },
                                                    // '& .MuiPickersDay-dayWithMargin': {
                                                    //     color: 'green',
                                                    // },

                                                }}
                                                    size="small"
                                                />}
                                            />
                                        </LocalizationProvider>
                                    </Box>
                                    <Box>
                                        <Typography fontSize={'.8rem'} className='self-start text-gray-500'>To:</Typography>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                inputFormat='DD/MM/YYYY'
                                                value={date.to ? dayjs(date.to, 'DD/MM/YYYY') : null}

                                                onChange={(newValue) => {
                                                    setDate(prev => ({ ...prev, to: newValue }));
                                                }}
                                                minDate={dayjs(date.from, 'DD/MM/YYYY').subtract(1, 'day')}
                                                renderInput={(params) => <CustomTextField {...params} sx={{

                                                    svg: { color: 'primary.main', fontSize: '1.5rem' },
                                                    input: { color: '' },


                                                    '& .MuiInputBase-root': {

                                                        outline: 'none',
                                                        flexDirection: 'row-reverse'
                                                    },

                                                    '& .MuiOutlinedInput-notchedOutline': {

                                                    },
                                                    // '& .MuiPickersDay-dayWithMargin': {
                                                    //     color: 'green',
                                                    // },

                                                }}
                                                    size="small"
                                                />}
                                            />
                                        </LocalizationProvider>
                                    </Box>
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
                                            color: 'white'
                                        }
                                    }}
                                >
                                    Today
                                </Button>

                                <Button onClick={handleTomorrow}
                                    sx={{
                                        width: '100%',
                                        color: 'primary.main',
                                        border: (theme) => `1px solid ${theme.palette.primary.main}`,
                                        bgcolor: '#fff !important',
                                        '&:hover': {
                                            backgroundColor: (theme) => `${theme.palette.primary.main} !important`,
                                            color: 'white'
                                        }
                                    }}
                                >Tomorrow</Button>
                                <Button onClick={handleNextMonth}
                                    sx={{
                                        width: '100%',
                                        color: 'primary.main',
                                        border: (theme) => `1px solid ${theme.palette.primary.main}`,
                                        bgcolor: '#fff !important',
                                        '&:hover': {
                                            backgroundColor: (theme) => `${theme.palette.primary.main} !important`,
                                            color: 'white'
                                        }
                                    }}
                                >Next Month</Button>
                                <Button onClick={handleNextThreeMonths}
                                    sx={{
                                        width: '100%',
                                        color: 'primary.main',
                                        border: (theme) => `1px solid ${theme.palette.primary.main}`,
                                        bgcolor: '#fff !important',
                                        '&:hover': {
                                            backgroundColor: (theme) => `${theme.palette.primary.main} !important`,
                                            color: 'white'
                                        }
                                    }}
                                >Next 3 Months</Button>
                            </Box>}

                        </Box>
                    </ClickAwayListener>

                    <TextField
                        color='primary'
                        sx={{
                            minWidth: '350px',
                            '& .MuiInputBase-root': {
                                border: 'none !important',
                                // borderRadius: '30px !important'
                            },
                            '& .MuiOutlinedInput-input': {
                                pl: 0
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                // border: 'none',
                            },
                        }}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IconSearch color='gray' size="1.1rem" />
                                </InputAdornment>
                            ),
                        }}
                        placeholder="Search by name, occupation, hourly rate"
                        size="small"
                        onChange={handleSearch}
                        value={search}
                    />
                </Paper>
            </Box>
        </Toolbar >
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};


export default EnhancedTableToolbar;