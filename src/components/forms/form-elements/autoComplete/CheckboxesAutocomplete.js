import React from 'react';
import { Autocomplete } from '@mui/material';
// custom
import CustomTextField from '../../theme-elements/CustomTextField';
import CustomCheckbox from '../../theme-elements/CustomCheckbox';
// Top 100 films as rated by IMDb users.
import top100Films from './data';

const CheckboxesAutocomplete = () => (
  <Autocomplete
    multiple
    id="checkboxes-tags-demo"
    options={top100Films}
    disableCloseOnSelect
    getOptionLabel={(option) => option.title}
    renderOption={(props, option, { selected }) => (
      <li {...props}>
        <CustomCheckbox style={{ marginRight: 8 }} checked={selected} />
        {option.title}
      </li>
    )}
    fullWidth
    renderInput={(params) => (
      <CustomTextField {...params} placeholder="Favorites" aria-label="Favorites" />
    )}
  />
);

export default CheckboxesAutocomplete;
