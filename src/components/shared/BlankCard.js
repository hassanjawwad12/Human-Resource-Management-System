import { Card } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const BlankCard = ({ children, className }) => {
  const customizer = useSelector((state) => state.customizer);
  return (
    <Card
      sx={{ p: 0, position: 'relative' }}
      className={className}
      elevation={customizer.isCardShadow ? 9 : 0}
      variant={!customizer.isCardShadow ? 'outlined' : undefined}
    >
      {children}
    </Card>
  );
};

BlankCard.propTypes = {
  children: PropTypes.node,
};

export default BlankCard;
