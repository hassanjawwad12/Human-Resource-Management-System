import React from 'react';
import { Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
// custom
import CustomTextField from "../../theme-elements/CustomTextField";

const options = ['Option 1', 'Option 2'];

const ControlledStateAutocomplete = () => {
  const [value, setValue] = React.useState(options[0]);
  const [inputValue, setInputValue] = React.useState('');
  return (
    <>
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        id="controllable-states-demo"
        options={options}
        fullWidth
        renderInput={(params) => (
          <CustomTextField
            {...params}
            placeholder="Controllable"
            aria-label="Controllable"
          />
        )}
      />
      <Typography
        color="textSecondary"
        variant="subtitle2"
        sx={{
          mt: 1,
        }}
      >{`value: ${value !== null ? `'${value}'` : 'null'}`}</Typography>
      <Typography
        color="textSecondary"
        variant="subtitle2"
      >{`inputvalue: '${inputValue}'`}</Typography>
    </>
  );
};

export default ControlledStateAutocomplete;
