import React from 'react';
import { Box, Grid } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import WeeklyStats from 'src/components/dashboards/modern/WeeklyStats';
import YearlySales from 'src/components/dashboards/ecommerce/YearlySales';
import PaymentGateways from 'src/components/dashboards/ecommerce/PaymentGateways';
import WelcomeCard from 'src/components/dashboards/ecommerce/WelcomeCard';
import Expence from 'src/components/dashboards/ecommerce/Expence';
import Growth from 'src/components/dashboards/ecommerce/Growth';
import RevenueUpdates from 'src/components/dashboards/ecommerce/RevenueUpdates';
import SalesOverview from 'src/components/dashboards/ecommerce/SalesOverview';
import SalesTwo from 'src/components/dashboards/ecommerce/SalesTwo';
import Sales from 'src/components/dashboards/ecommerce/Sales';
import MonthlyEarnings from 'src/components/dashboards/ecommerce/MonthlyEarnings';
import ProductPerformances from 'src/components/dashboards/ecommerce/ProductPerformances';
import RecentTransactions from 'src/components/dashboards/ecommerce/RecentTransactions';

const Ecommerce = () => {
  return (
    <PageContainer title="eCommerce Dashboard" description="this is eCommerce Dashboard page">
      <Box mt={3}>
        <Grid container spacing={3}>
          {/* column */}
          <Grid item xs={12} lg={8}>
            <WelcomeCard />
          </Grid>

          {/* column */}
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Expence />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Sales />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <RevenueUpdates />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <SalesOverview />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <SalesTwo />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Growth />
              </Grid>
              <Grid item xs={12}>
                <MonthlyEarnings />
              </Grid>
            </Grid>
          </Grid>
          {/* column */}
          <Grid item xs={12} sm={6} lg={4}>
            <WeeklyStats />
          </Grid>
          {/* column */}
          <Grid item xs={12} lg={4}>
            <YearlySales />
          </Grid>
          {/* column */}
          <Grid item xs={12} lg={4}>
            <PaymentGateways />
          </Grid>
          {/* column */}

          <Grid item xs={12} lg={4}>
            <RecentTransactions />
          </Grid>
          {/* column */}

          <Grid item xs={12} lg={8}>
            <ProductPerformances />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Ecommerce;
