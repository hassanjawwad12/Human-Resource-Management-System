import React from 'react';
import { Grid, Avatar, AvatarGroup, Badge, Stack } from '@mui/material';
// common component
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import ChildCard from '../../components/shared/ChildCard';

import User1 from "../../assets/images/profile/user-1.jpg"
import User2 from "../../assets/images/profile/user-2.jpg"
import User3 from "../../assets/images/profile/user-3.jpg"
import User4 from "../../assets/images/profile/user-4.jpg"
import User5 from "../../assets/images/profile/user-5.jpg"
import { IconMoodSmile } from '@tabler/icons';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Avatar',
  },
];

const MuiAvatar = () => (
  // 2

  <PageContainer title="Avatar" description="this is Avatar page">
    {/* breadcrumb */}
    {/* <Breadcrumb title="Avatar" items={BCrumb} /> */}
    {/* end breadcrumb */}

    <ParentCard title="Avatar">
      <Grid container spacing={3}>
        <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Image avatars">
            <Stack direction="row" spacing={1} justifyContent="center">
              <Avatar alt="Remy Sharp" src={User1} />
              <Avatar alt="Travis Howard" src={User2} />
              <Avatar alt="Cindy Baker" src={User3} />
            </Stack>
          </ChildCard>
        </Grid>
        <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Letter avatars">
            <Stack direction="row" spacing={1} justifyContent="center">
              <Avatar sx={{ bgcolor: "primary.main" }}>A</Avatar>
              <Avatar sx={{ bgcolor: "secondary.main" }}>B</Avatar>
              <Avatar sx={{ bgcolor: "error.main" }}>C</Avatar>
              <Avatar sx={{ bgcolor: "warning.main" }}>D</Avatar>
              <Avatar sx={{ bgcolor: "success.main" }}>E</Avatar>
            </Stack>
          </ChildCard>
        </Grid>
        <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Icon avatars">
            <Stack direction="row" spacing={1} justifyContent="center">
              <Avatar sx={{ bgcolor: "primary.main" }}>
                <IconMoodSmile width={24} />
              </Avatar>
              <Avatar sx={{ bgcolor: "secondary.main" }}>
                <IconMoodSmile width={24} />
              </Avatar>
              <Avatar sx={{ bgcolor: "error.main" }}>
                <IconMoodSmile width={24} />
              </Avatar>
              <Avatar sx={{ bgcolor: "warning.main" }}>
                <IconMoodSmile width={24} />
              </Avatar>
              <Avatar sx={{ bgcolor: "success.main" }}>
                <IconMoodSmile width={24} />
              </Avatar>
            </Stack>
          </ChildCard>
        </Grid>
        <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Variant">
            <Stack direction="row" spacing={1} justifyContent="center">
              <Avatar sx={{ bgcolor: "primary.main" }}>
                <IconMoodSmile width={24} />
              </Avatar>
              <Avatar sx={{ bgcolor: "primary.main" }} variant="square">
                <IconMoodSmile width={24} />
              </Avatar>
              <Avatar sx={{ bgcolor: "primary.main" }} variant="rounded">
                <IconMoodSmile width={24} />
              </Avatar>
            </Stack>
          </ChildCard>
        </Grid>
        <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Grouped">
            <Stack direction="row" spacing={1} justifyContent="center">
              <AvatarGroup max={4}>
                <Avatar alt="Remy Sharp" src={User1} />
                <Avatar alt="Travis Howard" src={User2} />
                <Avatar alt="Cindy Baker" src={User3} />
              </AvatarGroup>
            </Stack>
          </ChildCard>
        </Grid>
        <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Grouped Size">
            <Stack direction="row" spacing={1} justifyContent="center">
              <AvatarGroup max={4}>
                <Avatar alt="Remy Sharp" sx={{ width: 56, height: 56 }} src={User1} />
                <Avatar alt="Travis Howard" sx={{ width: 56, height: 56 }} src={User2} />
                <Avatar alt="Cindy Baker" sx={{ width: 56, height: 56 }} src={User3} />
              </AvatarGroup>
            </Stack>
          </ChildCard>
        </Grid>
        <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="With Badge">
            <Stack direction="row" spacing={1} justifyContent="center">
              <AvatarGroup>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <Avatar sx={{ width: 22, height: 22 }} alt="Remy Sharp" src={User1} />
                  }
                >
                  <Avatar alt="Travis Howard" src={User2} />
                </Badge>
              </AvatarGroup>
              {/* 2 */}
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot" color="success"
              >
                <Avatar alt="Remy Sharp" src={User3} />
              </Badge>
              {/* 3 */}
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot" color="warning"
              >
                <Avatar alt="Remy Sharp" src={User4} />
              </Badge>
              {/* 4 */}
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot" color="error"
              >
                <Avatar alt="Remy Sharp" src={User5} />
              </Badge>
            </Stack>
          </ChildCard>
        </Grid>
        <Grid item xs={12} lg={8} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Sizes">
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="center">
              <Avatar alt="Remy Sharp" src={User1} sx={{ width: 24, height: 24 }} />
              <Avatar alt="Remy Sharp" src={User1} sx={{ width: 32, height: 32 }} />
              <Avatar alt="Remy Sharp" src={User1} />
              <Avatar alt="Remy Sharp" src={User1} sx={{ width: 50, height: 50 }} />
              <Avatar alt="Remy Sharp" src={User1} sx={{ width: 60, height: 60 }} />
              <Avatar alt="Remy Sharp" src={User1} sx={{ width: 65, height: 65 }} />
            </Stack>
          </ChildCard>
        </Grid>
      </Grid>
    </ParentCard>
  </PageContainer>
);
export default MuiAvatar;
