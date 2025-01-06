import React from 'react';
import { Grid, Typography, Box, Breadcrumbs, Link, Button } from '@mui/material';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Breadcrumb = ({ subtitle, items, title, children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleBack = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment !== '');
    if (pathSegments.length > 1) {
      // Navigate to the parent path
      navigate(`/${pathSegments[0]}`);
    } else {
      // If we're already at the main path, don't navigate
      console.log("Already at the main path");
    }
  };

  // Check if we're at the main path
  const isMainPath = location.pathname.split('/').filter(segment => segment !== '').length === 1;

  return (
    <Grid
      container
      sx={{
        backgroundColor: 'primary.light',
        borderRadius: (theme) => theme.shape.borderRadius / 4,
        p: '15px 25px',
        marginTop: '30px',
        marginBottom: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Grid item xs={12} sm={6} lg={8} mb={0}>
        <Box display="flex" alignItems="center" mb={1} gap={1}>
          {!isMainPath && <ArrowBackIcon
            sx={{
              color: 'primary.main',
              cursor: 'pointer',
              '&:hover': {
              },
              transition: 'color 0.3s',
            }}
            onClick={handleBack} />}
          <Typography variant="h4">{title}</Typography>
        </Box>
        <Typography color="textSecondary" variant="h6" fontWeight={400} mt={0.8} mb={0}>
          {subtitle}
        </Typography>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize='small' />}
          sx={{ alignItems: 'center', mt: items ? '10px' : '' }}
          aria-label="breadcrumb"
        >
          {items
            ? items.map((item) => (
              <div key={item.title}>
                {item.to ? (
                  <Link
                    underline="none"
                    component={NavLink}
                    to={item.to}
                    sx={{
                      color: location.pathname === item.to ? 'text.primary' : 'text.secondary',
                      fontWeight: location.pathname === item.to ? 'bold' : 'normal',
                      '&:hover': {
                        color: 'primary.main',
                      },
                      transition: 'color 0.3s',
                    }}
                  >
                    {item.title}
                  </Link>
                ) : (
                  <Typography
                    color="text.primary"
                    sx={{ fontWeight: 600 }}
                  >
                    {item.title}
                  </Typography>
                )}
              </div>
            ))
            : ''}
        </Breadcrumbs>
      </Grid>
      <Grid item xs={12} sm={6} lg={4} display="flex" alignItems="flex-end">
        <Box
          sx={{
            display: { xs: 'none', md: 'block', lg: 'flex' },
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: '100%',
          }}
        >
          {children && (
            <Box sx={{ top: '0px', position: 'absolute' }}>{children}</Box>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default Breadcrumb;



{/* {children ? (
          <Box sx={{ top: '0px', position: 'absolute' }}>{children}</Box>
        ) : (
          <>
            <Box sx={{ top: '0px', position: 'absolute' }}>
              <img src={breadcrumbImg} alt={breadcrumbImg} width={'165px'} />
            </Box>
          </>
)} */}