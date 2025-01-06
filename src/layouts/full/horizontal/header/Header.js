import * as React from 'react';
import { IconButton, Box, AppBar, useMediaQuery, Toolbar, styled, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { toggleMobileSidebar } from 'src/store/customizer/CustomizerSlice';
import { IconMenu2 } from '@tabler/icons';
import Notifications from 'src/layouts/full/vertical/header/Notifications';
import Profile from 'src/layouts/full/vertical/header/Profile';
import Search from 'src/layouts/full/vertical/header/Search';
import Navigation from 'src/layouts/full/vertical/header/Navigation';
import Logo from 'src/layouts/full/shared/logo/Logo';

const Header = () => {
  const lgDown = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  // drawer
  const customizer = useSelector((state) => state.customizer);
  const dispatch = useDispatch();

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',

    [theme.breakpoints.up('lg')]: {
      minHeight: customizer.TopbarHeight,
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({theme}) => ({ margin: '0 auto', width: '100%', color: `${theme.palette.text.secondary} !important`, }));

  return (
    <></>
    // <AppBarStyled position="sticky" color="default" elevation={8}>
    //   <ToolbarStyled
    //     sx={{
    //       maxWidth: customizer.isLayout === 'boxed' ? 'lg' : '100%!important',
    //     }}
    //   >
    //     <Box sx={{ width: lgDown ? '45px' : 'auto', overflow: 'hidden' }}>
    //       <Logo />
    //     </Box>
    //     {lgDown ? (
    //       <IconButton
    //         color="inherit"
    //         aria-label="menu"
    //         onClick={() => dispatch(toggleMobileSidebar())}
    //       >
    //         <IconMenu2 />
    //       </IconButton>
    //     ) : (
    //       ''
    //     )}
    //     <Search />
    //     {lgUp ? (
    //       <>
    //         <Navigation />
    //       </>
    //     ) : null}
    //     <Box flexGrow={1} />
    //     <Stack spacing={1} direction="row" alignItems="center">
    //       <Notifications />
    //       <Profile />
    //     </Stack>
    //   </ToolbarStyled>
    // </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
  toggleSidebar: PropTypes.func,
};

export default Header;
