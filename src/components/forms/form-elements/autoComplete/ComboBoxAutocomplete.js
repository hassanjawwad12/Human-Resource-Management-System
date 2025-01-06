import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
// custom
import CustomTextField from '../../theme-elements/CustomTextField';
// Top 100 films as rated by IMDb users.
import top100Films from './data';

const ComboBoxAutocomplete = () => (
  <Autocomplete
    disablePortal
    id="combo-box-demo"
    options={top100Films}
    fullWidth
    renderInput={(params) => (
      <CustomTextField {...params} placeholder="Select movie" aria-label="Select movie" />
    )}
  />
);

export default ComboBoxAutocomplete;
