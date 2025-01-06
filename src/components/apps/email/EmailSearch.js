import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Fab, InputAdornment } from '@mui/material';
import { SearchEmail } from '../../../store/apps/email/EmailSlice';
import { IconMenu2, IconSearch } from '@tabler/icons';
import CustomTextField from '../../forms/theme-elements/CustomTextField'

const EmailSearch = ({ onClick }) => {
  const searchTerm = useSelector((state) => state.emailReducer.emailSearch);
  const dispatch = useDispatch();

  return (
    <Box display="flex" sx={{ p: 2 }}>
      {/* ------------------------------------------- */}
      {/* Button toggle sidebar when lgdown */}
      {/* ------------------------------------------- */}
      <Fab
        onClick={onClick}
        color="primary"
        size="small"
        sx={{ mr: 1, flexShrink: '0', display: { xs: 'block', lineHeight: '10px', lg: 'none' } }}
      >
        <IconMenu2 width="16" />
      </Fab>
      {/* ------------------------------------------- */}
      {/* Search */}
      {/* ------------------------------------------- */}
      <CustomTextField
        id="outlined-basic"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconSearch size={'16'} />
            </InputAdornment>
          ),
        }}
        fullWidth
        size="small"
        value={searchTerm}
        placeholder="Search emails"
        variant="outlined"
        onChange={(e) => dispatch(SearchEmail(e.target.value))}
      />
    </Box>
  );
};

export default EmailSearch;
