import { styled } from '@mui/material';
import { Button } from '@mui/material';

const CustomDisabledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
}));

export default CustomDisabledButton;
