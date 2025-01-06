import React, { useEffect } from 'react';
import {
  CardContent,
  Typography,
  Grid,
  Card,
  CardMedia,
  Box,
  IconButton,
  Stack,
  Skeleton,
} from '@mui/material';

import img1 from 'src/assets/images/blog/blog-img5.jpg';
import img2 from 'src/assets/images/blog/blog-img4.jpg';
import img3 from 'src/assets/images/blog/blog-img3.jpg';

import { IconPlayerPlay, IconPlayerSkipBack, IconPlayerSkipForward } from '@tabler/icons';

const musicCard = [
  {
    title: 'Uptown Funk',
    subheader: 'Jon Bon Jovi',
    img: img1,
  },
  {
    title: 'Blank Space',
    subheader: 'Madonna',
    img: img2,
  },
  {
    title: 'Lean On',
    subheader: 'Jennifer Lopez',
    img: img3,
  },
];

const MusicCard = () => {
  const [isLoading, setLoading] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Grid container spacing={3}>
      {musicCard.map((card, index) => (
        <Grid item xs={12} sm={4} key={index}>
          <Card sx={{ display: 'flex', p: 0 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: '1 0 auto' }}>
                <Typography component="div" variant="h5">
                  {card.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" component="div">
                  {card.subheader}
                </Typography>
              </CardContent>
              <Stack direction="row" spacing={2} px={2} pb={3}>
                <IconButton aria-label="previous">
                  <IconPlayerSkipBack width="20" />
                </IconButton>
                <IconButton aria-label="play/pause" color="error">
                  <IconPlayerPlay width="20" />
                </IconButton>
                <IconButton aria-label="next">
                  <IconPlayerSkipForward width="20" />
                </IconButton>
              </Stack>
            </Box>
            {isLoading ? (
              <Skeleton variant="square" animation="wave" width="100%" height={180}></Skeleton>
            ) : (
              <CardMedia
                component="img"
                sx={{ width: '100%', height: 180 }}
                image={card.img}
                alt="Live from space album cover"
              />
            )}
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default MusicCard;
