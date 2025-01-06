import React from 'react';
import { Typography, Grid } from '@mui/material';

import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import ChildCard from '../../components/shared/ChildCard';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Typography',
  },
];

const CustomTypography = () => {
  return (
    <PageContainer title="Typography" description="this is Typography page">
      {/* breadcrumb */}
      {/* <Breadcrumb title="Typography" items={BCrumb} /> */}
      {/* end breadcrumb */}
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <ParentCard title="Default Text">
            <Grid container spacing={3}>
              <Grid item sm={12}>
                <ChildCard>
                  <Typography variant="h1">h1. Heading</Typography>
                  <Typography variant="body1" color="textSecondary">
                    font size: 30 | line-height: 45 | font weight: 500
                  </Typography>
                </ChildCard>
              </Grid>
              <Grid item sm={12}>
                <ChildCard>
                  <Typography variant="h2">h2. Heading</Typography>
                  <Typography variant="body1" color="textSecondary">
                    font size: 24 | line-height: 36 | font weight: 500
                  </Typography>
                </ChildCard>
              </Grid>
              <Grid item sm={12}>
                <ChildCard>
                  <Typography variant="h3">h3. Heading</Typography>

                  <Typography variant="body1" color="textSecondary">
                    font size: 21 | line-height: 31.5 | font weight: 500
                  </Typography>
                </ChildCard>
              </Grid>
              <Grid item sm={12}>
                <ChildCard>
                  <Typography variant="h4">h4. Heading</Typography>

                  <Typography variant="body1" color="textSecondary">
                    font size: 18 | line-height: 27 | font weight: 500
                  </Typography>
                </ChildCard>
              </Grid>
              <Grid item sm={12}>
                <ChildCard>
                  <Typography variant="h5">h5. Heading</Typography>

                  <Typography variant="body1" color="textSecondary">
                    font size: 16 | line-height: 24 | font weight: 500
                  </Typography>
                </ChildCard>
              </Grid>
              <Grid item sm={12}>
                <ChildCard>
                  <Typography variant="h6">h6. Heading</Typography>

                  <Typography variant="body1" color="textSecondary">
                    font size: 14 | line-height: 21 | font weight: 500
                  </Typography>
                </ChildCard>
              </Grid>
              <Grid item sm={12}>
                <ChildCard>
                  <Typography variant="subtitle1">
                    subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis
                    tenetur
                  </Typography>

                  <Typography variant="body1" color="textSecondary">
                    font size: 16 | line-height: 28 | font weight: 400
                  </Typography>
                </ChildCard>
              </Grid>
              <Grid item sm={12}>
                <ChildCard>
                  <Typography variant="subtitle2">
                    subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis
                    tenetur
                  </Typography>

                  <Typography variant="body1" color="textSecondary">
                    font size: 14 | line-height: 21 | font weight: 400
                  </Typography>
                </ChildCard>
              </Grid>
              <Grid item sm={12}>
                <ChildCard>
                  <Typography variant="body1">
                    body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
                  </Typography>

                  <Typography variant="body1" color="textSecondary">
                    font size: 16 | line-height: 24 | font weight: 400
                  </Typography>
                </ChildCard>
              </Grid>
              <Grid item sm={12}>
                <ChildCard>
                  <Typography variant="body2">
                    body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
                  </Typography>

                  <Typography variant="body1" color="textSecondary">
                    font size: 14 | line-height: 20 | font weight: 400
                  </Typography>
                </ChildCard>
              </Grid>
              <Grid item sm={12}>
                <ChildCard>
                  <Typography variant="caption">
                    caption. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis
                    tenetur
                  </Typography>

                  <Typography variant="body1" color="textSecondary">
                    font size: 12 | line-height: 19 | font weight: 400
                  </Typography>
                </ChildCard>
              </Grid>
              <Grid item sm={12}>
                <ChildCard>
                  <Typography variant="overline">
                    overline. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis
                    tenetur
                  </Typography>

                  <Typography variant="body1" color="textSecondary">
                    font size: 12 | line-height: 31 | font weight: 400
                  </Typography>
                </ChildCard>
              </Grid>
            </Grid>

          </ParentCard>
        </Grid>
        <Grid item sm={12}>
          <ParentCard title="Default Text">
            <Grid container spacing={3}>
              <Grid item sm={12}>
                <ChildCard>
                  <Typography variant="h5" color="textprimary">
                    Text Primary
                  </Typography>

                  <Typography variant="body1" color="textprimary">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
                  </Typography>
                </ChildCard>
              </Grid>
              <Grid item sm={12}>
                <ChildCard>
                  <Typography variant="h5" color="textSecondary">
                    Text Secondary
                  </Typography>

                  <Typography variant="body1" color="textSecondary">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
                  </Typography>
                </ChildCard>
              </Grid>
              <Grid item sm={12}>
                <ChildCard>
                  <Typography variant="h5" sx={{ color: (theme) => theme.palette.info.main }}>
                    Text Info
                  </Typography>

                  <Typography variant="body1" sx={{ color: (theme) => theme.palette.info.main }}>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
                  </Typography>
                </ChildCard>
              </Grid>
              <Grid item sm={12}>
                <ChildCard>
                  <Typography variant="h5" sx={{ color: (theme) => theme.palette.primary.main }}>
                    Text Primary
                  </Typography>

                  <Typography variant="body1" sx={{ color: (theme) => theme.palette.primary.main }}>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
                  </Typography>
                </ChildCard>
              </Grid>
              <Grid item sm={12}>
                <ChildCard>
                  <Typography variant="h5" sx={{ color: (theme) => theme.palette.warning.main }}>
                    Text Warning
                  </Typography>

                  <Typography variant="body1" sx={{ color: (theme) => theme.palette.warning.main }}>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
                  </Typography>
                </ChildCard>
              </Grid>
              <Grid item sm={12}>
                <ChildCard>
                  <Typography variant="h5" sx={{ color: (theme) => theme.palette.error.main }}>
                    Text Error
                  </Typography>

                  <Typography variant="body1" sx={{ color: (theme) => theme.palette.error.main }}>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
                  </Typography>
                </ChildCard>
              </Grid>
              <Grid item sm={12}>
                <ChildCard>
                  <Typography variant="h5" sx={{ color: (theme) => theme.palette.success.main }}>
                    Text Success
                  </Typography>

                  <Typography variant="body1" sx={{ color: (theme) => theme.palette.success.main }}>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
                  </Typography>
                </ChildCard>
              </Grid>
            </Grid>
          </ParentCard>
        </Grid>
      </Grid >


    </PageContainer >
  );
};

export default CustomTypography;
