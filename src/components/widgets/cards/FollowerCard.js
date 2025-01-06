import React from 'react';
import { CardContent, Typography, Grid, Button, Avatar, Box, Stack } from '@mui/material';
import { IconMapPin } from '@tabler/icons';
import img1 from 'src/assets/images/profile/user-1.jpg';
import img2 from 'src/assets/images/profile/user-2.jpg';
import img3 from 'src/assets/images/profile/user-3.jpg';
import BlankCard from '../../shared/BlankCard';

const followerCard = [
  {
    title: 'Andrew Grant',
    location: 'El Salvador',
    avatar: img1,
  },
  {
    title: 'Leo Pratt',
    location: 'Bulgaria',
    avatar: img2,
  },
  {
    title: 'Charles Nunez',
    location: 'Nepal',
    avatar: img3,
  },
];

const FollowerCard = () => {
  return (
    <Grid container spacing={3}>
      {followerCard.map((card, index) => (
        <Grid item xs={12} sm={4} key={index}>
          <BlankCard>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Stack direction="row" spacing={2}>
                  <Avatar src={card.avatar} alt={card.avatar} />
                  <Box>
                    <Typography variant="h6">{card.title}</Typography>
                    <Typography
                      variant="subtitle1"
                      color="textSecondary"
                      display="flex"
                      alignItems="center"
                      gap="3px"
                    >
                      <IconMapPin width={18} /> {card.location}
                    </Typography>
                  </Box>
                </Stack>
                <Button variant="contained" color="primary">
                  Follow
                </Button>
              </Stack>
            </CardContent>
          </BlankCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default FollowerCard;
