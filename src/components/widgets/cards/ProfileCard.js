import React, { useEffect } from 'react';
import {
  CardContent,
  Typography,
  Grid,
  IconButton,
  Divider,
  Avatar,
  Box,
  Stack,
  Skeleton,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import BlankCard from '../../shared/BlankCard';

import {
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandTwitter,
} from '@tabler/icons';

import img1 from 'src/assets/images/profile/user-1.jpg';
import img2 from 'src/assets/images/profile/user-2.jpg';
import img3 from 'src/assets/images/profile/user-3.jpg';

const SocialIcons = [
  {
    name: 'Facebook',
    icon: <IconBrandFacebook size="18" color="#1877F2" />,
  },
  {
    name: 'Instagram',
    icon: <IconBrandInstagram size="18" color="#D7336D" />,
  },
  {
    name: 'Github',
    icon: <IconBrandGithub size="18" color="#006097" />,
  },
  {
    name: 'Twitter',
    icon: <IconBrandTwitter size="18" color="#1C9CEA" />,
  },
];

const profileCard = [
  {
    name: 'Andrew Grant',
    role: 'Technology Director',
    avatar: img1,
  },
  {
    name: 'Leo Pratt',
    role: 'Telecom Analyst',
    avatar: img2,
  },
  {
    name: 'Charles Nunez',
    role: 'Environmental Specialist',
    avatar: img3,
  },
];

const ProfileCard = () => {
  const theme = useTheme();
  const [isLoading, setLoading] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Grid container spacing={3}>
      {profileCard.map((card, index) => (
        <Grid item xs={12} sm={4} key={index}>
          <BlankCard>
            <CardContent>
              <Stack direction={'column'} gap={2} alignItems="center">
                {isLoading ? (
                  <Skeleton variant="square" animation="wave" width="100%" height={160}></Skeleton>
                ) : (
                  <Avatar
                    alt="Remy Sharp"
                    src={card.avatar}
                    sx={{ width: '80px', height: '80px' }}
                  />
                )}
                <Box textAlign={'center'}>
                  <Typography variant="h5">{card.name}</Typography>
                  <Typography variant="caption">{card.role}</Typography>
                </Box>
              </Stack>
            </CardContent>
            <Divider />
            <Box
              p={2}
              py={1}
              textAlign={'center'}
              sx={{
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.05)' : 'grey.100',
              }}
            >
              {SocialIcons.map((sicon) => {
                return <IconButton key={sicon.name}>{sicon.icon}</IconButton>;
              })}
            </Box>
          </BlankCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProfileCard;
