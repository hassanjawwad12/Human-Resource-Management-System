import React from 'react';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';

import icon1 from '../../../assets/images/svgs/icon-connect.svg';
import icon2 from '../../../assets/images/svgs/icon-user-male.svg';
import icon3 from '../../../assets/images/svgs/icon-briefcase.svg';
import icon4 from '../../../assets/images/svgs/icon-mailbox.svg';
import icon5 from '../../../assets/images/svgs/icon-favorites.svg';
import icon6 from '../../../assets/images/svgs/icon-speech-bubble.svg';


import TimerIcon from '@mui/icons-material/Timer';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import NotListedLocationIcon from '@mui/icons-material/NotListedLocation';


const topcards = [
  {
    icon: <TimerIcon sx={{ fontSize: '1.5rem', color: 'white' }} />,
    title: 'Attendance Rate',
    digits: '96.04%',
    iconBackgroundColor: 'bg-teal-500', // New prop for background color
    textColor: 'text-teal-700', // New prop for text color based on background color
    cardBackgroundColor: '!bg-teal-50', // New prop for lighter background color
  },
  {
    icon: <NotListedLocationIcon sx={{ fontSize: '1.5rem', color: 'white' }} />,
    title: 'Absence Rate',
    digits: '11.4%',
    iconBackgroundColor: 'bg-yellow-400', // New prop for background color
    textColor: 'text-yellow-700', // New prop for text color based on background color
    cardBackgroundColor: '!bg-yellow-50', // New prop for lighter background color
  },
  {
    icon: <MeetingRoomIcon sx={{ fontSize: '1.5rem', color: 'white' }} />,
    title: 'Avg. Clock-In Time',
    digits: '10:32 AM',
    iconBackgroundColor: 'bg-emerald-500', // New prop for background color
    textColor: 'text-emerald-700', // New prop for text color based on background color
    cardBackgroundColor: '!bg-emerald-50', // New prop for lighter background color
  },
  {
    icon: <MeetingRoomIcon sx={{ fontSize: '1.5rem', color: 'white' }} />,
    title: 'Avg. Clock-Out Time',
    digits: '5:39 PM',
    iconBackgroundColor: 'bg-rose-600', // New prop for background color
    textColor: 'text-rose-700', // New prop for text color based on background color
    cardBackgroundColor: '!bg-rose-50', // New prop for lighter background color
  },
  {
    icon: <WatchLaterIcon sx={{ fontSize: '1.5rem', color: 'white' }} />,
    title: 'On-Time Arrival Rate',
    digits: '85%',
    iconBackgroundColor: 'bg-green-500', // New prop for background color
    textColor: 'text-green-700', // New prop for text color based on background color
    cardBackgroundColor: '!bg-green-50', // New prop for lighter background color
  },
];


const TopCards = () => {
  return (
    <Grid container spacing={3} mt={0} columns={10} >
      {topcards.map((topcard, i) => (
        <Grid item xs={12} sm={4} lg={2} key={i} sx={{ pt: '0 !important' }}>
          <Card textAlign="center" className={topcard.cardBackgroundColor}>
            <CardContent sx={{ padding: '2px !important' }}>
              <Box className={'flex items-center justify-center w-fit p-3 ' + topcard.iconBackgroundColor}>
                {topcard.icon}
              </Box>

              <Typography
                className={`${topcard.textColor}`}
                sx={{ opacity: .7, fontWeight: 500 }}
                mt={1}
                variant="subtitle1"
                mb={1}
              >
                {topcard.title}
              </Typography>
              {/* <Typography color={topcard.bgcolor + '.main'} variant="h4" fontWeight={600}>
                {topcard.digits}
              </Typography> */}
              <Box className='flex items-end justify-between'>
                <Typography variant="h3" fontWeight={800}  className={`${topcard.textColor}`}>
                  {topcard.digits}
                </Typography>
                {i < 2 && <Typography fontSize={11} className='text-green-400'>+24%</Typography>}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default TopCards;
