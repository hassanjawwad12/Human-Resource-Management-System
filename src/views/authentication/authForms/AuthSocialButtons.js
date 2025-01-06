import React from 'react';
import icon1 from 'src/assets/images/svgs/google-icon.svg';
import icon2 from 'src/assets/images/svgs/facebook-icon.svg';
import icon3 from 'src/assets/images/svgs/linkedin-icon.svg';
import CustomSocialButton from '../../../components/forms/theme-elements/CustomSocialButton';
import { Stack, display, minWidth, width } from '@mui/system';
import { Avatar, Box } from '@mui/material';


const AuthSocialButtons = ({ title }) => (
  <>
    <Stack direction="row" justifyContent="center" spacing={2} mt={2} height={'40px'}>
      <CustomSocialButton sx={{ width: '40px', minWidth: 'auto', borderRadius: '50%', display: 'flex', alignItems: 'center', padding: 0, paddingLeft: '3.5px' }}>
        <Avatar
          src={icon1}
          alt={icon1}
          sx={{
            width: 32,
            height: 32,
          }}
        />
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, whiteSpace: 'nowrap', mr: { sm: '3px' } }}>
          {/* {title}{' '} */}
        </Box>{' '}

      </CustomSocialButton>
      <CustomSocialButton sx={{ width: '40px', minWidth: 'auto', borderRadius: '50%', display: 'flex', alignItems: 'center', padding: 0, paddingLeft: '3.5px' }}>
        <Avatar
          src={icon2}
          alt={icon2}
          sx={{
            width: 35,
            height: 35,
          }}
        />
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, whiteSpace: 'nowrap', mr: { sm: '3px' } }}>
          {/* {title}{' '} */}
        </Box>{' '}

      </CustomSocialButton>
      <CustomSocialButton sx={{ width: '40px', minWidth: 'auto', borderRadius: '50%', display: 'flex', alignItems: 'center', padding: 0, paddingLeft: '3.5px' }}>
        <Avatar
          src={icon3}
          alt={icon3}
          sx={{
            width: 35,
            height: 35,
            borderRadius: '50%',
          }}
        />
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, whiteSpace: 'nowrap', mr: { sm: '3px' } }}>
          {/* {title}{' '} */}
        </Box>{' '}

      </CustomSocialButton>
    </Stack>
  </>
);

export default AuthSocialButtons;
