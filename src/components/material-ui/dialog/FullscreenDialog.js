import React, { useRef, useState } from 'react';
import { AppBar, Avatar, Dialog, IconButton, Slide, Toolbar, Typography } from '@mui/material';
import { IconX } from '@tabler/icons';
import { useLocation } from 'react-router-dom';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FullscreenDialog = (props) => {
  const location = useLocation();
  const { open, setOpen, name, image, title } = props;
  const paperRef = useRef(null);
  const [showNameAndImage, setShowNameAndImage] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    if (location.pathname === '/dashboards/employee') {
      if (scrollTop > 350) {
        setShowNameAndImage(true);
      } else {
        setShowNameAndImage(false);
      }
    }
  };

  return (
    <>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        PaperProps={{
          ref: paperRef,
          onScroll: handleScroll,
        }}
      >
        <AppBar sx={{ position: 'sticky', top: 0 }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <IconX width={24} height={24} />
            </IconButton>
            <Typography mx={2} mr={5} variant="h6" component="div" >
              {title}
            </Typography>

            {/* Conditionally render name and image when scrolled */}
            {showNameAndImage && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                 <Avatar
                  alt={name}
                  src={`http://122.248.194.140:8081/ExergyHRM/Users/GetProfileImageByFileName?fileName=${image}`}
                />
                <Typography variant="body1" component="span" ml={2}>
                  {name}
                </Typography>
               
              </div>
            )}
          </Toolbar>
        </AppBar>
        <div>{props.children}</div>
      </Dialog>
    </>
  );
};

export default FullscreenDialog;
