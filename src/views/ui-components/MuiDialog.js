import React from 'react';
import { Grid } from '@mui/material';
// common component
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import ParentCard from '../../components/shared/ParentCard';
import ChildCard from '../../components/shared/ChildCard';

// custom components
import SimpleDialog from '../../components/material-ui/dialog/SimpleDialog';
import AlertDialog from '../../components/material-ui/dialog/AlertDialog';
import TransitionDialog from '../../components/material-ui/dialog/TransitionDialog';
import FormDialog from '../../components/material-ui/dialog/FormDialog';
import FullscreenDialog from '../../components/material-ui/dialog/FullscreenDialog';
import MaxWidthDialog from '../../components/material-ui/dialog/MaxWidthDialog';
import ScrollContentDialog from '../../components/material-ui/dialog/ScrollContentDialog';
import ResponsiveDialog from '../../components/material-ui/dialog/ResponsiveDialog';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Dialog',
  },
];

const MuiDialog = () => (
  // 2

  <PageContainer title="Dialog" description="this is Dialog page">
    {/* breadcrumb */}
    {/* <Breadcrumb title="Dialog" items={BCrumb} /> */}
    {/* end breadcrumb */}

    <ParentCard title="Dialog">
      <Grid container spacing={3}>
        <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Simple">
            <SimpleDialog />
          </ChildCard>
        </Grid>
        <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Alert">
            <AlertDialog />
          </ChildCard>
        </Grid>
        <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Transition">
            <TransitionDialog />
          </ChildCard>
        </Grid>
        <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Form">
            <FormDialog />
          </ChildCard>
        </Grid>
        <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Full screen">
            <FullscreenDialog />
          </ChildCard>
        </Grid>
        <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Max width">
            <MaxWidthDialog />
          </ChildCard>
        </Grid>
        <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Scrolling Content">
            <ScrollContentDialog />
          </ChildCard>
        </Grid>
        <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Responsive Fullscreen">
            <ResponsiveDialog />
          </ChildCard>
        </Grid>
      </Grid>
    </ParentCard>
  </PageContainer>
);
export default MuiDialog;
