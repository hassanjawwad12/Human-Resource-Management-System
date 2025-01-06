import React from 'react';
import { Box, Avatar, Typography, IconButton, Tooltip, useMediaQuery, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import img1 from 'src/assets/images/profile/user-1.jpg';
import { IconPower } from '@tabler/icons';
import { Link } from "react-router-dom";
import { logout } from '../../../../../store/auth/login/LoginSlice';

import AlertDialog from '../../../../../components/material-ui/dialog/AlertDialog';
export const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.loginReducer);
  const customizer = useSelector((state) => state.customizer);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true);
  };

  const userT = JSON.parse(localStorage.getItem('Exergy HRMData'));

  const hideMenu = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : '';
  return (
    <Box
      display={'flex'}
      alignItems="center"
      gap={2}
      sx={{ m: 2, px: 2,py:1, bgcolor: `${'primary.light'}` }}
    
    >
      {!hideMenu ? (
        <>
          <LogoutModal open={open} setOpen={setOpen} />
          <Avatar src={user.profileFileName || `http://122.248.194.140:8081/ExergyHRM/Users/GetProfileImageByFileName?fileName=${user.targetFileName}`} />

          <Box>
            <Typography sx={{ fontSize: '13px', fontWeight: 700 }} color="textPrimary">{`${user.firstName[0]}. ${user.lastName}`}</Typography>
            <Typography sx={{ fontSize: '11px' }} color="textSecondary">{userT.designation}</Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Tooltip title="Logout" placement="top">
              <IconButton onClick={handleClickOpen} color="primary" aria-label="logout" size="small">
                <IconPower size="20" />
              </IconButton>
            </Tooltip>
          </Box>
        </>
      ) : (
        <Avatar alt="Remy Sharp" src={img1} sx={{ height: 30, width: 30 }} />
      )}
    </Box>
  );
};


export const LogoutModal = ({ open, setOpen }) => {
  const dispatch = useDispatch()

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <AlertDialog open={open} setOpen={setOpen}>
      <DialogTitle id="alert-dialog-title">
        Logout
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          You will be returned to the login screen
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ pt: 3, pb: 2 }}>
        <Button variant='outlined' onClick={handleClose}

          sx={{ mr: 1, color: 'primary.main !important', bgcolor: '#fff !important' }}>Cancel</Button>
        <Button sx={{ color: 'white' }} variant='contained' onClick={() => dispatch(logout())} autoFocus>
          Logout
        </Button>
      </DialogActions>
    </AlertDialog>
  )
}