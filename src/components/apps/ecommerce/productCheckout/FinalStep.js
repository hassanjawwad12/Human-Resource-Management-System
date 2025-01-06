import { Box, Typography } from '@mui/material';
import payment from 'src/assets/images/products/payment-complete.gif';

const FinalStep = () => {
  return (
    <>
      <Box my={3}>
        <Box textAlign="center" p={3}>
          <Typography variant="h5">Thank you for your purchase!</Typography>
          <Typography variant="h6" mt={1} mb={4} color="primary">
            Your order id: 3fa7-69e1-79b4-dbe0d35f5f5d
          </Typography>
          <Box>
            <img src={payment} alt="payment" />
          </Box>
          <br />
          <br />
          <Typography variant="body2">
            We will send you a notification <br />
            within 2 days when it ships.
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default FinalStep;
