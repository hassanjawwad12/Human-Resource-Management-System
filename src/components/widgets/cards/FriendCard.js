import React from 'react';
import { CardContent, Typography, Grid, Button, Box, AvatarGroup, Avatar, Stack } from '@mui/material';
import BlankCard from '../../shared/BlankCard';

import img1 from 'src/assets/images/profile/user-1.jpg';
import img2 from 'src/assets/images/profile/user-2.jpg';
import img3 from 'src/assets/images/profile/user-3.jpg';
import img4 from 'src/assets/images/profile/user-4.jpg';


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
  {
    title: 'Lora Powers',
    location: 'Nepal',
    avatar: img4,
  },
];

const FriendCard = () => {
  return (
    <Grid container spacing={3}>
      {followerCard.map((card, index) => (
        <Grid item xs={12} sm={6} lg={3} key={index}>
          <BlankCard>
            <CardContent>
              <Avatar src={card.avatar} sx={{ height: 80, width: 80 }}></Avatar>
              <Stack direction="row" spacing={2} mt={3}>
                <Box>
                  <Typography variant="h6" mb={1}>
                    {card.title}
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <AvatarGroup>
                      <Avatar sx={{ height: 28, width: 28 }} alt="Remy Sharp" src={img1} />
                      <Avatar sx={{ height: 28, width: 28 }} alt="Travis Howard" src={img2} />
                      <Avatar sx={{ height: 28, width: 28 }} alt="Cindy Baker" src={img3} />
                    </AvatarGroup>
                    <Typography variant="subtitle2" color="textSecondary">
                      3 mutual friends
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
              <Stack spacing={2} mt={3}>
                <Button size="large" variant="text" color="primary">
                  Add Friend
                </Button>
                <Button size="large" variant="text" color="secondary">
                  Remove
                </Button>
              </Stack>
            </CardContent>
          </BlankCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default FriendCard;
