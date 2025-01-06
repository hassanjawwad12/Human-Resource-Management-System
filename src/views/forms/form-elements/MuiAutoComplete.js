import React from 'react';
import { Grid } from '@mui/material';

import ComboBoxAutocomplete from '../../../components/forms/form-elements/autoComplete/ComboBoxAutocomplete';
import CountrySelectAutocomplete from '../../../components/forms/form-elements/autoComplete/CountrySelectAutocomplete';
import ControlledStateAutocomplete from '../../../components/forms/form-elements/autoComplete/ControlledStateAutocomplete';
import FreeSoloAutocomplete from '../../../components/forms/form-elements/autoComplete/FreeSoloAutocomplete';
import MultipleValuesAutocomplete from '../../../components/forms/form-elements/autoComplete/MultipleValuesAutocomplete';
import CheckboxesAutocomplete from '../../../components/forms/form-elements/autoComplete/CheckboxesAutocomplete';
import SizesAutocomplete from '../../../components/forms/form-elements/autoComplete/SizesAutocomplete';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../../components/container/PageContainer';
import ParentCard from '../../../components/shared/ParentCard';
import ChildCard from '../../../components/shared/ChildCard';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'AutoComplete',
  },
];

const ExAutoComplete = () => (
  // 2

  <PageContainer title="Autocomplete" description="this is Autocomplete page">
    {/* breadcrumb */}
    {/* <Breadcrumb title="AutoComplete" items={BCrumb} /> */}
    {/* end breadcrumb */}

    <ParentCard title="Autocomplete">
      <Grid container spacing={3}>
        <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Combo Box">
            <ComboBoxAutocomplete />
          </ChildCard>
        </Grid>
        <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Country Select">
            <CountrySelectAutocomplete />
          </ChildCard>
        </Grid>
        <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Controlled State">
            <ControlledStateAutocomplete />
          </ChildCard>
        </Grid>
        <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Free Solo">
            <FreeSoloAutocomplete />
          </ChildCard>
        </Grid>
        <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Multiple Values">
            <MultipleValuesAutocomplete />
          </ChildCard>
        </Grid>
        <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Checkboxes">
            <CheckboxesAutocomplete />
          </ChildCard>
        </Grid>
        <Grid item xs={12} lg={4} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Sizes">
            <SizesAutocomplete />
          </ChildCard>
        </Grid>
      </Grid>
    </ParentCard>
  </PageContainer>
);
export default ExAutoComplete;
